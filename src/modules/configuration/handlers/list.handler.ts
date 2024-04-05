
import { Request, Response } from "express";
import { typePayload, typeResult, typeResultData, typeResultError } from "../types/list.types";
import configurationList from "../repository/list.repository";

export default async function listConfiguration(
  { req, res }: { req: Request; res: Response }
): Promise<typeResult> {
  let data: null | typeResultData = null;
  let error: null | typeResultError = null;

  try {
    const { perPage, lastKnown, sortOrder } = req.body as typePayload;

    const { configurations, lastEvaluatedKey } = await configurationList({
      perPage,
      lastKnown,
      sortOrder,
    });

    data = {
      Items: configurations,
      lastKnown: lastEvaluatedKey?.sk?.S || "",
      perPage: perPage || 10,
    };
  } catch (err: any) {
    console.error("[CONFIGURATION] LIST Error: ", err);
    error = {
      code: err.errorCode || "SOMETHING_WENT_WRONG",
      message: err.message || "Something went wrong",
    };
  }

  return { data, error };
}
