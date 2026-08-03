import React, { useState, useEffect, useRef } from 'react';
import { Sliders, KeyRound, Network, MessageSquare, Plus, Check } from 'lucide-react';

export const RubricStudioSlides: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<(() => void) | null>(null);

  const steps = [
    {
      title: "Criterion Builder",
      icon: <Sliders size={18} />,
      color: "var(--gta-pink)",
      description: "Define evaluation parameters, scoring bounds, and weight factors.",
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Active Criteria List</span>
            <button className="badge badge-pink" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'rgba(230, 0, 126, 0.15)' }}>
              <Plus size={12} /> Add new
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {/* Criteria Item 1 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Concept Accuracy</span>
                <span style={{ fontSize: '12px', color: 'var(--gta-pink)', fontWeight: 'bold' }}>Max: 10 pts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ width: '80%', height: '100%', background: 'var(--gta-pink)', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', left: '80%', top: '-3px', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px var(--gta-pink)' }}></div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '30px', textAlign: 'right' }}>80%</span>
              </div>
            </div>

            {/* Criteria Item 2 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Derivation Rigor</span>
                <span style={{ fontSize: '12px', color: 'var(--gta-pink)', fontWeight: 'bold' }}>Max: 6 pts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ width: '60%', height: '100%', background: 'var(--gta-pink)', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', left: '60%', top: '-3px', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px var(--gta-pink)' }}></div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '30px', textAlign: 'right' }}>60%</span>
              </div>
            </div>

            {/* Criteria Item 3 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Academic Style</span>
                <span style={{ fontSize: '12px', color: 'var(--gta-pink)', fontWeight: 'bold' }}>Max: 4 pts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ width: '30%', height: '100%', background: 'var(--gta-pink)', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', left: '30%', top: '-3px', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px var(--gta-pink)' }}></div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '30px', textAlign: 'right' }}>30%</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "AI Reference Key",
      icon: <KeyRound size={18} />,
      color: "var(--gta-cyan)",
      description: "Define standard answers, core facts, and semantic matching anchors.",
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Grading Reference Editor</span>
            <span style={{ fontSize: '11px', color: 'var(--text-cyan)', fontWeight: '600' }}>Active: Q1.3</span>
          </div>

          <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left', lineHeight: '1.5', overflow: 'hidden' }}>
            <span style={{ color: 'var(--text-cyan)' }}># Standard Answer Schema:</span><br />
            The student response must identify that gravity is the <span style={{ background: 'rgba(0, 203, 214, 0.15)', color: '#fff', border: '1px solid var(--gta-cyan)', padding: '1px 3px', borderRadius: '3px' }}>curvature of spacetime</span> caused by the uneven distribution of <span style={{ background: 'rgba(0, 203, 214, 0.15)', color: '#fff', border: '1px solid var(--gta-cyan)', padding: '1px 3px', borderRadius: '3px' }}>mass-energy</span>, as described by Einstein's field equations.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'left' }}>Required Keyword Nodes:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ background: 'rgba(0, 203, 214, 0.1)', border: '1px solid var(--gta-cyan)', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', color: 'var(--text-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={10} /> Curvature of Spacetime
              </span>
              <span style={{ background: 'rgba(0, 203, 214, 0.1)', border: '1px solid var(--gta-cyan)', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', color: 'var(--text-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={10} /> Mass-Energy
              </span>
              <span style={{ background: 'rgba(0, 203, 214, 0.1)', border: '1px solid var(--gta-cyan)', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', color: 'var(--text-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={10} /> Einstein's Equations
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Point Distribution",
      icon: <Network size={18} />,
      color: "var(--gta-purple)",
      description: "Apportion points flexibly across parts and sub-questions.",
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Sub-Question Mark Tree</span>
            <span style={{ fontSize: '12px', color: 'var(--gta-purple)', fontWeight: 'bold' }}>Total: 10 pts</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
            {/* Tree Branch 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '80px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Q1 (a)</div>
              <div style={{ flex: 1, height: '2px', background: 'var(--gta-purple)', position: 'relative' }}>
                <div style={{ position: 'absolute', right: 0, top: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--gta-purple)' }}></div>
              </div>
              <div style={{ width: '100px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Identify mass</span>
                <span style={{ background: 'rgba(92, 10, 135, 0.15)', border: '1px solid var(--gta-purple)', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', color: 'var(--text-primary)', fontWeight: 'bold' }}>3 pts</span>
              </div>
            </div>

            {/* Tree Branch 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '80px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Q1 (b)</div>
              <div style={{ flex: 1, height: '2px', background: 'var(--gta-purple)', position: 'relative' }}>
                <div style={{ position: 'absolute', right: 0, top: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--gta-purple)' }}></div>
              </div>
              <div style={{ width: '100px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Relate equations</span>
                <span style={{ background: 'rgba(92, 10, 135, 0.15)', border: '1px solid var(--gta-purple)', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', color: 'var(--text-primary)', fontWeight: 'bold' }}>4 pts</span>
              </div>
            </div>

            {/* Tree Branch 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '80px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Q1 (c)</div>
              <div style={{ flex: 1, height: '2px', background: 'var(--gta-purple)', position: 'relative' }}>
                <div style={{ position: 'absolute', right: 0, top: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--gta-purple)' }}></div>
              </div>
              <div style={{ width: '100px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Solve tensors</span>
                <span style={{ background: 'rgba(92, 10, 135, 0.15)', border: '1px solid var(--gta-purple)', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', color: 'var(--text-primary)', fontWeight: 'bold' }}>3 pts</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Feedback Templates",
      icon: <MessageSquare size={18} />,
      color: "var(--gta-orange)",
      description: "Program standard feedback triggers and automated annotations.",
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Automated Feedback Matrix</span>
            <span style={{ fontSize: '11px', color: 'var(--gta-orange)', fontWeight: '600' }}>Active Triggers</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {/* Feedback Band 1 */}
            <div style={{ borderLeft: '3px solid var(--gta-orange)', background: 'rgba(255, 150, 0, 0.02)', padding: '8px 12px', borderRadius: '0 8px 8px 0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Band: 90% - 100%</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Excellent</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                "Exceptional depth and mathematical rigor shown in deriving the field equations. Highly precise."
              </p>
            </div>

            {/* Feedback Band 2 */}
            <div style={{ borderLeft: '3px solid var(--gta-orange)', background: 'rgba(255, 150, 0, 0.02)', padding: '8px 12px', borderRadius: '0 8px 8px 0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Band: 50% - 89%</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Passing</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                "Satisfactory explanation, but verify the tensor transformation steps in part C."
              </p>
            </div>

            {/* Feedback Band 3 */}
            <div style={{ borderLeft: '3px solid var(--gta-orange)', background: 'rgba(255, 150, 0, 0.02)', padding: '8px 12px', borderRadius: '0 8px 8px 0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Band: 0% - 49%</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Deficient</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                "Core conceptual gaps regarding spacetime curvature. Review Lecture 4 notes."
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    setActiveStep(prev => (prev + 1) % steps.length);
  };

  autoPlayRef.current = nextStep;

  // Autoplay loop
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (autoPlayRef.current) autoPlayRef.current();
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section 
      style={{
        maxWidth: '1200px',
        margin: '60px auto 40px',
        padding: '0 20px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge tag */}
      <div style={{ display: 'inline-flex', marginBottom: '16px' }}>
        <span className="badge badge-pink" style={{ letterSpacing: '1px' }}>
          Interactive tour
        </span>
      </div>

      {/* Header */}
      <h2 style={{ 
        fontSize: 'clamp(24px, 3.5vw, 36px)', 
        fontWeight: '800', 
        marginBottom: '12px', 
        color: 'var(--text-primary)',
        letterSpacing: '-0.5px' 
      }}>
        Explore Rubric Studio
      </h2>
      <p style={{ 
        color: 'var(--text-secondary)', 
        maxWidth: '640px', 
        margin: '0 auto 40px', 
        fontSize: '14px', 
        lineHeight: '1.6' 
      }}>
        Preview how administrators establish criteria, reference keys, and mark boundaries to streamline the grading suite.
      </p>

      {/* Main Tour Grid Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) 1.5fr',
        gap: '40px',
        alignItems: 'center',
        textAlign: 'left',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--panel-border)',
        borderRadius: '24px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}>
        {/* Left Hand Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.02)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? step.color : 'transparent',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  width: '100%'
                }}
              >
                <div style={{
                  background: isActive ? step.color : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  borderRadius: '12px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s ease'
                }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px', color: step.color, fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Step 0{idx + 1}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                    {step.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Hand Interactive Mockup Box */}
        <div style={{
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--panel-border)',
          borderRadius: '16px',
          padding: '24px',
          height: '350px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}>
          {/* Subtle Ambient Backlight Glow inside Mockup */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-20%',
            width: '150px',
            height: '150px',
            background: `radial-gradient(circle, ${steps[activeStep].color}15 0%, transparent 70%)`,
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }}></div>

          {/* Render Active Mockup */}
          <div style={{ flex: 1 }}>
            {steps[activeStep].mockup}
          </div>
        </div>
      </div>
    </section>
  );
};
