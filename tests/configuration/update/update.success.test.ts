import app from "../../../src";
import request from "supertest";
import { expect, describe, test } from "@jest/globals";
import { typePayload as createPayload } from "../../../src/modules/configuration/types/create.types";
import { typePayload as uploadPayload } from "../../../src/modules/configuration/types/update.types";

describe("UPDATE CONFIGURATION - SUCCESS", () => {
  test("should successfully update a configuration", async () => {
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

    let updateData: uploadPayload = {
      configurationId,
      requestLimits: {
        windowMs: 60000 + 1,
        max: 1000 - 1,
      },
      isPrimary: true,
      concurrency: {
        max: 1000 - 1,
      },
    };

    const updateResponse = await request(app)
      .put("/api/configuration")
      .send(updateData);
    
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({
      data: {
        code: "CONFIGURATION_UPDATED",
        message: "Configuration updated successfully",
      },
      error: null,
    });

    const getResponse = await request(app)
      .get(`/api/configuration`)
      .send({ configurationId });
    

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      data: {
        configurationId: expect.any(String),
        requestLimits: {
          windowMs: 60001,
          max: 999,
        },
        concurrency: {
          max: 999,
        },
        isPrimary: true,
        createdAtMs: expect.any(Number),
        updatedAtMs: expect.any(Number),
      },
      error: null,
    });
  });
});
