# api-sutra

A lightweight and reusable API client wrapper built on top of **Axios** for making clean and consistent HTTP API requests.

**API Sutra** lets you configure your API once and use simple methods for your requests:

```js
api.get("/users");

api.post("/users", data);

api.put("/users/1", data);

api.patch("/users/1", data);

api.delete("/users/1");
```

Instead of repeatedly configuring Axios and your API base URL, create one reusable client:

```js
import { createApiClient } from "api-sutra";

const api = createApiClient({
  baseURL: "https://api.example.com",
});

const users = await api.get("/users");
```

> **Simple API requests. One reusable client. Built on Axios.**

---

## Features

* Simple and reusable API client
* Built on Axios
* Supports `GET`
* Supports `POST`
* Supports `PUT`
* Supports `PATCH`
* Supports `DELETE`
* Universal `request()` method
* Configure the base URL once
* Automatically normalizes API paths
* Directly returns `response.data`
* Supports Axios request configuration
* Optional Bearer token authentication
* Runtime token management
* Configurable request timeout
* Custom default headers
* Request interceptors
* Response interceptors
* Error interceptors
* Standardized API errors
* Preserves HTTP status and response data
* Promise-based API
* ES Module support
* Node.js 18+
* Backward-compatible `getApiUrl()` helper
* Lightweight abstraction over Axios

---

## Installation

Install API Sutra using npm:

```bash
npm install api-sutra
```

---

## Quick Start

### Import

```js
import { createApiClient } from "api-sutra";
```

### Create an API Client

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
});
```

You can now reuse the same client throughout your application:

```js
const users = await api.get("/users");

const user = await api.post("/users", {
  name: "Pasi Abhishek",
});
```

---

# HTTP Methods

## GET

Use `get()` to retrieve data:

```js
const users = await api.get("/users");

console.log(users);
```

The request is sent to:

```text
GET https://api.example.com/users
```

API Sutra returns the API's `response.data` directly.

---

## POST

Use `post()` to create a resource:

```js
const user = await api.post("/users", {
  name: "Pasi Abhishek",
  email: "pasi@example.com",
});

console.log(user);
```

---

## PUT

Use `put()` to replace or update an existing resource:

```js
const user = await api.put("/users/1", {
  name: "Pasi Abhishek",
  email: "pasi@example.com",
});
```

---

## PATCH

Use `patch()` for partial updates:

```js
const user = await api.patch("/users/1", {
  name: "Master Aazam",
});
```

---

## DELETE

Use `delete()` to remove a resource:

```js
const result = await api.delete("/users/1");

console.log(result);
```

---

# API Paths

API Sutra automatically normalizes leading slashes.

Both of these are supported:

```js
api.get("/users");
```

and:

```js
api.get("users");
```

They both resolve to:

```text
https://api.example.com/users
```

Even multiple leading slashes are normalized:

```js
api.get("///users");
```

becomes:

```text
/users
```

---

# Query Parameters

Axios request options can be passed to individual requests.

```js
const users = await api.get("/users", {
  params: {
    page: 1,
    limit: 10,
  },
});
```

The resulting request is equivalent to:

```text
GET https://api.example.com/users?page=1&limit=10
```

---

# Request Headers

You can provide request-specific headers:

```js
const users = await api.get("/users", {
  headers: {
    "X-App-Version": "1.0.0",
  },
});
```

Because API Sutra uses Axios, supported Axios request configuration can also be passed.

Examples include:

* `headers`
* `params`
* `timeout`
* `withCredentials`
* `signal`
* `responseType`
* Other Axios request options

---

# Authentication

API Sutra supports optional Bearer token authentication.

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
  token: "YOUR_TOKEN",
});
```

Requests automatically include:

```http
Authorization: Bearer YOUR_TOKEN
```

You can then make authenticated requests without manually adding the header:

```js
const profile = await api.get("/profile");
```

---

# Token Management

You can change the authentication token after creating the client.

## Set Token

```js
api.setToken("NEW_TOKEN");
```

The client will use:

```http
Authorization: Bearer NEW_TOKEN
```

for future requests.

## Clear Token

```js
api.clearToken();
```

This removes the Authorization header from the client.

Calling:

```js
api.setToken("");
```

also clears the current token.

---

# Custom Default Headers

Default headers can be configured when creating the client:

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
  headers: {
    "X-App-Version": "1.0.0",
    "X-Client": "web",
  },
});
```

API Sutra also provides a default:

```http
Content-Type: application/json
```

unless overridden by your headers.

---

# Request Timeout

The default timeout is:

```text
10000 ms
```

which equals 10 seconds.

You can customize it:

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
  timeout: 5000,
});
```

You can also override the timeout for an individual request:

```js
const users = await api.get("/users", {
  timeout: 3000,
});
```

---

# Interceptors

API Sutra exposes a simple configuration for Axios interceptors.

## Request Interceptor

```js
const api = createApiClient({
  baseURL: "https://api.example.com",

  interceptors: {
    request: (config) => {
      console.log("Sending request:", config.url);

      return config;
    },
  },
});
```

