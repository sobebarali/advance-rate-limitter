import request from "supertest";

import app from "../../../src";
import config from "../../../src/configs";

test("Should block concurrent requests exceeding the IP limit", async () => {
  const numRequests = config.requestLimits.max + 1;
  const promises = [];

  for (let i = 0; i < numRequests; i++) {
    promises.push(request(app).get("/"));
  }

  const responses = await Promise.all(promises);
  expect(responses[numRequests - 1].status).toBe(429);
  expect(responses[numRequests - 1].text).toContain(
    "Your IP has exceeded the 10 request limit per 1 minute(s). Try again in 1 minute(s)."
  );
});
