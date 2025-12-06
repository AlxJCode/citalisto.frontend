// Test session management (session.ts)

import { getSession, isAuthenticated, requireAuth } from "../../src/lib/auth";
import { logTestStart, logSuccess, logError, logInfo, logSection, sleep } from "./helpers";

export async function testSessionManagement() {
    logSection("Testing Session Management (session.ts)");

    // Test 1: Get Session (will be null without login)
    try {
        logTestStart("Test 1: getSession()");

        const session = await getSession();

        if (session) {
            logSuccess("Session retrieved!");
            logInfo("User ID", session.id);
            logInfo("Username", session.username);
            logInfo("Email", session.email);
            logInfo("Role", session.roleDisplay);
        } else {
            logInfo("No active session", "null (expected if not logged in)");
        }
    } catch (error: any) {
        logError("Failed to get session", error);
    }

    await sleep(1000);

    // Test 2: Is Authenticated
    try {
        logTestStart("Test 2: isAuthenticated()");

        const isAuth = await isAuthenticated();

        logInfo("Is Authenticated", isAuth);

        if (isAuth) {
            logSuccess("User is authenticated!");
        } else {
            logInfo("User is NOT authenticated", "(expected if not logged in)");
        }
    } catch (error: any) {
        logError("Failed to check authentication", error);
    }

    await sleep(1000);

    // Test 3: Require Auth (will throw if not authenticated)
    try {
        logTestStart("Test 3: requireAuth()");

        const user = await requireAuth();

        logSuccess("User is authenticated!");
        logInfo("User ID", user.id);
        logInfo("Username", user.username);
    } catch (error: any) {
        logInfo("Expected Error (not authenticated)", error.message);
    }
}
