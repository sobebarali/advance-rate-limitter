import app from "../../../src";
import request from "supertest";
import { expect, describe, test } from "@jest/globals";
import { typePayload as createPayload } from "../../../src/modules/configuration/types/create.types";
import { randomUUID } from "crypto";
import { typePayload } from "../../../src/modules/configuration/types/update.types";

describe("DELETE CONFIGURATION - ERROR", () => {
  test("should fail to delete a configuration", async () => {
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

    const configurationId = randomUUID(); // Random configurationId

    const deleteResponse = await request(app)
      .delete(`/api/configuration`)
      .send({ configurationId });


    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body).toEqual({
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Configuration not found",
      },
    });
  });

  test("should fail to delete a configuration as it was the primary config", async () => {
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

    let updateData: typePayload = {
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
    
    const deleteResponse = await request(app)
      .delete(`/api/configuration`)
      .send({ configurationId });
    
    expect(deleteResponse.status).toBe(400);
    expect(deleteResponse.body).toEqual({
      data: null,
      error: {
        code: "PRIMARY_CONFIG",
        message: "Primary configuration cannot be deleted",
      },
    });
  });
});
