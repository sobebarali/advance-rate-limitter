import request from "supertest";

import app from "../../../src";
import config from "../../../src/configs";

test("Should block requests exceeding the rate limit", async () => {
  const numRequests = config.requestLimits.max + 1;

  for (let i = 0; i < numRequests; i++) {
    const response = await request(app).get("/");

    if (i < config.requestLimits.max) {
      expect(response.status).toBe(200);
      expect(response.text).toBe("Hello World");
    } else {
      expect(response.status).toBe(429);
      expect(response.text).toContain(
        "Too many requests from this IP, please try again later"
      );
    }
  }
});
