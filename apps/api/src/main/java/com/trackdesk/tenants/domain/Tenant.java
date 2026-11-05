package com.trackdesk.tenants.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.security.SecureRandom;
import java.text.Normalizer;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.domain.Persistable;

/** A contractor company (the tenant itself; its id IS the tenant id). UK-only in v1. */
@Entity
@Table(name = "tenant")
public class Tenant implements Persistable<UUID> {

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final String ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

  @Id private UUID id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, updatable = false)
  private String slug;

  @Column(nullable = false)
  private String countryCode;

  @Column(nullable = false)
  private String status;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Transient private boolean isNew = true;

  protected Tenant() {}

  public static Tenant create(UUID id, String name) {
    Tenant t = new Tenant();
    t.id = id;
    t.name = name.trim();
    t.slug = slugify(name) + "-" + randomSuffix();
    t.countryCode = "GB";
    t.status = "active";
    return t;
  }

  /** URL-safe slug; a random suffix avoids collisions we cannot check across tenants (RLS). */
  static String slugify(String name) {
    String ascii =
        Normalizer.normalize(name, Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase();
    String slug = ascii.replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    if (slug.isEmpty()) {
      slug = "company";
    }
    return slug.length() > 40 ? slug.substring(0, 40) : slug;
  }

  private static String randomSuffix() {
    StringBuilder sb = new StringBuilder(6);
    for (int i = 0; i < 6; i++) {
      sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
    }
    return sb.toString();
  }

  @PostLoad
  @PostPersist
  void markNotNew() {
    isNew = false;
  }

  @Override
  public UUID getId() {
    return id;
  }

  @Override
  public boolean isNew() {
    return isNew;
  }

  public String getName() {
    return name;
  }

  public String getSlug() {
    return slug;
  }

  public String getCountryCode() {
    return countryCode;
  }

  public String getStatus() {
    return status;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
