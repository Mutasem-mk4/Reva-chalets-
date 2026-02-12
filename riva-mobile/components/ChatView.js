import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Send, UserCircle } from 'lucide-react-native';
import { socket, connectSocket, disconnectSocket } from '../lib/socket';
import { api } from '../lib/api';

export default function ChatView({ bookingId = 'booking-123', userName = 'User', onClose, lang = 'ar' }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const listRef = useRef(null);

    const isAr = lang === 'ar';

    // 1. Initial Load & Socket Setup
    useEffect(() => {
        // Connect
        connectSocket();

        // Join Room
        socket.emit('join_room', bookingId);

        // Listen for incoming messages
        socket.on('receive_message', (newItem) => {
            console.log("New Message Received:", newItem);
            setMessages((prev) => [...prev, newItem]);
            // Scroll to bottom
            setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
        });

        // Cleanup
        return () => {
            socket.off('receive_message');
        };
    }, [bookingId]);

    // 2. Fetch history (Mock for now, normally API)
    useEffect(() => {
        // Mock history
        setMessages([
            {
                id: '1',
                content: isAr ? 'أهلاً بكم في مزارع الريف! أخبرونا إذا احتجتم لأي شيء.' : 'Welcome to Al-Reef Farm! Let us know if you need anything.',
                sender: { name: isAr ? 'المضيف' : 'Host' },
                senderId: 'host-1',
                createdAt: new Date(Date.now() - 3600000).toISOString()
            }
        ]);
    }, []);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const msgData = {
            bookingId,
            content: inputText,
            senderId: 'user-me', // In real app, from auth
            senderName: userName,
        };

        // Emit to server
        socket.emit('send_message', msgData);

        setInputText('');
    };

    const renderItem = ({ item }) => {
        const isMe = item.senderId === 'user-me';
        return (
            <View style={[styles.msgContainer, isMe ? styles.myMsgContainer : styles.otherMsgContainer, isAr && !isMe && { flexDirection: 'row-reverse' }]}>
                {!isMe && (
                    <View style={[styles.avatar, isAr && { marginRight: 0, marginLeft: 8 }]}>
                        <Text style={styles.avatarText}>{item.sender.name[0]}</Text>
                    </View>
                )}
                <View style={[styles.msgBubble, isMe ? styles.myBubble : styles.otherBubble]}>
                    {!isMe && <Text style={[styles.senderName, isAr && { textAlign: 'right' }]}>{item.sender.name}</Text>}
                    <Text style={[styles.msgText, isMe ? styles.myText : styles.otherText, isAr && { textAlign: 'right' }]}>{item.content}</Text>
                    <Text style={[styles.timeText, isMe ? styles.myTime : styles.otherTime]}>
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{isAr ? 'دردشة المجموعة' : 'Group Chat'}</Text>
                <Text style={styles.headerSubtitle}>{isAr ? 'مجموعة التنسيق والخدمات' : 'Coordination Group'}</Text>
                {onClose && (
                    <TouchableOpacity onPress={onClose} style={[styles.closeBtn, isAr && { right: 'auto', left: 20 }]}>
                        <Text style={{ color: '#6B7280' }}>{isAr ? 'إغلاق' : 'Close'}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Messages List */}
            <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Input Bar */}
            <View style={[styles.inputArea, isAr && { flexDirection: 'row-reverse' }]}>
                <TextInput
                    style={[styles.input, isAr && { textAlign: 'right', marginRight: 0, marginLeft: 10 }]}
                    placeholder={isAr ? 'اكتب رسالة...' : 'Type a message...'}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                    <Send size={20} color="white" style={isAr && { transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    closeBtn: {
        position: 'absolute',
        right: 20,
        top: 18,
    },
    listContent: {
        padding: 20,
        paddingBottom: 20,
    },
    msgContainer: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    myMsgContainer: {
        justifyContent: 'flex-end',
    },
    otherMsgContainer: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    avatarText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    msgBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
    },
    myBubble: {
        backgroundColor: '#1E3932', // Riva Green
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 4,
    },
    senderName: {
        fontSize: 12,
        color: '#E5A61D', // Gold
        marginBottom: 4,
        fontWeight: 'bold',
    },
    msgText: {
        fontSize: 15,
        lineHeight: 20,
    },
    myText: {
        color: 'white',
    },
    otherText: {
        color: '#1F2937',
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    otherTime: {
        color: '#9CA3AF',
    },
    inputArea: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: '#1F2937',
        marginRight: 10,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E5A61D', // Gold
        alignItems: 'center',
        justifyContent: 'center',
    },
});
