import app from '../../../src';
import request from 'supertest';
import { expect, describe, test } from '@jest/globals';
import { typePayload } from '../../../src/modules/configuration/types/create.types';

describe("DELETE CONFIGURATION - VALIDATION", () => {
  test("should fail to delete a configuration", async () => {
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

    const configurationId = createResponse.body.data.configurationId;

    const deleteResponse = await request(app)
      .delete(`/api/configuration`)
      .send({ configurationId: "" }); // Empty configurationId

    expect(deleteResponse.status).toBe(400);
    expect(deleteResponse.body).toEqual({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
        message: '"configurationId" is not allowed to be empty',
      },
    });
  });
});

