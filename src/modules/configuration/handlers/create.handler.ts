import { Request, Response } from "express";
import {
  typePayload,
  typeResult,
  typeResultData,
  typeResultError,
} from "../types/create.types";
import configurationCreate from "../repository/create.repository";

export default async function createConfiguration({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<typeResult> {
  let data: null | typeResultData = null;
  let error: null | typeResultError = null;

  try {
    const { requestLimits, concurrency } = req.body as typePayload;

    const createResult = await configurationCreate({
      requestLimits,
      concurrency,
    });

    data = {
      configurationId: createResult.configurationId,
      requestLimits,
      concurrency,
      createdAtMs: createResult.createdAtMs,
      updatedAtMs: createResult.updatedAtMs,
    };
  } catch (err: any) {
    console.error("[CONFIGURATION] CREATE Error: ", err);
    error = {
      code: err.errorCode || "SOMETHING_WENT_WRONG",
      message: err.message || "Something went wrong",
    };
  }

  return { data, error };
}
