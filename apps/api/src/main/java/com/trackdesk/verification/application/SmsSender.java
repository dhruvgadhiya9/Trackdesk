// SECURITY-REVIEW-REQUIRED: Happy Code delivery channel.
package com.trackdesk.verification.application;

/** Port for sending Happy Code SMS (provider TBD — Sprint 5). */
public interface SmsSender {

  void send(String e164PhoneNumber, String message);
}
