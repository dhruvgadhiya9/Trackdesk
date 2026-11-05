#!/usr/bin/env tsx
/**
 * Regenerates packages/ui/src/tokens.ts from Figma variables.
 *
 * Usage: FIGMA_TOKEN=<personal access token> FIGMA_FILE_KEY=<file key> pnpm tokens:sync
 *   - FIGMA_TOKEN: Figma → Settings → Personal access tokens (scope: file_variables:read). Keep it in
 *     your password manager; never commit it or put it in a committed .env.
 *   - FIGMA_FILE_KEY: from the library URL figma.com/design/<FILE_KEY>/...
 *   - Requires the Variables REST API (Figma Enterprise). Otherwise export variables as JSON from
 *     Figma (plugin "Variables Exporter") and run with FIGMA_EXPORT_JSON=<path>.
 *
 * Expected Figma structure (designer checklist, docs/09-figma-to-code.md):
 *   collection "primitives": color/<hue>/<step>
 *   collection "semantic":   color/<group>/<name> (aliases to primitives)
 *   collection "spacing":    <step> (number, px); "radius": <name>; typography and shadow as styles
 * The script resolves aliases, then rewrites ONLY the value literals in tokens.ts for tokens that
 * exist in both places, and reports tokens missing on either side. Review the diff in a PR with
 * designer approval.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type FigmaColor = { r: number; g: number; b: number; a: number };
type FigmaValue = FigmaColor | number | string | boolean | { type: 'VARIABLE_ALIAS'; id: string };
interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  variableCollectionId: string;
  valuesByMode: Record<string, FigmaValue>;
}
interface FigmaCollection {
  id: string;
  name: string;
  defaultModeId: string;
}

const TOKENS_FILE = join(process.cwd(), 'packages', 'ui', 'src', 'tokens.ts');

async function load(): Promise<{ variables: Record<string, FigmaVariable>; collections: Record<string, FigmaCollection> }> {
  if (process.env.FIGMA_EXPORT_JSON) {
    return JSON.parse(readFileSync(process.env.FIGMA_EXPORT_JSON, 'utf8')).meta;
  }
  const token = process.env.FIGMA_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  if (!token || !fileKey) {
    console.error('Set FIGMA_TOKEN and FIGMA_FILE_KEY (or FIGMA_EXPORT_JSON). See the header of this script.');
    process.exit(2);
  }
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
    headers: { 'X-Figma-Token': token },
  });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  return (await res.json()).meta;
}

const hex = ({ r, g, b }: FigmaColor) =>
  '#' + [r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();

async function main() {
  const { variables, collections } = await load();
  const byId = variables;
  const resolve = (v: FigmaVariable, depth = 0): FigmaValue => {
    const collection = collections[v.variableCollectionId];
    const value = v.valuesByMode[collection?.defaultModeId ?? Object.keys(v.valuesByMode)[0]!];
    if (value && typeof value === 'object' && 'type' in value && value.type === 'VARIABLE_ALIAS') {
      const target = byId[value.id];
      if (!target || depth > 10) throw new Error(`Unresolvable alias in ${v.name}`);
      return resolve(target, depth + 1);
    }
    return value!;
  };

  // "color/blue/500" in collection "primitives" -> key "primitives.color.blue.500"
  const figma = new Map<string, string>();
  for (const v of Object.values(variables)) {
    const collection = collections[v.variableCollectionId]?.name ?? 'unknown';
    const key = `${collection}.${v.name.split('/').join('.')}`;
    const value = resolve(v);
    if (v.resolvedType === 'COLOR') figma.set(key, hex(value as FigmaColor));
    else if (v.resolvedType === 'FLOAT') figma.set(key, String(value));
  }

  let source = readFileSync(TOKENS_FILE, 'utf8');
  let updated = 0;
  for (const [key, value] of figma) {
    const [collection, ...path] = key.split('.');
    if (collection !== 'primitives' || path[0] !== 'color') continue;
    const [, hue, step] = path;
    const re = new RegExp(`(${hue}: \\{[^}]*?${step}: c\\(')#[0-9A-Fa-f]{6}('\\))`);
    if (re.test(source)) {
      source = source.replace(re, `$1${value}$2`);
      updated++;
    } else {
      console.warn(`Not in tokens.ts (add it by hand, then re-run): ${key}`);
    }
  }
  writeFileSync(TOKENS_FILE, source);
  console.log(`Updated ${updated} primitive colour tokens from Figma. Review the diff and open a PR for designer sign-off.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
