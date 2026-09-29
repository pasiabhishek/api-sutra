# master-api-url

A lightweight and simple utility for making **GET API requests with Axios**.

`master-api-url` combines a base API URL and endpoint path, performs the GET request internally using Axios, handles request errors, and directly returns the API response data.

The goal is simple:

```js
const data = await getApiUrl(baseUrl, path);
```

No need to write Axios or `fetch` request code yourself.

## Features

* Simple GET API requests
* Uses Axios internally
* No need to write `fetch()`
* No need to use Axios directly
* Automatically handles `/` between base URL and endpoint
* Directly returns `response.data`
* Supports Axios request options
* Handles API request errors internally
* Returns `null` when a request fails
* Validates the base URL and API path
* Promise-based
* Lightweight
* Works with modern JavaScript and ES Modules

## Installation

Install `master-api-url` using npm:

```bash
npm install master-api-url
```

## Usage

### Import

```js
import { getApiUrl } from "master-api-url";
```

### Basic Example

```js
const data = await getApiUrl(
  "https://api.example.com",
  "/users"
);

console.log(data);
```

Internally, the package makes:

```text
GET https://api.example.com/users
```

and returns:

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
const data = await getApiUrl(
  "https://api.example.com",
  "/users"
);
```

will give you:

```js
{
  success: true,
  users: []
}
```

## Endpoint With or Without `/`

You can provide the endpoint with or without a leading slash.

### With a leading slash

```js
const data = await getApiUrl(
  "https://api.example.com",
  "/users"
);
```

### Without a leading slash

```js
const data = await getApiUrl(
  "https://api.example.com",
  "users"
);
```

Both produce:

```text
https://api.example.com/users
```

The package automatically removes unnecessary trailing and leading slashes before constructing the URL.

## Query Parameters

Query parameters can be included directly in the API path:

```js
const data = await getApiUrl(
  "https://api.example.com",
  "/users?page=1&limit=10"
);

console.log(data);
```

The resulting request is:

```text
GET https://api.example.com/users?page=1&limit=10
```

## Axios Request Options

The third argument can be used to pass Axios request configuration.

```js
const data = await getApiUrl(
  "https://api.example.com",
  "/users",
  {
    headers: {
      Authorization: "Bearer YOUR_TOKEN"
    }
  }
);
```

The `options` object is passed directly to:

```js
axios.get(url, options);
```

This allows you to provide supported Axios GET request configuration such as:

* `headers`
* `params`
* `timeout`
* `withCredentials`
* Other supported Axios request options

### Example With Headers

```js
const data = await getApiUrl(
  "https://api.example.com",
  "/users",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
```

### Example With Query Parameters

You can also use Axios `params`:

```js
const data = await getApiUrl(
  "https://api.example.com",
  "/users",
  {
    params: {
      page: 1,
      limit: 10
    }
  }
);
```

Axios will generate the appropriate query string.

## Function

```js
getApiUrl(baseUrl, path, options)
```

### Parameters

| Parameter | Type     | Default | Description                     |
| --------- | -------- | ------- | ------------------------------- |
| `baseUrl` | `string` | —       | Base URL of the API             |
| `path`    | `string` | —       | API endpoint path               |
| `options` | `object` | `{}`    | Axios GET request configuration |

## Return Value

`getApiUrl()` returns a Promise.

### Successful Request

When the request succeeds, the function returns:

```js
response.data
```

For example:

```js
const users = await getApiUrl(
  "https://api.example.com",
  "/users"
);
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

### Failed Request

If the Axios request fails, the error is handled internally.

The function logs the error:

```text
master-api-url: API request failed.
```

and returns:

```js
null
```

Example:

```js
const users = await getApiUrl(
  "https://api.example.com",
  "/users"
);

if (users === null) {
  console.log("Unable to fetch users.");
}
```

You do not need to write a request-level `try/catch` for normal HTTP/request failures.

## Validation Errors

The package validates `baseUrl` and `path` before making the request.

### Missing Base URL

```js
await getApiUrl("", "/users");
```

throws:

```text
Error: Base URL is required.
```

### Missing API Path

```js
await getApiUrl(
  "https://api.example.com",
  ""
);
```

throws:

```text
Error: API path is required.
```

These are input validation errors and are intentionally thrown before Axios is called.

## React Example

`master-api-url` can be used in React applications.

```jsx
import { useEffect, useState } from "react";
import { getApiUrl } from "master-api-url";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const data = await getApiUrl(
        import.meta.env.VITE_API_URL,
        "/api/users"
      );

      if (data !== null) {
        setUsers(data);
      }
    }

    loadUsers();
  }, []);

  return (
    <div>
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

If your API response is:

```json
{
  "success": true,
  "users": []
}
```

then use:

```js
if (data !== null) {
  setUsers(data.users);
}
```

## Using Environment Variables

For Vite projects, you can store your API base URL in `.env`:

```env
VITE_API_URL=https://api.example.com
```

Then:

```js
import { getApiUrl } from "master-api-url";

const data = await getApiUrl(
  import.meta.env.VITE_API_URL,
  "/api/users"
);
```

## Real-World Example

For an API such as ArtistHood:

```js
import { getApiUrl } from "master-api-url";

const artists = await getApiUrl(
  "https://artisthood-e6a5.onrender.com",
  "/api/artists"
);

console.log(artists);
```

If the API returns an array of artists:

```js
[
  {
    _id: "...",
    fullName: "Artist Name"
  }
]
```

then:

```js
artists
```

directly contains that array.

## How It Works

The package handles the request internally:

```text
getApiUrl(baseUrl, path, options)
              │
              ▼
       Validate inputs
              │
              ▼
       Clean URL slashes
              │
              ▼
        Build API URL
              │
              ▼
       axios.get(url, options)
              │
        ┌─────┴─────┐
        ▼           ▼
     Success      Failure
        │           │
        ▼           ▼
 response.data     null
```

This keeps API request code simple for the package user.

## Example Project Structure

```text
your-project/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
├── .env
├── package.json
└── ...
```

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

## Publishing

Login to npm:

```bash
npm login
```

Then publish:

```bash
npm publish
```

For subsequent releases, update the package version:

```bash
npm version patch
```

or:

```bash
npm version minor
```

Then publish the new version:

```bash
npm publish
```

## Requirements

* Node.js 18+
* npm 9+
* Axios

## License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

## Author

**Pasi Abhishek**

* GitHub: [@pasiabhishek](https://github.com/pasiabhishek)
* npm: [master-api-url](https://www.npmjs.com/package/master-api-url)

## Repository

GitHub:

https://github.com/pasiabhishek/master-api-url

---

If `master-api-url` helps simplify your API requests, consider giving the project a ⭐ on GitHub.
