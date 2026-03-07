'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), { ssr: false });

const PROJECTS = [
  {
    index: '01',
    company: 'Salesloft',
    year: '2024',
    title: 'Influence Graph',
    description:
      'A zero-to-one AI-powered relationship intelligence layer for B2B sales teams — mapping stakeholder influence across accounts to surface hidden decision paths and improve deal velocity.',
    tags: ['AI/ML', 'Data Viz', 'B2B SaaS', '0→1'],
    cta: 'View Case Study →',
    href: '/work/influence-graph',
  },
  {
    index: '02',
    company: 'Salesloft',
    year: '2023',
    title: 'AI Email Assistant',
    description:
      'Designing for generative AI explainability in a productivity context — helping sales reps understand, trust, and appropriately override AI-drafted outreach at scale.',
    tags: ['Generative AI', 'Explainability', 'Productivity'],
    cta: 'View Case Study →',
    href: '/work/ai-email-assistant',
  },
  {
    index: '03',
    company: 'GitHub',
    year: '2022',
    title: 'GitHub',
    description:
      "UX research and systems design for developer tooling at GitHub — contributing to the Pull Request experience redesign and code review workflow improvements for millions of developers.",
    tags: ['Developer Tools', 'UX Research', 'Systems'],
    cta: 'View Case Study →',
    href: '/work/github',
  },
  {
    index: '04',
    company: 'Sony',
    year: '2021',
    title: 'Sony',
    description:
      'Consumer electronics research and design — exploring the intersection of hardware and software in next-generation audio products, grounded in ethnographic research and interaction design.',
    tags: ['Consumer', 'Research', 'Hardware/Software'],
    cta: 'View Deck →',
    href: '/work/sony',
  },
];

const ODDS_ITEMS = [
  { type: 'photo', caption: 'Light through kitchen window, 6am' },
  { type: 'experiment', title: 'Particle Sketch', desc: 'Exploring emergence in p5.js' },
  { type: 'photo', caption: 'Ferry to Bainbridge, overcast' },
  { type: 'experiment', title: 'Recipe Architecture', desc: 'Structuring culinary knowledge' },
  { type: 'photo', caption: 'Pike Place, Tuesday morning' },
  { type: 'photo', caption: 'Shadow patterns, Capitol Hill' },
  { type: 'experiment', title: 'Character Builder', desc: 'Interactive narrative persona tool' },
  { type: 'photo', caption: 'Rain on glass, March' },
  { type: 'experiment', title: 'Type Experiments', desc: 'Kinetic typography studies' },
];

export default function Home() {
  const [nameVisible, setNameVisible] = useState(false);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setNameVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handle = () => {
      if (window.scrollY > 40) setScrollHintVisible(false);
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <>
      <Sidebar />

      {/* HERO */}
      <section id="hero-canvas-wrapper" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <HeroCanvas />

        <div style={{
          position: 'absolute', bottom: '72px', left: '48px',
          opacity: nameVisible ? 1 : 0, transition: 'opacity 0.8s ease',
          pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '18px', color: 'var(--ink)', lineHeight: 1.3 }}>
            Harshita Shyale
          </div>
          <div style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '11px', color: 'var(--ink-muted)', marginTop: '4px' }}>
            Product Designer · Seattle
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
          opacity: scrollHintVisible ? 1 : 0, transition: 'opacity 0.6s ease',
          pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-faint)' }}>
            scroll
          </span>
          <ScrollArrow />
        </div>
      </section>

      {/* WORK */}
      <section id="work" style={{ padding: '80px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '64px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '32px', fontWeight: 400, color: 'var(--ink)', margin: 0 }}>Work</h2>
          <span style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)' }}>2021 — present</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {PROJECTS.map((project, i) => <ProjectCard key={project.index} project={project} i={i} />)}
        </div>
      </section>

      {/* ODDS & ENDS */}
      <section id="odds" style={{ padding: '80px 72px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '32px', fontStyle: 'italic', fontWeight: 400, color: 'var(--ink)', margin: 0 }}>Odds &amp; Ends</h2>
          <span style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)' }}>Visual note-taking</span>
        </div>
        <p style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.8, maxWidth: '480px', marginBottom: '40px' }}>
          This collection of visual notes serves as both documentation and meditation — exploring patterns in the ordinary, and finding meaning in how we move through everyday spaces.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {ODDS_ITEMS.map((item, i) => <OddsCell key={i} item={item} />)}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '80px 72px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '22px', fontStyle: 'italic', fontWeight: 400, color: 'var(--ink)', marginBottom: '28px', lineHeight: 1.4 }}>
              designer &amp; researcher based in Seattle.
            </h2>
            {[
              "I'm Harshita — a product designer with a background in computer science and theatre, specializing in human-centered AI interfaces and systems.",
              "My work lives at the intersection of careful observation, systematic thinking, and design. I combine thorough research with storytelling, creating experiences that resonate at both the system level and the human level.",
              "Over the years I've shaped interfaces at tech giants and startups — working across cloud infrastructure, developer tools, productivity, and healthcare spaces.",
            ].map((para, i) => (
              <p key={i} style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '12.5px', color: 'var(--ink-muted)', lineHeight: 1.85, marginBottom: '20px' }}>{para}</p>
            ))}
            <div style={{ width: '24px', height: '1px', background: 'var(--accent)', margin: '28px 0' }} />
            <p style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '12.5px', color: 'var(--ink-muted)', lineHeight: 1.85 }}>
              When I&apos;m not designing, I&apos;m photographing ordinary moments, cooking something South Indian, or rearranging my apartment plants.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '4px' }}>
            <InfoList heading="Currently" items={['Product Designer · Salesloft / AI Features · Seattle WA']} />
            <InfoList heading="Previously" items={['RPA Developer · HPE', 'Product Design Intern · Nutanix']} />
            <InfoList heading="Education" items={['M.S. Computer Science · 2022', 'B.E. Computer Science · 2020']} />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '80px 72px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '28px', fontStyle: 'italic', color: 'var(--ink)', marginBottom: '24px' }}>
          Let&apos;s work together.
        </p>
        <a href="mailto:harshita@example.com" style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}>
          harshita@example.com
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 72px', display: 'flex', justifyContent: 'space-between' }}>
        <FooterSpan text="Designed & developed by Harshita · © 2025" />
        <FooterSpan text="harshitashyale.com" />
      </footer>
    </>
  );
}

