import { Request, Response } from "express";
import {
  typePayload,
  typeResult,
  typeResultData,
  typeResultError,
} from "../types/get.types";
import configurationGet from "../repository/get.repository";

export default async function getConfiguration({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<typeResult> {
  let data: null | typeResultData = null;
  let error: null | typeResultError = null;

  try {
    const { configurationId, isPrimary } = req.body as typePayload;

    const getResult = await configurationGet({
      configurationId,
      isPrimary,
    });

    data = {
      configurationId,
      requestLimits: {
        windowMs: getResult.requestLimits.windowMs,
        max: getResult.requestLimits.max,
      },
      concurrency: {
        max: getResult.concurrency.max,
      },
      isPrimary: getResult.isPrimary,
      createdAtMs: getResult.createdAtMS,
      updatedAtMs: getResult.updatedAtMS,
    };
  } catch (err: any) {
    console.error("[CONFIGURATION] GET Error: ", err);
    error = {
      code: err.errorCode || "SOMETHING_WENT_WRONG",
      message: err.message || "Something went wrong",
    };
  }

  return { data, error };
}