---

## Response Interceptor

```js
const api = createApiClient({
  baseURL: "https://api.example.com",

  interceptors: {
    response: (response) => {
      console.log("Response received");

      return response;
    },
  },
});
```

---

## Error Interceptor

```js
const api = createApiClient({
  baseURL: "https://api.example.com",

  interceptors: {
    error: (error) => {
      console.error("API error:", error);

      return Promise.reject(error);
    },
  },
});
```

You can also configure all three:

```js
const api = createApiClient({
  baseURL: "https://api.example.com",

  interceptors: {
    request: (config) => {
      return config;
    },

    response: (response) => {
      return response;
    },

    error: (error) => {
      return Promise.reject(error);
    },
  },
});
```

---

# Universal Request

When the standard methods are not enough, use `request()`:

```js
const data = await api.request({
  method: "GET",
  url: "/users",
});
```

For example:

```js
const data = await api.request({
  method: "OPTIONS",
  url: "/users",
});
```

You can use Axios configuration supported by the underlying client.

---

# Return Value

All API methods return a Promise.

When a request succeeds, API Sutra returns:

```js
response.data
```

For example, if the API returns:

```json
{
  "success": true,
  "users": []
}
```

then:

```js
const data = await api.get("/users");
```

directly gives:

```js
{
  success: true,
  users: []
}
```

You do not need to write:

```js
const response = await axios.get(...);

const data = response.data;
```

---

# Error Handling

API Sutra normalizes request errors into a consistent `ApiSutraError`.

Example:

```js
try {
  const users = await api.get("/users");
} catch (error) {
  console.log(error.name);
  console.log(error.message);
  console.log(error.status);
  console.log(error.data);
  console.log(error.response);
}
```

A normalized error provides:

```js
error.name
error.message
error.status
error.data
error.response
error.code
error.original
```

The error name is:

```text
ApiSutraError
```

---

## Example API Error

If the server returns:

```json
{
  "message": "Unauthorized"
}
```

you can handle it with:

```js
try {
  const profile = await api.get("/profile");
} catch (error) {
  console.log(error.message);
}
```

Output:

```text
Unauthorized
```

API Sutra also preserves the original Axios error through:

```js
error.original
```

This allows advanced applications to access the underlying Axios error when necessary.

---

# Validation

API Sutra validates required configuration before making requests.

## Missing Base URL

```js
createApiClient();
```

throws:

```text
Error: Base URL is required.
```

## Missing API Path

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
});

await api.get("");
```

throws:

```text
Error: API path is required.
```

These validation errors happen before an HTTP request is made.

---

# Configuration

The main function is:

```js
createApiClient(config)
```

### Configuration Options

| Property       | Type     | Default | Description                              |
| -------------- | -------- | ------: | ---------------------------------------- |
| `baseURL`      | `string` |       — | Base URL of the API                      |
| `token`        | `string` |       — | Optional Bearer authentication token     |
| `timeout`      | `number` | `10000` | Request timeout in milliseconds          |
| `headers`      | `object` |    `{}` | Default request headers                  |
| `interceptors` | `object` |    `{}` | Request, response and error interceptors |

---

# API Methods

After creating a client:

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
});
```

you get:

```js
api.get()
api.post()
api.put()
api.patch()
api.delete()
api.request()
api.setToken()
api.clearToken()
```

### GET

```js
api.get(path, options)
```

### POST

```js
api.post(path, data, options)
```

### PUT

```js
api.put(path, data, options)
```

### PATCH

```js
api.patch(path, data, options)
```

### DELETE

```js
api.delete(path, options)
```

### Universal Request

```js
api.request(config)
```

### Authentication

```js
api.setToken(token)
```

```js
api.clearToken()
```

---

# React Example

API Sutra works with React applications.

```jsx
import { useEffect, useState } from "react";
import { createApiClient } from "api-sutra";

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
});

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await api.get("/api/users");

        setUsers(data);
      } catch (error) {
        console.error(error);

        setError(error.message);
      }
    }

    loadUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>

      {error && <p>{error}</p>}

      {users.map((user) => (
        <p key={user._id}>
          {user.fullName}
        </p>
      ))}
    </div>
  );
}

export default Users;
```

---

# Environment Variables

For Vite applications, create:

```text
.env
```

and add:

```env
VITE_API_URL=https://api.example.com
```

Then:

```js
import { createApiClient } from "api-sutra";

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
});
```

Now requests can use:

```js
const users = await api.get("/api/users");
```

---

# Centralized API Service

For larger applications, you can create a reusable API service.

Example:

```text
src/
├── components/
├── pages/
├── services/
│   └── api.js
└── App.jsx
```

### `src/services/api.js`

```js
import { createApiClient } from "api-sutra";

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
```

Then use it anywhere:

```js
import api from "./services/api";

const users = await api.get("/users");
```

This keeps your API configuration centralized.

---

# Real-World Example

API Sutra can be used with an application such as ArtistHood:

