'use client';

import { motion } from 'framer-motion';
import styles from './Skills.module.css';

const skillCategories = [
  {
    title: 'Frontend & UI',
    skills: ['React', 'Next.js 15', 'TypeScript', 'Tailwind', 'Framer Motion', 'Three.js'],
  },
  {
    title: 'AI & Data',
    skills: ['LangGraph', 'OpenAI / Claude', 'RAG', 'Vector DBs (pgvector)', 'Voice AI (Pipecat)'],
  },
  {
    title: 'Backend & Infra',
    skills: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'GCP', 'AWS', 'Redis'],
  },
];

export default function Skills() {
  return (
    <section className="section" id="skills">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="section-label">toolkit</div>
        <h2 className="section-title">Skills & Tech</h2>
      </motion.div>

      <div className={styles.container}>
        {skillCategories.map((category, i) => (
          <motion.div
            key={category.title}
            className={styles.category}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <h3 className={styles.categoryTitle}>{category.title}</h3>
            <div className={styles.pillContainer}>
              {category.skills.map((skill) => (
                <span key={skill} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
