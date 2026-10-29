import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import app from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

test("GET /health reports the HTTP process status", async () => {
  const response = await fetch(`${baseUrl}/health`, { headers: { connection: "close" } });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).service, "user-service");
});
