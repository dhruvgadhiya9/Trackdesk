package com.trackdesk.support;

import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;
import org.testcontainers.utility.MountableFile;

/**
 * One PostGIS container per test JVM (started lazily, reused by every integration test). The
 * bootstrap script (roles + extensions) runs as the container superuser, exactly as a human runs it
 * once per real environment; Flyway then migrates as trackdesk_owner.
 */
public final class PostgresContainer {

  public static final String APP_USER = "trackdesk_app";
  public static final String APP_PASSWORD = "trackdesk_app_local";
  public static final String OWNER_USER = "trackdesk_owner";
  public static final String OWNER_PASSWORD = "trackdesk_owner_local";

  private static final PostgreSQLContainer<?> CONTAINER =
      new PostgreSQLContainer<>(
              DockerImageName.parse("postgis/postgis:16-3.4").asCompatibleSubstituteFor("postgres"))
          .withDatabaseName("trackdesk")
          .withCopyFileToContainer(
              MountableFile.forClasspathResource("db/bootstrap/00_roles_and_extensions.sql"),
              "/docker-entrypoint-initdb.d/zz_trackdesk_bootstrap.sql");

  private PostgresContainer() {}

  public static synchronized PostgreSQLContainer<?> get() {
    if (!CONTAINER.isRunning()) {
      CONTAINER.start();
    }
    return CONTAINER;
  }
}
