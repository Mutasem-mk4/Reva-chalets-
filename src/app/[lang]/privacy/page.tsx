'use client';

import { use } from 'react';
import { getDictionary } from '@/lib/dictionaries';

export default function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const dict = getDictionary(lang);

    return (
        <div className="legal-page container">
            <h1>Privacy Policy</h1>
            <p className="updated">Last updated: January 2026</p>

            <section>
                <h2>1. Information We Collect</h2>
                <p>
                    We collect information you provide directly, including your name, email address, phone number,
                    and payment information when you make a booking. We also collect usage data through cookies and analytics.
                </p>
            </section>

            <section>
                <h2>2. How We Use Your Information</h2>
                <p>
                    Your information is used to process bookings, send confirmation emails, provide customer support,
                    and improve our services. We may also send you promotional offers if you opt in to our newsletter.
                </p>
            </section>

            <section>
                <h2>3. Data Security</h2>
                <p>
                    We implement industry-standard security measures including 256-bit SSL encryption for all data
                    transmissions. Your payment information is processed securely through our payment partners and
                    is never stored on our servers.
                </p>
            </section>

            <section>
                <h2>4. Third-Party Services</h2>
                <p>
                    We use trusted third-party services for payment processing (Stripe, CliQ) and analytics (Google Analytics).
                    These services have their own privacy policies governing how they handle your data.
                </p>
            </section>

            <section>
                <h2>5. Your Rights</h2>
                <p>
                    You have the right to access, correct, or delete your personal data. You can also opt out of
                    marketing communications at any time. To exercise these rights, contact us at{' '}
                    <a href="mailto:privacy@revachalets.com">privacy@revachalets.com</a>.
                </p>
            </section>

            <section>
                <h2>6. Cookies</h2>
                <p>
                    We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic.
                    You can control cookie settings through your browser preferences.
                </p>
            </section>

            <section>
                <h2>7. Contact Us</h2>
                <p>
                    For any privacy-related questions or concerns, please contact our Data Protection Officer at{' '}
                    <a href="mailto:privacy@revachalets.com">privacy@revachalets.com</a>.
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
