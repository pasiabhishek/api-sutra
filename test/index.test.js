import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { getApiUrl } from "../src/index.js";

describe("getApiUrl", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("should require base URL", async () => {
        await expect(
            getApiUrl("", "/api/users")
        ).rejects.toThrow("Base URL is required.");
    });

    it("should require API path", async () => {
        await expect(
            getApiUrl("https://example.com", "")
        ).rejects.toThrow("API path is required.");
    });

    it("should build the URL correctly", async () => {
        const mockResponse = {
            data: {
                id: 1,
                name: "Test User",
            },
        };

        vi.spyOn(axios, "get").mockResolvedValue(mockResponse);

        const data = await getApiUrl(
            "https://example.com/",
            "/api/users"
        );

        expect(axios.get).toHaveBeenCalledWith(
            "https://example.com/api/users",
            {}
        );

        expect(data).toEqual(mockResponse.data);
    });

    it("should fetch API data", async () => {
        const data = await getApiUrl(
            "https://jsonplaceholder.typicode.com",
            "/posts/1"
        );

        expect(data).toHaveProperty("id", 1);
        expect(data).toHaveProperty("userId", 1);
        expect(data).toHaveProperty("title");
        expect(data).toHaveProperty("body");
    });

    it("should return null when API request fails", async () => {
        vi.spyOn(axios, "get").mockRejectedValue(
            new Error("Network error")
        );

        const data = await getApiUrl(
            "https://example.com",
            "/api/users"
        );

        expect(data).toBeNull();
    });

    it("should pass axios options correctly", async () => {
        const mockResponse = {
            data: {
                success: true,
            },
        };

        vi.spyOn(axios, "get").mockResolvedValue(mockResponse);

        const options = {
            headers: {
                Authorization: "Bearer test-token",
            },
            timeout: 5000,
        };

        const data = await getApiUrl(
            "https://example.com",
            "/api/test",
            options
        );

        expect(axios.get).toHaveBeenCalledWith(
            "https://example.com/api/test",
            options
        );

        expect(data).toEqual({
            success: true,
        });
    });
});