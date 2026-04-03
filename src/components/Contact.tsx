'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Link2, ExternalLink } from 'lucide-react';
import styles from './Contact.module.css';

const contactItems = [
  {
    icon: <Phone size={20} />,
    label: 'Phone',
    value: '(585) 362-6165',
    href: 'tel:5853626165',
    color: '#00f0ff',
  },
  {
    icon: <Mail size={20} />,
    label: 'Email',
    value: 'asharrahman02@gmail.com',
    href: 'mailto:asharrahman02@gmail.com',
    color: '#ffd700',
  },
  {
    icon: <Link2 size={20} />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/ashar-rahman',
    href: 'https://www.linkedin.com/in/ashar-rahman/',
    color: '#7b2ff7',
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

    // Simulate transmission animation then open email client
    setTimeout(() => {
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
      window.open(`mailto:asharrahman02@gmail.com?subject=${subject}&body=${body}`);
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    }, 1200);
  };

  return (
    <section className="section" id="contact">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="section-label">Establish Comms</div>
        <h2 className="section-title">Get In Touch</h2>
        <p className={styles.intro}>
          Open to exciting opportunities, collaborations, and conversations.
          <br />
          Let&apos;s build something remarkable.
        </p>
      </motion.div>

      <div className={styles.layout}>
        {/* Contact cards */}
        <div className={styles.cards}>
          {contactItems.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={styles.contactCard}
              style={{ '--accent': item.color } as React.CSSProperties}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ x: 6 }}
            >
              <span className={styles.contactIcon} style={{ color: item.color, borderColor: item.color + '30', background: item.color + '12' }}>
                {item.icon}
              </span>
              <div>
                <div className={styles.contactLabel}>{item.label}</div>
                <div className={styles.contactValue}>{item.value}</div>
              </div>
              <ExternalLink size={14} className={styles.contactArrow} />
            </motion.a>
          ))}

          {/* Signal animation */}
          <div className={styles.signal}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={styles.signalRing}
                style={{ animationDelay: `${n * 0.5}s` }}
              />
            ))}
            <div className={styles.signalCore} />
          </div>
        </div>

        {/* Form */}
        <motion.div
          className={styles.formWrap}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input name="name" required className={styles.input} placeholder="Your name" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input name="email" type="email" required className={styles.input} placeholder="your@email.com" />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Message</label>
              <textarea
                name="message"
                required
                className={styles.textarea}
                placeholder="Tell me about your project or opportunity..."
                rows={5}
              />
            </div>

            <button
              type="submit"
              className={`${styles.submitBtn} ${sending ? styles.sending : ''} ${sent ? styles.sent : ''}`}
              disabled={sending || sent}
            >
              {sent ? (
                <>✓ Transmission Sent — Check Your Email App</>
              ) : sending ? (
                <>
                  <span className={styles.transmitting}>Transmitting</span>
                  <span className={styles.dots} />
                </>
              ) : (
                <>Transmit Message</>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      <div className={styles.footer}>
        <p>Made with ❤ in New York · © {new Date().getFullYear()} Ashar Rahman</p>
      </div>
    </section>
  );
}
