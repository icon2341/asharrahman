'use client';

import { useRef, useState, useCallback } from 'react';
import EtchCanvas from '@/components/EtchCanvas';
import type { EtchCanvasHandle } from '@/components/EtchCanvas';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import PongGame from '@/components/PongGame';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import styles from './page.module.css';

export default function Home() {
  const etchRef = useRef<EtchCanvasHandle>(null);
  const [shaking, setShaking] = useState(false);

  const handleShake = useCallback(() => {
    if (shaking) return;
    setShaking(true);
    // Trigger the shake animation, then clear the canvas
    setTimeout(() => {
      etchRef.current?.shake();
    }, 300);
    setTimeout(() => {
      setShaking(false);
    }, 600);
  }, [shaking]);

  return (
    <main className={`${styles.main} ${shaking ? 'shaking' : ''}`}>
      {/* Ambient etch-a-sketch background */}
      <EtchCanvas ref={etchRef} />

      {/* Navigation */}
      <Navigation />

      {/* Sections */}
      <Hero />

      {/* Pong game */}
      <div className={styles.pongSection}>
        <PongGame />
      </div>

      <div className={styles.sectionWrapper}>
        <Experience />
        <div className="divider" />
        <Projects />
        <div className="divider" />
        <Skills />
        <div className="divider" />
        <Contact />
      </div>

      {/* Shake button — fixed bottom-right */}
      <button className={styles.shakeBtn} onClick={handleShake} disabled={shaking}>
        <span className={styles.shakeBtnIcon}>⟳</span>
        <span className={styles.shakeBtnText}>shake</span>
      </button>
    </main>
  );
}
