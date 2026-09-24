# master-api-url

A lightweight and simple utility for making **GET API requests with Axios**.

`master-api-url` combines a base API URL and endpoint path, performs the request using Axios, and directly returns the API response data.

## Features

* Simple API URL handling
* Uses Axios internally
* Supports any API base URL
* Automatically handles `/` between base URL and endpoint
* Directly returns `response.data`
* Promise-based
* Lightweight and easy to integrate
* Works with modern JavaScript / ES Modules

## Installation

Install the package using npm:

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

The function internally makes:

```text
GET https://api.example.com/users
```

and returns:

```js
response.data
```

### Without Leading Slash

You can also pass the endpoint without `/`:

```js
const data = await getApiUrl(
    "https://api.example.com",
    "users"
);
```

Both of these produce the same URL:

```text
https://api.example.com/users
```

### With Query Parameters

```js
const data = await getApiUrl(
    "https://api.example.com",
    "/users?page=1&limit=10"
);

console.log(data);
```

## Function

```js
getApiUrl(baseUrl, path)
```

### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `baseUrl` | `string` | Base URL of the API |
| `path`    | `string` | API endpoint path   |

### Returns

Returns a Promise containing the API's `response.data`.

Example:

```js
const users = await getApiUrl(
    "https://api.example.com",
    "/users"
);
```

If the API returns:

```json
{
    "success": true,
    "users": []
}
```

the function returns:

```js
{
    "success": true,
    "users": []
}
```

## Error Handling

Since Axios is used internally, request errors are returned as rejected promises.

```js
try {
    const data = await getApiUrl(
        "https://api.example.com",
        "/users"
    );

    console.log(data);
} catch (error) {
    console.error("API request failed:", error);
}
```

## React Example

```js
import { getApiUrl } from "master-api-url";

async function fetchUsers() {
    try {
        const users = await getApiUrl(
            import.meta.env.VITE_API_URL,
            "/api/users"
        );

        console.log(users);
    } catch (error) {
        console.error(error);
    }
}
```

### Using Inside `useEffect`

```jsx
import { useEffect, useState } from "react";
import { getApiUrl } from "master-api-url";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await getApiUrl(
                    import.meta.env.VITE_API_URL,
                    "/api/users"
                );

                setUsers(data.users);
            } catch (error) {
                console.error(error);
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

`.env`:

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

## Build

Build the package using:

```bash
npm run build
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

---

If this package helps you simplify API requests, consider giving the project a ⭐ on GitHub.
