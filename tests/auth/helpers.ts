// Test helpers for auth tests

export function logTestStart(testName: string) {
    console.log(`\n${"=".repeat(70)}`);
    console.log(`🧪 ${testName}`);
    console.log(`${"=".repeat(70)}`);
}

export function logSuccess(message: string, data?: any) {
    console.log(`\n✅ SUCCESS: ${message}`);
    if (data) {
        console.log("   Data:", JSON.stringify(data, null, 2));
    }
}

export function logError(message: string, error?: any) {
    console.log(`\n❌ ERROR: ${message}`);
    if (error) {
        console.log("   Details:", error.message || error);
    }
}

export function logInfo(label: string, value: any) {
    console.log(`\n📋 ${label}:`, typeof value === "string" ? value : JSON.stringify(value, null, 2));
}

export function logSection(title: string) {
    console.log(`\n${"─".repeat(70)}`);
    console.log(`📦 ${title}`);
    console.log(`${"─".repeat(70)}`);
}

export function maskToken(token: string, showChars: number = 20): string {
    if (!token || token.length <= showChars) return token;
    return `${token.substring(0, showChars)}...`;
}

export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
