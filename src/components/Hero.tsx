'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import styles from './Hero.module.css';

const roles = [
  'Founding Engineer',
  'Full-Stack Developer',
  'AI Builder',
  'Startup Operator',
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = () => {
    const el = document.querySelector('#mission');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={containerRef} className={styles.hero} id="hero">
      <motion.div className={styles.content} style={{ opacity, scale, y }}>
        {/* Floating stat cards */}
        <motion.div
          className={styles.floatCard}
          style={{ top: '15%', right: '8%' }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className={styles.floatCardValue}>YC S22</div>
          <div className={styles.floatCardLabel}>Backed Startup</div>
        </motion.div>

        <motion.div
          className={styles.floatCard}
          style={{ bottom: '28%', left: '5%' }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div className={styles.floatCardValue}>$3M</div>
          <div className={styles.floatCardLabel}>ARR Product</div>
        </motion.div>

        <motion.div
          className={styles.floatCard}
          style={{ top: '25%', left: '3%' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <div className={styles.floatCardValue}>3.71</div>
          <div className={styles.floatCardLabel}>GPA · Magna Cum Laude</div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          className={styles.headingWrapper}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className={styles.roleText} key={roleIndex}>
              {roles[roleIndex]}
            </span>
          </motion.p>

          <h1 className={styles.name}>
            <span className={styles.nameFirst}>ASHAR</span>
            <span className={styles.nameLast}>RAHMAN</span>
          </h1>

          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            Building AI-native products from 0→1.
            <br />
            <span className={styles.taglineAccent}>
              Formerly founding engineer at Aviary AI (YC S22).
            </span>
          </motion.p>

          <motion.div
            className={styles.ctas}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <button className="btn-primary" onClick={() => {
              const el = document.querySelector('#projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span>Explore My Universe</span>
            </button>
            <button className="btn-outline" onClick={() => {
              const el = document.querySelector('#contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span>Get In Touch</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          className={styles.scrollIndicator}
          onClick={handleScroll}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className={styles.scrollText}>warp drive engaged</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={18} />
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Warp lines overlay */}
      <div className={styles.warpLines}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={styles.warpLine}
            style={{
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 0.4}s`,
              opacity: 0.03 + Math.random() * 0.05,
            }}
          />
        ))}
      </div>
    </section>
  );
}
