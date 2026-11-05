package com.trackdesk.customers.domain;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum CustomerStatus {
  ACTIVE,
  ARCHIVED;

  /** Stores the lowercase wire value used by the DB check constraint and the API. */
  @Converter(autoApply = true)
  public static class JpaConverter implements AttributeConverter<CustomerStatus, String> {
    @Override
    public String convertToDatabaseColumn(CustomerStatus status) {
      return status == null ? null : status.name().toLowerCase();
    }

    @Override
    public CustomerStatus convertToEntityAttribute(String value) {
      return value == null ? null : CustomerStatus.valueOf(value.toUpperCase());
    }
  }
}
