// Test auth.actions.ts Server Actions

import { loginAction, logoutAction, refreshTokenAction } from "../../src/features/auth/actions/auth.actions";
import { TEST_CREDENTIALS } from "./config";
import { logTestStart, logSuccess, logError, logInfo, logSection, sleep } from "./helpers";

export async function testAuthActions() {
    logSection("Testing Auth Server Actions (auth.actions.ts)");

    // Test 1: Login Action with valid credentials
    try {
        logTestStart("Test 1: loginAction() with VALID credentials");
        logInfo("Credentials", TEST_CREDENTIALS.valid);

        const result = await loginAction(TEST_CREDENTIALS.valid);

        if (result.success) {
            logSuccess("Login action successful!");
            logInfo("Message", result.message);
        } else {
            logError("Login action failed", result.error);
        }
    } catch (error: any) {
        logError("Login action threw exception", error);
    }

    await sleep(1000);

    // Test 2: Login Action with invalid credentials
    try {
        logTestStart("Test 2: loginAction() with INVALID credentials");
        logInfo("Credentials", TEST_CREDENTIALS.invalid);

        const result = await loginAction(TEST_CREDENTIALS.invalid);

        if (!result.success) {
            logSuccess("Error handled correctly in action!");
            logInfo("Error Message", result.error);
        } else {
            logError("Should have failed but succeeded!");
        }
    } catch (error: any) {
        logError("Login action threw exception", error);
    }

    await sleep(1000);

    // Test 3: Logout Action
    try {
        logTestStart("Test 3: logoutAction()");

        // Note: logoutAction() returns void and redirects
        await logoutAction();

        logSuccess("Logout action called successfully (redirects to /login)");
    } catch (error: any) {
        logError("Logout action threw exception", error);
    }

    await sleep(1000);

    // Test 4: Refresh Token Action (will likely fail without active session)
    try {
        logTestStart("Test 4: refreshTokenAction()");

        const result = await refreshTokenAction();

        if (result.success) {
            logSuccess("Refresh token action successful!");
            logInfo("Message", result.message);
        } else {
            logInfo("Expected Error (no refresh token)", result.error);
        }
    } catch (error: any) {
        logError("Refresh token action threw exception", error);
    }
}
