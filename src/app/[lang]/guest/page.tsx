import { redirect } from 'next/navigation';

export default async function GuestIndexPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    redirect(`/${lang}/guest/wallet`);
}
