#!/usr/bin/env node
// Generates the permission matrix for Java, SQL (RLS) and TypeScript from permissions.yaml.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(pkg, '..', '..');
const { roles, permissions } = YAML.parse(readFileSync(join(pkg, 'permissions.yaml'), 'utf8'));
const roleNames = Object.keys(roles);
const entries = Object.entries(permissions).sort(([a], [b]) => a.localeCompare(b));

for (const [perm, def] of entries) {
  if (!/^[a-z-]+(:[a-z-]+)+$/.test(perm)) throw new Error(`Bad permission name: ${perm}`);
  for (const r of def.roles) if (!roleNames.includes(r)) throw new Error(`${perm}: unknown role ${r}`);
}

const constName = (p) => p.toUpperCase().replace(/[:-]/g, '_');
const banner = 'GENERATED from packages/contracts/permissions.yaml by gen-permissions.mjs — DO NOT EDIT.';
const write = (file, content) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  console.log(`wrote ${file.replace(repo, '.')}`);
};

// ---------- Java ----------
const javaConsts = entries
  .map(([p, d]) => `  /** ${d.description}. Roles: ${d.roles.join(', ')}. */\n  public static final String ${constName(p)} = "${p}";`)
  .join('\n\n');
const javaMatrix = roleNames
  .map((r) => {
    const perms = entries.filter(([, d]) => d.roles.includes(r)).map(([p]) => constName(p));
    return `          Map.entry(\n              "${r}",\n              Set.of(${perms.length ? '\n                  ' + perms.join(',\n                  ') : ''}))`;
  })
  .join(',\n');
write(
  join(repo, 'apps/api/src/main/java/com/trackdesk/platform/security/Permission.java'),
  `// ${banner}
// SECURITY-REVIEW-REQUIRED: role permission matrix.
package com.trackdesk.platform.security;

import java.util.Map;
import java.util.Set;

/**
 * Permission constants (Spring Security authorities) and the role → permission matrix. Use as
 * {@code @PreAuthorize("hasAuthority('" + Permission.CUSTOMERS_READ + "')")}.
 */
public final class Permission {

  private Permission() {}

${javaConsts}

  /** Role names, as used in the JWT {@code app_metadata.role} claim. */
  public static final Set<String> ROLES =
      Set.of(${roleNames.map((r) => `"${r}"`).join(', ')});

  private static final Map<String, Set<String>> MATRIX =
      Map.ofEntries(
${javaMatrix});

  /** Permissions granted to a role; empty for unknown roles (fail closed). */
  public static Set<String> forRole(String role) {
    return role == null ? Set.of() : MATRIX.getOrDefault(role, Set.of());
  }
}
`,
);

// ---------- SQL (repeatable Flyway migration) ----------
const rows = entries.flatMap(([p, d]) => d.roles.map((r) => `  ('${r}', '${p}')`));
write(
  join(repo, 'apps/api/src/main/resources/db/migration/R__role_permissions.sql'),
  `-- ${banner}
-- SECURITY-REVIEW-REQUIRED: role permission matrix used by RLS helper app_has_permission().
delete from role_permission;
insert into role_permission (role, permission) values
${rows.join(',\n')};
`,
);

// ---------- TypeScript ----------
write(
  join(pkg, 'src/generated/permissions.ts'),
  `// ${banner}
export const ROLES = ${JSON.stringify(roleNames)} as const;
export type RoleName = (typeof ROLES)[number];

export const PERMISSIONS = {
${entries.map(([p]) => `  ${constName(p)}: '${p}',`).join('\n')}
} as const;
export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<RoleName, readonly PermissionName[]> = {
${roleNames
  .map((r) => `  ${r}: [${entries.filter(([, d]) => d.roles.includes(r)).map(([p]) => `'${p}'`).join(', ')}],`)
  .join('\n')}
};

export function can(role: RoleName | undefined | null, permission: PermissionName): boolean {
  return !!role && ROLE_PERMISSIONS[role].includes(permission);
}
`,
);
