/*************************************************************
 *
 * Test DB isolation
 *
 * -----------------------------------
 * Wipes every table after each test so tests never see data
 * left over by a previous one. Foreign key checks are disabled
 * for the duration of the wipe since tables reference each
 * other (game_user -> game/user, etc.) and truncation order
 * would otherwise matter.
 * -----------------------------------
 *
 *************************************************************/

const { sequelize } = require("../../server/service/database/index.js");

// Seeded reference data (via `npx sequelize-cli db:seed:all`), not
// created by tests — wiping it here would break every test after
// the first one that needs it (e.g. Game.create() needs a gamemode row).
const SEEDED_TABLES = ["gamemode"];

beforeAll(() => {
  // Refuse to run against anything but the test database — a bug
  // here would otherwise wipe real data.
  if (!sequelize.getDatabaseName().includes("test")) {
    throw new Error(
      `Refusing to run tests against "${sequelize.getDatabaseName()}" — NODE_ENV must be "test".`,
    );
  }
});

afterEach(async () => {
  // Read the actual table names from the DB rather than trusting each
  // model's getTableName() — some models set an explicit singular
  // tableName that differs from Sequelize's pluralized guess.
  const excluded = ["SequelizeMeta", ...SEEDED_TABLES].map((name) => `'${name}'`).join(",");
  const [rows] = await sequelize.query(
    `SELECT TABLE_NAME AS tableName FROM information_schema.tables WHERE table_schema = DATABASE() AND TABLE_NAME NOT IN (${excluded})`,
  );

  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  for (const { tableName } of rows) {
    await sequelize.query(`TRUNCATE TABLE \`${tableName}\``);
  }
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
});

afterAll(async () => {
  await sequelize.close();
});
