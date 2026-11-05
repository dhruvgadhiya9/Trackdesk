/**
 * Shared kernel: tenancy, security, permissions, audit, feature flags, errors, persistence base.
 * OPEN module — every business module may use it. Must not depend on any business module.
 */
@ApplicationModule(displayName = "Platform", type = ApplicationModule.Type.OPEN)
package com.trackdesk.platform;

import org.springframework.modulith.ApplicationModule;
