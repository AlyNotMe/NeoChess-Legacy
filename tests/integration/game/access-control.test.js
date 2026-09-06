const request = require("supertest");
const buildTestApp = require("../../setup/testApp.js");
const { loggedInAgent } = require("../../setup/authAgent.js");
const { createTestGame } = require("../../setup/fixtures.js");

const app = buildTestApp();

describe("game access control", () => {
  test("GET /game/:id without a session redirects to register", async () => {
    const game = await createTestGame();

    const res = await request(app).get(`/game/${game.id}`);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/fr/register");
  });

  test("POST /game/create without a session redirects to register", async () => {
    const res = await request(app).post("/game/create").type("form").send({});

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/fr/register");
  });

  test("GET /game/:id with a session but an unknown id returns 404", async () => {
    const { agent } = await loggedInAgent(app);

    const res = await agent.get("/game/999999");

    expect(res.status).toBe(404);
  });

  test("GET /game/:id with a session and an existing game renders the page", async () => {
    const { agent } = await loggedInAgent(app);
    const game = await createTestGame();

    const res = await agent.get(`/game/${game.id}`);

    expect(res.status).toBe(200);
  });
});
