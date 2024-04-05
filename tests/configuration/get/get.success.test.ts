import app from "../../../src";
import request from "supertest";
import { expect, describe, test } from "@jest/globals";
import { typePayload as createPayload } from "../../../src/modules/configuration/types/create.types";

describe("GET CONFIGURATION - SUCCESS", () => {
  test("should successfully get a configuration", async () => {
    let createData: createPayload = {
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

    const configurationId = createResponse.body.data.configurationId;

    const getResponse = await request(app)
      .get(`/api/configuration`)
      .send({ configurationId });
    

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      data: {
        configurationId: expect.any(String),
        requestLimits: {
          windowMs: 60000,
          max: 1000,
        },
        concurrency: {
          max: 1000,
        },
        isPrimary: false,
        createdAtMs: expect.any(Number),
        updatedAtMs: expect.any(Number),
      },
      error: null,
    });
  });
});
