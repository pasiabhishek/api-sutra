import { describe, it, expect } from "vitest";
import { getApiUrl } from "../src/index.js";

describe("getApiUrl", () => {
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
});