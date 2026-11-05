package com.trackdesk.platform;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * With the {@code migrate-only} profile the app starts (Flyway migrates on startup) and exits. Used
 * by {@code pnpm db:migrate}.
 */
@Component
@Profile("migrate-only")
public class MigrateOnlyRunner implements ApplicationRunner {

  private final ApplicationContext context;

  public MigrateOnlyRunner(ApplicationContext context) {
    this.context = context;
  }

  @Override
  public void run(ApplicationArguments args) {
    System.exit(SpringApplication.exit(context, () -> 0));
  }
}
