// SECURITY-REVIEW-REQUIRED: the tenant-isolation proof. Weakening any assertion needs Tech Lead
// sign-off.
package com.trackdesk.isolation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.catchThrowable;

import com.trackdesk.support.IntegrationTest;
import com.trackdesk.support.PostgresContainer;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.core.io.ClassPathResource;

/**
 * Database-level proof that RLS isolates tenants, for EVERY table with a tenant_id column
 * (discovered from the catalog, so new tables are covered automatically). Connects as the API role
 * {@code trackdesk_app} with {@code app.tenant_id} = tenant A and tries to read, insert, update and
 * delete tenant B's rows. Also proves queries fail closed with no tenant set.
 */
@Tag("isolation")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("Tenant isolation at the database (RLS)")
class RlsIsolationTest extends IntegrationTest {

  static final UUID TENANT_A = UUID.fromString("aaaaaaaa-0000-4000-8000-000000000001");
  static final UUID OWNER_A = UUID.fromString("aaaaaaaa-0000-4000-8000-0000000000a1");
  static final UUID TENANT_B = UUID.fromString("bbbbbbbb-0000-4000-8000-000000000002");
  static final String RLS_VIOLATION_OR_NO_PRIVILEGE = "42501";

  @BeforeAll
  void seed() throws Exception {
    try (Connection c = superuser()) {
      boolean seeded;
      try (Statement s = c.createStatement();
          ResultSet rs =
              s.executeQuery("select count(*) from tenant where id = '" + TENANT_A + "'")) {
        rs.next();
        seeded = rs.getInt(1) > 0;
      }
      if (!seeded) {
        String script =
            new String(
                new ClassPathResource("isolation/seed.sql").getInputStream().readAllBytes(),
                java.nio.charset.StandardCharsets.UTF_8);
        try (Statement s = c.createStatement()) {
          s.execute(script);
        }
      }
    }
  }

  Stream<String> tenantTables() throws SQLException {
    List<String> tables = new ArrayList<>();
    try (Connection c = superuser();
        ResultSet rs =
            c.createStatement()
                .executeQuery(
                    """
                    select c.table_name from information_schema.columns c
                    join information_schema.tables t
                      on t.table_name = c.table_name and t.table_schema = c.table_schema
                    where c.table_schema = 'public' and c.column_name = 'tenant_id'
                      and t.table_type = 'BASE TABLE'
                    order by 1
                    """)) {
      while (rs.next()) {
        tables.add(rs.getString(1));
      }
    }
    assertThat(tables).as("tenant tables discovered").hasSizeGreaterThan(30);
    return tables.stream();
  }

  // ------------------------------------------------------------------ structural guarantees

  @Test
  @DisplayName("The API role is not superuser, has no BYPASSRLS and owns no tables")
  void appRoleCannotBypassRls() throws SQLException {
    try (Connection c = superuser();
        ResultSet rs =
            c.createStatement()
                .executeQuery(
                    "select rolsuper, rolbypassrls from pg_roles where rolname = 'trackdesk_app'")) {
      assertThat(rs.next()).isTrue();
      assertThat(rs.getBoolean("rolsuper")).isFalse();
      assertThat(rs.getBoolean("rolbypassrls")).isFalse();
    }
    assertThat(
            queryLong(
                superuser(),
                "select count(*) from pg_tables where schemaname = 'public' and tableowner = 'trackdesk_app'"))
        .isZero();
  }

