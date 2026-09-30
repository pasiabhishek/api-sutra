import axios from "axios";

/**
 * Converts Axios errors into a simple, consistent Error object.
 * This makes it easier for the developer to handle API errors.
 */
function normalizeError(error) {
  // Try to get the error message sent by the API first.
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "API request failed.";

  // Create a normal JavaScript Error with the useful API message.
  const normalizedError = new Error(message);

  // Keep useful information from the original Axios error.
  normalizedError.status = error.response?.status;
  normalizedError.data = error.response?.data;
  normalizedError.response = error.response;

  return normalizedError;
}

/**
 * Creates a reusable API client.
 *
 * Once the client is created, you don't need to write
 * the base URL again for every API request.
 *
 * Example:
 *
 * const api = createApiClient({
 *   baseURL: "https://api.example.com"
 * });
 *
 * api.get("/users");
 */
export function createApiClient({
  baseURL,
  token,
  timeout = 10000,
  headers = {},
} = {}) {

  // The API client cannot work without a base URL.
  if (!baseURL) {
    throw new Error("Base URL is required.");
  }

  // Create one Axios client with the common configuration.
  const client = axios.create({
    // Remove extra "/" from the end of the base URL.
    baseURL: String(baseURL).replace(/\/+$/, ""),

    // Stop the request if it takes longer than the given time.
    timeout,

    // Default headers for API requests.
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  // If a token is provided, automatically send it
  // with every request made through this API client.
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  /**
   * Cleans and validates the API endpoint.
   *
   * Example:
   * "/users" becomes "/users"
   * "users" becomes "/users"
   */
  const normalizePath = (path) => {

    // Every API request needs a path.
    if (!path) {
      throw new Error("API path is required.");
    }

    // Make sure the path starts with exactly one "/".
    return `/${String(path).replace(/^\/+/, "")}`;
  };

  /**
   * GET request
   *
   * Example:
   * api.get("/users")
   */
  const get = async (path, options = {}) => {
    try {
      // Send the GET request using the configured Axios client.
      const response = await client.get(
        normalizePath(path),
        options
      );

      // Return the actual API data instead of
      // making the developer use response.data.
      return response.data;

    } catch (error) {
      // Convert the Axios error into our standard error.
      throw normalizeError(error);
    }
  };

  /**
   * POST request
   *
   * Example:
   * api.post("/users", { name: "Pasi" })
   */
  const post = async (path, data = {}, options = {}) => {
    try {
      const response = await client.post(
        normalizePath(path),
        data,
        options
      );

      return response.data;

    } catch (error) {
      throw normalizeError(error);
    }
  };

  /**
   * PUT request
   *
   * Used when updating an existing resource.
   *
   * Example:
   * api.put("/users/1", { name: "Pasi" })
   */
  const put = async (path, data = {}, options = {}) => {
    try {
      const response = await client.put(
        normalizePath(path),
        data,
        options
      );

      return response.data;

    } catch (error) {
      throw normalizeError(error);
    }
  };

  /**
   * PATCH request
   *
   * Used when partially updating a resource.
   *
   * Example:
   * api.patch("/users/1", { name: "Pasi" })
   */
  const patch = async (path, data = {}, options = {}) => {
    try {
      const response = await client.patch(
        normalizePath(path),
        data,
        options
      );

      return response.data;

    } catch (error) {
      throw normalizeError(error);
    }
  };

  /**
   * DELETE request
   *
   * Example:
   * api.delete("/users/1")
   */
  const remove = async (path, options = {}) => {
    try {
      const response = await client.delete(
        normalizePath(path),
        options
      );

      return response.data;

    } catch (error) {
      throw normalizeError(error);
    }
  };

  // Return all available API methods.
  // The developer can now use:
  //
  // api.get()
  // api.post()
  // api.put()
  // api.patch()
  // api.delete()
  return {
    get,
    post,
    put,
    patch,
    delete: remove,
  };
}

/**
 * Old GET helper from version 1.
 *
 * This is kept so existing users of the package
 * don't have to immediately change their code.
 *
 * New projects should use createApiClient().
 */
export async function getApiUrl(baseUrl, path, options = {}) {
  // Create a temporary API client using the provided base URL.
  const api = createApiClient({
    baseURL: baseUrl,
  });

  // Make the GET request through the new API client.
  return api.get(path, options);
}
