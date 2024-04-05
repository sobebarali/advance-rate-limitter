import { UpdateItemCommand, UpdateItemInput } from "@aws-sdk/client-dynamodb";
import { dbClient, TableName } from "../../../database";
import CustomError from "../../../utils/customError";

export default async function configurationUpdate({
  configurationId,
  requestLimits,
  concurrency,
  isPrimary,
}: {
  configurationId: string;
  requestLimits: { windowMs: number; max: number };
  concurrency: { max: number };
  isPrimary: boolean;
}) {  
  try {
    const _now = Date.now();
    const params: UpdateItemInput = {
      TableName: TableName,
      Key: {
        pk: { S: "CONFIGURATION" },
        sk: { S: `${configurationId}` },
      },
      UpdateExpression:
        "SET requestLimits = :requestLimits, concurrency = :concurrency, updatedAtMs = :updatedAtMs, isPrimary = :isPrimary",
      ExpressionAttributeValues: {
        ":requestLimits": {
          M: {
            windowMs: { N: requestLimits.windowMs.toString() },
            max: { N: requestLimits.max.toString() },
          },
        },
        ":concurrency": {
          M: {
            max: { N: concurrency.max.toString() },
          },
        },
        ":updatedAtMs": { N: _now.toString() },
        ":isPrimary": { BOOL: isPrimary },
      },
    };

    const command = new UpdateItemCommand(params);
    await dbClient.send(command);

    return {
      configurationId,
      requestLimits,
      concurrency,
      updatedAtMs: _now.toString(),
    };
  } catch (error) {
    console.error("39208269 Error configuration update", error);
    throw new CustomError(500, "DB_ERROR", `Error updating configuration`);
  }
}
