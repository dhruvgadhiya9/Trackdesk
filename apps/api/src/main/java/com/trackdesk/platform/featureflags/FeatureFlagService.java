package com.trackdesk.platform.featureflags;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Effective flags = global defaults ({@code feature_flag}) overridden per tenant ({@code
 * tenant_feature_flag}, RLS-scoped). Consumed by the web/mobile {@code useFeatureFlag} hook.
 */
@Service
public class FeatureFlagService {

  private final FeatureFlagRepository repository;

  public FeatureFlagService(FeatureFlagRepository repository) {
    this.repository = repository;
  }

  @Transactional(readOnly = true)
  public Map<String, Boolean> effectiveFlags() {
    Map<String, Boolean> flags = new LinkedHashMap<>();
    for (Object[] row : repository.globalDefaults()) {
      flags.put((String) row[0], (Boolean) row[1]);
    }
    for (Object[] row : repository.tenantOverrides()) {
      flags.put((String) row[0], (Boolean) row[1]);
    }
    return flags;
  }

  @Transactional(readOnly = true)
  public boolean isEnabled(String key) {
    return effectiveFlags().getOrDefault(key, false);
  }
}
