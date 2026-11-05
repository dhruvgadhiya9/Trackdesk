package com.trackdesk.users.infrastructure;

import com.trackdesk.users.domain.Invitation;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvitationRepository extends JpaRepository<Invitation, UUID> {

  /**
   * Visible without a tenant ONLY when {@code app.invite_token_hash} equals this hash (capability
   * RLS policy on invitation; see V1__platform.sql).
   */
  Optional<Invitation> findByTokenHash(String tokenHash);

  @Query(
      """
      select i from Invitation i
      where i.acceptedAt is null and i.revokedAt is null and i.expiresAt > :now
      order by i.createdAt desc
      """)
  List<Invitation> findPending(@Param("now") Instant now);

  @Query(
      """
      select i from Invitation i
      where lower(i.email) = lower(:email)
        and i.acceptedAt is null and i.revokedAt is null
      """)
  List<Invitation> findOpenForEmail(@Param("email") String email);
}
