'use client';

import { useEffect, useState } from 'react';
import RewardCard from '@/components/features/RewardCard';
import { getDictionary } from '@/lib/dictionaries';

// Mock Type
interface StoredReward {
    id: string;
    code: string;
    status: 'active' | 'redeemed';
    generatedAt: number;
}

export default function WalletPage({ params }: { params: Promise<{ lang: string }> }) {
    const [rewards, setRewards] = useState<StoredReward[]>([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<string>('en');
    const [dict, setDict] = useState<any>(null);

    useEffect(() => {
        // Ungroup params promise
        params.then(unwrapped => {
            setLang(unwrapped.lang);
            setDict(getDictionary(unwrapped.lang));
        });

        // Fetch Rewards from LocalStorage (Mocking DB)
        const loadRewards = () => {
            // In a real app, this would be an API call
            // For now, we simulate finding the 'gift-reward' key we used in Phase 18
            // We will just create a list of "Demo Rewards" if none exist for showcase
            const hasReward = localStorage.getItem('reward_status');

            let mockRewards: StoredReward[] = [];

            if (hasReward) {
                mockRewards.push({
                    id: 'reward-123',
                    code: 'VIP-GIFT-1',
                    status: hasReward as 'active' | 'redeemed',
                    generatedAt: Date.now()
                });
            }

            // Add a demo one if empty for better visuals
            if (mockRewards.length === 0) {
                mockRewards.push({
                    id: 'demo-1',
                    code: 'WELCOME-GIFT',
                    status: 'active',
                    generatedAt: Date.now()
                });
            }

            setRewards(mockRewards);
            setLoading(false);
        };

        loadRewards();
    }, [params]);

    if (!dict) return null; // Wait for dict

    return (
        <div className="wallet-page">
            <h1 className="title">{dict.rewards.wallet}</h1>
            <p className="subtitle">{dict.rewards.scanInfo}</p>

            {loading ? (
                <div className="loading">{dict.common.loading}</div>
            ) : (
                <div className="rewards-grid">
                    {rewards.length > 0 ? (
                        rewards.map(reward => {
                            const mockPartner = {
                                id: reward.id,
                                name: 'Reward Gift',
                                discount: 'Special Offer',
                                category: 'Shopping' as 'Shopping',
                                description: 'Your special reward',
                                logo: '🎁',
                                qrValue: reward.code
                            };
                            return (
                                <div key={reward.id} className="reward-wrapper">
                                    <RewardCard partner={mockPartner} dict={dict} />
                                </div>
                            );
                        })
                    ) : (
                        <p className="empty-state">{dict.rewards.noRewards}</p>
                    )}
                </div>
            )}

            <style jsx>{`
        .wallet-page {
            animation: fadeIn 0.5s ease-out;
        }

        .title {
            font-family: var(--font-serif);
            font-size: 2rem;
            color: hsl(var(--foreground));
            margin-bottom: 0.5rem;
        }

        .subtitle {
            color: hsl(var(--muted-foreground));
            margin-bottom: 2rem;
        }

        .rewards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }

        .reward-wrapper {
            background: hsl(var(--card));
            border-radius: var(--radius);
            overflow: hidden;
            border: 1px solid hsl(var(--border));
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
