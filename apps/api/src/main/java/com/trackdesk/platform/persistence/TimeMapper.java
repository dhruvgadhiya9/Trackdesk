package com.trackdesk.platform.persistence;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.mapstruct.Mapper;

/** Shared MapStruct conversions (entities use Instant; the API contract uses OffsetDateTime). */
@Mapper
public interface TimeMapper {

  default OffsetDateTime toOffset(Instant instant) {
    return instant == null ? null : instant.atOffset(ZoneOffset.UTC);
  }

  default Instant toInstant(OffsetDateTime value) {
    return value == null ? null : value.toInstant();
  }
}
