import styles from '@/styles/about.module.css';

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Redefining Luxury in Jordan</h1>
                    <p>Reva Chalets connects discerning travelers with the most exclusive and comfortable properties across the Kingdom.</p>
                </div>
            </section>

            <section className={styles.story}>
                <div className={styles.storyText}>
                    <h2>Our Story</h2>
                    <p>
                        Founded in 2024, Reva Chalets was born from a simple belief: everyone deserves a perfect getaway.
                        We noticed that finding high-quality, trusted vacation rentals in Jordan was a challenge. Photos often didn't match reality, and booking processes were cumbersome.
                    </p>
                    <p>
                        We set out to change that. By hand-picking every property and verifying established quality standards, we ensure that your "Reva Moment" is nothing short of exceptional.
                    </p>
                </div>
                <div className={styles.storyImage}>
                    <div className={styles.placeholderImage}>Reva Team</div>
                </div>
            </section>

            <section className={styles.values}>
                <h2>Our Core Values</h2>
                <div className={styles.valueGrid}>
                    <div className={styles.valueCard}>
                        <span className={styles.icon}>✨</span>
                        <h3>Excellence</h3>
                        <p>We settle for nothing less than the best in service and quality.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <span className={styles.icon}>🛡️</span>
                        <h3>Trust</h3>
                        <p>Transparency and security are at the heart of every booking.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <span className={styles.icon}>❤️</span>
                        <h3>Comfort</h3>
                        <p>Your peace of mind is our ultimate priority.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
