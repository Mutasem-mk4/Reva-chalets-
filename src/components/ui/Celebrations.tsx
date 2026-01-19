'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
    id: number;
    x: number;
    delay: number;
    color: string;
    rotation: number;
    scale: number;
}

export default function Confetti({ trigger }: { trigger: boolean }) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
    const [show, setShow] = useState(false);

    const colors = ['#f5a623', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6', '#f97316'];

    useEffect(() => {
        if (trigger) {
            // Generate confetti pieces
            const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                scale: 0.5 + Math.random() * 0.5,
            }));

            setPieces(newPieces);
            setShow(true);

            // Clean up after animation
            const timeout = setTimeout(() => {
                setShow(false);
                setPieces([]);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [trigger]);

    if (!show) return null;

    return (
        <div className="confetti-container" aria-hidden="true">
            {pieces.map(piece => (
                <div
                    key={piece.id}
                    className="confetti-piece"
                    style={{
                        left: `${piece.x}%`,
                        animationDelay: `${piece.delay}s`,
                        backgroundColor: piece.color,
                        transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
                    }}
                />
            ))}

            <style jsx>{`
                .confetti-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 99999;
                    overflow: hidden;
                }
                
                .confetti-piece {
                    position: absolute;
                    top: -10px;
                    width: 10px;
                    height: 10px;
                    border-radius: 2px;
                    animation: confetti-fall 3s ease-out forwards;
                }
                
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}

// Animated success check
export function SuccessCheck({ show }: { show: boolean }) {
    if (!show) return null;

    return (
        <div className="success-check">
            <svg viewBox="0 0 52 52" className="checkmark">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>

            <style jsx>{`
                .success-check {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                }
                
                .checkmark {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    stroke-width: 2;
                    stroke: #22c55e;
                    stroke-miterlimit: 10;
                    animation: scale 0.3s ease-in-out 0.9s both;
                }
                
                .checkmark-circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    stroke-width: 2;
                    stroke: #22c55e;
                    fill: none;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                
                .checkmark-check {
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    stroke-width: 3;
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }
                
                @keyframes stroke {
                    100% { stroke-dashoffset: 0; }
                }
                
                @keyframes scale {
                    0%, 100% { transform: none; }
                    50% { transform: scale3d(1.1, 1.1, 1); }
                }
            `}</style>
        </div>
    );
}

// Typing animation for text
export function TypingText({ text, speed = 50 }: { text: string; speed?: number }) {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[index]);
                setIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [index, text, speed]);

    return (
        <span className="typing-text">
            {displayText}
            <span className="cursor">|</span>

            <style jsx>{`
                .typing-text {
                    display: inline;
                }
                
                .cursor {
                    animation: blink 1s infinite;
                    margin-left: 2px;
                }
                
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `}</style>
        </span>
    );
}
