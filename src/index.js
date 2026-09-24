import axios from "axios";

export async function getApiUrl(baseUrl, path, options = {}) {
    if (!baseUrl) {
        throw new Error("Base URL is required.");
    }

    if (!path) {
        throw new Error("API path is required.");
    }

    const cleanBaseUrl = String(baseUrl).replace(/\/+$/, "");
    const cleanPath = String(path).replace(/^\/+/, "");

    const url = `${cleanBaseUrl}/${cleanPath}`;

    try {
        const response = await axios.get(url, options);

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "API request failed."
        );
    }
}