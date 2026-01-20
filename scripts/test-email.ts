import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const key = process.env.RESEND_API_KEY;

console.log('--- Email Diagnosis Tool ---');
console.log(`Checking API Key... ${key ? 'Found' : 'MISSING'}`);

if (!key) {
    console.error('ERROR: RESEND_API_KEY is missing in .env file');
    process.exit(1);
}

const resend = new Resend(key);

async function testSend() {
    // Get the email from arguments or default to a dummy one to trigger error
    const testEmail = process.argv[2];

    if (!testEmail) {
        console.log('\nUsage: npx tsx src/scripts/test-email.ts <your-email@example.com>');
        console.log('Please provide the email address you want to test with.');
        return;
    }

    console.log(`\nAttempting to send test email to: ${testEmail}`);
    console.log('Using sender: onboarding@resend.dev');

    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: testEmail,
            subject: 'Reva Chalets Test Email 🧪',
            html: '<h1>It Works!</h1><p>If you see this, your email configuration is correct.</p>',
        });

        console.log('\n✅ Success! Response from Resend:');
        console.dir(data, { depth: null });

        if (data.error) {
            console.error('\n⚠️  Wait, Resend returned an error object:');
            console.error(data.error);
        } else {
            console.log('\n👉 Check your inbox (and spam folder) now.');
        }

    } catch (error) {
        console.error('\n❌ FAILED to send email.');
        console.error('Error Details:');
        console.error(error);

        console.log('\n--- Common Solutions ---');
        console.log('1. "validation_error": You can only send to YOUR OWN email address in Resend Sandbox mode.');
        console.log('2. "missing_api_key": Check your .env file.');
        console.log('3. "restricted_domain": Ensure you use onboarding@resend.dev');
    }
}

testSend();
