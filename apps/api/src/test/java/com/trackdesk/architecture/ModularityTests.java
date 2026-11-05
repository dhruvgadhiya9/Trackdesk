package com.trackdesk.architecture;

import com.trackdesk.TrackdeskApplication;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.docs.Documenter;

/**
 * Spring Modulith verification: no cycles, and modules only use each other's {@code application}
 * named interface (or events). Also writes module docs to build/spring-modulith-docs.
 */
@DisplayName("Module boundaries (Spring Modulith)")
class ModularityTests {

  static final ApplicationModules MODULES = ApplicationModules.of(TrackdeskApplication.class);

  @Test
  @DisplayName("Module structure is valid")
  void verify() {
    MODULES.verify();
  }

  @Test
  @DisplayName("Write module documentation")
  void document() {
    new Documenter(MODULES).writeModulesAsPlantUml().writeIndividualModulesAsPlantUml();
  }
}
