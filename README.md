# api-sutra

A lightweight and simple API client built on top of **Axios** for making HTTP API requests with a clean and reusable interface.

`master-api-url` lets you configure your API once and then use simple methods like:

```js
api.get("/users");
api.post("/users", data);
api.put("/users/1", data);
api.patch("/users/1", data);
api.delete("/users/1");
```

The goal is simple:

```js
import { createApiClient } from "master-api-url";

const api = createApiClient({
  baseURL: "https://api.example.com",
});

const users = await api.get("/users");
```

You configure the base URL once instead of repeatedly writing complete API URLs.

---

## Features

* Simple and reusable API client
* Built on Axios
* Supports `GET`
* Supports `POST`
* Supports `PUT`
* Supports `PATCH`
* Supports `DELETE`
* Configure the base URL once
* Automatically handles `/` between base URL and endpoint
* Directly returns `response.data`
* Supports Axios request options
* Optional Bearer token authentication
* Configurable request timeout
* Custom default headers
* Standardized API errors
* Preserves HTTP status and response data on errors
* Promise-based
* Lightweight
* Works with modern JavaScript
* ES Module support
* Keeps the original `getApiUrl()` helper for backward compatibility

---

## Installation

Install `master-api-url` using npm:

```bash
npm install master-api-url
```

---

## Usage

### Import

```js
import { createApiClient } from "master-api-url";
```

### Create an API Client

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
});
```

The `baseURL` is configured once and can then be reused for every request.

---

## GET Request

```js
const users = await api.get("/users");

console.log(users);
```

Internally, the package makes:

```text
GET https://api.example.com/users
```

and directly returns:

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

will give you:

```js
{
  success: true,
  users: []
}
```

---

## POST Request

Use `post()` to send data to an API.

```js
const user = await api.post("/users", {
  name: "Pasi Abhishek",
  email: "pasi@example.com",
});

console.log(user);
```

Internally:

```js
axios.post("/users", data, options);
```

The method returns:

```js
response.data
```

---

## PUT Request

Use `put()` when updating an existing resource.

```js
const user = await api.put("/users/1", {
  name: "Pasi Abhishek",
  email: "pasi@example.com",
});
```

---

## PATCH Request

Use `patch()` when partially updating an existing resource.

```js
const user = await api.patch("/users/1", {
  name: "Master Aazam",
});
```

---

## DELETE Request

Use `delete()` to remove a resource.

```js
const result = await api.delete("/users/1");

console.log(result);
```

---

## Endpoint With or Without `/`

You can provide an endpoint with or without a leading slash.

### With a leading slash

```js
const users = await api.get("/users");
```

### Without a leading slash

```js
const users = await api.get("users");
```

Both produce:

```text
https://api.example.com/users
```

The package automatically normalizes the endpoint path.

---

## Query Parameters

You can pass Axios request options to any request.

For example:

```js
const users = await api.get("/users", {
  params: {
    page: 1,
    limit: 10,
  },
});
```

Axios will generate the appropriate query string.

The request becomes:

```text
GET https://api.example.com/users?page=1&limit=10
```

---

## Request Headers

You can provide request-specific headers:

```js
const users = await api.get("/users", {
  headers: {
    Authorization: "Bearer YOUR_TOKEN",
  },
});
```

The options object is passed to Axios.

This means you can use supported Axios request configuration such as:

* `headers`
* `params`
* `timeout`
* `withCredentials`
* Other Axios request options

---

## Authentication

You can configure a Bearer token when creating the API client.

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
  token: "YOUR_TOKEN",
});
```

The client automatically adds:

```http
Authorization: Bearer YOUR_TOKEN
```

to requests.

You can then simply write:

```js
const profile = await api.get("/profile");
```

without manually adding the Authorization header to every request.

---

## Custom Headers