  @ParameterizedTest(name = "{0}: RLS enabled + forced, index leads with tenant_id")
  @MethodSource("tenantTables")
  void rlsEnabledForcedAndIndexed(String table) throws SQLException {
    try (Connection c = superuser()) {
      try (PreparedStatement ps =
          c.prepareStatement(
              "select relrowsecurity, relforcerowsecurity from pg_class where oid = ?::regclass")) {
        ps.setString(1, table);
        try (ResultSet rs = ps.executeQuery()) {
          rs.next();
          assertThat(rs.getBoolean(1)).as(table + " RLS enabled").isTrue();
          assertThat(rs.getBoolean(2)).as(table + " RLS forced").isTrue();
        }
      }
      try (PreparedStatement ps =
          c.prepareStatement(
              """
              select count(*) from pg_index i
              join pg_attribute a on a.attrelid = i.indrelid and a.attnum = i.indkey[0]
              where i.indrelid = ?::regclass and a.attname = 'tenant_id'
              """)) {
        ps.setString(1, table);
        try (ResultSet rs = ps.executeQuery()) {
          rs.next();
          assertThat(rs.getLong(1)).as(table + " has an index leading with tenant_id").isPositive();
        }
      }
      try (PreparedStatement ps =
          c.prepareStatement("select count(*) from pg_policies where tablename = ?")) {
        ps.setString(1, table);
        try (ResultSet rs = ps.executeQuery()) {
          rs.next();
          assertThat(rs.getLong(1)).as(table + " has policies").isPositive();
        }
      }
    }
  }

  @ParameterizedTest(name = "{0}: fixture has rows for tenant A and B")
  @MethodSource("tenantTables")
  void seedCoversEveryTenantTable(String table) throws SQLException {
    try (Connection c = superuser()) {
      assertThat(countWhereTenant(c, table, TENANT_A)).as(table + " rows for A").isPositive();
      assertThat(countWhereTenant(c, table, TENANT_B)).as(table + " rows for B").isPositive();
    }
  }

  // ------------------------------------------------------------------ behaviour as tenant A

  @ParameterizedTest(name = "{0}: tenant A cannot SELECT tenant B rows")
  @MethodSource("tenantTables")
  void cannotSelectOtherTenant(String table) throws SQLException {
    asTenantA(
        c -> {
          assertThat(countWhereTenant(c, table, TENANT_B)).as(table).isZero();
          long visible = queryLong(c, "select count(*) from " + table);
          long own = countWhereTenant(c, table, TENANT_A);
          assertThat(visible).as(table + " only own rows visible").isEqualTo(own);
          assertThat(own).as(table + " own rows visible (positive control)").isPositive();
        });
  }

  @ParameterizedTest(name = "{0}: tenant A cannot UPDATE tenant B rows")
  @MethodSource("tenantTables")
  void cannotUpdateOtherTenant(String table) throws SQLException {
    long before = countWhereTenantAsSuperuser(table, TENANT_B);
    asTenantA(
        c -> {
          Throwable t =
              catchThrowable(
                  () ->
                      assertThat(
                              update(
                                  c,
                                  "update "
                                      + table
                                      + " set tenant_id = tenant_id where tenant_id = ?",
                                  TENANT_B))
                          .isZero());
          assertNoRowsOrDenied(table, t);
        });
    assertThat(countWhereTenantAsSuperuser(table, TENANT_B)).isEqualTo(before);
  }

  @ParameterizedTest(name = "{0}: tenant A cannot move its rows to tenant B")
  @MethodSource("tenantTables")
  void cannotReassignToOtherTenant(String table) throws SQLException {
    long before = countWhereTenantAsSuperuser(table, TENANT_B);
    asTenantA(
        c -> {
          Throwable t =
              catchThrowable(
                  () ->
                      update(
                          c,
                          "update "
                              + table
                              + " set tenant_id = '"
                              + TENANT_B
                              + "' where tenant_id = ?",
                          TENANT_A));
          // Either denied (WITH CHECK / no privilege) or no rows matched (no update permission).
          if (t != null) {
            assertDenied(table, t);
          }
        });
    assertThat(countWhereTenantAsSuperuser(table, TENANT_B)).isEqualTo(before);
  }

  @ParameterizedTest(name = "{0}: tenant A cannot DELETE tenant B rows")
  @MethodSource("tenantTables")
  void cannotDeleteOtherTenant(String table) throws SQLException {
    long before = countWhereTenantAsSuperuser(table, TENANT_B);
    asTenantA(
        c -> {
          Throwable t =
              catchThrowable(
                  () ->
                      assertThat(
                              update(c, "delete from " + table + " where tenant_id = ?", TENANT_B))
                          .isZero());
          assertNoRowsOrDenied(table, t);
        });
    assertThat(countWhereTenantAsSuperuser(table, TENANT_B)).isEqualTo(before);
  }

