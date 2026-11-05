package com.trackdesk.sites.api;

import com.trackdesk.contracts.api.SitesApi;
import org.springframework.web.bind.annotation.RestController;

/**
 * SCAFFOLD (Sprint 1): bound to the generated {@link SitesApi} so routes exist and match the
 * contract. Every operation returns 501 (generated default) until it is overridden here with
 * {@code @PreAuthorize} + a service call, following CustomersController. When you implement an
 * endpoint, add it to CrossTenantApiTest (the coverage test enforces this).
 */
@RestController
public class SitesController implements SitesApi {}
