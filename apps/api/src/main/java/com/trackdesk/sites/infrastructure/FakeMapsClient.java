package com.trackdesk.sites.infrastructure;

import com.trackdesk.sites.application.MapsClient;
import java.util.Optional;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/** Local/test adapter: returns central Leeds for any LS postcode, otherwise nothing. */
@Component
@ConditionalOnProperty(
    name = "trackdesk.maps.provider",
    havingValue = "fake",
    matchIfMissing = true)
public class FakeMapsClient implements MapsClient {

  @Override
  public Optional<LatLng> geocode(String addressLine, String postcode) {
    if (postcode != null && postcode.toUpperCase().startsWith("LS")) {
      return Optional.of(new LatLng(53.7997, -1.5492));
    }
    return Optional.empty();
  }
}
