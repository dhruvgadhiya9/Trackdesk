package com.trackdesk.customers.application;

import com.trackdesk.contracts.model.AddressDto;
import com.trackdesk.contracts.model.CreateCustomerRequestDto;
import com.trackdesk.contracts.model.CustomerDto;
import com.trackdesk.contracts.model.UpdateCustomerRequestDto;
import com.trackdesk.customers.domain.Address;
import com.trackdesk.customers.domain.Customer;
import com.trackdesk.customers.domain.Customer.CustomerDetails;
import com.trackdesk.platform.persistence.TimeMapper;
import org.mapstruct.Mapper;

/** MapStruct mapping between the Customer entity and the OpenAPI-generated DTOs. */
@Mapper(uses = TimeMapper.class)
public interface CustomerMapper {

  CustomerDto toDto(Customer customer);

  AddressDto toDto(Address address);

  default Address toAddress(AddressDto dto) {
    return dto == null
        ? null
        : new Address(dto.getLine1(), dto.getLine2(), dto.getCity(), dto.getPostcode());
  }

  default CustomerDetails toDetails(CreateCustomerRequestDto r) {
    return new CustomerDetails(
        r.getName(),
        r.getAccountNumber(),
        r.getEmail(),
        r.getPhone(),
        toAddress(r.getBillingAddress()),
        r.getNotes());
  }

  default CustomerDetails toDetails(UpdateCustomerRequestDto r) {
    return new CustomerDetails(
        r.getName(),
        r.getAccountNumber(),
        r.getEmail(),
        r.getPhone(),
        toAddress(r.getBillingAddress()),
        r.getNotes());
  }
}
