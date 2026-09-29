import axios from "axios";

export async function getApiUrl(baseUrl, path, options = {}) {
  // Validate base URL
  if (!baseUrl) {
    throw new Error("Base URL is required.");
  }

  // Validate API path
  if (!path) {
    throw new Error("API path is required.");
  }

  // Clean base URL and API path
  const cleanBaseUrl = String(baseUrl).replace(/\/+$/, "");
  const cleanPath = String(path).replace(/^\/+/, "");

  // Build complete URL
  const url = `${cleanBaseUrl}/${cleanPath}`;

  try {
    // API request handled internally
    const response = await axios.get(url, options);

    // Return only the API data
    return response.data;
  } catch (error) {
    // Handle error internally
    console.error(
      "master-api-url:",
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "API request failed."
    );

    // Return null when request fails
    return null;
  }
}