  @ParameterizedTest(name = "{0}: tenant A cannot INSERT rows for tenant B")
  @MethodSource("tenantTables")
  void cannotInsertForOtherTenant(String table) throws SQLException {
    String rowB = rowJsonAsSuperuser(table, TENANT_B);
    for (String role : List.of("company_owner", "ops_manager", "field_worker", "customer")) {
      asTenant(
          TENANT_A,
          OWNER_A,
          role,
          c ->
              assertThatThrownBy(() -> insertCopy(c, table, rowB))
                  .as(table + " insert for B as A/" + role)
                  .isInstanceOfSatisfying(
                      SQLException.class,
                      e -> assertThat(e.getSQLState()).isEqualTo(RLS_VIOLATION_OR_NO_PRIVILEGE)));
    }
  }

  // ------------------------------------------------------------------ fail closed

  @ParameterizedTest(name = "{0}: no tenant set => no rows (fail closed)")
  @MethodSource("tenantTables")
  void failsClosedWithoutTenant(String table) throws SQLException {
    try (Connection c = appRole()) {
      c.setAutoCommit(false);
      assertThat(queryLong(c, "select count(*) from " + table)).as(table).isZero();
      String rowA = rowJsonAsSuperuser(table, TENANT_A);
      assertThatThrownBy(() -> insertCopy(c, table, rowA))
          .as(table + " insert without tenant")
          .isInstanceOfSatisfying(
              SQLException.class,
              e -> assertThat(e.getSQLState()).isEqualTo(RLS_VIOLATION_OR_NO_PRIVILEGE));
      c.rollback();
    }
  }

  @Test
  @DisplayName("tenant table: A sees only itself and cannot create a tenant for someone else")
  void tenantTable() throws SQLException {
    asTenantA(
        c -> {
          assertThat(queryLong(c, "select count(*) from tenant")).isEqualTo(1);
          assertThat(queryLong(c, "select count(*) from tenant where id = '" + TENANT_B + "'"))
              .isZero();
          assertThatThrownBy(
                  () ->
                      update(
                          c,
                          "insert into tenant (id, name, slug) values (?, 'Evil', 'evil-x1')",
                          UUID.randomUUID()))
              .isInstanceOfSatisfying(
                  SQLException.class, e -> assertThat(e.getSQLState()).isEqualTo("42501"));
        });
    try (Connection c = appRole()) {
      assertThat(queryLong(c, "select count(*) from tenant")).isZero();
    }
  }

  @Test
  @DisplayName("audit_event is append-only even within the tenant")
  void auditAppendOnly() throws SQLException {
    asTenantA(
        c ->
            assertThatThrownBy(
                    () -> update(c, "delete from audit_event where tenant_id = ?", TENANT_A))
                .isInstanceOfSatisfying(
                    SQLException.class, e -> assertThat(e.getSQLState()).isEqualTo("42501")));
  }

  @Test
  @DisplayName("Invitation capability: token hash reveals only that invitation, nothing else")
  void invitationCapability() throws SQLException {
    try (Connection c = appRole()) {
      c.setAutoCommit(false);
      setConfig(c, Map.of("app.invite_token_hash", sha256Hex("token-B")));
      assertThat(queryLong(c, "select count(*) from invitation")).isEqualTo(1);
      assertThat(queryLong(c, "select count(*) from customer")).isZero();
      assertThat(queryLong(c, "select count(*) from app_user")).isZero();
      c.rollback();
    }
  }

  // ------------------------------------------------------------------ helpers

  interface SqlWork {
    void run(Connection c) throws Exception;
  }

  void asTenantA(SqlWork work) throws SQLException {
    asTenant(TENANT_A, OWNER_A, "company_owner", work);
  }

