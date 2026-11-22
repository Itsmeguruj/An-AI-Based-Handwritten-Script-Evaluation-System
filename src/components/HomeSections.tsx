import React from 'react';
import {
  Download,
  Zap,
  FileText,
  Clock,
  Rss,
  Tag,
  Layers,
  Shield,
  Lock,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Cpu,
  Globe,
  Users,
  GraduationCap,
  Building,
  BarChart3,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

/* ── shared styles ───────────────────────────────────────────────── */
const sectionWrap: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '24px 32px 32px',
};

const sectionTitle: React.CSSProperties = {
  fontSize: 'clamp(28px, 4vw, 44px)',
  fontWeight: '800',
  letterSpacing: '-1.5px',
  color: 'var(--text-primary)',
  marginBottom: '16px',
  lineHeight: 1.1,
};

const sectionSub: React.CSSProperties = {
  fontSize: '16px',
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
  maxWidth: '640px',
  marginBottom: '44px',
};

const divider: React.CSSProperties = {
  borderTop: 'none',
};

const card: React.CSSProperties = {
  background: 'var(--panel-bg)',
  border: '1px solid var(--panel-border)',
  borderRadius: '16px',
  padding: '26px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  transition: 'border-color 0.25s, transform 0.25s',
  textAlign: 'left',
};

const grid3: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
  gap: '24px',
};

