import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender
const FROM_EMAIL = process.env.FROM_EMAIL || 'Reva Chalets <onboarding@resend.dev>';

// ═══════════════════════════════════════════════════════════════
// EMAIL TYPES
// ═══════════════════════════════════════════════════════════════

export interface BookingConfirmationData {
    to: string;
    guestName: string;
    chaletName: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    guestCount: number;
    totalPrice: number;
    bookingId: string;
}

export interface WelcomeEmailData {
    to: string;
    name: string;
    role: 'USER' | 'HOST';
}

export interface PasswordResetData {
    to: string;
    name: string;
    resetLink: string;
}

export interface DiscountEmailData {
    to: string;
    code: string;
}

// ... existing interfaces ...

// ═══════════════════════════════════════════════════════════════
// EMAIL FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function sendDiscountEmail(data: DiscountEmailData) {
    const { to, code } = data;

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `Your Exclusive Gift: 10% Off Reva Chalets 🎁`,
            html: getDiscountTemplate({ code }),
        });

        console.log('Discount email sent:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to send discount email:', error);
        return { success: false, error };
    }
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
    const { to, guestName, chaletName, checkIn, checkOut, nights, guestCount, totalPrice, bookingId } = data;

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `Booking Confirmed - ${chaletName}`,
            html: getBookingConfirmationTemplate({
                guestName,
                chaletName,
                checkIn,
                checkOut,
                nights,
                guestCount,
                totalPrice,
                bookingId,
            }),
        });

        console.log('Booking confirmation sent:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to send booking confirmation:', error);
        return { success: false, error };
    }
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
    const { to, name, role } = data;

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `Welcome to Reva Chalets!`,
            html: getWelcomeTemplate({ name, role }),
        });

        console.log('Welcome email sent:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to send welcome email:', error);
        return { success: false, error };
    }
}

export async function sendPasswordResetEmail(data: PasswordResetData) {
    const { to, name, resetLink } = data;

    try {
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `Reset Your Password - Reva Chalets`,
            html: getPasswordResetTemplate({ name, resetLink }),
        });

        console.log('Password reset email sent:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        return { success: false, error };
    }
}

// ═══════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════

function getBaseTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reva Chalets</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a1628; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-width: 100%;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f2847; border-radius: 16px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 40px; text-align: center; background: linear-gradient(135deg, #c9a55c 0%, #e8c87f 100%);">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #0a1628; font-family: Georgia, serif;">
                                Reva Chalets
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background-color: #081020; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #8b9bb3;">
                                © 2026 Reva Chalets. All rights reserved.
                            </p>
                            <p style="margin: 10px 0 0; font-size: 12px; color: #8b9bb3;">
                                Luxury Chalets in Jordan
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

function getBookingConfirmationTemplate(data: {
    guestName: string;
    chaletName: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    guestCount: number;
    totalPrice: number;
    bookingId: string;
}): string {
    return getBaseTemplate(`
        <h2 style="margin: 0 0 20px; font-size: 24px; color: #c9a55c;">Booking Confirmed! ✓</h2>
        
        <p style="margin: 0 0 20px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            Dear ${data.guestName},
        </p>
        
        <p style="margin: 0 0 30px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            Your booking has been confirmed. Here are your reservation details:
        </p>
        
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a3a5c; border-radius: 12px; margin-bottom: 30px;">
            <tr>
                <td style="padding: 25px;">
                    <h3 style="margin: 0 0 15px; font-size: 20px; color: #c9a55c;">${data.chaletName}</h3>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                            <td style="padding: 8px 0; color: #8b9bb3; font-size: 14px;">Check-in</td>
                            <td style="padding: 8px 0; color: #e2e8f0; font-size: 14px; text-align: right; font-weight: 600;">${data.checkIn}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #8b9bb3; font-size: 14px;">Check-out</td>
                            <td style="padding: 8px 0; color: #e2e8f0; font-size: 14px; text-align: right; font-weight: 600;">${data.checkOut}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #8b9bb3; font-size: 14px;">Nights</td>
                            <td style="padding: 8px 0; color: #e2e8f0; font-size: 14px; text-align: right; font-weight: 600;">${data.nights}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #8b9bb3; font-size: 14px;">Guests</td>
                            <td style="padding: 8px 0; color: #e2e8f0; font-size: 14px; text-align: right; font-weight: 600;">${data.guestCount}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding-top: 15px; border-top: 1px solid #2a4a6c;"></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #e2e8f0; font-size: 16px; font-weight: 600;">Total</td>
                            <td style="padding: 8px 0; color: #c9a55c; font-size: 18px; text-align: right; font-weight: 700;">${data.totalPrice} JOD</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
        <p style="margin: 0 0 10px; font-size: 14px; color: #8b9bb3;">
            Booking ID: <span style="color: #e2e8f0;">${data.bookingId}</span>
        </p>
        
        <p style="margin: 20px 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            We look forward to hosting you!
        </p>
        
        <a href="https://revachalets.com/bookings/${data.bookingId}" 
           style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #c9a55c 0%, #e8c87f 100%); color: #0a1628; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px;">
            View Booking Details
        </a>
    `);
}

function getWelcomeTemplate(data: { name: string; role: 'USER' | 'HOST' }): string {
    const isHost = data.role === 'HOST';

    return getBaseTemplate(`
        <h2 style="margin: 0 0 20px; font-size: 24px; color: #c9a55c;">Welcome to Reva Chalets! 🏡</h2>
        
        <p style="margin: 0 0 20px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            Hi ${data.name},
        </p>
        
        <p style="margin: 0 0 20px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            Thank you for joining Reva Chalets! ${isHost
            ? 'We\'re excited to have you as a property host.'
            : 'We\'re thrilled to have you as part of our community.'}
        </p>
        
        <p style="margin: 0 0 30px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            ${isHost
            ? 'Start listing your properties and reach guests from around the world.'
            : 'Explore our luxury chalets across Jordan and find your perfect getaway.'}
        </p>
        
        <a href="https://revachalets.com${isHost ? '/dashboard/chalets' : '/chalets'}" 
           style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #c9a55c 0%, #e8c87f 100%); color: #0a1628; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px;">
            ${isHost ? 'Add Your First Chalet' : 'Browse Chalets'}
        </a>
        
        <p style="margin: 30px 0 0; font-size: 14px; color: #8b9bb3;">
            If you have any questions, our support team is here to help.
        </p>
    `);
}

function getPasswordResetTemplate(data: { name: string; resetLink: string }): string {
    return getBaseTemplate(`
        <h2 style="margin: 0 0 20px; font-size: 24px; color: #c9a55c;">Reset Your Password</h2>
        
        <p style="margin: 0 0 20px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            Hi ${data.name},
        </p>
        
        <p style="margin: 0 0 20px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password:
        </p>
        
        <a href="${data.resetLink}" 
           style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #c9a55c 0%, #e8c87f 100%); color: #0a1628; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px; margin: 10px 0 30px;">
            Reset Password
        </a>
        
        <p style="margin: 0 0 10px; font-size: 14px; color: #8b9bb3;">
            This link will expire in 1 hour.
        </p>
        
        <p style="margin: 0; font-size: 14px; color: #8b9bb3;">
            If you didn't request a password reset, you can safely ignore this email.
        </p>
    `);
}

function getDiscountTemplate(data: { code: string }): string {
    return getBaseTemplate(`
        <h2 style="margin: 0 0 20px; font-size: 24px; color: #c9a55c;">Here is your 10% Discount! 🎉</h2>
        
        <p style="margin: 0 0 20px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            Thank you for subscribing to Reva Chalets! We're thrilled to offer you an exclusive discount on your first booking.
        </p>

        <div style="background-color: #1a3a5c; border: 1px dashed #c9a55c; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #8b9bb3; text-transform: uppercase; letter-spacing: 1px;">Use Code at Checkout</p>
            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #c9a55c; letter-spacing: 2px;">${data.code}</p>
        </div>
        
        <p style="margin: 0 0 30px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            This code is valid for any chalet booking made within the next 30 days. Don't miss out on your perfect luxury getaway!
        </p>
        
        <a href="https://revachalets.com/chalets" 
           style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #c9a55c 0%, #e8c87f 100%); color: #0a1628; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px;">
            Find Your Chalet
        </a>
    `);
}

export default resend;
