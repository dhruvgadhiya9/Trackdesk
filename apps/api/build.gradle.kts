import org.openapitools.generator.gradle.plugin.tasks.GenerateTask

plugins {
  java
  jacoco
  alias(libs.plugins.spring.boot)
  alias(libs.plugins.spring.dependency.management)
  alias(libs.plugins.openapi.generator)
  alias(libs.plugins.spotless)
}

group = "com.trackdesk"
version = "0.1.0"

java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }

repositories { mavenCentral() }

dependencyManagement {
  imports {
    mavenBom(libs.spring.modulith.bom.get().toString())
    mavenBom(libs.testcontainers.bom.get().toString())
  }
}

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("org.springframework.boot:spring-boot-starter-aop")
  implementation(libs.spring.modulith.starter.core)
  implementation("org.flywaydb:flyway-core")
  implementation("org.flywaydb:flyway-database-postgresql")
  implementation("org.hibernate.orm:hibernate-spatial")
  implementation(libs.mapstruct)
  implementation(libs.shedlock.spring)
  implementation(libs.shedlock.jdbc)
  implementation(libs.logstash.encoder)
  implementation(libs.sentry.spring.boot)
  implementation("io.micrometer:micrometer-registry-prometheus")
  runtimeOnly("org.postgresql:postgresql")

  annotationProcessor(libs.mapstruct.processor)
  annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")

  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.boot:spring-boot-testcontainers")
  testImplementation("org.springframework.security:spring-security-test")
  testImplementation(libs.spring.modulith.starter.test)
  testImplementation("org.testcontainers:junit-jupiter")
  testImplementation("org.testcontainers:postgresql")
  testImplementation(libs.archunit.junit5)
  testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

// ---------------------------------------------------------------------------------------------
// OpenAPI-first: generate Spring interfaces + DTOs from the bundled spec in packages/contracts.
// Controllers implement the generated *Api interfaces, so drift is a compile error.
// ---------------------------------------------------------------------------------------------
val contractsDir = layout.projectDirectory.dir("../../packages/contracts")
val generatedOpenApiDir = layout.buildDirectory.dir("generated/openapi")

val openApiGenerate by tasks.getting(GenerateTask::class) {
  generatorName.set("spring")
  inputSpec.set(contractsDir.file("generated/openapi.bundled.yaml").asFile.toURI().toString())
  configFile.set(contractsDir.file("codegen/java-spring.json").asFile.absolutePath)
  outputDir.set(generatedOpenApiDir.get().asFile.absolutePath)
  globalProperties.set(mapOf("apis" to "", "models" to "", "supportingFiles" to "ApiUtil.java"))
  cleanupOutput.set(true)
  validateSpec.set(true)
}

sourceSets { main { java { srcDir(generatedOpenApiDir.map { it.dir("src/main/java") }) } } }

tasks.withType<JavaCompile>().configureEach { options.encoding = "UTF-8" }

tasks.compileJava {
  dependsOn(openApiGenerate)
  options.compilerArgs.addAll(
      listOf("-parameters", "-Amapstruct.defaultComponentModel=spring", "-Amapstruct.unmappedTargetPolicy=ERROR", "-Amapstruct.defaultInjectionStrategy=constructor"))
}

// ---------------------------------------------------------------------------------------------
// Tests: unit + integration (Testcontainers) run in `test`. `isolationTest` runs only the tenant
// isolation suite (tag "isolation") for the fast CI gate and `pnpm test:isolation`.
// ---------------------------------------------------------------------------------------------
tasks.withType<Test>().configureEach {
  useJUnitPlatform()
  jvmArgs("-XX:+EnableDynamicAgentLoading")
  testLogging {
    events("failed", "skipped")
    exceptionFormat = org.gradle.api.tasks.testing.logging.TestExceptionFormat.FULL
  }
}

tasks.register<Test>("isolationTest") {
  description = "Runs the tenant-isolation suite (RLS + API cross-tenant tests)."
  group = "verification"
  testClassesDirs = sourceSets.test.get().output.classesDirs
  classpath = sourceSets.test.get().runtimeClasspath
  useJUnitPlatform { includeTags("isolation") }
}

tasks.test { finalizedBy(tasks.jacocoTestReport) }

tasks.jacocoTestReport {
  dependsOn(tasks.test)
  reports { xml.required = true; html.required = true }
  classDirectories.setFrom(
      files(classDirectories.files.map { fileTree(it) { exclude("com/trackdesk/contracts/**") } }))
}

spotless {
  java {
    target("src/**/*.java")
    targetExclude("src/main/java/com/trackdesk/platform/security/Permission.java")
    googleJavaFormat(libs.versions.google.java.format.get())
    removeUnusedImports()
    trimTrailingWhitespace()
    endWithNewline()
  }
  kotlinGradle {
    target("*.gradle.kts")
    trimTrailingWhitespace()
    endWithNewline()
  }
}

tasks.named("check") { dependsOn("spotlessCheck") }

tasks.bootJar { layered { enabled = true } }