function ScrollArrow() {
  return (
    <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="var(--ink-faint)" strokeWidth="1">
        <line x1="6" y1="0" x2="6" y2="12" /><polyline points="2,9 6,13 10,9" />
      </svg>
    </motion.div>
  );
}

function ProjectCard({ project, i }: { project: typeof PROJECTS[0]; i: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
      style={{ display: 'grid', gridTemplateColumns: '45% 55%', gap: '48px', alignItems: 'start' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
        <div style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)', marginBottom: '12px' }}>
          {project.index} · {project.company} · {project.year}
        </div>
        <Link href={project.href} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '28px', fontWeight: 400, color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.2 }}>{project.title}</h3>
        </Link>
        <p style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.8, marginBottom: '20px' }}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {project.tags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '2px', padding: '4px 10px' }}>{tag}</span>
          ))}
        </div>
        <UnderlineLink href={project.href} text={project.cta} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onClick={() => window.location.href = project.href}
        style={{
          aspectRatio: '16/10', background: 'var(--bg-subtle)',
          backgroundImage: 'repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.08)' : '0 0 0 rgba(0,0,0,0)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer',
        }}>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '11px', color: 'var(--ink-faint)' }}>
          {i < 2 ? 'Prototype video' : 'Case study visuals'}
        </span>
      </motion.div>
    </motion.div>
  );
}

function OddsCell({ item }: { item: { type: string; caption?: string; title?: string; desc?: string } }) {
  const [hovered, setHovered] = useState(false);
  if (item.type === 'photo') {
    return (
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ aspectRatio: '4/3', background: 'var(--bg-subtle)', backgroundImage: 'repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 0, transparent 50%)', backgroundSize: '16px 16px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(20,19,18,0.7)', padding: '12px 14px', transform: hovered ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.25s ease' }}>
          <span style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '11px', color: '#ede9e3' }}>{item.caption}</span>
        </div>
      </div>
    );
  }
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ aspectRatio: '1/1', background: 'var(--bg)', border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', cursor: 'pointer', transition: 'border-color 0.2s ease' }}>
      <span style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '16px', fontStyle: 'italic', color: hovered ? 'var(--accent)' : 'var(--ink)', marginBottom: '8px', transition: 'color 0.2s ease' }}>{item.title}</span>
      <span style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '11px', color: 'var(--ink-faint)', textAlign: 'center' }}>{item.desc}</span>
    </div>
  );
}

function InfoList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)', marginBottom: '10px' }}>{heading}</div>
      {items.map((item, i) => <div key={i} style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.7 }}>{item}</div>)}
    </div>
  );
}

function UnderlineLink({ href, text }: { href: string; text: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '11px', color: 'var(--ink)', textDecoration: 'none', display: 'inline-flex', flexDirection: 'column' }}>
      {text}
      <span style={{ height: '1px', background: 'var(--ink)', width: hovered ? '100%' : '0%', transition: 'width 0.25s ease' }} />
    </Link>
  );
}

function FooterSpan({ text }: { text: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '11px', color: hovered ? 'var(--ink)' : 'var(--ink-faint)', transition: 'color 0.2s ease', cursor: 'default' }}>
      {text}
    </span>
  );
}
