import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import config from "../configs";

const client = new DynamoDBClient({
  region: config.dynamodb.region,
  credentials: {
    accessKeyId: config.dynamodb.accessKeyId,
    secretAccessKey:config.dynamodb.secretAccessKey,
  },
});

export const dbClient = DynamoDBDocumentClient.from(client);

export const TableName = config.dynamodb.tableName;
