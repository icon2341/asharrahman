'use client';

import { motion } from 'framer-motion';
import styles from './Skills.module.css';

const skillCategories = [
  {
    title: 'Frontend & UI',
    skills: ['React', 'Next.js 15', 'TypeScript', 'Tailwind', 'Framer Motion', 'Three.js'],
    accent: '#00f0ff',
  },
  {
    title: 'AI & Data',
    skills: ['LangGraph', 'OpenAI / Claude', 'RAG', 'Vector DBs (pgvector)', 'Voice AI (Pipecat)'],
    accent: '#ff4060', // Hot pink/magenta
  },
  {
    title: 'Backend & Infra',
    skills: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'GCP', 'AWS', 'Redis'],
    accent: '#7b2ff7', // Deep purple
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
        <div className="section-label">Toolkit</div>
        <h2 className="section-title">Skills & Tech</h2>
      </motion.div>

      <div className={styles.container}>
        {skillCategories.map((category, i) => (
          <motion.div
            key={category.title}
            className={styles.category}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <h3 className={styles.categoryTitle} style={{ color: category.accent }}>
              {category.title}
            </h3>
            <div className={styles.pillContainer}>
              {category.skills.map((skill, j) => (
                <motion.div
                  key={skill}
                  className={styles.pill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + j * 0.05, duration: 0.4 }}
                  whileHover={{ 
                    scale: 1.05, 
                    borderColor: category.accent,
                    boxShadow: `0 0 15px ${category.accent}40`,
                    color: '#fff'
                  }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
