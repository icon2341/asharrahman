'use client';

import { motion } from 'framer-motion';
import styles from './Experience.module.css';

const experiences = [
  {
    title: 'Founding Engineer',
    company: 'Aviary AI',
    badge: 'YC S22',
    period: 'May 2024 — Mar 2026',
    location: 'New York, NY',
    bullets: [
      'Product Owner for Knowledge Base RAG platform generating $3M ARR',
      'Built agentic AI tooling with LangGraph and open source LLMs on scalable cloud infra',
      'Led SOC 2 compliance across all frontend applications',
      'Architected enterprise SAML authentication with React, Next.js, TypeScript',
      'Created AI ingestion pipelines processing thousands of concurrent documents',
      'Managed engineering team growth with scalable delegation policies',
    ],
    tags: ['React', 'Next.js', 'TypeScript', 'LangGraph', 'AWS', 'Azure', 'RAG', 'Voice AI'],
  },
  {
    title: 'Software Engineer Co-Op',
    company: 'Toast Inc',
    badge: 'Business Platform',
    period: 'Jan 2022 — Sep 2022',
    location: 'Boston, MA',
    bullets: [
      'Reduced server-side exceptions by 15% for 71,000 users using PostgreSQL, Kotlin, and AWS Lambda',
      'Designed database handling policy pitched to senior leadership — reduced db post-mortems by 50%',
      'Built anti-fraud tooling and ISO compliance automation',
    ],
    tags: ['Kotlin', 'PostgreSQL', 'AWS Lambda', 'Java'],
  },
  {
    title: 'Undergraduate Researcher',
    company: 'CLASP Lab — RIT',
    badge: 'AI/ML',
    period: 'Aug 2021 — Dec 2021',
    location: 'Rochester, NY',
    bullets: [
      'Conducted AI/ML research on confusion detection in humans using unsupervised learning models',
      'Published findings contributing to human-computer interaction understanding',
    ],
    tags: ['Python', 'Machine Learning', 'NLP', 'Research'],
  },
];

export default function Experience() {
  return (
    <section className="section" id="experience">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-label">log</div>
        <h2 className="section-title">Experience</h2>
      </motion.div>

      <div className={styles.timeline}>
        <div className={styles.line} />

        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            className={styles.item}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className={styles.dot}>+</div>

            <div className={styles.card}>
              <div className={styles.header}>
                <div>
                  <h3 className={styles.title}>{exp.title}</h3>
                  <div className={styles.company}>
                    {exp.company}
                    <span className="tag" style={{ marginLeft: 8 }}>{exp.badge}</span>
                  </div>
                </div>
                <div className={styles.meta}>
                  <span>{exp.period}</span>
                  <span>{exp.location}</span>
                </div>
              </div>

              <ul className={styles.bullets}>
                {exp.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>

              <div className={styles.tags}>
                {exp.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
