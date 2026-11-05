package com.trackdesk.verification.infrastructure;

import com.trackdesk.verification.application.SmsSender;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/** Local/test adapter: keeps messages in memory (tests read codes from here; never logged). */
@Component
@ConditionalOnProperty(name = "trackdesk.sms.provider", havingValue = "fake", matchIfMissing = true)
public class FakeSmsSender implements SmsSender {

  public record Sms(String to, String message) {}

  private final List<Sms> sent = new CopyOnWriteArrayList<>();

  @Override
  public void send(String e164PhoneNumber, String message) {
    sent.add(new Sms(e164PhoneNumber, message));
  }

  public List<Sms> sent() {
    return List.copyOf(sent);
  }
}
