package com.trackdesk.chat.api;

import com.trackdesk.contracts.api.ChatApi;
import org.springframework.web.bind.annotation.RestController;

/**
 * SCAFFOLD (Sprint 6): bound to the generated {@link ChatApi} so routes exist and match the
 * contract. Every operation returns 501 (generated default) until it is overridden here with
 * {@code @PreAuthorize} + a service call, following CustomersController. When you implement an
 * endpoint, add it to CrossTenantApiTest (the coverage test enforces this).
 */
@RestController
public class ChatController implements ChatApi {}
