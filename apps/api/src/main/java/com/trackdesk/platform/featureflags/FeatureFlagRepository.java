package com.trackdesk.platform.featureflags;

import jakarta.persistence.EntityManager;
import java.util.List;
import org.springframework.stereotype.Repository;

/** Repository: the only place this module's SQL lives (RLS scopes tenant overrides). */
@Repository
public class FeatureFlagRepository {

  private final EntityManager em;

  public FeatureFlagRepository(EntityManager em) {
    this.em = em;
  }

  @SuppressWarnings("unchecked")
  List<Object[]> globalDefaults() {
    return em.createNativeQuery("select key, default_enabled from feature_flag order by key")
        .getResultList();
  }

  @SuppressWarnings("unchecked")
  List<Object[]> tenantOverrides() {
    return em.createNativeQuery("select flag_key, enabled from tenant_feature_flag")
        .getResultList();
  }
}
