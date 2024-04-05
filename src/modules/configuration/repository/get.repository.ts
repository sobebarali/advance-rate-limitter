import { GetItemCommand, GetItemInput } from "@aws-sdk/client-dynamodb";

import { dbClient, TableName } from "../../../database";
import CustomError from "../../../utils/customError";

export default async function configurationGet({
  configurationId,
  isPrimary,
}: {
  configurationId: string;
  isPrimary?: boolean;
}) {
  try {
    const params = {
      TableName: TableName,
      Key: {
        pk: { S: "CONFIGURATION" },
        sk: { S: `${configurationId}` },
      },
    } as any;

    if (isPrimary) {
      params.Key.sk = { S: `${configurationId}:true` };
    }

    const command = new GetItemCommand(params);
    const response = await dbClient.send(command);

    if (!response.Item) {
      throw new CustomError(404, "NOT_FOUND", `Configuration not found`);
    }

    const configuration = {
      requestLimits: {
        windowMs: response.Item.requestLimits?.M?.windowMs?.N
          ? parseInt(response.Item.requestLimits.M.windowMs.N)
          : 0,
        max: response.Item.requestLimits?.M?.max?.N
          ? parseInt(response.Item.requestLimits.M.max.N)
          : 0,
      },
      concurrency: {
        max: response.Item.concurrency?.M?.max?.N
          ? parseInt(response.Item.concurrency.M.max.N)
          : 0,
      },
      isPrimary: response.Item.isPrimary?.BOOL ?? false,
      createdAtMS: response.Item.createdAtMS?.N
        ? parseInt(response.Item.createdAtMS.N)
        : 0,
      updatedAtMS: response.Item.updatedAtMS?.N
        ? parseInt(response.Item.updatedAtMS.N)
        : 0,
    };

    return configuration;
  } catch (error: any) {
    console.error("83859636 Error configuration get", error);
    if (error.errorCode === "NOT_FOUND") {
      throw new CustomError(error.statusCode, error.errorCode, error.message);
    } else {
      throw new CustomError(500, "DB_ERROR", `Error fetching configuration`);
    }
  }
}
