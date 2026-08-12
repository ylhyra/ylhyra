describe("database configuration", () => {
  const originalUser = process.env.YLHYRA_DATABASE_USER;
  const originalPassword = process.env.YLHYRA_DATABASE_PASSWORD;

  beforeEach(() => {
    jest.resetModules();
    delete process.env.YLHYRA_DATABASE_USER;
    delete process.env.YLHYRA_DATABASE_PASSWORD;
  });

  afterAll(() => {
    if (originalUser === undefined) delete process.env.YLHYRA_DATABASE_USER;
    else process.env.YLHYRA_DATABASE_USER = originalUser;
    if (originalPassword === undefined)
      delete process.env.YLHYRA_DATABASE_PASSWORD;
    else process.env.YLHYRA_DATABASE_PASSWORD = originalPassword;
  });

  test("can be imported without database credentials", () => {
    expect(() => require("server/database")).not.toThrow();
  });

  test("fails explicitly when a database operation is requested", () => {
    const database = require("server/database");
    expect(database.hasDatabaseConfiguration()).toBe(false);
    expect(database.assertDatabaseConfiguration).toThrow(
      "Missing database configuration!"
    );
    expect(() => database.default("SELECT 1", () => {})).toThrow(
      "Missing database configuration!"
    );
  });
});
