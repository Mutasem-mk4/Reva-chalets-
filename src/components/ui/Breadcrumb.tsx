'use client';

import Link from 'next/link';
import { ChevronRight } from '@/components/ui/Icons';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    lang: string;
}

export default function Breadcrumb({ items, lang }: BreadcrumbProps) {
    // Add Home as first item
    const allItems: BreadcrumbItem[] = [
        { label: lang === 'ar' ? 'الرئيسية' : 'Home', href: `/${lang}` },
        ...items
    ];

    return (
        <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
                {allItems.map((item, index) => (
                    <li key={index}>
                        {index > 0 && (
                            <span className="separator">
                                <ChevronRight size={14} />
                            </span>
                        )}
                        {item.href && index < allItems.length - 1 ? (
                            <Link href={item.href} className="link">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="current">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>

            <style jsx>{`
                .breadcrumb {
                    padding: 1rem 0;
                    margin-bottom: 1rem;
                }

                ol {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    gap: 0.25rem;
                }

                li {
                    display: flex;
                    align-items: center;
                    font-size: 0.9rem;
                }

                .separator {
                    color: hsl(var(--muted-foreground));
                    margin: 0 0.5rem;
                }

                .link {
                    color: hsl(var(--primary));
                    text-decoration: none;
                    transition: opacity 0.2s;
                }

                .link:hover {
                    opacity: 0.7;
                }

                .current {
                    color: hsl(var(--muted-foreground));
                    font-weight: 500;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                @media (max-width: 640px) {
                    li {
                        font-size: 0.8rem;
                    }

                    .current {
                        max-width: 150px;
                    }
                }
            `}</style>
        </nav>
    );
}
