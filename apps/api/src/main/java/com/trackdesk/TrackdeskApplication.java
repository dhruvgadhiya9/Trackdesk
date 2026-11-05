package com.trackdesk;

import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.modulith.Modulithic;
import org.springframework.scheduling.annotation.EnableScheduling;

/** TrackDesk API — Spring Modulith modular monolith. Module map: docs/02-architecture.md §3. */
@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "PT10M")
@Modulithic(systemName = "TrackDesk", sharedModules = "platform")
public class TrackdeskApplication {

  public static void main(String[] args) {
    SpringApplication.run(TrackdeskApplication.class, args);
  }
}
