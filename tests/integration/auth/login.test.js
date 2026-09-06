const request = require("supertest");
const buildTestApp = require("../../setup/testApp.js");
const { createTestUser } = require("../../setup/fixtures.js");

const app = buildTestApp();

describe("POST /login", () => {
  test("rejects a username shorter than 3 characters", async () => {
    const res = await request(app)
      .post("/login")
      .type("form")
      .send({ username: "ab", password: "correcthorse" });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/fr/login");
  });

  test("rejects an unknown username without crashing", async () => {
    const res = await request(app)
      .post("/login")
      .type("form")
      .send({ username: "nosuchuser", password: "correcthorse" });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/fr/login");
  });

  test("rejects the correct username with a wrong password", async () => {
    const { user } = await createTestUser();

    const res = await request(app)
      .post("/login")
      .type("form")
      .send({ username: user.username, password: "wrongpassword" });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/fr/login");
  });

  test("logs in with correct credentials and sets the session", async () => {
    const { user, plainPassword } = await createTestUser();
    const agent = request.agent(app);

    const res = await agent
      .post("/login")
      .type("form")
      .send({ username: user.username, password: plainPassword });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/");

    // A protected route (auth middleware) should now be reachable
    // with the same session cookie, proving req.session.user was set.
    const homeRes = await agent.get("/");
    expect(homeRes.status).toBe(200);
  });
});
