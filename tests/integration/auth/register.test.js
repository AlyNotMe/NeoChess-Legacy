const request = require("supertest");
const buildTestApp = require("../../setup/testApp.js");
const { User } = require("../../../server/service/database/index.js");
const { createTestUser } = require("../../setup/fixtures.js");

const app = buildTestApp();

describe("POST /register", () => {
  test("rejects a username shorter than 3 characters", async () => {
    const res = await request(app)
      .post("/fr/register")
      .type("form")
      .send({ username: "ab", password: "correcthorse" });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/fr/register");
    expect(await User.findOne({ where: { username: "ab" } })).toBeNull();
  });

  test("rejects a non-alphanumeric username", async () => {
    const res = await request(app)
      .post("/fr/register")
      .type("form")
      .send({ username: "bad name!", password: "correcthorse" });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/fr/register");
  });

  test("rejects a password shorter than 6 characters", async () => {
    const res = await request(app)
      .post("/fr/register")
      .type("form")
      .send({ username: "validuser", password: "abc" });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/fr/register");
    expect(await User.findOne({ where: { username: "validuser" } })).toBeNull();
  });

  test("rejects a username that already exists", async () => {
    const { user } = await createTestUser();

    const res = await request(app)
      .post("/fr/register")
      .type("form")
      .send({ username: user.username, password: "anotherpassword" });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/fr/register");
  });

  test("creates the user with a bcrypt hash (not the plaintext password) and redirects to login", async () => {
    const username = `newp${Date.now().toString().slice(-8)}`;

    const res = await request(app)
      .post("/fr/register")
      .type("form")
      .send({ username, password: "correcthorse" });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/fr/login");

    const created = await User.findOne({ where: { username } });
    expect(created).not.toBeNull();
    expect(created.password).not.toBe("correcthorse");
    expect(created.password).toMatch(/^\$2[aby]\$/); // bcrypt hash prefix
  });
});
