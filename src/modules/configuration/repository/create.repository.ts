import getId from "get-short-id";
import { PutItemCommand, PutItemInput } from "@aws-sdk/client-dynamodb";
import { dbClient, TableName } from "../../../database";
import CustomError from "../../../utils/customError";

export default async function configurationCreate({
  requestLimits,
  concurrency,
}: {
  requestLimits: { windowMs: number; max: number };
  concurrency: { max: number };
}) {
  try {
    const _now = Date.now();
    let isPrimary = false;
    const configurationId = getId({ prefix: `config-${_now}`, count: 14 });

    const params = {
      TableName: TableName,
      Item: {
        pk: { S: "CONFIGURATION" },
        sk: { S: `${configurationId}` },
        requestLimits: {
          M: {
            windowMs: { N: requestLimits.windowMs.toString() },
            max: { N: requestLimits.max.toString() },
          },
        },
        concurrency: {
          M: {
            max: { N: concurrency.max.toString() },
          },
        },
        isPrimary: { BOOL: isPrimary },
        createdAtMS: { N: _now.toString() },
      },
    } as PutItemInput;

    const command = new PutItemCommand(params);
    await dbClient.send(command);

    return {
      configurationId,
      requestLimits,
      concurrency,
      createdAtMs: _now.toString(),
      updatedAtMs: _now.toString(),
    };
  } catch (error) {
    console.error("30032478 Error configuration create", error);
    throw new CustomError(500, "DB_ERROR", `Error creating configuration`);
  }
}
