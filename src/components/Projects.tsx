'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Globe } from 'lucide-react';
import styles from './Projects.module.css';

const projects = [
  {
    id: 'local',
    priority: true,
    name: 'Local',
    url: 'https://local-app.xyz',
    tagline: 'AI concierge for planning social outings in NYC',
    description:
      'AI-native personal concierge that replaces the 5-app social planning nightmare. Transforms the fragmented TikTok→Google→Maps→Resy workflow into a single autonomous agent.',
    gradient: 'linear-gradient(135deg, #00f0ff 0%, #7b2ff7 100%)',
    accent: '#00f0ff',
    tags: ['Next.js', 'React Native', 'GCP', 'TypeScript', 'Voice AI', 'RAG', 'pgvector'],
    stats: [
      { label: 'NYC Venues', value: '40k+' },
      { label: 'Users', value: '10k+' },
      { label: 'Influencers Tracked', value: '60+' },
    ],
    detail: {
      headline: 'We don\'t just search — we execute.',
      sections: [
        {
          title: 'The Problem',
          body: 'Planning a night out in NYC means bouncing between TikTok, Google Maps, Resy, and Instagram. Local collapses this into one autonomous agent that actually does the work.',
        },
        {
          title: 'Proprietary Data Moat',
          body: '40,000 NYC venue profiles built by bypassing Google Places using novel AI scraping — capturing "essence" data (vibe, crowd, noise, dietary) that no API provides. Cost: $0. Google\'s equivalent: $17/1,000 requests.',
        },
        {
          title: 'Voice AI — The Last Mile',
          body: 'Autonomous outbound phone calls to venues via Pipecat + Twilio + ElevenLabs. The agent calls ahead to verify real-time walk-in availability, patio status, and wait times — perishable data no API can provide.',
        },
        {
          title: 'Multimodal Intelligence',
          body: '60+ NYC food influencer TikTok/Instagram videos ingested weekly. Gemini 2.0 multimodal extracts venue names, vibes, and optimal visit times — turning social content into structured search data.',
        },
        {
          title: 'The Rolodex',
          body: 'Save any URL (Instagram Reels, articles, TikToks) and Local\'s AI extracts, vector-embeds, and makes it semantically searchable. "That rooftop bar video" → instant retrieval via pgvector.',
        },
        {
          title: 'Tech Stack',
          body: 'Next.js 15 (frontend), Node.js/Express (worker), Python FastAPI (scraper), PostgreSQL + pgvector (vector search), Redis, GCP. iOS app 90% built via autonomous AI coding agents.',
        },
      ],
    },
  },
  {
    id: 'aviary',
    priority: false,
    name: 'Aviary AI',
    url: 'https://aviaryai.com',
    tagline: 'Enterprise AI knowledge platform (YC S22)',
    description:
      'Knowledge Base RAG platform and agentic AI tooling used by Fortune 500 enterprises. Product-owned the platform as Founding Engineer from prototype to $3M ARR.',
    gradient: 'linear-gradient(135deg, #7b2ff7 0%, #ff4060 100%)',
    accent: '#7b2ff7',
    tags: ['React', 'Next.js', 'TypeScript', 'LangGraph', 'AWS', 'Azure', 'SAML', 'RAG'],
    stats: [
      { label: 'ARR', value: '$3M' },
      { label: 'Backed', value: 'YC S22' },
      { label: 'Compliance', value: 'SOC 2' },
    ],
    detail: {
      headline: 'Enterprise AI from prototype to $3M ARR.',
      sections: [
        {
          title: 'Role',
          body: 'Founding Software Engineer and Product Owner for the Knowledge Base RAG platform. Served as the bridge between customer success, product, and engineering.',
        },
        {
          title: 'RAG Platform',
          body: 'Architected a Knowledge Base RAG platform powering AI assistants for enterprise clients. Built robust AI ingestion pipelines processing thousands of concurrent documents using multi-microservice architecture with Sentry error handling.',
        },
        {
          title: 'Agentic AI Tooling',
          body: 'Developed agentic AI workflows leveraging LangGraph and open-source LLMs deployed on scalable AWS and Azure infrastructure. Delivered AI-native technology from MVP to production scale.',
        },
        {
          title: 'Enterprise Security',
          body: 'Led SOC 2 compliance across all frontend applications. Designed and implemented IdP-initiated SAML authentication for enterprise customers using React, Next.js, and TypeScript.',
        },
        {
          title: 'Voice AI',
          body: 'Built voice AI features for enterprise customer-facing applications, enabling natural language interaction with knowledge bases at scale.',
        },
      ],
    },
  },
  {
    id: 'umrahbuddy',
    priority: false,
    name: 'Umrah Buddy',
    url: 'https://umrah-buddy.com',
    tagline: 'Carry the prayers of your loved ones to Umrah',
    description:
      'Spiritual web app that lets pilgrims collect du\'as from friends and family before Umrah, carry them to the Haram, and notify submitters when their prayer is completed.',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ff9500 100%)',
    accent: '#ffd700',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Email', 'Auth'],
    stats: [
      { label: 'Mission', value: 'Spiritual' },
      { label: 'Friction', value: 'Zero' },
      { label: 'Built for', value: 'The Ummah' },
    ],
    detail: {
      headline: 'Technology in service of the spiritual.',
      sections: [
        {
          title: 'The Idea',
          body: 'When you travel for Umrah, loved ones want to send prayers with you. Umrah Buddy makes this beautiful and frictionless — no app downloads, no accounts required to submit du\'as.',
        },
        {
          title: 'How It Works',
          body: 'Set your Umrah date, get a unique shareable link, send it to friends and family. They submit prayers instantly. You carry them to the Haram, check them off, and submitters get notified.',
        },
        {
          title: 'Features',
          body: 'Beautiful du\'a collection with Arabic calligraphy, transliteration, and translation. Real-time prayer tracking dashboard. Email notifications on completion. Zero-friction sharing.',
        },
        {
          title: 'Tech',
          body: 'Next.js App Router, TypeScript, PostgreSQL, Better Auth for authentication, email notification system. Deployed on Vercel.',
        },
      ],
    },
  },
  {
    id: 'sheska',
    priority: false,
    name: 'Sheska',
    url: 'https://github.com/icon2341/Sheskaweb',
    tagline: 'Fintech event management platform',
    description:
      'Online fintech platform that makes hosting events easier, more integrated, and cheaper — handling payments, vendor integrations, and seamless guest experiences.',
    gradient: 'linear-gradient(135deg, #00ff88 0%, #00c8ff 100%)',
    accent: '#00ff88',
    tags: ['React', 'TypeScript', 'Firebase', 'Bootstrap', 'MUI', 'Node'],
    stats: [
      { label: 'Type', value: 'Fintech' },
      { label: 'Infra', value: 'Serverless' },
      { label: 'Platform', value: 'Firebase' },
    ],
    detail: {
      headline: 'Events, payments, vendors — unified.',
      sections: [
        {
          title: 'What It Does',
          body: 'Sheska is a fintech event management platform that handles seamless guest integration, vendor discovery, payment processing, and event experiences in one place.',
        },
        {
          title: 'Tech Stack',
          body: 'React frontend with TypeScript, Bootstrap + MUI for UI, Node.js backend, Firebase BaaS for serverless infrastructure, PostgreSQL for data persistence.',
        },
      ],
    },
  },
];

