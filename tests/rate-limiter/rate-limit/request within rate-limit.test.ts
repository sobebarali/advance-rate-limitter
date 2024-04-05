import request from "supertest";

import app from "../../../src";
import config from "../../../src/configs";


test("Should allow requests within the rate limit", async () => {
  const numRequests = config.requestLimits.max;

  for (let i = 0; i < numRequests; i++) {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World");
  }
});
