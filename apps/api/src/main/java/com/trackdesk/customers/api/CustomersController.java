package com.trackdesk.customers.api;

import com.trackdesk.contracts.api.CustomersApi;
import com.trackdesk.contracts.model.CreateCustomerRequestDto;
import com.trackdesk.contracts.model.CustomerDto;
import com.trackdesk.contracts.model.CustomerPageDto;
import com.trackdesk.contracts.model.CustomerStatusDto;
import com.trackdesk.contracts.model.UpdateCustomerRequestDto;
import com.trackdesk.customers.application.CustomerService;
import com.trackdesk.platform.security.Permission;
import java.net.URI;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

/**
 * Implements the generated {@link CustomersApi} — signatures come from the OpenAPI spec, so the API
 * cannot drift from the contract. Thin: permission check + delegate to the service.
 */
@RestController
public class CustomersController implements CustomersApi {

  private final CustomerService service;

  public CustomersController(CustomerService service) {
    this.service = service;
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.CUSTOMERS_READ + "')")
  public ResponseEntity<CustomerPageDto> listCustomers(
      String search, CustomerStatusDto status, Integer page, Integer size) {
    return ResponseEntity.ok(service.list(search, status, page, size));
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.CUSTOMERS_READ + "')")
  public ResponseEntity<CustomerDto> getCustomer(UUID customerId) {
    return ResponseEntity.ok(service.get(customerId));
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.CUSTOMERS_CREATE + "')")
  public ResponseEntity<CustomerDto> createCustomer(CreateCustomerRequestDto request) {
    CustomerDto created = service.create(request);
    return ResponseEntity.created(URI.create("/v1/customers/" + created.getId())).body(created);
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.CUSTOMERS_UPDATE + "')")
  public ResponseEntity<CustomerDto> updateCustomer(
      UUID customerId, UpdateCustomerRequestDto request) {
    return ResponseEntity.ok(service.update(customerId, request));
  }

  @Override
  @PreAuthorize("hasAuthority('" + Permission.CUSTOMERS_ARCHIVE + "')")
  public ResponseEntity<CustomerDto> archiveCustomer(UUID customerId) {
    return ResponseEntity.ok(service.archive(customerId));
  }
}
