import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

// Mock auth - functions must be defined before jest.mock
const mockSignIn = jest.fn();
const mockSignInWithGoogle = jest.fn();
jest.mock('@/lib/auth', () => ({
    useAuth: () => ({
        signIn: mockSignIn,
        signInWithGoogle: mockSignInWithGoogle,
    }),
}));

// Mock CSS module
jest.mock('@/styles/auth.module.css', () => new Proxy({}, { get: (_, name) => name }));

// Mock Icons
jest.mock('@/components/ui/Icons', () => ({
    Email: () => <div data-testid="email-icon" />,
    Lock: () => <div data-testid="lock-icon" />,
    Eye: () => <div data-testid="eye-icon" />,
    ArrowRight: () => <div data-testid="arrow-icon" />,
    X: () => <div data-testid="x-icon" />,
}));

// Mock LoadingSpinner
jest.mock('@/components/ui/LoadingSpinner', () => () => <div data-testid="spinner" />);

// React use() accepts thenables - use a pre-resolved thenable instead of Promise
// so it resolves synchronously in the JSDOM test environment
function resolvedThenable<T>(value: T) {
    return {
        then(resolve: (v: T) => void) {
            resolve(value);
        },
        status: 'fulfilled',
        value,
    } as unknown as Promise<T>;
}

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form with email and password fields', () => {
        render(<LoginPage params={resolvedThenable({ lang: 'en' })} />);

        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('renders Arabic labels when lang is ar', () => {
        render(<LoginPage params={resolvedThenable({ lang: 'ar' })} />);

        expect(screen.getByText('مرحباً بعودتك')).toBeInTheDocument();
        expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
        expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
    });

    it('calls signIn with email and password on submit', async () => {
        mockSignIn.mockResolvedValue({ error: null });
        render(<LoginPage params={resolvedThenable({ lang: 'en' })} />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@test.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.submit(screen.getByLabelText('Email').closest('form')!);

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('user@test.com', 'password123');
        });
    });

    it('shows error message on failed sign in', async () => {
        mockSignIn.mockResolvedValue({ error: { message: 'Invalid credentials' } });
        render(<LoginPage params={resolvedThenable({ lang: 'en' })} />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bad@test.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
        fireEvent.submit(screen.getByLabelText('Email').closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('has a link to forgot password page', () => {
        render(<LoginPage params={resolvedThenable({ lang: 'en' })} />);

        const forgotLink = screen.getByText('Forgot password?');
        expect(forgotLink).toBeInTheDocument();
        expect(forgotLink.closest('a')).toHaveAttribute('href', '/en/auth/forgot-password');
    });

    it('has a link to signup page', () => {
        render(<LoginPage params={resolvedThenable({ lang: 'en' })} />);

        const signupLink = screen.getByText('Sign up');
        expect(signupLink).toBeInTheDocument();
        expect(signupLink.closest('a')).toHaveAttribute('href', '/en/auth/signup');
    });

    it('has Google sign-in button', () => {
        render(<LoginPage params={resolvedThenable({ lang: 'en' })} />);

        expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });
});
