import { Request, Response } from "express";
import {
  typePayload,
  typeResult,
  typeResultData,
  typeResultError,
} from "../types/update.types";
import configurationUpdate from "../repository/update.repository";

export default async function updateConfiguration({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<typeResult> {
  let data: null | typeResultData = null;
  let error: null | typeResultError = null;

  try {
    const { configurationId, requestLimits, concurrency, isPrimary } =
      req.body as typePayload;

    const result = await configurationUpdate({
      configurationId,
      requestLimits: {
        windowMs: requestLimits?.windowMs || 0,
        max: requestLimits?.max || 0,
      },
      concurrency: {
        max: concurrency?.max || 0,
      },
      isPrimary: isPrimary || false,
    });

    data = {
      code: "CONFIGURATION_UPDATED",
      message: "Configuration updated successfully",
    };
  } catch (err: any) {
    console.error("[CONFIGURATION] UPDATE Error: ", err);
    error = {
      code: err.errorCode || "SOMETHING_WENT_WRONG",
      message: err.message || "Something went wrong",
    };
  }

  return { data, error };
}
