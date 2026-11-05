package com.trackdesk.compliance.api;

import com.trackdesk.contracts.api.ComplianceApi;
import org.springframework.web.bind.annotation.RestController;

/**
 * SCAFFOLD (Sprint 5): bound to the generated {@link ComplianceApi} so routes exist and match the
 * contract. Every operation returns 501 (generated default) until it is overridden here with
 * {@code @PreAuthorize} + a service call, following CustomersController. When you implement an
 * endpoint, add it to CrossTenantApiTest (the coverage test enforces this).
 */
@RestController
public class ComplianceController implements ComplianceApi {}
