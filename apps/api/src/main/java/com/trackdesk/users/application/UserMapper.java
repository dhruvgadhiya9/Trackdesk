package com.trackdesk.users.application;

import com.trackdesk.contracts.model.InvitationDto;
import com.trackdesk.contracts.model.RoleDto;
import com.trackdesk.contracts.model.UserDto;
import com.trackdesk.platform.persistence.TimeMapper;
import com.trackdesk.users.domain.AppUser;
import com.trackdesk.users.domain.Invitation;
import java.time.Instant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(uses = TimeMapper.class)
public interface UserMapper {

  UserDto toDto(AppUser user);

  @Mapping(target = "status", expression = "java(status(invitation, now))")
  InvitationDto toDto(Invitation invitation, Instant now);

  default RoleDto role(String value) {
    return value == null ? null : RoleDto.fromValue(value);
  }

  default UserDto.StatusEnum userStatus(String value) {
    return value == null ? null : UserDto.StatusEnum.fromValue(value);
  }

  default InvitationDto.StatusEnum status(Invitation invitation, Instant now) {
    return InvitationDto.StatusEnum.fromValue(invitation.status(now).name().toLowerCase());
  }
}