const iconCircle = (color: string): React.CSSProperties => ({
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  background: `${color}18`,
  border: `1px solid ${color}40`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const pill: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  marginBottom: '12px',
};

/* ═══════════════════════════════════════════════════════════════════
   DOWNLOAD
═══════════════════════════════════════════════════════════════════ */
export const DownloadSection: React.FC = () => (
  <section id="download" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(0,203,214,0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0,203,214,0.3)' }}>
        <Download size={12} /> Deployment & Downloads
      </div>
      <h2 style={sectionTitle}>Deploy DeepScript Evaluation Suite</h2>
      <p style={sectionSub}>
        Cross-platform runtime environments engineered for web browsers, desktop evaluation suites, CLI batch ingestion, and on-premise institutional servers.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
        {[
          { 
            label: 'Web Evaluation Studio', 
            desc: 'Zero-installation browser studio with WebAssembly PDF rendering, real-time SVG polygon overlay, and responsive coordinate mapping.', 
            icon: <Globe size={20} color="var(--gta-cyan)" />, 
            color: 'var(--gta-cyan)', 
            badge: 'Recommended',
            spec: 'Chrome 100+, Edge 100+, Firefox 110+, Safari 16+'
          },
          { 
            label: 'Evaluation CLI & Batch Runner', 
            desc: 'Headless batch ingestion utility for processing hundreds of scanned answer booklet PDFs with Otsu contour segmentation and JSON gradebook exports.', 
            icon: <Cpu size={20} color="var(--gta-pink)" />, 
            color: 'var(--gta-pink)', 
            badge: 'CLI Terminal',
            spec: 'Node.js 18+ / Python 3.10+ / Linux, macOS, Windows'
          },
          { 
            label: 'Local Engine & Offline Runner', 
            desc: 'On-premise Express & JSON fallback backend ensuring complete zero-data-egress evaluations without requiring active internet connectivity.', 
            icon: <Download size={20} color="#a78bfa" />, 
            color: '#a78bfa', 
            badge: 'Offline First',
            spec: 'Zero cloud leaks, local storage persistence, instant recovery'
          },
          { 
            label: 'Mobile & Tablet Scanner Client', 
            desc: 'Camera scanner client for high-resolution desk capture of physical answer sheets with automatic keystone correction and de-skewing.', 
            icon: <Layers size={20} color="#34d399" />, 
            color: '#34d399', 
            badge: 'App Store / Play Store',
            spec: 'Android, iOS, and PWA camera integration'
          },
        ].map(({ label, desc, icon, color, badge, spec }) => (
          <div
            key={label}
            style={card}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--panel-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={iconCircle(color)}>{icon}</div>
              <span style={{ fontSize: '10px', fontWeight: '700', color, background: `${color}15`, border: `1px solid ${color}30`, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.5px' }}>{badge}</span>
            </div>
            <h4 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>{label}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{desc}</p>
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--panel-border)', fontSize: '11px', color: 'var(--text-muted)' }}>
              {spec}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '36px', padding: '18px 22px', background: 'rgba(0,203,214,0.04)', border: '1px solid rgba(0,203,214,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', textAlign: 'left' }}>
        <CheckCircle2 size={18} color="var(--gta-cyan)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)', flex: 1, lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-primary)' }}>System Compatibility:</strong> DeepScript client operates instantly in modern web browsers without native plugin dependencies. For local server execution, Node.js 18+ and npm are pre-configured.
        </span>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   FEATURES
═══════════════════════════════════════════════════════════════════ */
export const FeaturesSection: React.FC = () => (
  <section id="features" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(255,42,133,0.1)', color: 'var(--gta-pink)', border: '1px solid rgba(255,42,133,0.3)' }}>
        <Zap size={12} /> Vision & Rubric Architecture
      </div>
      <h2 style={sectionTitle}>Engineered for Precision<br />Examination Grading</h2>
      <p style={sectionSub}>
        DeepScript combines intelligent computer vision, contour segmentation, and multimodal vision models to eliminate subjective evaluation bottlenecks.
      </p>

      <div style={grid3}>
        {[
          { 
            title: 'Circled Question Anchor Detection', 
            desc: 'Radial ray circularity scanning detects handwritten circled numbers (①, ②, 4)), irregular loops, and sub-questions (1a, 1b) as visual anchors for answer initiation.', 
            icon: <Zap size={20} />, 
            color: 'var(--gta-cyan)' 
          },
          { 
            title: 'Tight Line Bounding (HPP / VPP Profiling)', 
            desc: 'Horizontal and Vertical Projection Profiling segments individual handwriting lines into tight bounding boxes hugging ink without margin bleed.', 
            icon: <Layers size={20} />, 
            color: 'var(--gta-pink)' 
          },
          { 
            title: 'Multi-Page Block Stitching Engine', 
            desc: 'Intelligently identifies and combines scattered answer blocks, out-of-order questions, and multi-page answer continuations with 6-D confidence scoring.', 
            icon: <Sparkles size={20} />, 
            color: '#a78bfa' 
          },
          { 
            title: 'VTU 5-Module Scheme Ingestion', 
            desc: 'Hierarchical extraction of university question papers (e.g. BCS304), structuring Q1 OR Q2 options, 20M module caps, and validating 100M total parity.', 
            icon: <BookOpen size={20} />, 
            color: '#34d399' 
          },
          { 
            title: 'Step-Type Rubric Partitioning', 
            desc: 'Granular mark allocation across Principle/Formula, Derivation/Steps, Diagram/Labels, and Final Output with explicit partial credit and penalty rules.', 
            icon: <Sliders size={20} />, 
            color: '#f59e0b' 
          },
          { 
            title: 'Dual-Engine Multimodal AI Evaluation', 
            desc: 'Vision-Language Models (Gemini 2.0 Flash / OpenRouter VLM) grade consolidated answers with strictness calibration (80% VTU Standard) and step justifications.', 
            icon: <BarChart3 size={20} />, 
            color: 'var(--gta-cyan)' 
          },
        ].map(({ title, desc, icon, color }) => (
          <div
            key={title}
            style={card}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--panel-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={iconCircle(color)}>
              {React.cloneElement(icon as React.ReactElement<any>, { color })}
            </div>
            <h4 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>{title}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   DOCS
═══════════════════════════════════════════════════════════════════ */
const docTopics = [
  { 
    title: 'Pipeline & Vision Architecture', 
    items: ['Ingestion Pipeline Overview', 'Circled Anchor Radial Ray Scanning', 'Horizontal & Vertical Projection Profiling', 'Multi-Page Continuation Graph'] 
  },
  { 
    title: 'Administrator Operations Manual', 
    items: ['Uploading VTU Examination Papers', 'Generating Benchmark Model Answers', 'Mark Allocation & Criterion Parity', 'Assigning Script Batches to Coordinators'] 
  },
  { 
    title: 'Coordinator Review Studio Guide', 
    items: ['Reviewing CV Detected Blocks', 'Adjusting Grab Handles & Polygons', 'Merging & Splitting Blocks', 'Approving Scripts for AI Dual-Engine Grading'] 
  },
  { 
    title: 'Multimodal Vision Model Config', 
    items: ['Gemini 2.0 Flash API Integration', 'OpenRouter VLM Endpoints', 'Rubric Strictness Tuning (0–100%)', 'Temperature & Anti-Hallucination Controls'] 
  },
  { 
    title: 'API Endpoints & Integration', 
    items: ['POST /api/extract-pdf-text', 'POST /api/assignments', 'POST /api/reverted-results', 'GET /api/auth/coordinators'] 
  },
  { 
    title: 'Security & Local Offline Fallback', 
    items: ['Zero-Cloud JSON Fallback Architecture', 'MongoDB Atlas Dual Mode', 'Single-Use SMTP OTP Security', '20-Minute Inactivity Auto-Lock'] 
  },
];

export const DocsSection: React.FC = () => (
  <section id="docs" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(0,203,214,0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0,203,214,0.3)' }}>
        <FileText size={12} /> Documentation & Architecture
      </div>
      <h2 style={sectionTitle}>Technical Architecture & Guides</h2>
      <p style={sectionSub}>
        Comprehensive developer documentation, coordinator audit handbooks, and multimodal vision pipeline specifications.
      </p>

      <div style={grid3}>
        {docTopics.map(({ title, items }) => (
          <div key={title} style={{ ...card }}>
            <h4 style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--gta-cyan)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ArrowRight size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'default' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '36px', padding: '24px', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={iconCircle('var(--gta-cyan)')}>
            <BookOpen size={20} color="var(--gta-cyan)" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Engine Stack Quick Reference</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              React 19 + TypeScript + Vite • Express API • Multimodal Vision Models (Gemini / OpenRouter) • OpenCV Canvas Profiling
            </p>
          </div>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--gta-cyan)', background: 'rgba(0, 203, 214, 0.1)', border: '1px solid rgba(0, 203, 214, 0.3)', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
          v2.1.0 Architecture Verified
        </span>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   CHANGELOG
═══════════════════════════════════════════════════════════════════ */
const releases = [
  {
    version: 'v2.1.0',
    date: 'November 2026',
    tag: 'Latest',
    tagColor: 'var(--gta-cyan)',
    changes: [
      { type: 'New', text: 'Circled Question Anchor Recognition with radial ray circularity geometry and subquestion parsing (1a, 1b)' },
      { type: 'New', text: 'Horizontal & Vertical Projection Profiling (HPP/VPP) for tight text-line boundary fitting without margin bleed' },
      { type: 'New', text: 'Multi-page answer continuation detection with 6-dimension confidence scoring matrix' },
      { type: 'Improved', text: 'Coordinator Review Studio with interactive SVG polygon overlays and real canvas Auto-Fit' },
      { type: 'Improved', text: 'Google-style eye-soothing ambient edge glows and auto-sliding architecture showcase carousel' },
    ],
  },
  {
    version: 'v2.0.0',
    date: 'October 2026',
    tag: 'Major Release',
    tagColor: '#34d399',
    changes: [
      { type: 'New', text: 'High-precision VTU 5-Module Scheme Ingestion with Choice Set validation (Q1 OR Q2)' },
      { type: 'New', text: '4-dimension step-type rubric generation (Principle, Derivation, Diagram, Final Output)' },
      { type: 'New', text: 'Dual-Engine Multimodal AI Evaluation (Gemini 2.0 Flash & OpenRouter VLM)' },
      { type: 'New', text: 'Automatic 20-minute inactivity session lock & multi-role coordinator verification' },
      { type: 'Fixed', text: 'Dark and light theme persistence across all review studios and modals' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'May 2026',
    tag: 'Academic Capstone',
    tagColor: '#a78bfa',
    changes: [
      { type: 'New', text: 'Core handwritten answer booklet evaluation studio by Guru Raghavendra J & Team at GECM' },
      { type: 'New', text: 'Dual storage architecture (MongoDB Atlas cloud + local JSON fallback engine)' },
      { type: 'New', text: 'Two-factor coordinator authentication via SMTP email verification' },
    ],
  },
];

const typeBadge: Record<string, React.CSSProperties> = {
  New: { background: 'rgba(0,203,214,0.12)', color: 'var(--gta-cyan)', border: '1px solid rgba(0,203,214,0.3)' },
  Improved: { background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' },
  Fixed: { background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' },
};

export const ChangelogSection: React.FC = () => (
  <section id="changelog" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(255,42,133,0.1)', color: 'var(--gta-pink)', border: '1px solid rgba(255,42,133,0.3)' }}>
        <Clock size={12} /> Changelog & Releases
      </div>
      <h2 style={sectionTitle}>DeepScript Engine Evolution</h2>
      <p style={sectionSub}>
        A running history of computer vision upgrades, pedagogical rubric engines, and coordinator review suite releases.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {releases.map(r => (
          <div key={r.version} style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap', textAlign: 'left' }}>
            {/* Version sidebar */}
            <div style={{ minWidth: '150px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-primary)' }}>{r.version}</span>
                <span style={{ fontSize: '9px', fontWeight: '700', color: r.tagColor, background: `${r.tagColor}15`, border: `1px solid ${r.tagColor}30`, padding: '2px 6px', borderRadius: '20px', letterSpacing: '0.5px' }}>{r.tag}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.date}</span>
            </div>
            {/* Changes */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {r.changes.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '4px', flexShrink: 0, marginTop: '2px', letterSpacing: '0.3px', ...(typeBadge[c.type] || {}) }}>{c.type}</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   BLOG
═══════════════════════════════════════════════════════════════════ */
const posts = [
  {
    tag: 'Computer Vision',
    tagColor: 'var(--gta-cyan)',
    date: 'Nov 12, 2026',
    title: 'Beyond Rectangular Bounding: Extracting Irregular Handwritten Answers with Contour Ray Scanning and Projection Profiling',
    desc: 'A deep technical breakdown of how DeepScript combines radial ray circularity tests for circled question numbers with horizontal projection profiling (HPP) to tightly hug ink boundaries without margin bleed or sibling collisions.',
  },
  {
    tag: 'Rubric AI',
    tagColor: 'var(--gta-pink)',
    date: 'Oct 28, 2026',
    title: 'Eliminating Examiner Subjectivity: Translating University Evaluation Schemes into Step-Level Multimodal Rubrics',
    desc: 'How DeepScript structures university question papers into explicit dimensions (Principle, Derivation, Diagram, Final Output) and enforces semantic synonym tolerance without requiring rigid verbatim matching.',
  },
  {
    tag: 'Architecture',
    tagColor: '#a78bfa',
    date: 'Oct 14, 2026',
    title: 'Zero-Cloud Fallback: Engineering an Examination Suite with Offline JSON Storage and In-Memory Inference',
    desc: 'Analyzing our zero-data-egress architecture designed for university examination confidentiality, ensuring continuous grading during network cuts and safeguarding student privacy.',
  },
];

export const BlogSection: React.FC = () => (
  <section id="blog" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(0,203,214,0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0,203,214,0.3)' }}>
        <Rss size={12} /> Engineering & Research Articles
      </div>
      <h2 style={sectionTitle}>Technical Insights from the Team</h2>
      <p style={sectionSub}>
        In-depth research papers, computer vision breakdowns, and examination architecture insights from Guru Raghavendra J & the development team.
      </p>

      <div style={grid3}>
        {posts.map(p => (
          <article
            key={p.title}
            style={{ ...card, cursor: 'default' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = p.tagColor; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--panel-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: p.tagColor, background: `${p.tagColor}15`, border: `1px solid ${p.tagColor}30`, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.5px' }}>{p.tag}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.date}</span>
            </div>
            <h4 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{p.title}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: p.tagColor, fontSize: '12px', fontWeight: '600', marginTop: 'auto', paddingTop: '8px' }}>
              Read Technical Paper <ArrowRight size={12} />
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   PRICING
═══════════════════════════════════════════════════════════════════ */
const plans = [
  {
    name: 'Academic Capstone & Review',
    price: '₹0',
    period: '/ Academic License',
    color: 'var(--gta-cyan)',
    desc: 'Fully unlocked for academic evaluation, project expos, and viva-voce defense at GECM.',
    features: [
      'Full CV handwritten script parsing',
      'Circled question anchor detection (①, ②)',
      'Local JSON zero-cloud storage fallback',
      'Coordinator Review Studio & Auto-Fit',
      'Verified scorecard PDF export',
      'VTU 5-Module Choice Scheme validation',
    ],
  },
  {
    name: 'Department & College Center',
    price: '₹4,999',
    period: '/ exam cycle',
    color: 'var(--gta-pink)',
    highlight: true,
    desc: 'For engineering departments running high-volume semester examinations.',
    features: [
      'Unlimited coordinator assignments',
      'High-throughput batch script ingestion',
      'Dual-engine multimodal AI scoring',
      'Automated SMTP OTP two-factor auth',
      'Audit log tracking & grade exports',
      'Dedicated MongoDB Atlas cloud sync',
    ],
  },
  {
    name: 'State Examination Board',
    price: 'Custom',
    period: 'Institutional Contract',
    color: '#a78bfa',
    desc: 'Enterprise-grade on-premise deployment for university examination boards.',
    features: [
      'On-premise local GPU inference (Qwen-VL / Ollama)',
      'University SSO / LDAP integration',
      'Multi-evaluator moderation & re-evaluation',
      'Custom rubric ingestion APIs',
      'Dedicated data residency & SLA guarantees',
      'Complete institutional white-label branding',
    ],
  },
];

export const PricingSection: React.FC = () => (
  <section id="pricing" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(255,42,133,0.1)', color: 'var(--gta-pink)', border: '1px solid rgba(255,42,133,0.3)' }}>
        <Tag size={12} /> Deployment Tiers
      </div>
      <h2 style={sectionTitle}>Academic & Institutional Plans</h2>
      <p style={sectionSub}>
        Transparent, accessible options for academic capstone demonstration, department grading centers, and university examination boards.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {plans.map(p => (
          <div
            key={p.name}
            style={{
              ...card,
              ...(p.highlight ? { border: `1.5px solid ${p.color}`, background: `${p.color}07`, boxShadow: `0 8px 32px ${p.color}18` } : {}),
            }}
          >
            {p.highlight && (
              <span style={{ fontSize: '10px', fontWeight: '700', color: p.color, background: `${p.color}20`, border: `1px solid ${p.color}40`, padding: '3px 10px', borderRadius: '20px', alignSelf: 'flex-start', letterSpacing: '0.5px' }}>
                Most Popular
              </span>
            )}
            <h4 style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', margin: 0 }}>{p.name}</h4>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '30px', fontWeight: '800', color: p.color, letterSpacing: '-1px' }}>{p.price}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.period}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{p.desc}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {p.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={13} color={p.color} style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   USE CASES
═══════════════════════════════════════════════════════════════════ */
const cases = [
  {
    icon: <GraduationCap size={22} />,
    color: 'var(--gta-cyan)',
    title: 'VTU University Semester Exams',
    desc: 'Parses complex 5-module university exam booklets (e.g. BCS304) with internal choices (Q1 OR Q2), stitching multi-page continuation answers and enforcing exact 100-mark validation.',
  },
  {
    icon: <Building size={22} />,
    color: 'var(--gta-pink)',
    title: 'Internal Assessments & Quizzes',
    desc: 'Enables rapid turnaround for classroom tests with instant handwritten block extraction and 6-D confidence scoring for quick professor review.',
  },
  {
    icon: <Users size={22} />,
    color: '#a78bfa',
    title: 'Multi-Valuator Re-Evaluation & Moderation',
    desc: 'Eliminates subjective examiner bias with standardized step-type rubrics, transparent mark justifications, and visual highlight overlays.',
  },
  {
    icon: <Shield size={22} />,
    color: '#34d399',
    title: 'Academic Project Expos & Viva-Voce Defense',
    desc: 'Live capstone project defense showcase, highlighting multimodal computer vision, automated anchor recognition, and zero-data-harvesting privacy.',
  },
  {
    icon: <Layers size={22} />,
    color: '#f59e0b',
    title: 'Physical-to-Digital Examination Archiving',
    desc: 'Converts physical answer booklets into encrypted, searchable digital archives with OCR-indexed student answers.',
  },
  {
    icon: <BarChart3 size={22} />,
    color: 'var(--gta-cyan)',
    title: 'Diagrammatic & Mathematical Evaluation',
    desc: 'Evaluates technical circuit diagrams, memory architecture drawings, and step-by-step mathematical proofs with dedicated step-type rubrics.',
  },
];

export const UseCasesSection: React.FC = () => (
  <section id="cases" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(0,203,214,0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0,203,214,0.3)' }}>
        <Layers size={12} /> Real-World Scenarios
      </div>
      <h2 style={sectionTitle}>Built for University & Institutional Rigor</h2>
      <p style={sectionSub}>
        From VTU engineering semester exams to competitive evaluations — DeepScript adapts to complex handwriting and layout styles.
      </p>

      <div style={grid3}>
        {cases.map(c => (
          <div
            key={c.title}
            style={card}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--panel-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={iconCircle(c.color)}>
              {React.cloneElement(c.icon as React.ReactElement<any>, { color: c.color })}
            </div>
            <h4 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>{c.title}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════════════════════ */
export const AboutSection: React.FC = () => (
  <section id="about" style={divider}>
    <div style={sectionWrap}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <div style={{ ...pill, background: 'rgba(255,42,133,0.1)', color: 'var(--gta-pink)', border: '1px solid rgba(255,42,133,0.3)' }}>
          <Globe size={12} /> About Platform
        </div>
        <div style={{ ...pill, background: 'rgba(0, 203, 214, 0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0, 203, 214, 0.3)' }}>
          <GraduationCap size={12} /> College Main Project • GECM
        </div>
      </div>
      
      <h2 style={sectionTitle}>About DeepScript</h2>

      {/* College Main Project Declaration & Team Lead Commercial / App Store Rights */}
      <div style={{
        background: 'rgba(0, 203, 214, 0.04)',
        border: '1px solid rgba(0, 203, 214, 0.22)',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '36px',
        textAlign: 'left',
        boxShadow: '0 4px 20px rgba(0, 203, 214, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Shield size={20} color="var(--gta-cyan)" />
          <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
            College Main Project Declaration & Team Lead Commercial / App Store Rights
          </h4>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
          <strong>DeepScript</strong> is an engineering undergraduate final-year main capstone project engineered by <strong>Guru Raghavendra J (Team Lead)</strong> and the student engineering team at <strong>Government Engineering College, Mosalehosahalli (GECM)</strong>. As the primary creators, developers, and team lead, the student team holds full intellectual attribution, academic copyright, and unrestricted rights to use, showcase, defend, demonstrate, deploy, and publish this software for academic viva-voce examinations, degree fulfillment, project expos, and educational research. Furthermore, the Team Lead and creators reserve all worldwide rights to further develop the platform, package mobile/desktop builds, and publish DeepScript across the Apple App Store, Google Play Store, Microsoft Store, and commercial ed-tech channels.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'left' }}>
          <p style={{ ...sectionSub, marginBottom: '20px' }}>
            DeepScript is an AI-powered handwritten answer script evaluation studio built for modern educational institutions.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
            Born out of frustration with manual grading bottlenecks, DeepScript combines state-of-the-art OCR with a structured rubric engine to bring speed, consistency, and transparency to the evaluation process.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Our mission is to eliminate the inequality of inconsistent manual grading — giving every student a fair, data-backed, objectively scored result while saving educators hundreds of hours per exam cycle.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Project Type', value: 'Undergraduate Engineering Main Project' },
            { label: 'Founder & Team Lead', value: 'Guru Raghavendra J & Team' },
            { label: 'Headquarters / Institution', value: 'GECM, Mosalehosahalli, India' },
            { label: 'Academic Department', value: 'Computer Science & Engineering' },
            { label: 'Core Technology Stack', value: 'React + Node.js + MongoDB + Multimodal VLM' },
            { label: 'Distribution Roadmap', value: 'Web SaaS + Apple App Store + Google Play Store' },
            { label: 'Development Status', value: 'Active Academic Evaluation & Enhancement' },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '12px 18px', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '10px', textAlign: 'left' }}>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   PRIVACY
═══════════════════════════════════════════════════════════════════ */
const privacySections = [
  { 
    title: '1. Scope & Academic Privacy Commitment', 
    body: 'DeepScript ("we", "our", or "the platform"), engineered as an undergraduate engineering final-year main capstone project by Guru Raghavendra J (Team Lead) and the student engineering team at Government Engineering College, Mosalehosahalli (GECM), is committed to safeguarding the privacy and security of educational institutions, evaluators, faculty coordinators, and students. This Privacy Policy details our data governance standards in compliance with the Digital Personal Data Protection Act (DPDPA 2023), student educational records privacy principles (FERPA-aligned), and Google Play / Apple App Store developer data protection guidelines.' 
  },
  { 
    title: '2. Information We Collect', 
    body: 'We collect minimal, strictly necessary data required to deliver secure examination assessment services: \n• Evaluator & Coordinator Account Information: Full name, institutional email address, mobile phone number, department, college/institution name, username, and encrypted credentials (salted bcrypt password hashes). \n• Examination & Answer Script Data: Digitized student handwritten answer sheet images, course codes (e.g. BCS304), question paper schemas, model answers, and rubric criteria files uploaded by administrators. \n• Authentication & Audit Records: Single-use One-Time Passwords (OTPs) sent via SMTP, evaluation timestamp logs, coordinator mark adjustment audit trails, and authenticated session tokens. \n• Technical Diagnostics: Browser user agent, screen resolution, and local IP addresses logged strictly for authentication security and coordinator verification.' 
  },
  { 
    title: '3. Student Script Privacy & Zero Commercial Harvesting', 
    body: 'We maintain a strict Zero-Commercial-Harvesting Guarantee: All student answer booklets, handwriting scans, and awarded marks belong exclusively to the student and their respective academic institution. DeepScript DOES NOT sell, monetize, broker, or license student answer scripts or evaluation records to advertisers, data brokers, or commercial third parties. Student handwritten script data is NEVER harvested or utilized to train public commercial AI foundation models.' 
  },
  { 
    title: '4. Purpose of Processing & Legal Basis', 
    body: 'Data collected through DeepScript is processed strictly for legitimate academic assessment purposes: \n• Authenticating authorized faculty administrators and verified evaluation coordinators. \n• Executing computer-vision layout analysis, circled question-number anchor recognition, and handwriting boundary segmentation. \n• Facilitating dual-engine AI rubric scoring (Gemini 2.0 Flash / OpenRouter VLM) with human-in-the-loop coordinator approval. \n• Maintaining an immutable, tamper-evident audit ledger of marks awarded and coordinator corrections.' 
  },
  { 
    title: '5. Storage, Security & Cryptographic Protection', 
    body: '• Cloud Encryption: Records stored in MongoDB Atlas are safeguarded using AES-256 encryption at rest and TLS 1.3 encryption in transit. \n• Offline Local Resilience: When operating in offline JSON storage mode, all evaluation data remains strictly on the host institution\'s local machine, ensuring zero data egress outside the institutional boundary. \n• Credential Hashing: Passwords are encrypted using salted bcrypt hashing. Single-use OTPs are cryptographically hashed, valid for only 10 minutes, and permanently purged immediately upon verification or expiry.' 
  },
  { 
    title: '6. Third-Party AI Inference & Boundary Protections', 
    body: 'When administrators configure multimodal vision models (e.g., Google Gemini API, OpenRouter, or local Ollama engines) for automated scoring, script snippets and rubric keys are transmitted exclusively over encrypted HTTPS/TLS channels directly to the designated inference endpoint. Requests utilize enterprise zero-data-retention API headers; data is processed ephemerally in volatile memory for evaluation and discarded immediately after returning the score breakdown.' 
  },
  { 
    title: '7. App Store & Mobile Platform Privacy (EULA Compliance)', 
    body: 'For desktop builds or future mobile/tablet applications distributed via the Apple App Store, Google Play Store, or Microsoft Store: \n• Camera & File Storage Access: Requested on-demand solely to allow coordinators to scan or upload answer booklet PDFs/images. No background camera access or unauthorized file reading is performed. \n• Zero Tracking & Analytics: DeepScript contains zero third-party advertising SDKs, behavioral tracking pixels, or cross-app identifier tracking.' 
  },
  { 
    title: '8. Cookies, Local Storage & Session Timeout', 
    body: 'DeepScript does not employ tracking cookies. We utilize browser localStorage solely to maintain your authenticated JWT session state and visual theme preference (dark/light mode). For examination security, all active coordinator sessions are automatically locked after 20 minutes of inactivity to prevent unauthorized terminal access.' 
  },
  { 
    title: '9. Data Retention & Account Deletion Rights', 
    body: 'Evaluators, coordinators, and academic institutions retain full control over their information: Coordinators may review, update their verified mobile contact details, or request account removal through their institution administrator. Administrators have the authority to archive, export, or permanently delete student answer scripts, block assignments, and evaluation records upon completion of academic evaluation cycles.' 
  },
  { 
    title: '10. Protection of Minors', 
    body: 'DeepScript is designed exclusively for collegiate, university, and professional academic grading suites. Direct account registration is restricted to faculty members, certified evaluators, and academic administrators aged 18 and older.' 
  },
  { 
    title: '11. Policy Updates & Notifications', 
    body: 'We may periodically update this Privacy Policy to accommodate new vision engine features or evolving data protection regulations. The latest revision date will always be visible at the top of this policy, and significant modifications will be communicated through in-app administrative notices.' 
  },
  { 
    title: '12. Data Protection Contact & Institutional Office', 
    body: 'For privacy inquiries, audit log verification, or data deletion requests, contact the DeepScript Project Team Lead: Guru Raghavendra J (Student Team Lead) • Department of Computer Science & Engineering, Government Engineering College, Mosalehosahalli (GECM), Hassan, Karnataka 573212, India.' 
  },
];

export const PrivacySection: React.FC = () => (
  <section id="privacy" style={divider}>
    <div style={sectionWrap}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <div style={{ ...pill, background: 'rgba(0,203,214,0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0,203,214,0.3)' }}>
          <Lock size={12} /> Privacy & Data Protection
        </div>
        <div style={{ ...pill, background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          <Shield size={12} /> Zero Commercial Data Harvesting
        </div>
      </div>
      
      <h2 style={sectionTitle}>Privacy Policy</h2>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
        Standard Institutional Data Governance & App Store Privacy Policy • Last updated: July 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '780px', textAlign: 'left' }}>
        {privacySections.map(s => (
          <div key={s.title} style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '18px' }}>
            <h4 style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--text-primary)', marginBottom: '6px' }}>{s.title}</h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-line' }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   TERMS AND CONDITIONS & USAGE AGREEMENTS
═══════════════════════════════════════════════════════════════════ */
const termsSections = [
  { 
    title: '1. Acceptance of Terms', 
    body: 'By registering as an evaluation coordinator, logging in as an administrator, or accessing DeepScript services, you agree to be bound by these Terms and Conditions. If you do not agree with any provision of these terms, you must immediately refrain from accessing or utilizing the platform.' 
  },
  { 
    title: '2. Permitted Educational & Evaluative Use', 
    body: 'DeepScript is provided for educational evaluation, academic benchmarking, and university exam rubric testing. Authorized users agree to operate the platform strictly in accordance with ethical academic standards. Any unauthorized commercial exploitation, external credential leasing, or malicious reverse-engineering is strictly prohibited.' 
  },
  { 
    title: '3. Intellectual Property & Ownership Rights', 
    body: 'All software, codebases, computer-vision parsing algorithms, user interface designs, and documentation remain the intellectual property of the primary creators and development team. No ownership rights are transferred to end-users or institutions beyond the limited non-exclusive license granted herein.' 
  },
  { 
    title: '4. App Store & Digital Distribution EULA', 
    body: 'When accessed or downloaded via digital application marketplaces (including Apple App Store, Google Play Store, or Microsoft Store), users are granted a limited, revocable, non-exclusive, and non-transferable license to execute the application on personal or institutional client devices in compliance with standard App Store terms. Modifying application binaries, redistributing cracked packages, or bypassing licensing checks is prohibited.' 
  },
  { 
    title: '5. User Accounts & Credential Security', 
    body: 'Users are responsible for safeguarding their login credentials and session tokens. Coordinators must obtain administrator approval and secret verification keys before accessing student scripts. Any unauthorized account usage must be reported to the institution administrator immediately. You are legally responsible for all actions taken under your credentials.' 
  },
  { 
    title: '6. Student Answer Scripts & Academic Privacy', 
    body: 'All handwritten student answer booklets, question papers, syllabus schemas, and institutional rubric keys uploaded to DeepScript remain the exclusive academic property of the institution, faculty, and respective students. DeepScript processes script images within the institution perimeter and does not sell, harvest, or transmit student data to unauthorized third-party commercial entities.' 
  },
  { 
    title: '7. AI Evaluative Assistance & Human-in-the-Loop Principle', 
    body: 'AI-generated scores, confidence metrics, and step-level criterion breakdowns generated by DeepScript multimodal AI engines (Gemini 2.0 Flash / OpenRouter VLM) serve as intelligent decision-support assistance for educators. In strict accordance with university examination standards, all marks must be audited, reviewed, and finalized by authorized human evaluators or coordinators before official gradebook publication.' 
  },
  { 
    title: '8. In-App Purchases, Features & Token Quotas', 
    body: 'Future application store releases may offer optional tiered features, script evaluation volume packages, and AI inference token quotas. Billing, cancellations, and renewals processed via Apple In-App Purchase or Google Play In-App Billing are governed by platform billing rules in conjunction with applicable institutional licensing agreements.' 
  },
  { 
    title: '9. Service Availability, Backups & Offline Fallback', 
    body: 'DeepScript is provided on a best-effort basis without warranties of continuous 100% uptime. To prevent data loss during examination cycles, DeepScript includes a local JSON database fallback that maintains evaluation states during cloud or network outages. Institutions are advised to maintain independent archival backups of final gradebooks.' 
  },
  { 
    title: '10. Software Updates & Platform Evolution', 
    body: 'The development team reserves the right to deliver software updates, patch algorithmic boundaries, upgrade vision models, or deprecate legacy versions via over-the-air (OTA) updates and app store release cycles. Users are encouraged to maintain the latest approved release to guarantee parser accuracy and coordinate alignment.' 
  },
  { 
    title: '11. Limitation of Liability & Academic Disclaimer', 
    body: 'To the maximum extent permitted by applicable law, the developers and DeepScript team shall not be liable for any indirect, incidental, or consequential damages resulting from platform use, examination delays, or AI-generated score disparities. Final grading authority remains strictly with accredited institutional examiners.' 
  },
  { 
    title: '12. Governing Law & Dispute Resolution', 
    body: 'These terms shall be governed by and construed in accordance with the applicable laws and institutional academic regulations of Karnataka, India, under the academic project jurisdiction of the Department of Computer Science & Engineering, Government Engineering College, Mosalehosahalli.' 
  },
];

export const TermsSection: React.FC = () => (
  <section id="terms" style={divider}>
    <div style={sectionWrap}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <div style={{ ...pill, background: 'rgba(255,42,133,0.1)', color: 'var(--gta-pink)', border: '1px solid rgba(255,42,133,0.3)' }}>
          <FileText size={12} /> Terms
        </div>
        <div style={{ ...pill, background: 'rgba(0, 203, 214, 0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0, 203, 214, 0.3)' }}>
          <Shield size={12} /> Standard Terms & Conditions
        </div>
      </div>
      
      <h2 style={sectionTitle}>Terms and Conditions</h2>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
        Standard End-User Terms, Licensing & Usage Agreements • Last updated: July 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '780px', textAlign: 'left' }}>
        {termsSections.map(s => (
          <div key={s.title} style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '18px' }}>
            <h4 style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--text-primary)', marginBottom: '6px' }}>{s.title}</h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
