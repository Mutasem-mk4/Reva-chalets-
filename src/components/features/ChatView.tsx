'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatView.module.css';

interface ChatViewProps {
    groupId: string;
    currentUserId?: string;
    locale?: string;
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    sender: {
        id: string;
        name: string;
        image: string | null;
    };
    createdAt: string;
    type: 'TEXT' | 'IMAGE' | 'SYSTEM';
}

export default function ChatView({ groupId, currentUserId = 'mock-user-1', locale = 'ar' }: ChatViewProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/groups/messages?groupId=${groupId}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (e) {
            console.error("Failed to fetch messages", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const content = inputText;
        setInputText(''); // optimistic clear

        try {
            const res = await fetch('/api/groups/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId,
                    content,
                    senderId: currentUserId
                })
            });

            const newMessage = await res.json();
            setMessages(prev => [...prev, newMessage]);
        } catch (e) {
            console.error("Failed to send message", e);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <button className={styles.backButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className={styles.groupInfo}>
                        <h2 className={styles.groupName}>{locale === 'ar' ? 'مجموعة الشاليه' : 'Chalet Group'}</h2>
                        <span className={styles.memberCount}>6 members</span>
                    </div>
                    <button className={styles.settingsButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                        </svg>
                    </button>
                </div>
            </header>

            <div className={styles.messagesList}>
                {loading && messages.length === 0 ? (
                    <div className={styles.loader}>Loading conversation...</div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentUserId;
                        // Assuming host-1 is the Maazib for demo
                        const isHost = msg.senderId === 'host-1';

                        return (
                            <div key={msg.id} className={`${styles.messageRow} ${isMe ? styles.myMessageRow : ''}`}>
                                {!isMe && (
                                    <div className={styles.avatar}>
                                        {msg.sender.image ? (
                                            <img src={msg.sender.image} alt={msg.sender.name} />
                                        ) : (
                                            <div className={styles.avatarPlaceholder}>
                                                {msg.sender.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className={`${styles.bubble} ${isMe ? styles.myBubble : styles.otherBubble}`}>
                                    {!isMe && (
                                        <div className={styles.senderName}>
                                            {msg.sender.name}
                                            {isHost && <span className={styles.hostBadge}>👑 Maazib</span>}
                                        </div>
                                    )}
                                    <p className={styles.messageContent}>{msg.content}</p>
                                    <span className={styles.time}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={handleSend}>
                <button type="button" className={styles.attachButton}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                </button>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className={styles.input}
                />
                <button type="submit" className={styles.sendButton} disabled={!inputText.trim()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
            </form>
        </div>
    );
}
