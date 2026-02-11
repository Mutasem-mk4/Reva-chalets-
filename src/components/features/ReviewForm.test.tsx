import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewForm from './ReviewForm';
import { hasCompletedStayAt } from '@/lib/bookingVerification';

// Mock dependencies
jest.mock('@/lib/bookingVerification', () => ({
    hasCompletedStayAt: jest.fn(),
    getCompletedStaysAt: jest.fn(() => []),
    createMockBooking: jest.fn(),
}));

jest.mock('@/components/ui/Icons', () => ({
    Sparkles: () => <div data-testid="sparkles-icon" />,
    Check: () => <div data-testid="check-icon" />,
    Lock: () => <div data-testid="lock-icon" />,
    StarFilled: () => <div data-testid="star-filled-icon" />,
    Star: () => <div data-testid="star-icon" />,
}));

describe('ReviewForm', () => {
    const defaultProps = {
        chaletId: 'chalet-123',
        chaletName: 'Luxury Chalet',
        locale: 'en'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show locked state if user has not completed a stay', async () => {
        (hasCompletedStayAt as jest.Mock).mockReturnValue(false);

        render(<ReviewForm {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText(/Verified Guests Only/i)).toBeInTheDocument();
            expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
        });
    });

    it('should show form if user is verified', async () => {
        (hasCompletedStayAt as jest.Mock).mockReturnValue(true);

        render(<ReviewForm {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText(/Write a Review/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Share your experience/i)).toBeInTheDocument();
        });
    });

    it('should update stars on click', async () => {
        (hasCompletedStayAt as jest.Mock).mockReturnValue(true);

        render(<ReviewForm {...defaultProps} />);

        await waitFor(() => {
            const starButtons = screen.getAllByRole('button').filter(btn => !btn.classList.contains('submit-btn'));
            fireEvent.click(starButtons[2]); // 3rd star
        });

        // Verify filled stars
        const filledStars = screen.getAllByTestId('star-filled-icon');
        expect(filledStars.length).toBe(3);
    });

    it('should submitt form successfully', async () => {
        (hasCompletedStayAt as jest.Mock).mockReturnValue(true);
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 'review-1' }),
            })
        );

        render(<ReviewForm {...defaultProps} />);

        await waitFor(() => {
            const textarea = screen.getByPlaceholderText(/Share your experience/i);
            fireEvent.change(textarea, { target: { value: 'Amazing experience!' } });

            const starButtons = screen.getAllByRole('button');
            fireEvent.click(starButtons[4]); // 5th star

            const submitBtn = screen.getByText(/Submit Verified Review/i);
            fireEvent.click(submitBtn);
        });

        await waitFor(() => {
            expect(screen.getByText(/Thank you!/i)).toBeInTheDocument();
            expect(screen.getByText(/Your verified review has been submitted/i)).toBeInTheDocument();
        });
    });
});
