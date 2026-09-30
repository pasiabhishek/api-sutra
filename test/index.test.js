import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from "vitest";

import axios from "axios";
import {
    createApiClient,
    getApiUrl,
} from "../src/index.js";

describe("createApiClient", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("should require a base URL", () => {
        expect(() => createApiClient()).toThrow(
            "Base URL is required."
        );
    });

    it("should require an API path", async () => {
        const api = createApiClient({
            baseURL: "https://example.com",
        });

        await expect(
            api.get("")
        ).rejects.toThrow("API path is required.");
    });

    it("should create an Axios client with the correct configuration", () => {
        const createSpy = vi.spyOn(axios, "create");

        createApiClient({
            baseURL: "https://example.com/",
            timeout: 5000,
            headers: {
                "X-Test": "true",
            },
        });

        expect(createSpy).toHaveBeenCalledWith({
            baseURL: "https://example.com",
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
                "X-Test": "true",
            },
        });
    });

    it("should make a GET request", async () => {
        const mockResponse = {
            data: {
                id: 1,
                name: "Test User",
            },
        };

        const get = vi.fn().mockResolvedValue(mockResponse);

        vi.spyOn(axios, "create").mockReturnValue({
            get,
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        });

        const api = createApiClient({
            baseURL: "https://example.com/",
        });

        const data = await api.get("/api/users");

        expect(get).toHaveBeenCalledWith(
            "/api/users",
            {}
        );

        expect(data).toEqual(mockResponse.data);
    });

    it("should normalize API paths", async () => {
        const get = vi.fn().mockResolvedValue({
            data: { success: true },
        });

        vi.spyOn(axios, "create").mockReturnValue({
            get,
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        });

        const api = createApiClient({
            baseURL: "https://example.com",
        });

        await api.get("///api/users");

        expect(get).toHaveBeenCalledWith(
            "/api/users",
            {}
        );
    });

    it("should make a POST request", async () => {
        const post = vi.fn().mockResolvedValue({
            data: {
                id: 1,
                name: "Pasi",
            },
        });

        vi.spyOn(axios, "create").mockReturnValue({
            get: vi.fn(),
            post,
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        });

        const api = createApiClient({
            baseURL: "https://example.com",
        });

        const user = {
            name: "Pasi",
        };

        const data = await api.post(
            "/users",
            user
        );

        expect(post).toHaveBeenCalledWith(
            "/users",
            user,
            {}
        );

        expect(data).toEqual({
            id: 1,
            name: "Pasi",
        });
    });

    it("should make a PUT request", async () => {
        const put = vi.fn().mockResolvedValue({
            data: {
                success: true,
            },
        });

        vi.spyOn(axios, "create").mockReturnValue({
            get: vi.fn(),
            post: vi.fn(),
            put,
            patch: vi.fn(),
            delete: vi.fn(),
        });

        const api = createApiClient({
            baseURL: "https://example.com",
        });

        const data = await api.put(
            "/users/1",
            { name: "Updated User" }
        );

        expect(put).toHaveBeenCalledWith(
            "/users/1",
            { name: "Updated User" },
            {}
        );

        expect(data).toEqual({
            success: true,
        });
    });

    it("should make a PATCH request", async () => {
        const patch = vi.fn().mockResolvedValue({
            data: {
                success: true,
            },
        });

        vi.spyOn(axios, "create").mockReturnValue({
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            patch,
            delete: vi.fn(),
        });

        const api = createApiClient({
            baseURL: "https://example.com",
        });

        const data = await api.patch(
            "/users/1",
            { name: "Pasi" }
        );

        expect(patch).toHaveBeenCalledWith(
            "/users/1",
            { name: "Pasi" },
            {}
        );

        expect(data).toEqual({
            success: true,
        });
    });

    it("should make a DELETE request", async () => {
        const remove = vi.fn().mockResolvedValue({
            data: {
                success: true,
            },
        });

        vi.spyOn(axios, "create").mockReturnValue({
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: remove,
        });

        const api = createApiClient({
            baseURL: "https://example.com",
        });

        const data = await api.delete("/users/1");

        expect(remove).toHaveBeenCalledWith(
            "/users/1",
            {}
        );

        expect(data).toEqual({
            success: true,
        });
    });

    it("should pass Axios options correctly", async () => {
        const get = vi.fn().mockResolvedValue({
            data: {
                success: true,
            },
        });

        vi.spyOn(axios, "create").mockReturnValue({
            get,
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        });

        const api = createApiClient({
            baseURL: "https://example.com",
        });

        const options = {
            headers: {
                Authorization: "Bearer test-token",
            },
            timeout: 5000,
        };

        const data = await api.get(
            "/api/test",
            options
        );

        expect(get).toHaveBeenCalledWith(
            "/api/test",
            options
        );

        expect(data).toEqual({
            success: true,
        });
    });

    it("should configure a Bearer token", () => {
        const createSpy = vi.spyOn(axios, "create");

        const apiClient = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        };

        createSpy.mockReturnValue(apiClient);

        createApiClient({
            baseURL: "https://example.com",
            token: "test-token",
        });

        expect(
            apiClient.defaults?.headers?.common?.Authorization
        ).toBe("Bearer test-token");
    });

    it("should throw a normalized API error", async () => {
        const axiosError = {
            response: {
                status: 404,
                data: {
                    message: "User not found",
                },
            },
            message: "Request failed",
        };

        const get = vi.fn().mockRejectedValue(axiosError);

        vi.spyOn(axios, "create").mockReturnValue({
            get,
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        });

        const api = createApiClient({
            baseURL: "https://example.com",
        });

        try {
            await api.get("/users/999");
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("User not found");
            expect(error.status).toBe(404);
            expect(error.data).toEqual({
                message: "User not found",
            });
        }
    });
});


describe("getApiUrl", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("should continue supporting the old GET helper", async () => {
        const get = vi.fn().mockResolvedValue({
            data: {
                id: 1,
                name: "Test User",
            },
        });

        vi.spyOn(axios, "create").mockReturnValue({
            get,
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        });

        const data = await getApiUrl(
            "https://example.com/",
            "/api/users"
        );

        expect(get).toHaveBeenCalledWith(
            "/api/users",
            {}
        );

        expect(data).toEqual({
            id: 1,
            name: "Test User",
        });
    });

    it("should pass options through the old helper", async () => {
        const get = vi.fn().mockResolvedValue({
            data: {
                success: true,
            },
        });

        vi.spyOn(axios, "create").mockReturnValue({
            get,
            post: vi.fn(),
            put: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
        });

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

        expect(get).toHaveBeenCalledWith(
            "/api/test",
            options
        );

        expect(data).toEqual({
            success: true,
        });
    });
});
