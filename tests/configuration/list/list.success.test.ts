import app from "../../../src";
import request from "supertest";
import { expect, describe, test } from "@jest/globals";
import { typePayload } from "../../../src/modules/configuration/types/create.types";

describe("LIST CONFIGURATION - SUCCESS", () => {
  test("should successfully list a configuration", async () => {
    //create multiple configurations
    for (let i = 0; i < 5; i++) {
      let data: typePayload = {
        requestLimits: {
          windowMs: 60000 + i,
          max: 1000 + i,
        },
        concurrency: {
          max: 1000 + i,
        },
      };
      await request(app).post("/api/configuration").send(data);
    }

    let response = await request(app).get("/api/configurations");


    expect(response.status).toBe(200);
    expect(response.body.error).toBeNull();
    expect(response.body.data.Items).toBeDefined();
    expect(response.body.data.perPage).toBe(10);
    expect(response.body.data.lastKnown).toBeDefined();
  });
});
