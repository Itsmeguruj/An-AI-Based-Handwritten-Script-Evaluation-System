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
  maxWidth: '600px',
  marginBottom: '48px',
};

const divider: React.CSSProperties = {
  borderTop: 'none',
};

const card: React.CSSProperties = {
  background: 'var(--panel-bg)',
  border: '1px solid var(--panel-border)',
  borderRadius: '16px',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  transition: 'border-color 0.25s, transform 0.25s',
};

const grid3: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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
        <Download size={12} /> Download
      </div>
      <h2 style={sectionTitle}>Get DeepScript</h2>
      <p style={sectionSub}>
        DeepScript runs entirely in your browser — no installation required. Access it from any
        modern desktop browser and start evaluating handwritten scripts within seconds.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Web App', desc: 'Instant access via browser. No setup, no downloads.', icon: <Globe size={20} color="var(--gta-cyan)" />, color: 'var(--gta-cyan)', badge: 'Recommended' },
          { label: 'Desktop (Coming Soon)', desc: 'Native Electron app for offline evaluation and local data storage.', icon: <Download size={20} color="var(--gta-pink)" />, color: 'var(--gta-pink)', badge: 'Soon' },
          { label: 'Self-Host', desc: 'Deploy on your institution\'s private server with custom MongoDB.', icon: <Cpu size={20} color="#a78bfa" />, color: '#a78bfa', badge: 'Enterprise' },
        ].map(({ label, desc, icon, color, badge }) => (
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
            <h4 style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', margin: 0 }}>{label}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', padding: '20px 24px', background: 'rgba(0,203,214,0.04)', border: '1px solid rgba(0,203,214,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <CheckCircle size={18} color="var(--gta-cyan)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', flex: 1 }}>
          <strong style={{ color: 'var(--text-primary)' }}>System requirements:</strong> Any modern browser (Chrome 100+, Edge 100+, Firefox 110+, Safari 16+). No plugin installation needed.
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
        <Zap size={12} /> Features
      </div>
      <h2 style={sectionTitle}>Everything you need to<br />evaluate at scale</h2>
      <p style={sectionSub}>
        DeepScript combines AI-powered OCR with a structured rubric engine, giving educators
        a complete toolkit to grade handwritten exams accurately and efficiently.
      </p>

      <div style={grid3}>
        {[
          { title: 'Qwen 2.5-VL 7B Engine', desc: 'Ultra-precision handwriting and multi-modal document recognition supporting equations, tabular rubrics, and cursive scripts.', icon: <Cpu size={20} />, color: 'var(--gta-cyan)' },
          { title: 'Custom Rubric Builder', desc: 'Define per-question scoring schemas, keywords, deduction rates, and partial mark policies.', icon: <BookOpen size={20} />, color: 'var(--gta-pink)' },
          { title: 'Multi-Coordinator Workflow', desc: 'Assign papers to verified coordinators with built-in access management and audit logs.', icon: <Users size={20} />, color: '#a78bfa' },
          { title: 'Real-Time Scorecard', desc: 'Live per-question marks with inline AI-generated feedback and confidence scores.', icon: <BarChart3 size={20} />, color: '#34d399' },
          { title: 'OTP-Secured Login', desc: 'Two-factor authentication for both coordinators and administrators. No session leaks.', icon: <Shield size={20} />, color: '#f59e0b' },
          { title: 'PDF Export', desc: 'Export fully-styled evaluation scorecards as PDF reports, ready to share with students.', icon: <FileText size={20} />, color: 'var(--gta-cyan)' },
        ].map(({ title, desc, icon, color }) => (
          <div
            key={title}
            style={card}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--panel-border)'; }}
          >
            <div style={iconCircle(color)}>
              {React.cloneElement(icon as React.ReactElement<any>, { color })}
            </div>
            <h4 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>{title}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{desc}</p>
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
  { title: 'Getting Started', items: ['Creating your Admin account', 'Registering Coordinators', 'Setting up MongoDB Atlas', 'Environment variables (.env)'] },
  { title: 'Rubric Configuration', items: ['Rubric JSON schema', 'Setting per-question marks', 'Keyword matching policies', 'Partial credit rules'] },
  { title: 'Evaluation Workflow', items: ['Uploading answer scripts', 'Choosing OCR model', 'Reviewing AI scorecard', 'Approving & publishing marks'] },
  { title: 'Admin Portal', items: ['Coordinator access management', 'System audit logs', 'Mass notifications', 'Assigning papers'] },
  { title: 'API Reference', items: ['POST /api/auth/register', 'POST /api/auth/login-initiate', 'POST /api/auth/login-verify', 'GET /api/auth/coordinators'] },
  { title: 'Self-Hosting', items: ['Docker deployment guide', 'Reverse proxy setup (Nginx)', 'SSL/TLS configuration', 'Backup & restore'] },
];

export const DocsSection: React.FC = () => (
  <section id="docs" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(0,203,214,0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0,203,214,0.3)' }}>
        <FileText size={12} /> Documentation
      </div>
      <h2 style={sectionTitle}>Documentation</h2>
      <p style={sectionSub}>
        Everything you need to deploy, configure, and operate DeepScript across your institution.
      </p>

      <div style={grid3}>
        {docTopics.map(({ title, items }) => (
          <div key={title} style={{ ...card }}>
            <h4 style={{ fontWeight: '700', fontSize: '14px', color: 'var(--gta-cyan)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h4>
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

      <div style={{ marginTop: '40px', textAlign: 'center', padding: '40px', background: 'var(--panel-bg)', border: '1px dashed var(--panel-border)', borderRadius: '16px' }}>
        <BookOpen size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>Full documentation is currently being compiled.</p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Check back soon or contact your system administrator.</p>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   CHANGELOG
═══════════════════════════════════════════════════════════════════ */
const releases = [
  {
    version: 'v1.2.0',
    date: 'July 2026',
    tag: 'Latest',
    tagColor: 'var(--gta-cyan)',
    changes: [
      { type: 'New', text: 'Two-factor OTP login for coordinators via SMTP email gateway' },
      { type: 'New', text: 'System activity logs with role-based filtering' },
      { type: 'Improved', text: 'Mass notification compose modal with coordinator selection' },
      { type: 'Fixed', text: 'Local JSON database fallback when MongoDB Atlas is offline' },
    ],
  },
  {
    version: 'v1.1.0',
    date: 'June 2026',
    tag: 'Stable',
    tagColor: '#34d399',
    changes: [
      { type: 'New', text: 'Qwen 2.5-VL 7B model integration with ultra-precision document vision & math recognition' },
      { type: 'New', text: 'Custom rubric builder with keyword matching policies' },
      { type: 'Improved', text: 'Dark/light theme toggle with full CSS variable system' },
      { type: 'Fixed', text: 'PDF scorecard export alignment and margin issues' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'May 2026',
    tag: 'Initial',
    tagColor: '#a78bfa',
    changes: [
      { type: 'New', text: 'Core AI evaluation workspace with paper upload' },
      { type: 'New', text: 'Admin portal with coordinator management' },
      { type: 'New', text: 'MongoDB Atlas + local JSON database dual storage' },
      { type: 'New', text: 'Registration/login flow with bcrypt password hashing' },
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
        <Clock size={12} /> Changelog
      </div>
      <h2 style={sectionTitle}>What's new in DeepScript</h2>
      <p style={sectionSub}>
        A running history of features, improvements, and bug fixes shipped with each release.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {releases.map(r => (
          <div key={r.version} style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Version sidebar */}
            <div style={{ minWidth: '140px', flexShrink: 0 }}>
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
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{c.text}</span>
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
    tag: 'Engineering',
    tagColor: 'var(--gta-cyan)',
    date: 'Jul 2, 2026',
    title: 'How GOT-OCR 2.0 handles cursive and mixed-language answer scripts',
    desc: 'A deep dive into the vision transformer architecture behind DeepScript\'s core OCR pipeline, and how we fine-tuned it for education-specific handwriting.',
  },
  {
    tag: 'Product',
    tagColor: 'var(--gta-pink)',
    date: 'Jun 20, 2026',
    title: 'Building a rubric engine that thinks like an examiner',
    desc: 'We share how we designed the rubric configuration system to support keyword matching, partial credit, and penalty deductions — all configurable per question.',
  },
  {
    tag: 'Case Study',
    tagColor: '#a78bfa',
    date: 'Jun 10, 2026',
    title: 'From 3 days to 3 hours: grading 800 scripts at GECM',
    desc: 'How a pilot deployment of DeepScript at GECM\'s CSE department reduced manual evaluation time from 72 hours to under 4 hours per exam cycle.',
  },
];

export const BlogSection: React.FC = () => (
  <section id="blog" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(0,203,214,0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0,203,214,0.3)' }}>
        <Rss size={12} /> Blog
      </div>
      <h2 style={sectionTitle}>From the DeepScript team</h2>
      <p style={sectionSub}>
        Engineering insights, product updates, and real-world case studies from the teams building and deploying DeepScript.
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: p.tagColor, fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>
              Read more <ArrowRight size={12} />
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
    name: 'Academic Free',
    price: '₹0',
    period: '/ forever',
    color: 'var(--gta-cyan)',
    desc: 'Perfect for individual educators and small departments.',
    features: ['Up to 3 coordinators', '500 scripts / month', 'All OCR models', 'Email OTP login', 'PDF export', 'Local JSON fallback DB'],
  },
  {
    name: 'Institution',
    price: '₹4,999',
    period: '/ month',
    color: 'var(--gta-pink)',
    highlight: true,
    desc: 'For colleges and universities running high-volume evaluations.',
    features: ['Unlimited coordinators', 'Unlimited scripts', 'Priority OCR processing', 'Custom SMTP gateway', 'Audit log export', 'MongoDB Atlas managed'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    color: '#a78bfa',
    desc: 'Full white-label deployment for examination boards and state bodies.',
    features: ['On-premise self-hosted', 'SLA-backed support', 'SSO / LDAP integration', 'Custom rubric APIs', 'Dedicated account manager', 'Data residency guarantee'],
  },
];

export const PricingSection: React.FC = () => (
  <section id="pricing" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(255,42,133,0.1)', color: 'var(--gta-pink)', border: '1px solid rgba(255,42,133,0.3)' }}>
        <Tag size={12} /> Pricing
      </div>
      <h2 style={sectionTitle}>Simple, transparent pricing</h2>
      <p style={sectionSub}>
        Start free with no credit card required. Upgrade when your institution needs more scale.
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
              <span style={{ fontSize: '32px', fontWeight: '800', color: p.color, letterSpacing: '-1px' }}>{p.price}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{p.period}</span>
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
    title: 'University Semester Exams',
    desc: 'Evaluate hundreds of handwritten answer booklets per batch. Coordinators grade assigned papers while admins track progress and export final scorecards.',
  },
  {
    icon: <Building size={22} />,
    color: 'var(--gta-pink)',
    title: 'Competitive Entrance Exams',
    desc: 'High-throughput processing with strict rubric enforcement ensures consistent, bias-free scoring across large applicant pools.',
  },
  {
    icon: <Layers size={22} />,
    color: '#a78bfa',
    title: 'Internal Assessment & Quizzes',
    desc: 'Upload short-answer quiz scans and receive instant AI-suggested marks per question — with confidence thresholds for borderline answers.',
  },
  {
    icon: <Users size={22} />,
    color: '#34d399',
    title: 'Multi-Department Collaboration',
    desc: 'Each department runs its own workspace under the same admin umbrella. Coordinators are scoped to their assigned papers only.',
  },
  {
    icon: <Shield size={22} />,
    color: '#f59e0b',
    title: 'Examination Boards',
    desc: 'Enterprise-grade self-hosted deployments for state examination bodies needing data residency, SSO, and SLA-backed uptime.',
  },
  {
    icon: <BarChart3 size={22} />,
    color: 'var(--gta-cyan)',
    title: 'Analytics & Reporting',
    desc: 'Track cohort performance, identify weak areas, and generate per-student reports — all from the evaluation data captured during grading.',
  },
];

export const UseCasesSection: React.FC = () => (
  <section id="cases" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(0,203,214,0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0,203,214,0.3)' }}>
        <Layers size={12} /> Use Cases
      </div>
      <h2 style={sectionTitle}>Built for every evaluation context</h2>
      <p style={sectionSub}>
        From small classroom quizzes to nationwide board exams — DeepScript adapts to the scale and structure of your institution.
      </p>

      <div style={grid3}>
        {cases.map(c => (
          <div
            key={c.title}
            style={card}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--panel-border)'; }}
          >
            <div style={iconCircle(c.color)}>
              {React.cloneElement(c.icon as React.ReactElement<any>, { color: c.color })}
            </div>
            <h4 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>{c.title}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
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
      <div style={{ ...pill, background: 'rgba(255,42,133,0.1)', color: 'var(--gta-pink)', border: '1px solid rgba(255,42,133,0.3)' }}>
        <Globe size={12} /> About
      </div>
      <h2 style={sectionTitle}>About DeepScript</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start', flexWrap: 'wrap' }}>
        <div>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { label: 'Founded', value: '2026' },
            { label: 'Founder', value: 'Guru Raghavendra J & Team' },
            { label: 'Headquarters', value: 'GECM, Mosalehosahalli, India' },
            { label: 'Core Stack', value: 'React + Node.js + MongoDB + Qwen 2.5-VL 7B' },
            { label: 'Status', value: 'Development' },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '16px 20px', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{value}</div>
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
  { title: 'What we collect', body: 'We collect name, email address, mobile number, institution, department, and username during coordinator registration. Passwords are stored as bcrypt hashes and never in plain text.' },
  { title: 'How we use your data', body: 'Your data is used solely to authenticate your session, manage workspace access, and communicate verification OTPs. We do not sell or share your data with any third party.' },
  { title: 'Data storage', body: 'Data is stored in MongoDB Atlas (cloud) with encryption at rest, or locally in JSON files when the cloud database is unavailable. Only administrators can access coordinator records.' },
  { title: 'OTP & email', body: 'OTPs sent via SMTP are single-use and expire after 10 minutes. We never store OTP codes after verification. Email addresses are used only for authentication and system notifications.' },
  { title: 'Cookies & sessions', body: 'DeepScript uses localStorage to persist your login session client-side. No third-party tracking cookies are used. Your session data is cleared on logout.' },
  { title: 'Your rights', body: 'You may request deletion of your account and all associated data by contacting your institution administrator. Data portability and export will be supported in future releases.' },
];

export const PrivacySection: React.FC = () => (
  <section id="privacy" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(0,203,214,0.1)', color: 'var(--gta-cyan)', border: '1px solid rgba(0,203,214,0.3)' }}>
        <Lock size={12} /> Privacy
      </div>
      <h2 style={sectionTitle}>Privacy Policy</h2>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '40px' }}>Last updated: July 2026</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '760px' }}>
        {privacySections.map(s => (
          <div key={s.title}>
            <h4 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px' }}>{s.title}</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   TERMS
═══════════════════════════════════════════════════════════════════ */
const termsSections = [
  { title: '1. Acceptance of Terms', body: 'By registering as a coordinator or logging in as an administrator, you agree to be bound by these Terms of Service. If you do not agree, you may not use DeepScript.' },
  { title: '2. Authorized Use', body: 'DeepScript is provided exclusively for educational evaluation purposes within accredited institutions. Unauthorized access attempts, credential sharing, or use for non-evaluation purposes is strictly prohibited.' },
  { title: '3. Account Responsibility', body: 'You are responsible for maintaining the confidentiality of your login credentials. Report any unauthorized access to your institution administrator immediately. You are liable for all activity under your account.' },
  { title: '4. Data & Evaluation Content', body: 'All answer scripts and rubric configurations uploaded to DeepScript belong to your institution. DeepScript does not claim ownership of any evaluation data or academic content.' },
  { title: '5. AI-Generated Scores', body: 'AI-generated marks are suggestions and must be reviewed by an authorized evaluator before being published or communicated to students. DeepScript is not responsible for final grade decisions.' },
  { title: '6. Service Availability', body: 'DeepScript is provided on a best-effort basis. We do not guarantee 100% uptime. Critical evaluations should have offline contingency plans. The local JSON fallback database provides continuity during cloud outages.' },
  { title: '7. Modifications', body: 'We reserve the right to modify these terms at any time. Continued use of the service after modifications constitutes acceptance of the updated terms.' },
];

export const TermsSection: React.FC = () => (
  <section id="terms" style={divider}>
    <div style={sectionWrap}>
      <div style={{ ...pill, background: 'rgba(255,42,133,0.1)', color: 'var(--gta-pink)', border: '1px solid rgba(255,42,133,0.3)' }}>
        <FileText size={12} /> Terms
      </div>
      <h2 style={sectionTitle}>Terms of Service</h2>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '40px' }}>Last updated: July 2026</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '760px' }}>
        {termsSections.map(s => (
          <div key={s.title}>
            <h4 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px' }}>{s.title}</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
