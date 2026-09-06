process.env.NODE_ENV = "test";

module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/testDb.js"],
  testTimeout: 15000,
  // Test files share one real DB with no per-file isolation (TRUNCATE-based
  // cleanup, not per-file schemas), so running them in parallel workers lets
  // one file's cleanup wipe rows another file just inserted. Force serial
  // execution instead of adding DB-level isolation for a small suite.
  maxWorkers: 1,
};
