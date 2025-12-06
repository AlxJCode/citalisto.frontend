// Test auth.api.ts services

import { loginApi, getMeApi, refreshTokenApi, verifyTokenApi } from "../../src/features/auth/services/auth.api";
import { TEST_CREDENTIALS } from "./config";
import { logTestStart, logSuccess, logError, logInfo, logSection, maskToken, sleep } from "./helpers";

export async function testAuthApiServices() {
    logSection("Testing Auth API Services (auth.api.ts)");

    let accessToken = "";
    let refreshToken = "";

    // Test 1: Login with valid credentials
    try {
        logTestStart("Test 1: loginApi() with VALID credentials");
        logInfo("Credentials", TEST_CREDENTIALS.valid);

        const tokens = await loginApi(TEST_CREDENTIALS.valid);

        logSuccess("Login successful!");
        logInfo("Access Token", maskToken(tokens.access));
        logInfo("Refresh Token", maskToken(tokens.refresh));

        accessToken = tokens.access;
        refreshToken = tokens.refresh;
    } catch (error: any) {
        logError("Login failed", error);
    }

    await sleep(1000);

    // Test 2: Login with invalid credentials
    try {
        logTestStart("Test 2: loginApi() with INVALID credentials");
        logInfo("Credentials", TEST_CREDENTIALS.invalid);

        await loginApi(TEST_CREDENTIALS.invalid);

        logError("Should have thrown an error but didn't!");
    } catch (error: any) {
        logSuccess("Error handled correctly!");
        logInfo("Error Message", error.message);
    }

    await sleep(1000);

    // Test 3: Get user info with valid token
    if (accessToken) {
        try {
            logTestStart("Test 3: getMeApi() with valid access token");

            const user = await getMeApi(accessToken);

            logSuccess("User info retrieved!");
            logInfo("User ID", user.id);
            logInfo("Username", user.username);
            logInfo("Email", user.email);
            logInfo("Full Name", `${user.firstName} ${user.lastName}`);
            logInfo("Role", user.roleDisplay);
            logInfo("Business", user.businessModel?.name || "N/A");
        } catch (error: any) {
            logError("Failed to get user info", error);
        }

        await sleep(1000);
    }

    // Test 4: Verify token
    if (accessToken) {
        try {
            logTestStart("Test 4: verifyTokenApi() with valid token");

            const isValid = await verifyTokenApi(accessToken);

            if (isValid) {
                logSuccess("Token is valid!");
            } else {
                logError("Token is invalid!");
            }
        } catch (error: any) {
            logError("Token verification failed", error);
        }

        await sleep(1000);
    }

    // Test 5: Verify invalid token
    try {
        logTestStart("Test 5: verifyTokenApi() with INVALID token");

        const isValid = await verifyTokenApi("invalid_token_123");

        if (!isValid) {
            logSuccess("Invalid token correctly identified as invalid!");
        } else {
            logError("Invalid token was considered valid!");
        }
    } catch (error: any) {
        logError("Token verification failed", error);
    }

    await sleep(1000);

    // Test 6: Refresh token
    if (refreshToken) {
        try {
            logTestStart("Test 6: refreshTokenApi() with valid refresh token");

            const newTokens = await refreshTokenApi(refreshToken);

            logSuccess("Tokens refreshed!");
            logInfo("New Access Token", maskToken(newTokens.access));
            logInfo("New Refresh Token", maskToken(newTokens.refresh));
        } catch (error: any) {
            logError("Failed to refresh token", error);
        }
    }
}
