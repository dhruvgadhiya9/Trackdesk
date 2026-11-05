package com.trackdesk.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.repository.Repository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RestController;

/** Enforces CLAUDE.md forbidden patterns that the compiler cannot. */
@DisplayName("Architecture rules (ArchUnit)")
class ArchitectureTests {

  static JavaClasses classes;

  @BeforeAll
  static void importClasses() {
    classes =
        new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.trackdesk");
  }

  @Test
  @DisplayName("Controllers implement a generated OpenAPI interface")
  void controllersImplementGeneratedInterfaces() {
    classes()
        .that()
        .areAnnotatedWith(RestController.class)
        .should(implementAGeneratedApiInterface())
        .check(classes);
  }

  @Test
  @DisplayName("Controllers never touch repositories or the EntityManager")
  void noRepositoryAccessFromControllers() {
    noClasses()
        .that()
        .areAnnotatedWith(RestController.class)
        .should()
        .dependOnClassesThat()
        .areAssignableTo(Repository.class)
        .orShould()
        .dependOnClassesThat()
        .areAssignableTo(EntityManager.class)
        .orShould()
        .dependOnClassesThat()
        .resideInAPackage("..infrastructure..")
        .check(classes);
  }

  @Test
  @DisplayName("Spring Data repositories live in infrastructure (or platform)")
  void repositoriesInInfrastructure() {
    classes()
        .that()
        .areAssignableTo(Repository.class)
        .and()
        .areInterfaces()
        .should()
        .resideInAnyPackage("..infrastructure..", "com.trackdesk.platform..")
        .check(classes);
  }

  @Test
  @DisplayName("No raw SQL (EntityManager / JdbcTemplate) outside repositories and tenancy")
  void noRawSqlOutsideRepositories() {
    noClasses()
        .that()
        .resideOutsideOfPackages("..infrastructure..", "com.trackdesk.platform.tenancy..")
        .and()
        .areNotAnnotatedWith(org.springframework.stereotype.Repository.class)
        .should()
        .callMethod(EntityManager.class, "createNativeQuery", String.class)
        .orShould()
        .dependOnClassesThat()
        .areAssignableTo(JdbcTemplate.class)
        .check(classes);
  }

  @Test
  @DisplayName("Domain code does not depend on web, API DTOs or infrastructure")
  void domainIsPure() {
    noClasses()
        .that()
        .resideInAPackage("..domain..")
        .should()
        .dependOnClassesThat()
        .resideInAnyPackage(
            "org.springframework.web..",
            "com.trackdesk.contracts..",
            "..infrastructure..",
            "..api..")
        .check(classes);
  }

  @Test
  @DisplayName("Platform (shared kernel) does not depend on business modules")
  void platformIndependent() {
    noClasses()
        .that()
        .resideInAPackage("com.trackdesk.platform..")
        .should()
        .dependOnClassesThat()
        .resideInAnyPackage(
            "com.trackdesk.customers..",
            "com.trackdesk.tenants..",
            "com.trackdesk.users..",
            "com.trackdesk.jobs..",
            "com.trackdesk.sites..")
        .check(classes);
  }

  @Test
  @DisplayName("Only the tenancy package writes TenantContext")
  void tenantContextIsNotSetElsewhere() {
    noClasses()
        .that()
        .resideOutsideOfPackage("com.trackdesk.platform.tenancy..")
        .should()
        .callMethod(
            com.trackdesk.platform.tenancy.TenantContext.class,
            "callAs",
            com.trackdesk.platform.tenancy.TenantPrincipal.class,
            java.util.Map.class,
            java.util.function.Supplier.class)
        .check(classes);
  }

  private static ArchCondition<JavaClass> implementAGeneratedApiInterface() {
    return new ArchCondition<>("implement an interface from com.trackdesk.contracts.api") {
      @Override
      public void check(JavaClass item, ConditionEvents events) {
        boolean ok =
            item.getAllRawInterfaces().stream()
                .anyMatch(i -> i.getPackageName().equals("com.trackdesk.contracts.api"));
        events.add(
            new SimpleConditionEvent(
                item,
                ok,
                item.getName()
                    + (ok ? " implements" : " does not implement")
                    + " a generated API"));
      }
    };
  }
}
