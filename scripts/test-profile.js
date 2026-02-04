
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to the guest profile page
    await page.goto('http://localhost:3000/en/guest/profile');

    // Check if the profile page element exists
    const profilePage = await page.$('.profile-page');

    if (profilePage) {
        console.log('Profile page loaded successfully.');
    } else {
        console.error('Failed to load profile page.');
    }

    await browser.close();
})();
