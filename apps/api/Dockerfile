# TrackDesk API — layered Spring Boot image. Build from the REPO ROOT (needs packages/contracts):
#   docker build -f apps/api/Dockerfile -t trackdesk-api .
# Secrets are injected at runtime from the secret manager; never bake them into the image.

FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY packages/contracts/generated packages/contracts/generated
COPY packages/contracts/codegen packages/contracts/codegen
COPY apps/api apps/api
WORKDIR /src/apps/api
RUN ./gradlew --no-daemon bootJar -x test \
 && java -Djarmode=tools -jar build/libs/trackdesk-api-*.jar extract --layers --launcher --destination /extracted

FROM eclipse-temurin:21-jre
RUN useradd --system --uid 10001 trackdesk
WORKDIR /app
COPY --from=build /extracted/dependencies/ ./
COPY --from=build /extracted/spring-boot-loader/ ./
COPY --from=build /extracted/snapshot-dependencies/ ./
COPY --from=build /extracted/application/ ./
USER 10001
EXPOSE 8080
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError"
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/actuator/health/liveness || exit 1
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
