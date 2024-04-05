import { QueryCommand, QueryInput } from "@aws-sdk/client-dynamodb";

import { dbClient, TableName } from "../../../database";
import CustomError from "../../../utils/customError";

export default async function configurationList({
  perPage = 10,
  lastKnown,
  sortOrder = "desc",
}: {
  perPage?: number;
  lastKnown?: string;
  sortOrder?: string;
}) {
  
  lastKnown = lastKnown ? lastKnown : "";

  try {
    const params = {
      TableName: TableName,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: "CONFIGURATION" },
      },
      Limit: perPage,
      ScanIndexForward: sortOrder === "asc",
      ConsistentRead: process.env.NODE_ENV === "test",
    } as QueryInput;

    if (lastKnown) {
      params.ExclusiveStartKey = {
        pk: { S: "CONFIGURATION" },
        sk: { S: lastKnown },
      };
    }

    const command = new QueryCommand(params);
    const result = await dbClient.send(command);

    const configurations = (result.Items || []).map((item) => ({
      configurationId: item.sk?.S,
      requestLimits: item.requestLimits?.M
        ? {
            windowMs: parseInt(item.requestLimits.M.windowMs?.N || "0"),
            max: parseInt(item.requestLimits.M.max?.N || "0"),
          }
        : undefined,
      concurrency: item.ipLimits?.M
        ? {
            max: parseInt(item.ipLimits.M.max?.N || "0"),
          }
        : undefined,
      createdAtMs: item.createdAtMS?.N,
      updatedAtMs: item.updatedAtMs?.N,
    }));

    return {
      configurations,
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  } catch (error) {
    console.error("17977527 Error configuration list", error);
    throw new CustomError(500, "DB_ERROR", `Error listing configuration`);
  }
}
