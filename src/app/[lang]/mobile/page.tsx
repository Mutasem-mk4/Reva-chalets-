import MobileHome from '@/components/features/MobileHome';

interface MobilePageProps {
    params: Promise<{ lang: string }>;
}

export default async function MobilePage({ params }: MobilePageProps) {
    const { lang } = await params;

    return <MobileHome locale={lang} userName="User Name" />;
}

export const metadata = {
    title: 'Riva - Chalet Booking',
    description: 'Book your perfect chalet getaway with Riva',
};
