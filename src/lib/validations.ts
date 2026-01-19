import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// AUTH SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long')
        .regex(/[A-Za-z]/, 'Password must contain at least one letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z.enum(['USER', 'HOST']).default('USER'),
});

export const resetPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

// ═══════════════════════════════════════════════════════════════
// BOOKING SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const bookingSchema = z.object({
    chaletId: z.string().cuid('Invalid chalet ID'),
    startDate: z.string().datetime().or(z.date()),
    endDate: z.string().datetime().or(z.date()),
    guestName: z.string().min(2, 'Name is required').max(100),
    guestEmail: z.string().email('Valid email is required'),
    guestPhone: z.string().min(8, 'Valid phone number is required').max(20),
    guestCount: z.number().int().min(1).max(20),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
}, {
    message: 'Check-out date must be after check-in date',
    path: ['endDate'],
});

// ═══════════════════════════════════════════════════════════════
// REVIEW SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const reviewSchema = z.object({
    chaletId: z.string().cuid('Invalid chalet ID'),
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    comment: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review is too long'),
});

// ═══════════════════════════════════════════════════════════════
// CONTACT SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const contactSchema = z.object({
    name: z.string().min(2, 'Name is required').max(100),
    email: z.string().email('Valid email is required'),
    subject: z.string().min(5, 'Subject is required').max(200),
    message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
});

// ═══════════════════════════════════════════════════════════════
// SANITIZATION HELPERS
// ═══════════════════════════════════════════════════════════════

export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove JS protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized = { ...obj };
    for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
            (sanitized as Record<string, unknown>)[key] = sanitizeInput(sanitized[key] as string);
        }
    }
    return sanitized;
}

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