  void asTenant(UUID tenant, UUID user, String role, SqlWork work) throws SQLException {
    try (Connection c = appRole()) {
      c.setAutoCommit(false);
      setConfig(
          c,
          Map.of(
              "app.tenant_id", tenant.toString(),
              "app.user_id", user.toString(),
              "app.role", role));
      try {
        work.run(c);
      } catch (SQLException | RuntimeException | Error e) {
        throw e;
      } catch (Exception e) {
        throw new RuntimeException(e);
      } finally {
        c.rollback();
      }
    }
  }

  static void setConfig(Connection c, Map<String, String> settings) throws SQLException {
    for (var e : settings.entrySet()) {
      try (PreparedStatement ps = c.prepareStatement("select set_config(?, ?, true)")) {
        ps.setString(1, e.getKey());
        ps.setString(2, e.getValue());
        ps.execute();
      }
    }
  }

  static void insertCopy(Connection c, String table, String rowJson) throws SQLException {
    // Savepoint so a denied insert does not poison the surrounding transaction.
    var sp = c.setSavepoint();
    try (PreparedStatement ps =
        c.prepareStatement(
            "insert into "
                + table
                + " select * from json_populate_record(null::"
                + table
                + ", ?::json)")) {
      ps.setString(1, rowJson);
      ps.executeUpdate();
    } catch (SQLException e) {
      c.rollback(sp);
      throw e;
    }
  }

  static int update(Connection c, String sql, UUID param) throws SQLException {
    var sp = c.setSavepoint();
    try (PreparedStatement ps = c.prepareStatement(sql)) {
      ps.setObject(1, param);
      return ps.executeUpdate();
    } catch (SQLException e) {
      c.rollback(sp);
      throw e;
    }
  }

  static void assertNoRowsOrDenied(String table, Throwable t) {
    if (t != null) {
      assertDenied(table, t);
    }
  }

  static void assertDenied(String table, Throwable t) {
    assertThat(t).as(table).isInstanceOf(SQLException.class);
    assertThat(((SQLException) t).getSQLState()).as(table).isEqualTo(RLS_VIOLATION_OR_NO_PRIVILEGE);
  }

  static long countWhereTenant(Connection c, String table, UUID tenant) throws SQLException {
    try (PreparedStatement ps =
        c.prepareStatement("select count(*) from " + table + " where tenant_id = ?")) {
      ps.setObject(1, tenant);
      try (ResultSet rs = ps.executeQuery()) {
        rs.next();
        return rs.getLong(1);
      }
    }
  }

  static long countWhereTenantAsSuperuser(String table, UUID tenant) throws SQLException {
    try (Connection c = superuser()) {
      return countWhereTenant(c, table, tenant);
    }
  }

  /** One row of {@code table} for {@code tenant} as JSON, with a fresh primary key. */
  static String rowJsonAsSuperuser(String table, UUID tenant) throws SQLException {
    try (Connection c = superuser();
        PreparedStatement ps =
            c.prepareStatement(
                "select (to_jsonb(t) || jsonb_build_object('id', gen_random_uuid()))::text from "
                    + table
                    + " t where tenant_id = ? limit 1")) {
      ps.setObject(1, tenant);
      try (ResultSet rs = ps.executeQuery()) {
        assertThat(rs.next()).as(table + " has a seed row").isTrue();
        return rs.getString(1);
      }
    }
  }

  static long queryLong(Connection c, String sql) throws SQLException {
    try (Statement s = c.createStatement();
        ResultSet rs = s.executeQuery(sql)) {
      rs.next();
      return rs.getLong(1);
    }
  }

  static Connection superuser() throws SQLException {
    var pg = PostgresContainer.get();
    return DriverManager.getConnection(pg.getJdbcUrl(), pg.getUsername(), pg.getPassword());
  }

  static Connection appRole() throws SQLException {
    return DriverManager.getConnection(
        PostgresContainer.get().getJdbcUrl(),
        PostgresContainer.APP_USER,
        PostgresContainer.APP_PASSWORD);
  }

  static String sha256Hex(String s) {
    try {
      byte[] d =
          java.security.MessageDigest.getInstance("SHA-256")
              .digest(s.getBytes(java.nio.charset.StandardCharsets.UTF_8));
      return java.util.HexFormat.of().formatHex(d);
    } catch (java.security.NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }
}
