import Mission from '@/components/Mission';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MissionPage() {
  return (
    <main style={{ backgroundColor: '#000', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Link 
        href="/" 
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--plasma)',
          fontFamily: 'var(--font-mono)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '0.85rem',
          backdropFilter: 'blur(10px)',
          padding: '12px 20px',
          borderRadius: '999px',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          background: 'rgba(13, 13, 43, 0.5)'
        }}
      >
        <ArrowLeft size={16} /> RETURN TO BASE
      </Link>
      <Mission />
    </main>
  );
}
