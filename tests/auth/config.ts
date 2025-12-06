// Test configuration for auth tests

export const TEST_CREDENTIALS = {
    valid: {
        username: "ccc",
        password: "xxx",
    },
    invalid: {
        username: "usuario_invalido_123",
        password: "password_incorrecta_456",
    },
};

export const API_BASE_URL = "https://www.citalistoapi.iveltech.com";

export const ENDPOINTS = {
    token: "/api/v1/auth/token/",
    me: "/api/v1/auth/me/",
    refresh: "/api/v1/auth/token/refresh/",
    verify: "/api/v1/auth/token/verify/",
};
