/*************************************************************
 *
 * Test auth helper
 *
 *************************************************************/

const request = require("supertest");
const { createTestUser } = require("./fixtures.js");

/**
 * Creates a user and returns a Supertest agent already logged in as
 * them (session cookie carried across requests) — for tests that need
 * an authenticated request but aren't testing the login flow itself.
 * @param {import("express").Express} app
 * @returns {Promise<{ agent: import("supertest").SuperAgentTest, user: import("sequelize").Model }>}
 */
async function loggedInAgent(app) {
  const { user, plainPassword } = await createTestUser();
  const agent = request.agent(app);

  await agent.post("/login").type("form").send({ username: user.username, password: plainPassword });

  return { agent, user };
}

module.exports = { loggedInAgent };
