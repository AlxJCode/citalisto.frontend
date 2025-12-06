// Test login from browser using Playwright
const { chromium } = require('playwright');

async function testLoginInBrowser() {
    console.log('🌐 Starting browser test...\n');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Step 1: Navigate to login page
        console.log('📍 Step 1: Navigating to login page...');
        await page.goto('http://localhost:3000/login');
        await page.waitForLoadState('networkidle');
        console.log('✅ Login page loaded\n');

        // Step 2: Fill credentials
        console.log('📝 Step 2: Filling credentials...');
        await page.fill('input[name="email"]', 'citalisto_super_admin');
        await page.fill('input[name="password"]', 'O8X1d.VkJ0a&');
        console.log('✅ Credentials filled\n');

        // Step 3: Click login button
        console.log('🔘 Step 3: Clicking login button...');
        await page.click('button[type="submit"]');

        // Wait for navigation or error message
        await page.waitForTimeout(3000);

        // Check current URL
        const currentUrl = page.url();
        console.log('📍 Current URL:', currentUrl);

        // Check for success (redirect to panel)
        if (currentUrl.includes('/panel') || currentUrl === 'http://localhost:3000/') {
            console.log('\n✅ SUCCESS: Login successful! Redirected to:', currentUrl);

            // Check cookies
            const cookies = await context.cookies();
            const accessToken = cookies.find(c => c.name === 'access_token');
            const refreshToken = cookies.find(c => c.name === 'refresh_token');

            console.log('\n🍪 Cookies:');
            console.log('   - Access Token:', accessToken ? '✅ Present' : '❌ Missing');
            console.log('   - Refresh Token:', refreshToken ? '✅ Present' : '❌ Missing');
        } else {
            // Check for error message
            const errorMessage = await page.textContent('.ant-message-notice-content').catch(() => null);
            if (errorMessage) {
                console.log('\n❌ ERROR: Login failed');
                console.log('   Error message:', errorMessage);
            } else {
                console.log('\n⚠️  WARNING: Still on login page, no error message visible');
            }
        }

        // Keep browser open for inspection
        console.log('\n⏸️  Browser will stay open for 10 seconds for inspection...');
        await page.waitForTimeout(10000);

    } catch (error) {
        console.error('\n💥 Error during test:', error.message);
    } finally {
        await browser.close();
        console.log('\n🏁 Test completed');
    }
}

testLoginInBrowser();
