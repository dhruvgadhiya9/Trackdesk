# PRD 22 — Chat
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/chat.yaml` · Sprint 6

## User stories
- As an ops manager, I chat with a technician about a job, and with a customer about their request.
- As an ops manager, I can hide inappropriate messages (moderation).

## Acceptance criteria
```gherkin
Feature: Chat
  Scenario: Live message
    When ops sends a message in a job conversation
    Then the technician receives it live via Supabase Realtime

  Scenario: Only participants can read
    Given I am not a participant of a conversation
    When I fetch its history
    Then the response is 404

  Scenario: Cross-tenant leak test
    Given subscribers in tenant A and tenant B
    When a tenant B message is sent
    Then the tenant A subscriber receives nothing

  Scenario: Moderation
    When ops hides a message
    Then it shows as "message removed" for all participants and the action is audited
```
