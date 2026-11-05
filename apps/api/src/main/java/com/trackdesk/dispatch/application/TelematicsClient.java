package com.trackdesk.dispatch.application;

import java.util.Optional;
import java.util.UUID;

/** Port for vehicle telematics. v1: stub only (telematics is deferred, see scope statement). */
public interface TelematicsClient {

  Optional<VehiclePosition> latestPosition(UUID technicianId);

  record VehiclePosition(double latitude, double longitude, java.time.Instant at) {}
}
