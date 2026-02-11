'use client';

import { motion } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: Math.min(delay, 0.2), ease: "easeOut" }}
            style={{ maxWidth: "100%", overflow: "hidden" }}
        >
            {children}
        </motion.div>
    );
}