```js
import { createApiClient } from "api-sutra";

const api = createApiClient({
  baseURL: "https://artisthood-e6a5.onrender.com",
});
```

Get artists:

```js
const artists = await api.get("/api/artists");

console.log(artists);
```

Create an artist:

```js
const artist = await api.post("/api/artists", {
  fullName: "Artist Name",
});
```

Authenticated request:

```js
const api = createApiClient({
  baseURL: "https://artisthood-e6a5.onrender.com",
  token: "YOUR_TOKEN",
});

const profile = await api.get("/api/profile");
```

---

# Backward Compatibility

API Sutra keeps the original `getApiUrl()` helper for applications using the earlier API.

```js
import { getApiUrl } from "api-sutra";

const users = await getApiUrl(
  "https://api.example.com",
  "/users"
);
```

Options can also be passed:

```js
const users = await getApiUrl(
  "https://api.example.com",
  "/users",
  {
    params: {
      page: 1,
    },
  }
);
```

For new projects, `createApiClient()` is recommended:

```js
import { createApiClient } from "api-sutra";

const api = createApiClient({
  baseURL: "https://api.example.com",
});

const users = await api.get("/users");
```

---

# Direct Axios Access

API Sutra intentionally keeps the underlying Axios client accessible for advanced use cases:

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
});

api.client;
```

This allows advanced developers to access Axios functionality directly when the API Sutra abstraction is not sufficient.

---

# How It Works

```text
createApiClient(config)
        │
        ▼
 Validate base URL
        │
        ▼
   Create Axios client
        │
        ▼
 Configure headers
        │
        ▼
 Add authentication
        │
        ▼
 Configure interceptors
        │
        ▼
 ┌───────────────────────┐
 │  api.get()            │
 │  api.post()           │
 │  api.put()            │
 │  api.patch()          │
 │  api.delete()         │
 │  api.request()        │
 └───────────┬───────────┘
             │
             ▼
       Normalize path
             │
             ▼
       Axios request
             │
        ┌────┴────┐
        ▼         ▼
     Success    Failure
        │         │
        ▼         ▼
 response.data  ApiSutraError
```

API Sutra provides a small abstraction over Axios while keeping Axios functionality available underneath.

---

# Project Structure

A typical application using API Sutra can be structured like:

```text
your-project/
│
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│       └── api.js
│
├── .env
├── package.json
└── ...
```

---

# Development

Clone the repository:

```bash
git clone https://github.com/pasiabhishek/api-sutra.git
```

Move into the project:

```bash
cd api-sutra
```

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

---

# Testing

API Sutra uses **Vitest** for testing.

Run the complete test suite:

```bash
npm test
```

Run Vitest in watch mode:

```bash
npm run test:watch
```

The test suite covers:

* Base URL validation
* API path validation
* Axios client creation
* GET requests
* POST requests
* PUT requests
* PATCH requests
* DELETE requests
* Custom request configuration
* Path normalization
* Authentication tokens
* Token updates
* Token clearing
* Interceptors
* Error normalization
* Legacy `getApiUrl()` support

---

# Build

API Sutra currently exports its source directly:

```text
src/index.js
```

No separate compilation step is required.

Run the test suite before publishing:

```bash
npm test
```

---

# Publishing

Login to npm:

```bash
npm login
```

Check the logged-in account:

```bash
npm whoami
```

Check the files that will be published:

```bash
npm pack --dry-run
```

Publish:

```bash
npm publish
```

For future releases:

### Patch

```bash
npm version patch
npm publish
```

### Minor

```bash
npm version minor
npm publish
```

### Major

```bash
npm version major
npm publish
```

Use a major version when introducing breaking API changes.

---

# Requirements

* Node.js 18+
* npm 9+
* Axios
* Modern JavaScript environment
* ES Module support

---

# License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

---

# Author

**Pasi Abhishek**

* GitHub: [@pasiabhishek](https://github.com/pasiabhishek)
* npm: [api-sutra](https://www.npmjs.com/package/api-sutra)

---

# Repository

GitHub:

https://github.com/pasiabhishek/api-sutra

---

# Why API Sutra?

Axios is already a powerful HTTP client.

**API Sutra does not try to replace Axios.**

Instead, it provides a small reusable layer for applications that want:

* One centralized API configuration
* Cleaner endpoint calls
* Automatic path normalization
* Built-in Bearer authentication
* Runtime token management
* Consistent HTTP methods
* Standardized errors
* Request and response interceptors
* Less repetitive API configuration
* Direct access to Axios when needed

Without API Sutra:

```js
axios.get(`${BASE_URL}/users`);

axios.post(`${BASE_URL}/users`, data);

axios.put(`${BASE_URL}/users/1`, data);

axios.delete(`${BASE_URL}/users/1`);
```

With API Sutra:

```js
const api = createApiClient({
  baseURL: BASE_URL,
});

api.get("/users");

api.post("/users", data);

api.put("/users/1", data);

api.delete("/users/1");
```

---

## API Sutra

**Simple API requests.
One reusable client.
Built on Axios.**
