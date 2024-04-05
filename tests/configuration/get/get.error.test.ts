import app from "../../../src";
import request from "supertest";
import { expect, describe, test } from "@jest/globals";
import { typePayload } from "../../../src/modules/configuration/types/create.types";
import { randomUUID } from "crypto";

describe("GET CONFIGURATION - ERROR", () => {
  test("should fail to get a configuration", async () => {
    let createData: typePayload = {
      requestLimits: {
        windowMs: 60000,
        max: 1000,
      },
      concurrency: {
        max: 1000,
      },
    };

    const createResponse = await request(app)
      .post("/api/configuration")
      .send(createData);

    expect(createResponse.status).toBe(201);

    const configurationId = randomUUID(); // Random configurationId that doesn't exist

    const getResponse = await request(app)
      .get(`/api/configuration`)
      .send({ configurationId });

    expect(getResponse.status).toBe(404);
    expect(getResponse.body).toEqual({
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Configuration not found",
      },
    });
  });
});
