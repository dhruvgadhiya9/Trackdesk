package com.trackdesk.sites.application;

import java.util.Optional;

/** Port for geocoding UK addresses (Google Maps or Mapbox adapter — Sprint 1). */
public interface MapsClient {

  Optional<LatLng> geocode(String addressLine, String postcode);

  record LatLng(double latitude, double longitude) {}
}
