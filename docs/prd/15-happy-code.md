# PRD 15 — Happy Code OTP job verification
Linked Figma frame: TODO · Contract: `packages/contracts/openapi/verification.yaml` · Sprint 5
**SECURITY-REVIEW-REQUIRED**

## User stories
- As a customer site contact, I receive a 6-digit "Happy Code" by SMS when the technician completes the job, and I give it to them if I'm satisfied.
- As a technician, I enter the Happy Code to verify the job.

## Acceptance criteria
```gherkin
Feature: Happy Code
  Scenario: Code sent on completion
    When a job is completed
    Then a 6-digit code is generated, stored as a hash (Argon2/BCrypt), expires in 30 minutes
    And sent by SMS to the site contact through the SMS adapter

  Scenario: Correct code verifies the job
    When the technician enters the correct code before expiry
    Then the job moves completed → verified and an audit event is recorded

  Scenario: Attempt limit
    When 5 wrong codes are entered
    Then the code is locked and ops must resend

  Scenario: Expired code
    When the code is entered after expiry
    Then the response is 410

  Scenario: Rate limit on resend
    When resend is requested more than 3 times in 15 minutes
    Then the response is 429

  Scenario: Ops override
    When ops verifies without a code
    Then a reason is required and audited
```
