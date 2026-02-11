'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
    const pathname = usePathname();
    const locale = pathname?.startsWith('/en') ? 'en' : 'ar';

    return (
        <div className="not-found">
            <div className="container">
                <div className="content">
                    <div className="error-code">404</div>
                    <h1>{locale === 'ar' ? 'عذراً! الصفحة غير موجودة' : "Oops! Page Not Found"}</h1>
                    <p>
                        {locale === 'ar' ? 'يبدو أن الصفحة التي تبحث عنها قد تاهت في الصحراء. لا تقلق، دعنا نعيدك إلى المسار الصحيح!' : "The page you're looking for seems to have wandered off into the desert. Don't worry, let's get you back on track!"}
                    </p>

                    <div className="actions">
                        <Link href={`/${locale}`} className="btn-primary">
                            🏠 {locale === 'ar' ? 'الرئيسية' : 'Go Home'}
                        </Link>
                        <Link href={`/${locale}/chalets`} className="btn-secondary">
                            🏡 {locale === 'ar' ? 'تصفح الشاليهات' : 'Browse Chalets'}
                        </Link>
                    </div>

                    <div className="suggestions">
                        <h3>{locale === 'ar' ? 'قد تكون تبحث عن:' : 'You might be looking for:'}</h3>
                        <ul>
                            <li><Link href={`/${locale}/chalets`}>{locale === 'ar' ? 'شاليهاتنا الفاخرة' : 'Our Luxury Chalets'}</Link></li>
                            <li><Link href={`/${locale}/contact`}>{locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}</Link></li>
                            <li><Link href={`/${locale}/rewards`}>{locale === 'ar' ? 'برنامج المكافآت' : 'Rewards Program'}</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .not-found {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 2rem;
                    background: #FAF8F3; /* Cream background */
                }

                .content {
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .error-code {
                    font-size: 8rem;
                    font-weight: 800;
                    color: #E5A61D; /* Riva Gold */
                    line-height: 1;
                    margin-bottom: 1rem;
                    font-family: var(--font-serif);
                }

                h1 {
                    font-family: var(--font-serif);
                    font-size: 2.5rem;
                    color: #1F423A; /* Riva Forest Green */
                    margin-bottom: 1.5rem;
                }

                p {
                    color: #4B5563;
                    font-size: 1.15rem;
                    line-height: 1.8;
                    margin-bottom: 2.5rem;
                }

                .actions {
                    display: flex;
                    gap: 1.25rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-bottom: 4rem;
                }

                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: #1F423A; /* Forest Green */
                    color: white;
                    padding: 1rem 2.5rem;
                    border-radius: 50px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 15px rgba(31, 66, 58, 0.15);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(31, 66, 58, 0.25);
                    background: #2C5248;
                }

                .btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: white;
                    color: #1F423A;
                    padding: 1rem 2.5rem;
                    border-radius: 50px;
                    font-weight: 700;
                    text-decoration: none;
                    border: 2px solid #1F423A;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .btn-secondary:hover {
                    background: #F3F4F6;
                    transform: translateY(-2px);
                }

                .suggestions {
                    padding-top: 2.5rem;
                    border-top: 1px solid #E5E7EB;
                }

                .suggestions h3 {
                    color: #1F423A;
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin-bottom: 1.25rem;
                }

                .suggestions ul {
                    list-style: none;
                    padding: 0;
                    display: flex;
                    gap: 2rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .suggestions a {
                    color: #E5A61D; /* Riva Gold */
                    text-decoration: none;
                    font-weight: 700;
                    transition: all 0.2s;
                    border-bottom: 2px solid transparent;
                }

                .suggestions a:hover {
                    border-color: #E5A61D;
                }

                @media (max-width: 640px) {
                    .error-code { font-size: 6rem; }
                    h1 { font-size: 2rem; }
                    .actions { flex-direction: column; }
                    .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
                    .suggestions ul { flex-direction: column; gap: 1rem; }
                }
            `}</style>
        </div>
    );
}
