package com.trackdesk.dispatch.infrastructure;

import com.trackdesk.dispatch.application.TelematicsClient;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

/** v1 stub: no telematics provider. */
@Component
public class StubTelematicsClient implements TelematicsClient {

  @Override
  public Optional<VehiclePosition> latestPosition(UUID technicianId) {
    return Optional.empty();
  }
}
