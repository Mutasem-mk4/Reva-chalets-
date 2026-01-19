'use client';

import { motion } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            style={{ perspective: "1000px" }}
        >
            {children}
        </motion.div>
    );
}
