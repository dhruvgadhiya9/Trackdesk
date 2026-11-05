package com.trackdesk.customers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.trackdesk.customers.domain.Address;
import com.trackdesk.customers.domain.Customer;
import com.trackdesk.customers.domain.Customer.CustomerDetails;
import com.trackdesk.customers.domain.CustomerStatus;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CustomerUnitTest {

  @Test
  void createTrimsAndNormalises() {
    Customer c =
        Customer.create(
            new CustomerDetails(
                "  Northside Academy ",
                " ",
                "fm@x.test",
                null,
                new Address("1 Lane", null, "Leeds", " ls1 4ap "),
                ""),
            UUID.randomUUID());
    assertThat(c.getName()).isEqualTo("Northside Academy");
    assertThat(c.getAccountNumber()).isNull();
    assertThat(c.getNotes()).isNull();
    assertThat(c.getBillingAddress().getPostcode()).isEqualTo("LS1 4AP");
    assertThat(c.getStatus()).isEqualTo(CustomerStatus.ACTIVE);
  }

  @Test
  void nameIsRequired() {
    assertThatThrownBy(() -> new CustomerDetails(" ", null, null, null, null, null))
        .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void archive() {
    Customer c = Customer.create(new CustomerDetails("X", null, null, null, null, null), null);
    c.archive();
    assertThat(c.getStatus()).isEqualTo(CustomerStatus.ARCHIVED);
  }

  @Test
  void statusConverterUsesLowercaseWireValues() {
    var converter = new CustomerStatus.JpaConverter();
    assertThat(converter.convertToDatabaseColumn(CustomerStatus.ARCHIVED)).isEqualTo("archived");
    assertThat(converter.convertToEntityAttribute("active")).isEqualTo(CustomerStatus.ACTIVE);
  }
}
