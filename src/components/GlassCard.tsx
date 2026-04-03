'use client';

import { motion } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  glow?: 'plasma' | 'solar' | 'none';
  delay?: number;
}

export default function GlassCard({
  children,
  className = '',
  style,
  hover = true,
  glow = 'plasma',
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      className={`${styles.card} ${hover ? styles.hoverable : ''} ${
        glow === 'plasma' ? styles.glowPlasma : glow === 'solar' ? styles.glowSolar : ''
      } ${className}`}
      style={style}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
