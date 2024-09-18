```markdown
# Express.js Rate Limiting, Concurrency Control, Configuration Management and TDD

This project implements request rate limiting, concurrency control, and configuration management for an Express.js application using `express-rate-limit`, Redis, and a basic CRUD system to manage configurations dynamically.

## Features

- **Rate Limiting**: Limits the number of requests a client can make within a specific time window.
- **Concurrency Control**: Limits the number of simultaneous requests a client can make, with Redis handling the state of concurrent requests.
- **Configuration Management**: CRUD operations to manage and update configurations (such as rate-limiting and concurrency settings) dynamically via a REST API.
- **Redis Integration**: Uses Redis to track concurrent requests and apply expiration logic for request counts.
- **Error Handling**: Catches Redis errors and ensures proper error messages are sent when limits are exceeded.

## Technologies Used

- **Express.js**: Web framework for building the API.
- **Redis**: In-memory data store used to track concurrent requests.
- **express-rate-limit**: Middleware for limiting the rate of incoming requests.
- **Node.js**: Runtime for the backend API.
- **PostgreSQL / MongoDB (Optional)**: Optional databases for storing configuration settings (depending on your choice).

## Prerequisites

- **Node.js** (v12.x or higher)
- **Redis** (Make sure Redis is installed and running locally or use a remote Redis instance)
- **PostgreSQL or MongoDB** (for storing configuration data if not using an in-memory solution)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the application:

   Create a `config.js` file in the `configs` directory and provide the necessary configuration for request limits, concurrency control, and database connection settings.

   Example `configs/config.js`:

   ```javascript
   module.exports = {
     requestLimits: {
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100, // Limit each IP to 100 requests per windowMs
     },
     concurrency: {
       max: 10, // Maximum concurrent requests per IP
     },
     db: {
       // Postgres or MongoDB connection settings
       // For example: PostgreSQL
       host: 'localhost',
       port: 5432,
       username: 'your-username',
       password: 'your-password',
       database: 'config_db'
     }
   };
   ```

4. Ensure Redis is running:

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

5. Set up your database (optional):

   If using PostgreSQL or MongoDB for configuration storage, ensure your database is properly set up with the required tables/collections for configurations.

## Usage

1. Start the application:

   ```bash
   npm start
   ```

2. The app will now be running on the configured port (default is `http://localhost:3000`). Both rate limiting and concurrency limiting are applied globally.

## Middleware Explanation

### Rate Limiting

The `rateLimiter` middleware uses the `express-rate-limit` package to limit the number of requests an IP can make in a given time window. It is configured using the `requestLimits` property from the config file.

- **Window Duration**: The time window (in milliseconds) over which the number of requests is tracked.
- **Max Requests**: The maximum number of requests allowed per IP within the time window.

### Concurrency Control

The `concurrentRequestLimiter` middleware uses Redis to track how many concurrent requests are being made by each IP address. If the number of concurrent requests exceeds the defined maximum, the request is denied, and the client receives a `429 Too Many Requests` response.

- **MAX_CONCURRENT_REQUESTS**: The maximum number of concurrent requests an IP can have in flight at the same time.
- **RESET_INTERVAL**: The time window (in seconds) after which the number of concurrent requests is reset.

## Configuration Management (CRUD)

This project includes a basic Configuration Management API that allows administrators to perform CRUD operations on configuration settings such as rate-limiting values, concurrency limits, and others.

### API Endpoints

- **GET /config**: Retrieve the current configuration settings.
- **POST /config**: Create a new configuration.
- **PUT /config/:id**: Update an existing configuration.
- **DELETE /config/:id**: Delete a configuration.

### Example API Requests

1. **Get current configuration:**

   ```bash
   curl -X GET http://localhost:3000/config
   ```

2. **Update rate limit settings:**

   ```bash
   curl -X PUT http://localhost:3000/config/1 \
     -H "Content-Type: application/json" \
     -d '{"requestLimits": {"windowMs": 60000, "max": 50}}'
   ```

3. **Delete a configuration:**

   ```bash
   curl -X DELETE http://localhost:3000/config/1
   ```

### CRUD Storage

The configurations can be stored in an optional database (e.g., PostgreSQL or MongoDB) or as an in-memory object depending on your choice. The app supports basic CRUD operations to create, read, update, and delete configurations dynamically, allowing you to change rate limits and concurrency control without restarting the server.

## Example Configuration in `app.js`

Here is how the middleware and CRUD routes are applied in the `app.js` file:

```javascript
import express from "express";
import rateLimiter from "./middlewares/rateLimiter";
import concurrentRequestLimiter from "./middlewares/concurrentRequestLimiter";
import configRoutes from "./routes/configRoutes"; // CRUD routes for configuration management

const app = express();

app.use(express.json()); // For parsing JSON request bodies

// Middleware for limiting the number of concurrent requests per IP
app.use(concurrentRequestLimiter());

// Middleware for limiting the request rate per IP
app.use(rateLimiter);

// Routes for managing configuration (CRUD)
app.use("/config", configRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Express Rate Limiting, Concurrency Control, and Configuration Management API!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Error Handling

- If Redis encounters an error, the middleware logs the error and responds with a `500 Internal Server Error`.
- If the request limit is exceeded, a `429 Too Many Requests` status is returned with an appropriate message.
- If any error occurs in the CRUD operations, appropriate error messages are sent back with the correct HTTP status codes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Key Updates:
- **Configuration Management**: Added CRUD functionality to manage configurations like rate limits and concurrency dynamically.
- **API Endpoints**: Described RESTful endpoints for managing configurations.
- **Usage Section**: Demonstrated how to interact with the configuration API.
- **Example Requests**: Provided example cURL requests for performing CRUD operations on configurations.
