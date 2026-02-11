import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from './page';

// Mock auth
const mockResetPassword = jest.fn();
jest.mock('@/lib/auth', () => ({
    useAuth: () => ({
        resetPassword: mockResetPassword,
    }),
}));

// Mock CSS module
jest.mock('@/styles/auth.module.css', () => new Proxy({}, { get: (_, name) => name }));

// Mock Icons
jest.mock('@/components/ui/Icons', () => ({
    Email: () => <div data-testid="email-icon" />,
    ArrowRight: () => <div data-testid="arrow-icon" />,
    Check: () => <div data-testid="check-icon" />,
    X: () => <div data-testid="x-icon" />,
}));

// Mock LoadingSpinner
jest.mock('@/components/ui/LoadingSpinner', () => () => <div data-testid="spinner" />);

// React use() accepts thenables - use a pre-resolved thenable
function resolvedThenable<T>(value: T) {
    return {
        then(resolve: (v: T) => void) { resolve(value); },
        status: 'fulfilled',
        value,
    } as unknown as Promise<T>;
}

describe('ForgotPasswordPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders forgot password form with email field', () => {
        render(<ForgotPasswordPage params={resolvedThenable({ lang: 'en' })} />);

        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByText('Send Reset Link')).toBeInTheDocument();
    });

    it('renders Arabic labels when lang is ar', () => {
        render(<ForgotPasswordPage params={resolvedThenable({ lang: 'ar' })} />);

        expect(screen.getByText('نسيت كلمة المرور؟')).toBeInTheDocument();
        expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
        expect(screen.getByText('إرسال رابط إعادة التعيين')).toBeInTheDocument();
    });

    it('calls resetPassword with email on submit', async () => {
        mockResetPassword.mockResolvedValue({ error: null });
        render(<ForgotPasswordPage params={resolvedThenable({ lang: 'en' })} />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@test.com' } });
        fireEvent.submit(screen.getByLabelText('Email').closest('form')!);

        await waitFor(() => {
            expect(mockResetPassword).toHaveBeenCalledWith('user@test.com');
        });
    });

    it('shows error on failed reset', async () => {
        mockResetPassword.mockResolvedValue({ error: { message: 'User not found' } });
        render(<ForgotPasswordPage params={resolvedThenable({ lang: 'en' })} />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bad@test.com' } });
        fireEvent.submit(screen.getByLabelText('Email').closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('User not found')).toBeInTheDocument();
        });
    });

    it('has a back to login link', () => {
        render(<ForgotPasswordPage params={resolvedThenable({ lang: 'en' })} />);

        const backLink = screen.getByText(/Back to Sign In/i);
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/en/auth/login');
    });
});
