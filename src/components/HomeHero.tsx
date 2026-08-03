import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft,
  UploadCloud,
  Zap,
  BookOpen,
  BarChart3,
  Building
} from 'lucide-react';

interface HomeHeroProps {
  onActionClick: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onActionClick }) => {
  const [activeIdx, setActiveIdx] = useState(2); // Set Step 2 (Evaluation) as active initially (the center slide)
  const [isHovered, setIsHovered] = useState(false);
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const autoPlayRef = useRef<(() => void) | null>(null);

  const steps = [
    {
      id: 0,
      title: "Batch Script Upload",
      icon: <UploadCloud size={16} />,
      color: "var(--gta-pink)",
      promptText: "Upload raw scans or low-contrast handwritten answer scripts...",
      visual: (
        <div className="card-visual-container">
          <div className="stacked-papers">
            <div className="paper-sheet p1">
              <div className="paper-line"></div>
              <div className="paper-line short"></div>
            </div>
            <div className="paper-sheet p2">
              <div className="paper-line"></div>
              <div className="paper-line short"></div>
            </div>
            <div className="paper-sheet p3">
              <div className="scanning-laser"></div>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px auto 4px' }}>
                <UploadCloud size={18} color="var(--gta-pink)" />
              </div>
              <div className="paper-line" style={{ background: 'var(--gta-pink)' }}></div>
              <div className="paper-line short" style={{ background: 'var(--gta-pink)' }}></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "OCR Handwriting Parsing",
      icon: <Zap size={16} />,
      color: "var(--gta-cyan)",
      promptText: "Transcribe cursive writing and handwritten papers to text...",
      visual: (
        <div className="card-visual-container">
          <div className="perspective-grid">
            <div className="grid-mesh"></div>
            <div className="grid-sphere"></div>
            <span className="float-symbol" style={{ top: '25%', left: '15%', animationDelay: '0s' }}>α</span>
            <span className="float-symbol" style={{ top: '15%', left: '75%', animationDelay: '1s' }}>f(x)</span>
            <span className="float-symbol" style={{ top: '45%', left: '60%', animationDelay: '2s' }}>∑</span>
            <span className="float-symbol" style={{ top: '35%', left: '30%', animationDelay: '3s' }}>dy/dx</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Rubric-based Evaluation",
      icon: <BookOpen size={16} />,
      color: "var(--gta-purple)",
      promptText: "Evaluate responses against custom rubric marking schemes...",
      visual: (
        <div className="card-visual-container">
          <div className="particle-rings">
            <div className="concentric-ring r1"></div>
            <div className="concentric-ring r2"></div>
            <div className="concentric-ring r3"></div>
            <div className="orb-core"></div>
          </div>
          <div className="particle-swarm">
            <div className="swarm-dot" style={{ top: '80%', left: '30%', '--drift': '15px', animationDelay: '0s' } as any}></div>
            <div className="swarm-dot" style={{ top: '75%', left: '50%', '--drift': '-20px', animationDelay: '0.8s' } as any}></div>
            <div className="swarm-dot" style={{ top: '90%', left: '70%', '--drift': '30px', animationDelay: '1.4s' } as any}></div>
            <div className="swarm-dot" style={{ top: '85%', left: '45%', '--drift': '-10px', animationDelay: '2.1s' } as any}></div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Analytics & Markup Export",
      icon: <BarChart3 size={16} />,
      color: "var(--gta-orange)",
      promptText: "Generate annotated PDFs, scorecards, and class summaries...",
      visual: (
        <div className="card-visual-container">
          <div className="chart-card-viz">
            <div className="chart-bar-row">
              <div className="chart-bar" style={{ '--height': '35px' } as any}></div>
              <div className="chart-bar" style={{ '--height': '60px', animationDelay: '0.2s' } as any}></div>
              <div className="chart-bar" style={{ '--height': '45px', animationDelay: '0.4s' } as any}></div>
              <div className="chart-bar" style={{ '--height': '80px', animationDelay: '0.6s' } as any}></div>
            </div>
            <div style={{
              position: 'absolute',
              top: '25%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 150, 0, 0.12)',
              border: '1px solid var(--gta-orange)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '10px',
              color: 'var(--gta-orange)',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}>
              PUBLISH
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "LMS Sync Integrations",
      icon: <Building size={16} />,
      color: "var(--gta-cyan)",
      promptText: "Synchronize grades and feedback automatically to Canvas, Blackboard, or Moodle...",
      visual: (
        <div className="card-visual-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '130px', height: '110px' }}>
            <div style={{ position: 'absolute', top: '10%', left: '5%', background: 'rgba(230, 0, 126, 0.1)', border: '1px solid var(--gta-pink)', borderRadius: '6px', padding: '3px 6px', fontSize: '9px', color: 'var(--gta-pink)', fontWeight: 'bold' }}>
              Canvas
            </div>
            <div style={{ position: 'absolute', bottom: '15%', left: '10%', background: 'rgba(0, 203, 214, 0.1)', border: '1px solid var(--gta-cyan)', borderRadius: '6px', padding: '3px 6px', fontSize: '9px', color: 'var(--gta-cyan)', fontWeight: 'bold' }}>
              Moodle
            </div>
            <div style={{ position: 'absolute', top: '40%', right: '0%', background: 'rgba(255, 150, 0, 0.1)', border: '1px solid var(--gta-orange)', borderRadius: '6px', padding: '3px 6px', fontSize: '9px', color: 'var(--gta-orange)', fontWeight: 'bold' }}>
              Blackboard
            </div>
            <div className="orb-core" style={{ top: '50%', left: '45%' }}></div>
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

  autoPlayRef.current = nextStep;

  // Autoplay loops
  useEffect(() => {
    if (isHovered) return;
    const play = () => {
      if (autoPlayRef.current) autoPlayRef.current();
    };
    const interval = setInterval(play, 6000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Typing effect hook
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
    }, 35);
    
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
