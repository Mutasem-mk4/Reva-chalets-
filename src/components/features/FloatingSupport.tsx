'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/support.module.css';
import { X, Send, MessageSquare, Calendar, HelpCircle, Clock, Wallet, Phone, Email } from '@/components/ui/Icons';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    time: string;
}

interface FAQ {
    keywords: string[];
    question: string;
    answer: string;
}

const FAQ_DATA: FAQ[] = [
    {
        keywords: ['book', 'booking', 'reserve', 'reservation', 'how to book'],
        question: 'How do I book a chalet?',
        answer: 'Simply browse our collection, select your preferred chalet, choose your dates, and complete the booking form. You\'ll receive an instant confirmation email with all the details! 📧'
    },
    {
        keywords: ['cancel', 'cancellation', 'refund', 'policy'],
        question: 'What is the cancellation policy?',
        answer: 'We offer free cancellation up to 48 hours before your check-in date. Cancellations made within 48 hours may be subject to a one-night charge. ✅'
    },
    {
        keywords: ['check-in', 'check-out', 'checkin', 'checkout', 'time', 'arrive', 'leave'],
        question: 'What time is check-in and check-out?',
        answer: 'Standard check-in is 3:00 PM and check-out is 11:00 AM. Early check-in or late check-out can be arranged upon request! 🕒'
    },
    {
        keywords: ['pet', 'pets', 'dog', 'cat', 'animal'],
        question: 'Are pets allowed?',
        answer: 'Pet policies vary by property. Some chalets are pet-friendly while others are not. Check the specific listing or ask me about a particular chalet! 🐕'
    },
    {
        keywords: ['deposit', 'security', 'payment', 'pay'],
        question: 'Is there a security deposit?',
        answer: 'Yes, most properties require a refundable security deposit of 50-100 JOD. This is returned within 3-5 business days after checkout. 💳'
    },
    {
        keywords: ['airport', 'transfer', 'pickup', 'transportation', 'taxi'],
        question: 'Do you offer airport transfers?',
        answer: 'Yes! We arrange private airport transfers from Queen Alia International Airport to any of our properties. Contact us 24 hours in advance. 🚗'
    },
    {
        keywords: ['price', 'cost', 'how much', 'rate', 'pricing'],
        question: 'What are your prices?',
        answer: 'Our prices range from 120 JOD to 300 JOD per night depending on the property and season. Check individual chalet pages for current rates! 💰'
    },
    {
        keywords: ['amenities', 'facilities', 'pool', 'wifi', 'included'],
        question: 'What amenities are included?',
        answer: 'Each chalet varies, but common amenities include WiFi, AC, parking, and fully equipped kitchens. Many have pools and BBQ areas! Check individual listings for details. 🏊'
    }
];

const QUICK_QUESTIONS = [
    { text: 'How do I book?', icon: <Calendar size={14} /> },
    { text: 'Cancellation policy', icon: <X size={14} /> },
    { text: 'Check-in times', icon: <Clock size={14} /> },
    { text: 'Pricing info', icon: <Wallet size={14} /> }
];

function getTimeString(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function findAnswer(input: string): string {
    const lowerInput = input.toLowerCase();

    for (const faq of FAQ_DATA) {
        for (const keyword of faq.keywords) {
            if (lowerInput.includes(keyword)) {
                return faq.answer;
            }
        }
    }

    // Default response if no match
    return "I'm not sure about that, but I'd love to help! You can reach our team directly at support@revachalets.com or call +962 6 XXX XXXX. 📞";
}

export default function FloatingSupport() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '👋 Hi there! I\'m Reva Assistant. How can I help you plan your perfect stay? \n\nTry asking about booking, cancellations, or check-in times!',
            sender: 'bot',
            time: getTimeString()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (text?: string) => {
        const messageText = text || inputValue.trim();
        if (!messageText) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            time: getTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Simulate typing delay then respond
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: findAnswer(messageText),
                sender: 'bot',
                time: getTimeString()
            };
            setMessages(prev => [...prev, botMessage]);
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleQuickQuestion = (question: any) => {
        handleSend(question.text);
    };

    return (
        <div className={styles.supportContainer}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <div className={styles.headerInfo}>
                            <span className={styles.statusDot}></span>
                            <div>
                                <h3>Reva Assistant</h3>
                                <small>Online • Replies instantly</small>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} aria-label="Close chat"><X size={20} /></button>
                    </div>

                    <div className={styles.chatBody}>
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : ''}`}
                            >
                                <p>{msg.text}</p>
                                <small>{msg.time}</small>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.quickQuestions}>
                        {QUICK_QUESTIONS.map((q, idx) => (
                            <button
                                key={idx}
                                className={styles.quickBtn}
                                onClick={() => handleQuickQuestion(q)}
                            >
                                {q.icon}
                                {q.text}
                            </button>
                        ))}
                    </div>

                    <div className={styles.chatInput}>
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={() => handleSend()} aria-label="Send message"><Send size={18} /></button>
                    </div>
                </div>
            )}

            <button
                className={styles.floatBtn}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Chat with support"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
}
