'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import styles from './Contact.module.css';

const contactItems = [
  {
    icon: <Phone size={14} />,
    label: 'Phone',
    value: '(585) 362-6165',
    href: 'tel:5853626165',
  },
  {
    icon: <Mail size={14} />,
    label: 'Email',
    value: 'asharrahman02@gmail.com',
    href: 'mailto:asharrahman02@gmail.com',
  },
  {
    icon: <ExternalLink size={14} />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/ashar-rahman',
    href: 'https://www.linkedin.com/in/ashar-rahman/',
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    setSending(true);

    setTimeout(() => {
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
      window.open(`mailto:asharrahman02@gmail.com?subject=${subject}&body=${body}`);
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    }, 800);
  };

  return (
    <section className="section" id="contact">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="section-label">connect</div>
        <h2 className="section-title">Get In Touch</h2>
        <p className={styles.intro}>
          Open to opportunities, collaborations, and conversations.
          <br />
          Let&apos;s build something.
        </p>
      </motion.div>

      <div className={styles.layout}>
        {/* Contact links */}
        <div className={styles.cards}>
          {contactItems.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={styles.contactCard}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <span className={styles.contactIcon}>{item.icon}</span>
              <div>
                <div className={styles.contactLabel}>{item.label}</div>
                <div className={styles.contactValue}>{item.value}</div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Form */}
        <motion.div
          className={styles.formWrap}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>name</label>
                <input name="name" required className={styles.input} placeholder="_" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>email</label>
                <input name="email" type="email" required className={styles.input} placeholder="_" />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>message</label>
              <textarea
                name="message"
                required
                className={styles.textarea}
                placeholder="..."
                rows={5}
              />
            </div>

            <button
              type="submit"
              className={`${styles.submitBtn} ${sending ? styles.sending : ''} ${sent ? styles.sent : ''}`}
              disabled={sending || sent}
            >
              {sent ? (
                <>✓ sent — check your email app</>
              ) : sending ? (
                <>sending...</>
              ) : (
                <>send message</>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      <div className={styles.footer}>
        <p>made in new york · © {new Date().getFullYear()} ashar rahman</p>
      </div>
    </section>
  );
}
