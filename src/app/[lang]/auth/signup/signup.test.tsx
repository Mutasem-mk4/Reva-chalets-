import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from './page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

// Mock auth
const mockSignUp = jest.fn();
jest.mock('@/lib/auth', () => ({
    useAuth: () => ({
        signUp: mockSignUp,
    }),
}));

// Mock CSS module
jest.mock('@/styles/auth.module.css', () => new Proxy({}, { get: (_, name) => name }));

// Mock Icons
jest.mock('@/components/ui/Icons', () => ({
    Email: () => <div data-testid="email-icon" />,
    Lock: () => <div data-testid="lock-icon" />,
    User: () => <div data-testid="user-icon" />,
    Eye: () => <div data-testid="eye-icon" />,
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

describe('SignupPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders signup form with name, email, password fields', () => {
        render(<SignupPage params={resolvedThenable({ lang: 'en' })} />);

        expect(screen.getAllByText('Create Account').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders Arabic labels when lang is ar', () => {
        render(<SignupPage params={resolvedThenable({ lang: 'ar' })} />);

        expect(screen.getByText('إنشاء حساب')).toBeInTheDocument();
        expect(screen.getByLabelText('الاسم الكامل')).toBeInTheDocument();
        expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
        expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
    });

    it('shows role selector with User and Host options', () => {
        render(<SignupPage params={resolvedThenable({ lang: 'en' })} />);

        expect(screen.getByText('Book Chalets')).toBeInTheDocument();
        expect(screen.getByText('List My Property')).toBeInTheDocument();
    });

    it('calls signUp with correct data on submit', async () => {
        mockSignUp.mockResolvedValue({ error: null });
        render(<SignupPage params={resolvedThenable({ lang: 'en' })} />);

        fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Ahmad' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ahmad@test.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123456' } });
        fireEvent.submit(screen.getByLabelText('Email').closest('form')!);

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith('ahmad@test.com', 'pass123456', { name: 'Ahmad', role: 'USER' });
        });
    });

    it('shows error message on failed signup', async () => {
        mockSignUp.mockResolvedValue({ error: { message: 'Email already exists' } });
        render(<SignupPage params={resolvedThenable({ lang: 'en' })} />);

        fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'exists@test.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123456' } });
        fireEvent.submit(screen.getByLabelText('Email').closest('form')!);

        await waitFor(() => {
            expect(screen.getByText('Email already exists')).toBeInTheDocument();
        });
    });

    it('has a link to login page', () => {
        render(<SignupPage params={resolvedThenable({ lang: 'en' })} />);

        const loginLink = screen.getByText('Sign in');
        expect(loginLink).toBeInTheDocument();
        expect(loginLink.closest('a')).toHaveAttribute('href', '/en/auth/login');
    });
});
