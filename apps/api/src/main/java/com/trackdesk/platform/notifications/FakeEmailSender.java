package com.trackdesk.platform.notifications;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Local/test adapter: keeps the last message per recipient in memory (tests read the invite link
 * from here). Logs the recipient only — never the token — to avoid secrets in logs.
 */
public class FakeEmailSender implements EmailSender {

  private static final Logger log = LoggerFactory.getLogger(FakeEmailSender.class);

  public record SentInvitation(String toEmail, String companyName, String role, String acceptUrl) {}

  private final Map<String, SentInvitation> lastByEmail = new ConcurrentHashMap<>();
  private final boolean logLinks;

  public FakeEmailSender() {
    this(false);
  }

  /**
   * @param logLinks LOCAL PROFILE ONLY: also log the accept link so a developer can accept
   *     invitations without a mail provider. Never enable in shared environments.
   */
  public FakeEmailSender(boolean logLinks) {
    this.logLinks = logLinks;
  }

  @Override
  public void sendInvitation(String toEmail, String companyName, String role, String acceptUrl) {
    lastByEmail.put(
        toEmail.toLowerCase(), new SentInvitation(toEmail, companyName, role, acceptUrl));
    log.info("[fake-email] invitation for role {} sent to {}", role, toEmail);
    if (logLinks) {
      log.warn("[fake-email][local only] accept link for {}: {}", toEmail, acceptUrl);
    }
  }

  public Optional<SentInvitation> lastInvitationTo(String email) {
    return Optional.ofNullable(lastByEmail.get(email.toLowerCase()));
  }
}