export default function Projects() {
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);

  return (
    <section className="section" id="projects">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="section-label">Discoveries</div>
        <h2 className="section-title">Projects</h2>
      </motion.div>

      <div className={styles.grid}>
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className={`${styles.card} ${project.priority ? styles.featured : ''}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelected(project)}
          >
            {/* Gradient top bar */}
            <div className={styles.gradientBar} style={{ background: project.gradient }} />

            <div className={styles.cardInner}>
              {project.priority && (
                <span className="tag tag-solar" style={{ marginBottom: 12, display: 'inline-flex' }}>
                  ★ Featured Project
                </span>
              )}

              <h3 className={styles.name}>{project.name}</h3>
              <p className={styles.tagline}>{project.tagline}</p>
              <p className={styles.desc}>{project.description}</p>

              {/* Stats */}
              <div className={styles.stats}>
                {project.stats.map((s) => (
                  <div key={s.label} className={styles.stat}>
                    <div className={styles.statValue} style={{ color: project.accent }}>{s.value}</div>
                    <div className={styles.statLabel}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className={styles.tags}>
                {project.tags.slice(0, 5).map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>

              <div className={styles.cta} style={{ borderColor: project.accent + '40' }}>
                <span style={{ color: project.accent }}>View Details</span>
                <ExternalLink size={14} style={{ color: project.accent }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            {/* Wrapping in modalWrapper to ensure centering isn't overridden by framer motion inline styles */}
            <div className={styles.modalWrapper}>
              <motion.div
                className={styles.modal}
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
              >
                <div className={styles.modalGradient} style={{ background: selected.gradient }} />

                <div className={styles.modalHeader}>
                  <div>
                    <h2 className={styles.modalTitle}>{selected.name}</h2>
                    <p className={styles.modalHeadline}>{selected.detail.headline}</p>
                  </div>
                  <div className={styles.modalActions}>
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe size={16} />
                      <span>Visit</span>
                    </a>
                    <button className={styles.closeBtn} onClick={() => setSelected(null)}>
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className={styles.modalSections}>
                  {selected.detail.sections.map((s, i) => (
                    <motion.div
                      key={s.title}
                      className={styles.modalSection}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <h4 className={styles.modalSectionTitle} style={{ color: selected.accent }}>
                        {s.title}
                      </h4>
                      <p className={styles.modalSectionBody}>{s.body}</p>
                    </motion.div>
                  ))}
                </div>

                <div className={styles.modalTags}>
                  {selected.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
