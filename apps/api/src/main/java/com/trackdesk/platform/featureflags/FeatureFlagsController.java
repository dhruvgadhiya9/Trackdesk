package com.trackdesk.platform.featureflags;

import com.trackdesk.contracts.api.PlatformApi;
import com.trackdesk.contracts.model.FeatureFlagsDto;
import com.trackdesk.platform.security.Permission;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FeatureFlagsController implements PlatformApi {

  private final FeatureFlagService service;

  public FeatureFlagsController(FeatureFlagService service) {
    this.service = service;
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.FEATUREFLAGS_READ + "')")
  public ResponseEntity<FeatureFlagsDto> getFeatureFlags() {
    return ResponseEntity.ok(new FeatureFlagsDto().flags(service.effectiveFlags()));
  }
}
