'use client';

import { useParams } from 'next/navigation';
import ChatView from '@/components/features/ChatView';
import { useAuth } from '@/lib/auth';

export default function ChatPage({ params: { lang, id } }: { params: { lang: string, id: string } }) {
    const { user } = useAuth();

    // In a real scenario, we'd verify the user belongs to this booking group here
    // For now, we pass the booking ID as the group ID

    return (
        <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            {/* 64px is rough header height, we might need adjustments for mobile */}
            <ChatView
                groupId={id}
                currentUserId={user?.id || 'mock-user-1'}
                locale={lang}
            />
        </div>
    );
}
