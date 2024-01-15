Certainly! Below is a basic example of documentation for your project. Please customize it further based on the specific features, endpoints, and details of your application.

# Puppeteer ChatGPT Summary Generator Documentation

Puppeteer ChatGPT Summary Generator is a web application designed to simplify the process of generating text summaries from web pages. It leverages Puppeteer for web scraping and ChatGPT for natural language processing, providing users with an efficient and user-friendly way to extract and summarize information from websites.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Running the Application](#running-the-application)
3. [API Endpoints](#api-endpoints)
   - [User Registration](#user-registration)
   - [User Login](#user-login)
   - [User Logout](#user-logout)
   - [Generate Summary](#generate-summary)
4. [Web Scraping with Puppeteer](#web-scraping-with-puppeteer)
5. [ChatGPT Summary Generation](#chatgpt-summary-generation)
6. [Middleware](#middleware)
   - [Token Blacklist Check](#token-blacklist-check)
7. [Models](#models)
   - [User Model](#user-model)
8. [Configuration Files](#configuration-files)
   - [MongoDB Configuration](#mongodb-configuration)
   - [Redis Configuration](#redis-configuration)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

## Overview

The Puppeteer ChatGPT Summary Generator allows users to register, log in, and generate text summaries from web pages. The application integrates web scraping using Puppeteer for extracting information and ChatGPT for summarizing the content. Token-based authentication, MongoDB for user data storage, and Redis for token management are key components of this application.

## Getting Started

### Installation

1. Clone the repository.

   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

### Running the Application

1. Configure your MongoDB connection in `db.ts` and your Redis connection in `redis.ts`.
2. Start the application.

   ```bash
   npm start
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000).

## API Endpoints

### User Registration

**Endpoint:** `/user/register`  
**Method:** `POST`  
**Description:** Register a new user.

**Request:**

```json
{
  "username": "example_user",
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "user": {
    "username": "example_user",
    "email": "user@example.com"
  }
}
```

### User Login

**Endpoint:** `/user/login`  
**Method:** `POST`  
**Description:** Log in an existing user.

**Request:**
**Use this for Test**
```json
{
  "email": "test@example.com",
  "password": "test"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### User Logout

**Endpoint:** `/user/logout`  
**Method:** `GET`  
**Description:** Log out the current user.

**Response:**

```text
Please login again
```

### Generate Summary

**Endpoint:** `/user/generateSummary`  
**Method:** `POST`  
**Description:** Generate a summary from a given URL.

**Request:**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "summary": "A concise summary of the web page content."
}
```

## Web Scraping with Puppeteer

The application uses Puppeteer to scrape text content from web pages. The `puppeteerHelper.ts` file provides the necessary functions for web scraping. Customize the code in this file based on the structure of the target web page.

## ChatGPT Summary Generation

Text summaries are generated using the ChatGPT API. The `chatGPTHelper.ts` file contains the functions responsible for interacting with the ChatGPT API. Ensure to replace the `YOUR_CHATGPT_API_KEY` variable with your actual API key.

## Middleware

### Token Blacklist Check

**Middleware:** `checkBlacklist`  
**Description:** Checks if the user's authentication token is blacklisted.

## Models

### User Model

**File:** `user.ts`  
**Description:** Defines the structure of the user data stored in MongoDB.

```typescript
interface User {
  username: string;
  email: string;
  password: string;
}
```

### Rate Limiter

**Middleware:** `rateLimiter.ts`  
**Description:** Implements rate limiting to prevent abuse of the API by limiting the number of requests from a single IP address within a specific time window.

```typescript
// middleware/rateLimiter.ts
import { RateLimit } from 'express-rate-limit';

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 15 requests per `window` (here, per 1 minute).
  headers: true, // Enable headers for request limiting information
});

export default limiter;

## Configuration Files

### MongoDB Configuration

**File:** `db.ts`  
**Description:** Configures the connection to MongoDB.

### Redis Configuration

**File:** `redis.ts`  
**Description:** Configures the connection to Redis.

## Contributing

If you want to contribute to the project, please follow the guidelines in the [Contributing.md](CONTRIBUTING.md) file.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or support, please contact:

- Email: avinashmohandev@gmail.com

Feel free to customize this documentation to match the specifics of your project.

### Deploy it in 7 seconds: 

[![Deploy to Cyclic](https://deploy.cyclic.app/button.svg)](https://deploy.cyclic.app/)