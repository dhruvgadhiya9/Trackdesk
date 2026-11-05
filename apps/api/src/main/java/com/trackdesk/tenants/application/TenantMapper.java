package com.trackdesk.tenants.application;

import com.trackdesk.contracts.model.TenantDto;
import com.trackdesk.platform.persistence.TimeMapper;
import com.trackdesk.tenants.domain.Tenant;
import org.mapstruct.Mapper;

@Mapper(uses = TimeMapper.class)
public interface TenantMapper {

  TenantDto toDto(Tenant tenant);

  default TenantDto.StatusEnum status(String value) {
    return value == null ? null : TenantDto.StatusEnum.fromValue(value);
  }
}
