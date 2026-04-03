import WarpField from '@/components/WarpField';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Deep-space starfield — fixed canvas background */}
      <WarpField />

      {/* Floating navigation */}
      <Navigation />

      {/* Sections */}
      <Hero />
      {/* Divider between mission and experience */}
      <div className={styles.sectionWrapper}>
        <Experience />
        <div className="divider" />
        <Projects />
        <div className="divider" />
        <Skills />
        <div className="divider" />
        <Contact />
      </div>
    </main>
  );
}
