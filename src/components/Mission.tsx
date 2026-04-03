'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import styles from './Mission.module.css';

const missionLines = [
  {
    prefix: 'DESIGNATION',
    text: 'Founding Engineer. Builder. Operator.',
  },
  {
    prefix: 'MISSION',
    text: 'Ship AI-native products that fundamentally change how people live, work, and experience the world.',
  },
  {
    prefix: 'APPROACH',
    text: 'Zero-to-one execution at startup velocity. From RAG pipelines to Voice AI—prototype to production, alone or leading teams.',
  },
  {
    prefix: 'PHILOSOPHY',
    text: 'Technology only matters when it reaches people. The last mile—the moment a product clicks for a real human—is where every decision gets made.',
  },
  {
    prefix: 'STATUS',
    text: 'Building Local — an AI concierge replacing 5 apps with one agent. Previously: Founding Engineer at Aviary AI (YC S22), $3M ARR.',
  },
];

export default function Mission() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'pre' | 'launch' | 'arc' | 'text'>('pre');
  const [hasEntered, setHasEntered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });

  // Trigger sequence on interaction (scroll intent, touch, or key)
  useEffect(() => {
    if (phase !== 'pre') return;

    const handleInteraction = (e: Event) => {
      // Prevent double trigger
      if (hasEntered) return;
      
      // If it's a wheel event, only trigger on down scroll
      if (e instanceof WheelEvent && e.deltaY <= 0) return;

      setHasEntered(true);
      startSequence();
    };

    window.addEventListener('wheel', handleInteraction);
    window.addEventListener('touchmove', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('touchmove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [phase, hasEntered]);

  const startSequence = () => {
    setPhase('launch');
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }

    // After ~8 seconds (approximate arc moment), reveal text
    setTimeout(() => {
      setPhase('arc');
    }, 7500);

    setTimeout(() => {
      setPhase('text');
    }, 9000);
  };

  // Allow manual trigger if user clicks
  const handleClick = () => {
    if (phase === 'pre') startSequence();
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="mission"
      onClick={handleClick}
    >
      {/* Artemis video background */}
      <video
        ref={videoRef}
        className={styles.video}
        src="/artemis.mp4"
        muted
        playsInline
        preload="auto"
        onTimeUpdate={(e) => {
          // Fallback: if video plays past 8s and we're still in launch phase
          if (e.currentTarget.currentTime > 8 && phase === 'launch') {
            setPhase('arc');
          }
          if (e.currentTarget.currentTime > 10 && phase === 'arc') {
            setPhase('text');
          }
        }}
      />

      {/* Overlay gradient — darkens as text appears */}
      <motion.div
        className={styles.overlay}
        animate={{
          opacity: phase === 'text' || phase === 'arc' ? 0.7 : 0.2,
        }}
        transition={{ duration: 2 }}
      />

      {/* Pre-launch hint */}
      <AnimatePresence>
        {phase === 'pre' && (
          <motion.div
            className={styles.hint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className={styles.hintDot} />
            <span>Scroll to initiate launch sequence</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launch label */}
      <AnimatePresence>
        {phase === 'launch' && (
          <motion.div
            className={styles.launchLabel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.launchDot} />
            <span className={styles.launchText}>ARTEMIS — LAUNCH SEQUENCE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission text — revealed at arc */}
      <AnimatePresence>
        {phase === 'text' && (
          <motion.div
            className={styles.content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div
              className={styles.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className={styles.labelLine} />
              MISSION STATEMENT
              <span className={styles.labelLine} />
            </motion.div>

            <div className={styles.lines}>
              {missionLines.map((line, i) => (
                <motion.div
                  key={line.prefix}
                  className={styles.line}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.6 + i * 0.35,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className={styles.linePrefix}>{line.prefix}</div>
                  <div className={styles.lineText}>{line.text}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className={styles.signature}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + missionLines.length * 0.35 + 0.3, duration: 1 }}
            >
              — Ashar Rahman
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
