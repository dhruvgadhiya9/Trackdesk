package com.trackdesk.platform.notifications;

/** Port for transactional email (provider TBD — see docs/02-architecture.md §8). */
public interface EmailSender {

  void sendInvitation(String toEmail, String companyName, String role, String acceptUrl);
}
