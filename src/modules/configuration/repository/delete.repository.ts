import {
  GetItemCommand,
  DeleteItemCommand,
  QueryCommand,
  QueryInput,
} from "@aws-sdk/client-dynamodb";
import { dbClient, TableName } from "../../../database";
import CustomError from "../../../utils/customError";

export default async function configurationDelete({
  configurationId,
}: {
  configurationId: string;
}) {
  try {
    const params = {
      TableName: TableName,
      Key: {
        pk: { S: "CONFIGURATION" },
        sk: { S: `${configurationId}` },
      },
    };

    const getCommand = new GetItemCommand(params);
    const getResponse = await dbClient.send(getCommand);

    if (!getResponse.Item) {
      throw new CustomError(404, "NOT_FOUND", `Configuration not found`);
    }

    if (getResponse.Item.isPrimary?.BOOL) {
      throw new CustomError(
        400,
        "PRIMARY_CONFIG",
        `Primary configuration cannot be deleted`
      );
    }

    // Check if this is the last configuration in the table
    const lastConfigurationParams = {
      TableName: TableName,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: "CONFIGURATION" },
      },
      Limit: 2,
    } as QueryInput;

    const lastConfigurationCommand = new QueryCommand(lastConfigurationParams);
    const lastConfigurationResponse = await dbClient.send(
      lastConfigurationCommand
    );

    if (lastConfigurationResponse.Items?.length === 1) {
      throw new CustomError(
        400,
        "LAST_CONFIG",
        `Last configuration cannot be deleted`
      );
    }

    const command = new DeleteItemCommand(params);
    await dbClient.send(command);
  } catch (error: any) {
    console.error("5318185 Error configuration delete", error);
    if (error.errorCode === "NOT_FOUND") {
      throw new CustomError(error.statusCode, error.errorCode, error.message);
    } else if (error.errorCode === "PRIMARY_CONFIG") {
      throw new CustomError(error.statusCode, error.errorCode, error.message);
    } else if (error.errorCode === "LAST_CONFIG") {
      throw new CustomError(error.statusCode, error.errorCode, error.message);
    } else {
      throw new CustomError(500, "DB_ERROR", `Error deleting configuration`);
    }
  }
}
