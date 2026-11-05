package com.trackdesk.customers.domain;

import com.trackdesk.platform.persistence.TenantScopedEntity;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/** A contractor's customer. Archived, never deleted (keeps job and certificate history). */
@Entity
@Table(name = "customer")
public class Customer extends TenantScopedEntity {

  @Column(nullable = false)
  private String name;

  private String accountNumber;
  private String email;
  private String phone;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "line1", column = @Column(name = "billing_line1")),
    @AttributeOverride(name = "line2", column = @Column(name = "billing_line2")),
    @AttributeOverride(name = "city", column = @Column(name = "billing_city")),
    @AttributeOverride(name = "postcode", column = @Column(name = "billing_postcode"))
  })
  private Address billingAddress;

  private String notes;

  @Column(nullable = false)
  private CustomerStatus status;

  @Version private Long version;

  @Column(updatable = false)
  private UUID createdBy;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(nullable = false)
  private Instant updatedAt;

  protected Customer() {}

  public static Customer create(CustomerDetails details, UUID createdBy) {
    Customer c = new Customer();
    c.apply(details);
    c.status = CustomerStatus.ACTIVE;
    c.createdBy = createdBy;
    return c;
  }

  /** Optimistic-lock aware update: callers pass the version the client last read. */
  public void update(CustomerDetails details, long expectedVersion) {
    if (version != null && version != expectedVersion) {
      throw new StaleCustomerException(getId());
    }
    apply(details);
  }

  public void archive() {
    this.status = CustomerStatus.ARCHIVED;
  }

  private void apply(CustomerDetails d) {
    this.name = d.name().trim();
    this.accountNumber = blankToNull(d.accountNumber());
    this.email = blankToNull(d.email());
    this.phone = blankToNull(d.phone());
    this.billingAddress = d.billingAddress();
    this.notes = blankToNull(d.notes());
  }

  private static String blankToNull(String s) {
    return s == null || s.isBlank() ? null : s.trim();
  }

  public String getName() {
    return name;
  }

  public String getAccountNumber() {
    return accountNumber;
  }

  public String getEmail() {
    return email;
  }

  public String getPhone() {
    return phone;
  }

  public Address getBillingAddress() {
    return billingAddress;
  }

  public String getNotes() {
    return notes;
  }

  public CustomerStatus getStatus() {
    return status;
  }

  public Long getVersion() {
    return version;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  /** Editable fields of a customer (domain input, independent of the API DTOs). */
  public record CustomerDetails(
      String name,
      String accountNumber,
      String email,
      String phone,
      Address billingAddress,
      String notes) {

    public CustomerDetails {
      if (name == null || name.isBlank()) {
        throw new IllegalArgumentException("Customer name is required");
      }
    }
  }

  /** Raised when the client's version is stale (HTTP 409). */
  public static class StaleCustomerException extends RuntimeException {
    public StaleCustomerException(UUID id) {
      super("Customer " + id + " was modified by someone else");
    }
  }
}
