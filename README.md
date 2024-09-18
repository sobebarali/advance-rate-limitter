# Express.js Rate Limiting, Concurrency Control, Configuration Management and TDD

This project implements request rate limiting, concurrency control, and configuration management for an Express.js application using `express-rate-limit`, Redis, and DynamoDB for managing configurations dynamically. It's built with TypeScript and follows Test-Driven Development (TDD) principles.

GitHub Repository: [https://github.com/sobebarali/advance-rate-limitter.git](https://github.com/sobebarali/advance-rate-limitter.git)

## Features

- **Rate Limiting**: Limits the number of requests a client can make within a specific time window.
- **Concurrency Control**: Limits the number of simultaneous requests a client can make, with Redis handling the state of concurrent requests.
- **Configuration Management**: CRUD operations to manage and update configurations (such as rate-limiting and concurrency settings) dynamically via a REST API, stored in DynamoDB.
- **Redis Integration**: Uses Redis to track concurrent requests and apply expiration logic for request counts.
- **Error Handling**: Catches Redis and DynamoDB errors and ensures proper error messages are sent when limits are exceeded.
- **Test-Driven Development**: Follows TDD practices to ensure code quality and reliability.

## Technologies Used

- **Express.js**: Web framework for building the API.
- **TypeScript**: Superset of JavaScript that adds static types.
- **Redis**: In-memory data store used to track concurrent requests.
- **DynamoDB**: NoSQL database service for storing configuration settings.
- **express-rate-limit**: Middleware for limiting the rate of incoming requests.
- **Node.js**: Runtime for the backend API.
- **Jest**: Testing framework for implementing TDD.
- **AWS SDK**: For interacting with DynamoDB.

## Prerequisites

- **Node.js** (v14.x or higher)
- **TypeScript** (v4.x or higher)
- **Redis** (Make sure Redis is installed and running locally or use a remote Redis instance)
- **AWS Account**: For DynamoDB access
- **AWS CLI**: Configured with appropriate credentials

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sobebarali/advance-rate-limitter.git
   cd advance-rate-limitter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the application:

   Create a `config.ts` file in the `src/configs` directory and provide the necessary configuration for request limits, concurrency control, and AWS settings.

   Example `src/configs/config.ts`:

   ```typescript
   import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

   export interface Config {
     requestLimits: {
       windowMs: number;
       max: number;
     };
     concurrency: {
       max: number;
     };
     aws: DynamoDBClientConfig;
   }

   const config: Config = {
     requestLimits: {
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100, // Limit each IP to 100 requests per windowMs
     },
     concurrency: {
       max: 10, // Maximum concurrent requests per IP
     },
     aws: {
       region: "us-east-1",
       // Add other AWS configurations as needed
     }
   };

   export default config;
   ```

4. Set up DynamoDB:

   Create a DynamoDB table for storing configurations. You can do this via the AWS Console or using the AWS CLI:

   ```bash
   aws dynamodb create-table \
     --table-name Configurations \
     --attribute-definitions AttributeName=id,AttributeType=S \
     --key-schema AttributeName=id,KeyType=HASH \
     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
   ```

5. Ensure Redis is running:

   If you don't have Redis installed, you can install it locally:

   ```bash
   # For MacOS
   brew install redis
   brew services start redis

   # For Ubuntu/Debian
   sudo apt update
   sudo apt install redis-server
   sudo systemctl start redis
   ```

   Or you can use a cloud-based Redis service such as Redis Labs.

## Usage

1. Start the application in development mode:

   ```bash
   npm run dev
   ```

2. Build and start the application for production:

   ```bash
   npm run build
   npm start
   ```

3. The app will now be running on the configured port (default is `http://localhost:3000`). Both rate limiting and concurrency limiting are applied globally.

## Test-Driven Development (TDD)

This project follows TDD practices. Here's how we implement TDD:

1. Write a failing test for a new feature or bug fix.
2. Run the test to ensure it fails (Red phase).
3. Write the minimum amount of code to make the test pass (Green phase).
4. Refactor the code while ensuring all tests still pass (Refactor phase).
5. Repeat for each new feature or bug fix.

To run the tests:

```bash
npm test
```

To run tests in watch mode during development:

```bash
npm run test:watch
```

## Middleware Explanation

### Rate Limiting

The `rateLimiter` middleware uses the `express-rate-limit` package to limit the number of requests an IP can make in a given time window. It is configured using the `requestLimits` property from the config file.

### Concurrency Control

The `concurrentRequestLimiter` middleware uses Redis to track how many concurrent requests are being made by each IP address. If the number of concurrent requests exceeds the defined maximum, the request is denied, and the client receives a `429 Too Many Requests` response.

## Configuration Management (CRUD)

This project includes a Configuration Management API that allows administrators to perform CRUD operations on configuration settings such as rate-limiting values, concurrency limits, and others. These configurations are stored in DynamoDB.

### API Endpoints

- **GET /api/configuration**: Retrieve the current configuration settings.
- **POST /api/configuration**: Create a new configuration.
- **PUT /api/configuration/:id**: Update an existing configuration.
- **DELETE /api/configuration/:id**: Delete a configuration.

### Example API Requests

1. **Get current configuration:**

   ```bash
   curl -X GET http://localhost:3000/api/configuration
   ```

2. **Update rate limit settings:**

   ```bash
   curl -X PUT http://localhost:3000/api/configuration/1 \
     -H "Content-Type: application/json" \
     -d '{"requestLimits": {"windowMs": 60000, "max": 50}}'
   ```

3. **Delete a configuration:**

   ```bash
   curl -X DELETE http://localhost:3000/api/configuration/1
   ```

## Example Configuration in `app.ts`

Here's how the middleware and CRUD routes are applied in the `app.ts` file:

```typescript
import express from 'express';
import rateLimiter from './middlewares/rateLimiter';
import concurrentRequestLimiter from './middlewares/concurrentRequestLimiter';
import configRoutes from './routes/configRoutes'; // CRUD routes for configuration management

const app = express();

app.use(express.json()); // For parsing JSON request bodies

// Middleware for limiting the number of concurrent requests per IP
app.use(concurrentRequestLimiter());

// Middleware for limiting the request rate per IP
app.use(rateLimiter);

// Routes for managing configuration (CRUD)
app.use('/api/configuration', configRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Express Rate Limiting, Concurrency Control, and Configuration Management API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
```

## Error Handling

- If Redis encounters an error, the middleware logs the error and responds with a `500 Internal Server Error`.
- If the request limit is exceeded, a `429 Too Many Requests` status is returned with an appropriate message.
- If any error occurs in the CRUD operations or DynamoDB interactions, appropriate error messages are sent back with the correct HTTP status codes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
