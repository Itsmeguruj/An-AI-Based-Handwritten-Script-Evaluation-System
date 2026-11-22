import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft,
  FileText,
  Scan,
  Layers,
  Sparkles,
  ShieldCheck,
  Link2
} from 'lucide-react';

interface HomeHeroProps {
  onActionClick: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onActionClick }) => {
  const [activeIdx, setActiveIdx] = useState(2); // Set Step 3 (Stitching / Coordinator Review) as active initially (center slide)
  const [displayedPrompt, setDisplayedPrompt] = useState('');

  const steps = [
    {
      id: 0,
      title: "Question Paper & Rubric Ingestion",
      icon: <FileText size={16} />,
      color: "var(--gta-pink)",
      promptText: "Ingest question papers and model schemes to structure module criteria and mark weights...",
      visual: (
        <div className="card-visual-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative', width: '100%', maxWidth: '205px' }}>
            <div style={{ flex: 1, background: 'var(--panel-bg-solid)', border: '1px solid var(--panel-border)', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
              <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--gta-pink)', marginBottom: '5px' }}>QP SCHEMA</div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginBottom: '4px' }}></div>
              <div style={{ height: '3px', width: '70%', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', marginBottom: '5px' }}></div>
              <div style={{ display: 'flex', gap: '3px', marginTop: '6px' }}>
                <span style={{ fontSize: '8px', padding: '1px 4px', background: 'rgba(230,0,126,0.15)', color: 'var(--gta-pink)', borderRadius: '2px', fontWeight: 'bold' }}>Q1: 5M</span>
                <span style={{ fontSize: '8px', padding: '1px 4px', background: 'rgba(230,0,126,0.15)', color: 'var(--gta-pink)', borderRadius: '2px', fontWeight: 'bold' }}>Q2: 5M</span>
              </div>
            </div>
            <div style={{ flex: 1, background: 'var(--panel-bg-solid)', border: '1px solid var(--panel-border)', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
              <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--gta-cyan)', marginBottom: '5px' }}>MODEL RUBRIC</div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginBottom: '4px' }}></div>
              <div style={{ height: '3px', width: '80%', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', marginBottom: '5px' }}></div>
              <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '5px' }}>Step-wise Bounds</div>
            </div>
          </div>
          <div className="scanning-laser" style={{ top: '50%' }}></div>
          <div style={{ marginTop: '12px', background: 'rgba(230, 0, 126, 0.12)', border: '1px solid var(--gta-pink)', borderRadius: '4px', padding: '2px 8px', fontSize: '9px', color: 'var(--gta-pink)', fontWeight: 'bold', letterSpacing: '0.4px' }}>
            SCHEMA EXTRACTED
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Circled Anchor & Boundary Parsing",
      icon: <Scan size={16} />,
      color: "var(--gta-cyan)",
      promptText: "Detect handwritten circled anchors (①, ②, 4)) with projection profile text line segmentation...",
      visual: (
        <div className="card-visual-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '14px' }}>
          <div style={{ width: '195px', background: 'var(--panel-bg-solid)', border: '1px solid var(--panel-border)', borderRadius: '6px', padding: '10px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid var(--gta-cyan)', color: 'var(--gta-cyan)', fontSize: '10px', fontWeight: 'bold' }}>①</span>
              <span style={{ fontSize: '9.5px', fontWeight: '700', color: 'var(--gta-cyan)' }}>Anchor Q1</span>
              <span style={{ fontSize: '8px', color: 'var(--text-muted)', marginLeft: 'auto' }}>98% Conf</span>
            </div>
            {/* Fitted text lines with grab box */}
            <div style={{ border: '1.5px dashed var(--gta-cyan)', borderRadius: '4px', padding: '6px', background: 'rgba(0, 203, 214, 0.05)', position: 'relative' }}>
              <div style={{ height: '3px', width: '90%', background: 'rgba(255,255,255,0.25)', borderRadius: '2px', marginBottom: '5px' }}></div>
              <div style={{ height: '3px', width: '75%', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginBottom: '5px' }}></div>
              <div style={{ height: '3px', width: '60%', background: 'rgba(255,255,255,0.18)', borderRadius: '2px' }}></div>
              {/* Corner grab handles */}
              <div style={{ position: 'absolute', top: '-3px', left: '-3px', width: '6px', height: '6px', background: 'var(--gta-cyan)', borderRadius: '1px' }}></div>
              <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '6px', height: '6px', background: 'var(--gta-cyan)', borderRadius: '1px' }}></div>
              <div style={{ position: 'absolute', bottom: '-3px', left: '-3px', width: '6px', height: '6px', background: 'var(--gta-cyan)', borderRadius: '1px' }}></div>
              <div style={{ position: 'absolute', bottom: '-3px', right: '-3px', width: '6px', height: '6px', background: 'var(--gta-cyan)', borderRadius: '1px' }}></div>
            </div>
          </div>
          <div style={{ marginTop: '8px', background: 'rgba(0, 203, 214, 0.12)', border: '1px solid var(--gta-cyan)', borderRadius: '4px', padding: '2px 8px', fontSize: '9px', color: 'var(--gta-cyan)', fontWeight: 'bold' }}>
            HPP / VPP TIGHT FIT
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Intelligent Block Stitching",
      icon: <Layers size={16} />,
      color: "var(--gta-purple)",
      promptText: "Stitch scattered answer blocks and multi-page continuations (e.g. Q1b continued on Page 5)...",
      visual: (
        <div className="card-visual-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '210px', justifyContent: 'center' }}>
            {/* Page 2 Block */}
            <div style={{ width: '85px', background: 'var(--panel-bg-solid)', border: '1px solid var(--panel-border)', borderRadius: '6px', padding: '6px', fontSize: '8.5px' }}>
              <div style={{ color: '#93c5fd', fontWeight: 'bold', marginBottom: '3px' }}>Page 2: Q1b</div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '1px', marginBottom: '3px' }}></div>
              <div style={{ height: '3px', width: '70%', background: 'rgba(255,255,255,0.15)', borderRadius: '1px', marginBottom: '4px' }}></div>
              <span style={{ fontSize: '7.5px', color: '#60a5fa', background: 'rgba(37,99,235,0.2)', padding: '1px 3px', borderRadius: '2px' }}>contd...</span>
            </div>
            
            {/* Connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <Link2 size={14} color="var(--gta-purple)" />
              <div style={{ width: '18px', height: '2px', background: 'var(--gta-purple)' }}></div>
            </div>

            {/* Page 5 Block */}
            <div style={{ width: '85px', background: 'var(--panel-bg-solid)', border: '1px solid var(--panel-border)', borderRadius: '6px', padding: '6px', fontSize: '8.5px' }}>
              <div style={{ color: '#93c5fd', fontWeight: 'bold', marginBottom: '3px' }}>Page 5: Q1b</div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '1px', marginBottom: '3px' }}></div>
              <div style={{ height: '3px', width: '85%', background: 'rgba(255,255,255,0.15)', borderRadius: '1px', marginBottom: '4px' }}></div>
              <span style={{ fontSize: '7.5px', color: '#10b981', background: 'rgba(16,185,129,0.2)', padding: '1px 3px', borderRadius: '2px' }}>unified</span>
            </div>
          </div>
          <div style={{ marginTop: '12px', background: 'rgba(147, 51, 234, 0.15)', border: '1px solid var(--gta-purple)', borderRadius: '4px', padding: '2px 8px', fontSize: '9px', color: '#c084fc', fontWeight: 'bold' }}>
            CONSOLIDATED ANSWER STITCH
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Dual-Engine Rubric Evaluation",
      icon: <Sparkles size={16} />,
      color: "var(--gta-orange)",
      promptText: "Evaluate responses against rubric criteria with step marks and examination choice exclusion rules...",
      visual: (
        <div className="card-visual-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '12px' }}>
          <div style={{ width: '200px', background: 'var(--panel-bg-solid)', border: '1px solid var(--panel-border)', borderRadius: '6px', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Question 1 Evaluation</span>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--gta-orange)' }}>4.5 / 5.0</span>
            </div>
            {/* Criteria breakdown rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '8px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Concept & Definition</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>2.0/2.0</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ width: '100%', height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                <span>• Implementation Flow</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>2.5/2.5</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--gta-orange)', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '8px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 5px', borderRadius: '3px' }}>Choice Policy: Top Marks Counted</span>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Coordinator Audit & Gradebook",
      icon: <ShieldCheck size={16} />,
      color: "var(--gta-cyan)",
      promptText: "Coordinator review queues, revert verification loops, booklet audit logs, and certified scorebooks...",
      visual: (
        <div className="card-visual-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '14px' }}>
          <div style={{ width: '190px', background: 'var(--panel-bg-solid)', border: '1px solid var(--panel-border)', borderRadius: '6px', padding: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '9px', fontFamily: 'monospace', color: 'var(--gta-cyan)', fontWeight: 'bold' }}>BKT-2026-33</span>
              <span style={{ fontSize: '8.5px', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>✓ APPROVED</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Score: 15 / 25
            </div>
            <div style={{ display: 'flex', gap: '4px', fontSize: '8px', color: 'var(--text-muted)' }}>
              <span>• Audit Trail Logged</span>
              <span>• Signed & Sealed</span>
            </div>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
            <span style={{ fontSize: '8.5px', background: 'rgba(0, 203, 214, 0.12)', border: '1px solid var(--gta-cyan)', color: 'var(--gta-cyan)', padding: '2px 7px', borderRadius: '4px', fontWeight: 'bold' }}>
              AUDIT VERIFIED
            </span>
            <span style={{ fontSize: '8.5px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)', padding: '2px 7px', borderRadius: '4px', fontWeight: 'bold' }}>
              PDF REPORT
            </span>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    setActiveIdx(prev => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setActiveIdx(prev => (prev - 1 + steps.length) % steps.length);
  };

  // Automated banner sliding timer (slides smoothly every 3.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % steps.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [activeIdx, steps.length]);

  // Typing effect hook for current active step
  useEffect(() => {
    const fullText = steps[activeIdx].promptText;
    setDisplayedPrompt('');
    let currentText = '';
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText[index];
        setDisplayedPrompt(currentText);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 22);
    
    return () => clearInterval(interval);
  }, [activeIdx]);

  const getCardPosition = (idx: number) => {
    if (idx === activeIdx) return 'active';
    const diff = idx - activeIdx;
    if (diff === -1 || (diff === steps.length - 1)) return 'prev';
    if (diff === 1 || (diff === -(steps.length - 1))) return 'next';
    if (diff === -2 || (diff === steps.length - 2)) return 'far-prev';
    if (diff === 2 || (diff === -(steps.length - 2))) return 'far-next';
    return 'hidden';
  };

  return (
    <div style={{ textAlign: 'center', padding: '15px 20px 15px', position: 'relative', zIndex: 2 }}>
      {/* Header Capsule tag */}
      <div style={{ display: 'inline-flex', marginBottom: '10px' }}>
        <div className="status-tag-capsule">
          <span className="pulsar-dot" style={{ 
            width: '6px', 
            height: '6px', 
            background: 'var(--gta-pink)', 
            borderRadius: '50%', 
            display: 'inline-block'
          }}></span>
          <span className="status-tag-text">
            Next gen Script Evolution System
          </span>
        </div>
      </div>

      {/* Title */}
      <h1 style={{ 
        fontSize: 'clamp(36px, 6vw, 60px)', 
        fontWeight: '900', 
        lineHeight: '1.15', 
        marginBottom: '10px',
        letterSpacing: '-1.5px'
      }}>
        Evaluate Handwriting <br />
        With The Speed of{' '}
        <span className="gta-text-gradient text-shimmer">
          Neural Intelligence.
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{ 
        fontSize: 'clamp(15px, 2.5vw, 18px)', 
        color: 'var(--text-secondary)', 
        maxWidth: '720px', 
        margin: '0 auto 16px',
        lineHeight: '1.6'
      }}>
        Seamlessly parse, score, and sync handwritten student scripts using multimodal vision and custom rubric engines.
      </p>

      {/* Welcome Showcase 3D perspective slider */}
      <div 
        id="how-it-works"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '90px'
        }}
      >
        <div className="carousel-cards-container">
          {/* Glowing aura backdrop behind center card */}
          <div 
            className="carousel-glow-backdrop" 
            style={{
              background: `radial-gradient(circle, ${
                steps[activeIdx].color === 'var(--gta-pink)' ? 'var(--gta-pink-glow)' :
                steps[activeIdx].color === 'var(--gta-cyan)' ? 'var(--gta-cyan-glow)' :
                steps[activeIdx].color === 'var(--gta-purple)' ? 'var(--gta-purple-glow)' :
                steps[activeIdx].color === 'var(--gta-orange)' ? 'var(--gta-orange-glow)' :
                'var(--gta-cyan-glow)'
              } 0%, transparent 70%)`
            }}
          ></div>

          {/* Cards map */}
          {steps.map((step, idx) => {
            const pos = getCardPosition(idx);
            return (
              <div 
                key={step.id} 
                className={`carousel-card ${pos}`}
                onClick={() => setActiveIdx(idx)}
                style={{
                  '--card-accent': step.color,
                  '--card-glow': step.color === 'var(--gta-pink)' ? 'rgba(230, 0, 126, 0.35)' :
                                 step.color === 'var(--gta-cyan)' ? 'rgba(0, 203, 214, 0.35)' :
                                 step.color === 'var(--gta-purple)' ? 'rgba(147, 51, 234, 0.35)' :
                                 step.color === 'var(--gta-orange)' ? 'rgba(255, 150, 0, 0.35)' :
                                 'rgba(0, 203, 214, 0.35)'
                } as React.CSSProperties}
              >
                {/* Simulated Screen / Visual Animation */}
                {step.visual}

                {/* Footer description details */}
                <div style={{ padding: '16px', textAlign: 'left', background: 'var(--panel-bg-solid)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: step.color }}>{step.icon}</span>
                    <strong style={{ fontSize: '12px', color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
                      Step 0{idx + 1}
                    </strong>
                  </div>
                  <h4 style={{ fontSize: '13px', margin: 0, fontWeight: '700', color: 'var(--text-primary)' }}>
                    {step.title}
                  </h4>
                </div>
              </div>
            );
          })}

          {/* Manual Arrow Controls (Google AI Studio styled side controls) */}
          <button 
            type="button" 
            className="slider-nav-btn prev" 
            onClick={(e) => { e.stopPropagation(); prevStep(); }} 
            aria-label="Previous step"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            type="button" 
            className="slider-nav-btn next" 
            onClick={(e) => { e.stopPropagation(); nextStep(); }} 
            aria-label="Next step"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Floating Simulated AI Studio Prompt Box */}
        <div className="carousel-prompt-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, paddingRight: '12px' }}>
            <span style={{ color: steps[activeIdx].color, fontSize: '15px', fontWeight: '800', fontFamily: 'monospace' }}>&gt;</span>
            <p className="prompt-text-line">
              {displayedPrompt}
              <span className="prompt-cursor" style={{ color: steps[activeIdx].color }}>|</span>
            </p>
          </div>
          <button 
            type="button"
            onClick={onActionClick}
            className="prompt-btn-primary"
            style={{ background: '#1a73e8' }}
          >
            Get started <ChevronRight size={14} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </div>

      {/* Step Indicators Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '55px' }}>
        {steps.map((step, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            style={{
              width: activeIdx === idx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: activeIdx === idx ? step.color : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
