import { Request, Response } from "express";
import {
  typePayload,
  typeResult,
  typeResultData,
  typeResultError,
} from "../types/delete.types";
import configurationDelete from "../repository/delete.repository";

export default async function deleteConfiguration({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<typeResult> {
  let data: null | typeResultData = null;
  let error: null | typeResultError = null;

  try {
    const { configurationId } = req.body as typePayload;

    await configurationDelete({ configurationId });

    data = {
      code: "CONFIGURATION_DELETED",
      message: "Configuration deleted successfully",
    };
  } catch (err: any) {
    console.error("[CONFIGURATION] DELETE Error: ", err);
    error = {
      code: err.errorCode || "SOMETHING_WENT_WRONG",
      message: err.message || "Something went wrong",
    };
  }

  return { data, error };
}
