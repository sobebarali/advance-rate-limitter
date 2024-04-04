import request from "supertest";

import app from "../../../src";
import config from "../../../src/configs";

test("Should allow concurrent requests within the rate-limit", async () => {
  const numRequests = config.requestLimits.max;
  const promises = [];

  for (let i = 0; i < numRequests; i++) {
    promises.push(request(app).get("/"));
  }

  const responses = await Promise.all(promises);
  responses.forEach((res) => {
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello World");
  });
});
