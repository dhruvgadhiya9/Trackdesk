package com.trackdesk.customers.domain;

import jakarta.persistence.Embeddable;

/** UK postal address (value object). */
@Embeddable
public class Address {

  private String line1;
  private String line2;
  private String city;
  private String postcode;

  protected Address() {}

  public Address(String line1, String line2, String city, String postcode) {
    this.line1 = line1;
    this.line2 = line2;
    this.city = city;
    this.postcode = postcode == null ? null : postcode.trim().toUpperCase();
  }

  public String getLine1() {
    return line1;
  }

  public String getLine2() {
    return line2;
  }

  public String getCity() {
    return city;
  }

  public String getPostcode() {
    return postcode;
  }
}
