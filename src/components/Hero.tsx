'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import styles from './Hero.module.css';

const roles = [
  'Founding Engineer',
  'Full-Stack Developer',
  'AI Builder',
  'Startup Operator',
];

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

const FULL_NAME = 'ASHAR RAHMAN';

export default function Hero() {
  const [typedName, setTypedName] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [nameComplete, setNameComplete] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [missionOpen, setMissionOpen] = useState(false);
  const roleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Type out the name
  useEffect(() => {
    if (typedName.length < FULL_NAME.length) {
      const timeout = setTimeout(() => {
        setTypedName(FULL_NAME.slice(0, typedName.length + 1));
      }, 80 + Math.random() * 60);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        setNameComplete(true);
        setShowContent(true);
      }, 400);
    }
  }, [typedName]);

  // Typewriter cycle for roles
  const typeRole = useCallback(() => {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      if (typedRole.length > 0) {
        roleTimeoutRef.current = setTimeout(() => {
          setTypedRole(typedRole.slice(0, -1));
        }, 30);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    } else {
      if (typedRole.length < currentRole.length) {
        roleTimeoutRef.current = setTimeout(() => {
          setTypedRole(currentRole.slice(0, typedRole.length + 1));
        }, 60 + Math.random() * 40);
      } else {
        roleTimeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    }
  }, [typedRole, roleIndex, isDeleting]);

  useEffect(() => {
    if (!nameComplete) return;
    typeRole();
    return () => {
      if (roleTimeoutRef.current) clearTimeout(roleTimeoutRef.current);
    };
  }, [nameComplete, typeRole]);

  // Blink cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.content}>
        {/* Name with typewriter */}
        <div className={styles.nameBlock}>
          <h1 className={styles.name}>
            {typedName}
            <span className={`${styles.cursor} ${showCursor ? styles.cursorVisible : ''}`}>
              █
            </span>
          </h1>
        </div>

        {/* Role typewriter */}
        <AnimatePresence>
          {nameComplete && (
            <motion.div
              className={styles.roleBlock}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className={styles.rolePrefix}>&gt; </span>
              <span className={styles.roleText}>{typedRole}</span>
              <span className={`${styles.roleCursor} ${showCursor ? styles.cursorVisible : ''}`}>
                _
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tagline + CTAs */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className={styles.tagline}>
                Building AI-native products from 0→1.
                <br />
                <span className={styles.taglineSub}>
                  Formerly founding engineer at Aviary AI (YC S22).
                </span>
              </p>

              {/* Mission dropdown */}
              <div className={styles.missionDropdown}>
                <button
                  className={`${styles.missionToggle} ${missionOpen ? styles.missionOpen : ''}`}
                  onClick={() => setMissionOpen(!missionOpen)}
                >
                  <span className={styles.missionToggleText}>
                    {missionOpen ? '[-]' : '[+]'} mission_statement.txt
                  </span>
                  <ChevronDown
                    size={14}
                    className={`${styles.missionChevron} ${missionOpen ? styles.missionChevronOpen : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {missionOpen && (
                    <motion.div
                      className={styles.missionContent}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.missionInner}>
                        {missionLines.map((line) => (
                          <div key={line.prefix} className={styles.missionLine}>
                            <span className={styles.missionPrefix}>{line.prefix}:</span>
                            <span className={styles.missionText}>{line.text}</span>
                          </div>
                        ))}
                        <div className={styles.missionSignature}>— Ashar Rahman</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.ctas}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    const el = document.querySelector('#projects');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>view projects</span>
                </button>
                <button
                  className="btn-outline"
                  onClick={() => {
                    const el = document.querySelector('#contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>get in touch</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className={styles.scrollText}>scroll</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
      {/* <img src="me.JPG" className={styles.avatar} alt="Ashar" /> */}

    </section>
  );
}
