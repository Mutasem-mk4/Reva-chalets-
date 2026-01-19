'use client';

import { use } from 'react';
import { getDictionary } from '@/lib/dictionaries';

export default function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const dict = getDictionary(lang);

    return (
        <div className="legal-page container">
            <h1>Terms of Service</h1>
            <p className="updated">Last updated: January 2026</p>

            <section>
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using Reva Chalets ("the Service"), you agree to be bound by these Terms of Service.
                    If you do not agree to these terms, please do not use our services.
                </p>
            </section>

            <section>
                <h2>2. Booking & Reservations</h2>
                <p>
                    All bookings are subject to availability. A reservation is only confirmed once you receive a
                    confirmation email from Reva Chalets. We reserve the right to cancel bookings under exceptional circumstances.
                </p>
            </section>

            <section>
                <h2>3. Payment Terms</h2>
                <p>
                    Payment is required at the time of booking. We accept major credit cards and CliQ instant payments.
                    All prices are displayed in Jordanian Dinars (JOD) and include applicable taxes.
                </p>
            </section>

            <section>
                <h2>4. Cancellation Policy</h2>
                <p>
                    Free cancellation is available up to 48 hours before your check-in date. Cancellations made within
                    48 hours of check-in may incur a fee of one night's stay. No-shows will be charged the full booking amount.
                </p>
            </section>

            <section>
                <h2>5. Guest Responsibilities</h2>
                <p>
                    Guests are responsible for any damage caused to the property during their stay. Smoking is prohibited
                    inside all chalets. Quiet hours are from 10 PM to 8 AM.
                </p>
            </section>

            <section>
                <h2>6. Limitation of Liability</h2>
                <p>
                    Reva Chalets shall not be liable for any indirect, incidental, or consequential damages arising
                    from the use of our services. Our total liability shall not exceed the amount paid for your booking.
                </p>
            </section>

            <section>
                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact us at{' '}
                    <a href="mailto:legal@revachalets.com">legal@revachalets.com</a>.
                </p>
            </section>

            <style jsx>{`
        .legal-page {
          padding: 4rem 1rem;
          max-width: 800px;
        }

        h1 {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: hsl(var(--primary));
        }

        .updated {
          color: hsl(var(--muted-foreground));
          margin-bottom: 3rem;
          font-size: 0.9rem;
        }

        section {
          margin-bottom: 2.5rem;
        }

        h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
        }

        p {
          line-height: 1.8;
          color: hsl(var(--muted-foreground));
        }

        a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
}
