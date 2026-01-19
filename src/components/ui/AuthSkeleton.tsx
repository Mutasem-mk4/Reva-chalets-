import styles from './AuthSkeleton.module.css';

export default function AuthSkeleton() {
    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <div className={styles.header}>
                    <div className={`${styles.skeleton} ${styles.title}`}></div>
                    <div className={`${styles.skeleton} ${styles.subtitle}`}></div>
                </div>

                <div className={styles.form}>
                    <div className={styles.formGroup}>
                        <div className={`${styles.skeleton} ${styles.label}`}></div>
                        <div className={`${styles.skeleton} ${styles.input}`}></div>
                    </div>
                    <div className={styles.formGroup}>
                        <div className={`${styles.skeleton} ${styles.label}`}></div>
                        <div className={`${styles.skeleton} ${styles.input}`}></div>
                    </div>
                    <div className={styles.formGroup}>
                        <div className={`${styles.skeleton} ${styles.label}`}></div>
                        <div className={`${styles.skeleton} ${styles.input}`}></div>
                    </div>
                    <div className={`${styles.skeleton} ${styles.button}`}></div>
                </div>

                <div className={styles.divider}>
                    <div className={`${styles.skeleton} ${styles.dividerLine}`}></div>
                    <div className={`${styles.skeleton} ${styles.dividerText}`}></div>
                    <div className={`${styles.skeleton} ${styles.dividerLine}`}></div>
                </div>

                <div className={`${styles.skeleton} ${styles.googleBtn}`}></div>

                <div className={`${styles.skeleton} ${styles.switchText}`}></div>
            </div>
        </div>
    );
}
