package com.trackdesk.customers.application;

import com.trackdesk.contracts.model.CreateCustomerRequestDto;
import com.trackdesk.contracts.model.CustomerDto;
import com.trackdesk.contracts.model.CustomerPageDto;
import com.trackdesk.contracts.model.CustomerStatusDto;
import com.trackdesk.contracts.model.UpdateCustomerRequestDto;
import com.trackdesk.customers.application.CustomerEvents.CustomerArchived;
import com.trackdesk.customers.application.CustomerEvents.CustomerCreated;
import com.trackdesk.customers.domain.Customer;
import com.trackdesk.customers.domain.CustomerStatus;
import com.trackdesk.customers.infrastructure.CustomerRepository;
import com.trackdesk.platform.audit.Audited;
import com.trackdesk.platform.tenancy.TenantContext;
import com.trackdesk.platform.web.ApiException;
import com.trackdesk.platform.web.Pages;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Customer use cases. Tenant scoping is enforced by RLS; permissions by the controller + RLS. */
@Service
@Transactional
public class CustomerService implements CustomerQueries {

  private final CustomerRepository repository;
  private final CustomerMapper mapper;
  private final ApplicationEventPublisher events;

  public CustomerService(
      CustomerRepository repository, CustomerMapper mapper, ApplicationEventPublisher events) {
    this.repository = repository;
    this.mapper = mapper;
    this.events = events;
  }

  @Transactional(readOnly = true)
  public CustomerPageDto list(String search, CustomerStatusDto status, Integer page, Integer size) {
    CustomerStatus effectiveStatus =
        status == null ? CustomerStatus.ACTIVE : CustomerStatus.valueOf(status.name());
    Page<Customer> result =
        repository.search(
            toLikePattern(search),
            effectiveStatus,
            Pages.of(page, size, Sort.by(Sort.Order.asc("name").ignoreCase())));
    return new CustomerPageDto()
        .items(result.map(mapper::toDto).getContent())
        .page(Pages.meta(result));
  }

  @Transactional(readOnly = true)
  public CustomerDto get(UUID id) {
    return mapper.toDto(find(id));
  }

  @Audited(action = "customer.created", entityType = "customer")
  public CustomerDto create(CreateCustomerRequestDto request) {
    Customer customer =
        Customer.create(mapper.toDetails(request), TenantContext.requirePrincipal().userId());
    Customer saved = repository.saveAndFlush(customer);
    events.publishEvent(new CustomerCreated(saved.getTenantId(), saved.getId()));
    return mapper.toDto(saved);
  }

  @Audited(action = "customer.updated", entityType = "customer")
  public CustomerDto update(UUID id, UpdateCustomerRequestDto request) {
    Customer customer = find(id);
    try {
      customer.update(mapper.toDetails(request), request.getVersion());
    } catch (Customer.StaleCustomerException e) {
      throw ApiException.conflict("conflict", e.getMessage());
    }
    return mapper.toDto(repository.saveAndFlush(customer));
  }

  @Audited(action = "customer.archived", entityType = "customer")
  public CustomerDto archive(UUID id) {
    Customer customer = find(id);
    customer.archive();
    Customer saved = repository.saveAndFlush(customer);
    events.publishEvent(new CustomerArchived(saved.getTenantId(), saved.getId()));
    return mapper.toDto(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public boolean exists(UUID customerId) {
    return repository.existsById(customerId);
  }

  private Customer find(UUID id) {
    return repository.findById(id).orElseThrow(() -> ApiException.notFound("Customer"));
  }

  /** Case-insensitive "contains" pattern with LIKE wildcards escaped. */
  static String toLikePattern(String search) {
    if (search == null || search.isBlank()) {
      return null;
    }
    String escaped =
        search.trim().toLowerCase().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    return "%" + escaped + "%";
  }
}
