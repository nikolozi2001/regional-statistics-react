# NRG API

## Overview

This API provides endpoints to manage records, households, months, resource data, energy consumption, and indicators. It's built with Express.js and connects to a MySQL database.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Database

## Setup

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd server
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Configure the database connection:
   Create a `.env` file with your MySQL credentials based on the sample below:

   ```
   DB_HOST=localhost
   DB_USER=username
   DB_PASSWORD=password
   DB_DATABASE=dbname
   DB_PORT=3306
   PORT=3000
   ```

## Running the Server

Start the server:
```sh
npm start
```

The server will run on `http://localhost:3000` by default. You can change the port by setting the PORT environment variable.

## API Documentation

### Regions
- **GET /api/regions**: Returns server status

## Error Handling

The API uses a centralized error handling approach. If an error occurs, it will return a JSON response with an error message and an appropriate HTTP status code.

```json
{
  "error": "Error message"
}
```

## Logging

The application uses Winston for logging. Logs are stored in:
- `error.log` - for error level logs
- `combined.log` - for all logs

## Project Structure

```
server/
├── app.js                # Main application entry point
├── db.js                 # Database connection configuration
├── logger.js             # Logging configuration
├── controllers/          # Request handlers for routes
│   └── regionsController.js
├── middleware/           # Express middleware
│   ├── errorHandler.js   # Centralized error handling
│   └── validate.js       # Request validation
├── routes/               # API route definitions
│   └── routes.js
└── .env                  # Environment variables (not in version control)
```

## License

[Include your license information here]

## Last Updated

April 24, 2025