You can configure default headers when creating the client:

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
  headers: {
    "X-App-Version": "1.0.0",
  },
});
```

These headers are used as default headers for the API client.

---

## Request Timeout

The default request timeout is:

```text
10000 ms
```

which is 10 seconds.

You can customize it:

```js
const api = createApiClient({
  baseURL: "https://api.example.com",
  timeout: 5000,
});
```

---

## Function

```js
createApiClient(config)
```

### Configuration

| Property  | Type     | Default | Description                          |
| --------- | -------- | ------: | ------------------------------------ |
| `baseURL` | `string` |       — | Base URL of the API                  |
| `token`   | `string` |       — | Optional Bearer authentication token |
| `timeout` | `number` | `10000` | Request timeout in milliseconds      |
| `headers` | `object` |    `{}` | Default request headers              |

---

## API Methods

After creating the client:

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

---

## Return Value

All API methods return a Promise.

When the request succeeds, the methods return:

```js
response.data
```

For example:

```js
const users = await api.get("/users");
```

If the API returns:

```json
[
  {
    "_id": "1",
    "fullName": "John Doe"
  },
  {
    "_id": "2",
    "fullName": "Jane Doe"
  }
]
```

then `users` directly contains:

```js
[
  {
    _id: "1",
    fullName: "John Doe"
  },
  {
    _id: "2",
    fullName: "Jane Doe"
  }
]
```

---

## Error Handling

API errors are normalized by `master-api-url`.

Example:

```js
try {
  const users = await api.get("/users");
} catch (error) {
  console.log(error.message);
  console.log(error.status);
  console.log(error.data);
}
```

The error provides:

```js
error.message
error.status
error.data
error.response
```

For example, an API returning:

```json
{
  "message": "Unauthorized"
}
```

can be handled as:

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

Unlike the original `getApiUrl()` implementation, the new API client **throws the normalized error** instead of silently returning `null`.

This allows the application to decide how the error should be handled.

---

## Validation Errors

The package validates the API configuration before making requests.

### Missing Base URL

```js
createApiClient();
```

throws:

```text
Error: Base URL is required.
```

### Missing API Path

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

These are input validation errors and are thrown before the API request is made.

---

## React Example

`master-api-url` can be used in React applications.

```jsx
import { useEffect, useState } from "react";
import { createApiClient } from "master-api-url";

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

## Using Environment Variables

For Vite projects, store your API base URL in `.env`:

```env
VITE_API_URL=https://api.example.com
```

Then create your client:

```js
import { createApiClient } from "master-api-url";

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
});
```

Now use it throughout your application:

```js
const users = await api.get("/api/users");
```

---

## Real-World Example

For an API such as ArtistHood:

```js
import { createApiClient } from "master-api-url";

const api = createApiClient({
  baseURL: "https://artisthood-e6a5.onrender.com",
});
```

Then:

```js
const artists = await api.get("/api/artists");

console.log(artists);
```

POST example:

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

## Backward Compatibility

The original `getApiUrl()` function is still available.

```js
import { getApiUrl } from "master-api-url";

const users = await getApiUrl(
  "https://api.example.com",
  "/users"
);
```

However, for new projects, `createApiClient()` is recommended:

```js
import { createApiClient } from "master-api-url";

const api = createApiClient({
  baseURL: "https://api.example.com",
});

const users = await api.get("/users");
```

---

## How It Works

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
       api.get()
       api.post()
       api.put()
       api.patch()
       api.delete()
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
response.data  normalized Error
```

The package provides a small abstraction over Axios while keeping the API simple.

---

## Example Project Structure

```text
your-project/

├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── .env
├── package.json
└── ...
```

A centralized API client can be placed inside:

```text
src/services/api.js
```

Example:

```js
import { createApiClient } from "master-api-url";

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
```

Then anywhere in your application:

```js
import api from "./services/api";

const users = await api.get("/users");
```

---

## Development

Clone the repository:

```bash
git clone https://github.com/pasiabhishek/master-api-url.git
```

Move into the project:

```bash
cd master-api-url
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

## Build

The package currently exports its source directly from:

```text
src/index.js
```

No separate compilation step is required.

Run the test suite with:

```bash
npm test
```

---

## Publishing

Login to npm:

```bash
npm login
```

Check your npm account:

```bash
npm whoami
```

Before publishing, check what will be included:

```bash
npm pack --dry-run
```

Publish the package:

```bash
npm publish
```

For a new patch release:

```bash
npm version patch
```

For a new minor release:

```bash
npm version minor
```

For the new `createApiClient()` API, use a major version if this is a breaking change:

```bash
npm version major
```

Then publish:

```bash
npm publish
```

---

## Requirements

* Node.js 18+
* npm 9+
* Axios
* Modern JavaScript environment
* ES Module support

---

## License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

---

## Author

**Pasi Abhishek**

* GitHub: [@pasiabhishek](https://github.com/pasiabhishek)
* npm: [master-api-url](https://www.npmjs.com/package/master-api-url)

---

## Repository

GitHub:

https://github.com/pasiabhishek/master-api-url

---

## Why master-api-url?

Axios is already a powerful HTTP client.

`master-api-url` doesn't try to replace Axios.

Instead, it provides a simpler API layer on top of Axios for applications that want:

* One reusable API configuration
* Cleaner endpoint calls
* Built-in authentication configuration
* Consistent request methods
* Standardized errors
* Less repetitive API code

Instead of:

```js
axios.get(`${BASE_URL}/users`);
axios.post(`${BASE_URL}/users`, data);
axios.put(`${BASE_URL}/users/1`, data);
axios.delete(`${BASE_URL}/users/1`);
```

you can use:

```js
const api = createApiClient({
  baseURL: BASE_URL,
});

api.get("/users");
api.post("/users", data);
api.put("/users/1", data);
api.delete("/users/1");
```

**Simple API requests. One reusable client. Built on Axios.**
