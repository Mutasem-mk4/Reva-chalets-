/**
 * @jest-environment node
 */
import { middleware } from '@/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Mock updateSession
jest.mock('@/lib/supabase/middleware', () => ({
    updateSession: jest.fn()
}));

// Mock NextResponse
jest.mock('next/server', () => {
    const original = jest.requireActual('next/server');
    return {
        ...original,
        NextResponse: {
            ...original.NextResponse,
            redirect: jest.fn().mockImplementation((url) => ({ status: 307, url: url.toString() })),
            next: jest.fn().mockImplementation(() => ({ status: 200 }))
        }
    };
});

describe('Middleware Security Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should allow public paths', async () => {
        const req = new NextRequest('http://localhost:3000/en/login');
        await middleware(req);
        // Should call updateSession (which calls next) OR just next if logic differs
        // In our code: public paths (like /_next) return next().
        // /en/login falls through to updateSession.
        expect(updateSession).toHaveBeenCalled();
    });

    it('should handle missing locale', async () => {
        const req = new NextRequest('http://localhost:3000/dashboard');
        // This hits "pathnameIsMissingLocale"
        await middleware(req);

        const redirectCall = (NextResponse.redirect as jest.Mock).mock.calls[0];
        const redirectUrl = redirectCall[0]; // The URL object
        expect(redirectUrl.toString()).toContain('/en/dashboard');
    });

    // Validating updateSession logic requires mocking what updateSession does.
    // Since we mocked updateSession to just be a spy, we verify middleware delegates to it for protected routes.
    it('should delegate to updateSession for dashboard routes', async () => {
        const req = new NextRequest('http://localhost:3000/en/dashboard');
        await middleware(req);
        expect(updateSession).toHaveBeenCalled();
    });
});
