package com.trackdesk.customers.infrastructure;

import com.trackdesk.customers.domain.Customer;
import com.trackdesk.customers.domain.CustomerStatus;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Customer persistence. No tenant predicate is written here on purpose: Postgres RLS (and the
 * Hibernate tenant filter) scope every query to the caller's tenant — and to the customer's own
 * record for customer-role users.
 */
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

  @Query(
      """
      select c from Customer c
      where c.status = :status
        and (:pattern is null or lower(c.name) like :pattern escape '\\')
      """)
  Page<Customer> search(
      @Param("pattern") String likePattern,
      @Param("status") CustomerStatus status,
      Pageable pageable);
}
