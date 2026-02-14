'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { LayoutDashboard, Users, Home, Calendar, LogOut, Settings, Tag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const menuItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Chalets', href: '/admin/chalets', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    // { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const params = useParams();
    const lang = params.lang as string; // Access lang from hook
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push(`/${lang}/login`);
        router.refresh();
    };

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900 font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg flex flex-col fixed inset-y-0 z-50">
                <div className="p-6 border-b flex items-center justify-center">
                    <Link href={`/${lang}`}>
                        <Image src="/images/logo-en.png" alt="Riva Admin" width={120} height={40} className="object-contain" />
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const hrefWithLang = `/${lang}${item.href}`;
                        const isActive = pathname === hrefWithLang || (item.href !== '/admin' && pathname.startsWith(hrefWithLang));

                        return (
                            <Link
                                key={item.name}
                                href={hrefWithLang}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 overflow-auto p-8 ${lang === 'ar' ? 'mr-64' : 'ml-64'}`}>
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
