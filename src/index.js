import axios from "axios";

/**
 * Makes Axios errors easier to understand and handle.
 *
 * API Sutra gives API errors one simple format.
 */
function normalizeError(error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "API request failed.";

  const normalizedError = new Error(message);

  normalizedError.name = "ApiSutraError";
  normalizedError.status = error.response?.status;
  normalizedError.data = error.response?.data;
  normalizedError.response = error.response;
  normalizedError.code = error.code;
  normalizedError.original = error;

  return normalizedError;
}

/**
 * Creates a reusable API client.
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
  interceptors = {},
} = {}) {
  if (!baseURL) {
    throw new Error("Base URL is required.");
  }

  const client = axios.create({
    baseURL: String(baseURL).replace(/\/+$/, ""),
    timeout,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  // Add authentication token if provided.
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  // Custom request interceptor.
  if (interceptors.request) {
    client.interceptors.request.use(interceptors.request);
  }

  // Custom response interceptor.
  if (interceptors.response) {
    client.interceptors.response.use(interceptors.response);
  }

  // Custom error interceptor.
  if (interceptors.error) {
    client.interceptors.response.use(
      (response) => response,
      interceptors.error
    );
  }

  /**
   * Normalizes an API path.
   *
   * "/users" -> "/users"
   * "users"  -> "/users"
   */
  const normalizePath = (path) => {
    if (!path) {
      throw new Error("API path is required.");
    }

    return `/${String(path).replace(/^\/+/, "")}`;
  };

  /**
   * Universal request method.
   *
   * Useful when the standard HTTP methods
   * are not enough.
   */
  const request = async (config = {}) => {
    try {
      const response = await client.request({
        ...config,
        url: normalizePath(config.url),
      });

      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  };

  // GET request.
  const get = async (path, options = {}) =>
    request({
      method: "GET",
      url: path,
      ...options,
    });

  // POST request.
  const post = async (path, data = {}, options = {}) =>
    request({
      method: "POST",
      url: path,
      data,
      ...options,
    });

  // PUT request.
  const put = async (path, data = {}, options = {}) =>
    request({
      method: "PUT",
      url: path,
      data,
      ...options,
    });

  // PATCH request.
  const patch = async (path, data = {}, options = {}) =>
    request({
      method: "PATCH",
      url: path,
      data,
      ...options,
    });

  // DELETE request.
  const remove = async (path, options = {}) =>
    request({
      method: "DELETE",
      url: path,
      ...options,
    });

  /**
   * Sets or changes the authentication token.
   */
  const setToken = (newToken) => {
    if (!newToken) {
      clearToken();
      return;
    }

    client.defaults.headers.common.Authorization = `Bearer ${newToken}`;
  };

  /**
   * Removes the authentication token.
   */
  const clearToken = () => {
    delete client.defaults.headers.common.Authorization;
  };

  // Return all API Sutra methods.
  return {
    get,
    post,
    put,
    patch,
    delete: remove,
    request,
    setToken,
    clearToken,

    // Advanced users can access the Axios client directly.
    client,
  };
}

/**
 * Legacy GET helper from version 1.
 *
 * Kept for backward compatibility.
 *
 * New projects should use createApiClient().
 */
export async function getApiUrl(
  baseUrl,
  path,
  options = {}
) {
  const api = createApiClient({
    baseURL: baseUrl,
  });

  return api.get(path, options);
}