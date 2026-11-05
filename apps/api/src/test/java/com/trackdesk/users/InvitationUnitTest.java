package com.trackdesk.users;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.trackdesk.users.domain.Invitation;
import com.trackdesk.users.domain.Invitation.Status;
import com.trackdesk.users.domain.InvitationTokens;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class InvitationUnitTest {

  final Instant now = Instant.parse("2026-11-06T10:00:00Z");

  Invitation invitation() {
    return new Invitation(
        " Tech@Example.TEST ", "field_worker", null, "hash", UUID.randomUUID(), now);
  }

  @Test
  void lifecycle() {
    Invitation i = invitation();
    assertThat(i.getEmail()).isEqualTo("tech@example.test");
    assertThat(i.status(now)).isEqualTo(Status.PENDING);
    assertThat(i.status(now.plus(Duration.ofDays(8)))).isEqualTo(Status.EXPIRED);
    i.accept(UUID.randomUUID(), now.plusSeconds(60));
    assertThat(i.status(now.plusSeconds(61))).isEqualTo(Status.ACCEPTED);
    assertThatThrownBy(() -> i.accept(UUID.randomUUID(), now.plusSeconds(120)))
        .isInstanceOf(IllegalStateException.class);
  }

  @Test
  void revokedCannotBeAccepted() {
    Invitation i = invitation();
    i.revoke(now);
    assertThat(i.status(now)).isEqualTo(Status.REVOKED);
    assertThatThrownBy(() -> i.accept(UUID.randomUUID(), now))
        .isInstanceOf(IllegalStateException.class);
  }

  @Test
  void emailMatchIsCaseInsensitive() {
    assertThat(invitation().isFor("TECH@example.test")).isTrue();
    assertThat(invitation().isFor("other@example.test")).isFalse();
    assertThat(invitation().isFor(null)).isFalse();
  }

  @Test
  void tokensAreRandomAndHashedDeterministically() {
    String a = InvitationTokens.newToken();
    String b = InvitationTokens.newToken();
    assertThat(a).isNotEqualTo(b).hasSize(43);
    assertThat(InvitationTokens.hash(a)).hasSize(64).isEqualTo(InvitationTokens.hash(a));
    assertThat(InvitationTokens.hash(a)).isNotEqualTo(InvitationTokens.hash(b));
  }
}
