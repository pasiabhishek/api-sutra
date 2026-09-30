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


const mockAxiosClient = () => ({
  request: vi.fn(),

  defaults: {
    headers: {
      common: {},
    },
  },

  interceptors: {
    request: {
      use: vi.fn(),
    },

    response: {
      use: vi.fn(),
    },
  },
});


describe("createApiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });


  it("should require a base URL", () => {
    expect(() =>
      createApiClient()
    ).toThrow("Base URL is required.");
  });


  it("should require an API path", async () => {
    const api = createApiClient({
      baseURL: "https://example.com",
    });

    await expect(
      api.get("")
    ).rejects.toThrow(
      "API path is required."
    );
  });


  it("should create Axios client correctly", () => {
    const client = mockAxiosClient();

    const createSpy = vi
      .spyOn(axios, "create")
      .mockReturnValue(client);

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
    const client = mockAxiosClient();

    client.request.mockResolvedValue({
      data: {
        id: 1,
        name: "Test User",
      },
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    const data = await api.get("/users");

    expect(client.request).toHaveBeenCalledWith({
      method: "GET",
      url: "/users",
    });

    expect(data).toEqual({
      id: 1,
      name: "Test User",
    });
  });


  it("should normalize API paths", async () => {
    const client = mockAxiosClient();

    client.request.mockResolvedValue({
      data: {
        success: true,
      },
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    await api.get("///users");

    expect(client.request).toHaveBeenCalledWith({
      method: "GET",
      url: "/users",
    });
  });


  it("should make a POST request", async () => {
    const client = mockAxiosClient();

    client.request.mockResolvedValue({
      data: {
        id: 1,
        name: "Pasi",
      },
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

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

    expect(client.request).toHaveBeenCalledWith({
      method: "POST",
      url: "/users",
      data: user,
    });

    expect(data).toEqual({
      id: 1,
      name: "Pasi",
    });
  });


  it("should make a PUT request", async () => {
    const client = mockAxiosClient();

    client.request.mockResolvedValue({
      data: {
        success: true,
      },
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    const data = await api.put(
      "/users/1",
      {
        name: "Updated User",
      }
    );

    expect(client.request).toHaveBeenCalledWith({
      method: "PUT",
      url: "/users/1",
      data: {
        name: "Updated User",
      },
    });

    expect(data).toEqual({
      success: true,
    });
  });


  it("should make a PATCH request", async () => {
    const client = mockAxiosClient();

    client.request.mockResolvedValue({
      data: {
        success: true,
      },
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    const data = await api.patch(
      "/users/1",
      {
        name: "Pasi",
      }
    );

    expect(client.request).toHaveBeenCalledWith({
      method: "PATCH",
      url: "/users/1",
      data: {
        name: "Pasi",
      },
    });

    expect(data).toEqual({
      success: true,
    });
  });


  it("should make a DELETE request", async () => {
    const client = mockAxiosClient();

    client.request.mockResolvedValue({
      data: {
        success: true,
      },
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    const data = await api.delete(
      "/users/1"
    );

    expect(client.request).toHaveBeenCalledWith({
      method: "DELETE",
      url: "/users/1",
    });

    expect(data).toEqual({
      success: true,
    });
  });


  it("should pass Axios options correctly", async () => {
    const client = mockAxiosClient();

    client.request.mockResolvedValue({
      data: {
        success: true,
      },
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

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
      "/users",
      options
    );

    expect(client.request).toHaveBeenCalledWith({
      method: "GET",
      url: "/users",
      ...options,
    });

    expect(data).toEqual({
      success: true,
    });
  });


  it("should configure a Bearer token", () => {
    const client = mockAxiosClient();

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    createApiClient({
      baseURL: "https://example.com",
      token: "test-token",
    });

    expect(
      client.defaults.headers.common.Authorization
    ).toBe(
      "Bearer test-token"
    );
  });


  it("should update the token", () => {
    const client = mockAxiosClient();

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    api.setToken("new-token");

    expect(
      client.defaults.headers.common.Authorization
    ).toBe(
      "Bearer new-token"
    );
  });


  it("should clear the token", () => {
    const client = mockAxiosClient();

    client.defaults.headers.common.Authorization =
      "Bearer test-token";

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    api.clearToken();

    expect(
      client.defaults.headers.common.Authorization
    ).toBeUndefined();
  });


  it("should make a custom request", async () => {
    const client = mockAxiosClient();

    client.request.mockResolvedValue({
      data: {
        success: true,
      },
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    const data = await api.request({
      method: "GET",
      url: "/users",
    });

    expect(client.request).toHaveBeenCalledWith({
      method: "GET",
      url: "/users",
    });

    expect(data).toEqual({
      success: true,
    });
  });


  it("should support interceptors", () => {
    const client = mockAxiosClient();

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const requestInterceptor = vi.fn();
    const responseInterceptor = vi.fn();
    const errorInterceptor = vi.fn();

    createApiClient({
      baseURL: "https://example.com",
      interceptors: {
        request: requestInterceptor,
        response: responseInterceptor,
        error: errorInterceptor,
      },
    });

    expect(
      client.interceptors.request.use
    ).toHaveBeenCalledWith(
      requestInterceptor
    );

    expect(
      client.interceptors.response.use
    ).toHaveBeenCalledTimes(2);
  });


  it("should normalize API errors", async () => {
    const client = mockAxiosClient();

    client.request.mockRejectedValue({
      response: {
        status: 404,
        data: {
          message: "User not found",
        },
      },
      message: "Request failed",
      code: "ERR_BAD_REQUEST",
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    await expect(
      api.get("/users/999")
    ).rejects.toMatchObject({
      name: "ApiSutraError",
      message: "User not found",
      status: 404,
      data: {
        message: "User not found",
      },
      code: "ERR_BAD_REQUEST",
    });
  });


  it("should use the fallback error message", async () => {
    const client = mockAxiosClient();

    client.request.mockRejectedValue({
      message: "Network error",
      code: "ERR_NETWORK",
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    await expect(
      api.get("/users")
    ).rejects.toMatchObject({
      name: "ApiSutraError",
      message: "Network error",
      code: "ERR_NETWORK",
    });
  });


  it("should clear the token when setToken receives an empty value", () => {
    const client = mockAxiosClient();

    client.defaults.headers.common.Authorization =
      "Bearer old-token";

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const api = createApiClient({
      baseURL: "https://example.com",
    });

    api.setToken("");

    expect(
      client.defaults.headers.common.Authorization
    ).toBeUndefined();
  });
});


describe("getApiUrl", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });


  it("should continue supporting the old GET helper", async () => {
    const client = mockAxiosClient();

    client.request.mockResolvedValue({
      data: {
        id: 1,
        name: "Test User",
      },
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

    const data = await getApiUrl(
      "https://example.com/",
      "/api/users"
    );

    expect(client.request).toHaveBeenCalledWith({
      method: "GET",
      url: "/api/users",
    });

    expect(data).toEqual({
      id: 1,
      name: "Test User",
    });
  });


  it("should pass options through the old helper", async () => {
    const client = mockAxiosClient();

    client.request.mockResolvedValue({
      data: {
        success: true,
      },
    });

    vi.spyOn(axios, "create")
      .mockReturnValue(client);

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

    expect(client.request).toHaveBeenCalledWith({
      method: "GET",
      url: "/api/test",
      ...options,
    });

    expect(data).toEqual({
      success: true,
    });
  });
});