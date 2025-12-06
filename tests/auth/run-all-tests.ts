// Run all auth tests

import { testAuthApiServices } from "./test-api";
import { testAuthActions } from "./test-actions";
import { testSessionManagement } from "./test-session";

async function runAllTests() {
    console.log("\n");
    console.log("╔" + "═".repeat(68) + "╗");
    console.log("║" + " ".repeat(15) + "🚀 CITALISTO AUTH TEST SUITE" + " ".repeat(24) + "║");
    console.log("╚" + "═".repeat(68) + "╝");
    console.log("\n");

    try {
        // Test 1: API Services
        await testAuthApiServices();

        console.log("\n\n");

        // Test 2: Server Actions
        await testAuthActions();

        console.log("\n\n");

        // Test 3: Session Management
        await testSessionManagement();

        console.log("\n");
        console.log("╔" + "═".repeat(68) + "╗");
        console.log("║" + " ".repeat(20) + "✅ ALL TESTS COMPLETED" + " ".repeat(24) + "║");
        console.log("╚" + "═".repeat(68) + "╝");
        console.log("\n");
    } catch (error: any) {
        console.log("\n");
        console.log("╔" + "═".repeat(68) + "╗");
        console.log("║" + " ".repeat(18) + "💥 TESTS FAILED WITH ERROR" + " ".repeat(22) + "║");
        console.log("╚" + "═".repeat(68) + "╝");
        console.error("\nError:", error);
        console.log("\n");
    }
}

runAllTests();
