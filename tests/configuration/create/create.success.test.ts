import app from "../../../src";
import request from "supertest";
import { expect, describe, test } from "@jest/globals";
import { typePayload } from "../../../src/modules/configuration/types/create.types";

describe("CREATE CONFIGURATION - SUCCESS", () => {
  test("should successfully create a configuration", async () => {
    let data: typePayload = {
      requestLimits: {
        windowMs: 60000,
        max: 1000,
      },
      concurrency: {
        max: 1000,
      },
    };

    const response = await request(app).post("/api/configuration").send(data);


    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: {
        configurationId: expect.any(String),
        requestLimits: {
          windowMs: 60000,
          max: 1000,
        },
        concurrency: {
          max: 1000,
        },
        createdAtMs: expect.any(String),
        updatedAtMs: expect.any(String),
      },
      error: null,
    });
  });
});
