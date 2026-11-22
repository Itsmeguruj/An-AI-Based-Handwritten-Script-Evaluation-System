import React, { useState, useEffect, useRef } from 'react';
import { Sliders, KeyRound, Network, MessageSquare, Plus, Check, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const RubricStudioSlides: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<(() => void) | null>(null);

  const steps = [
    {
      title: "Step-Type Criterion Builder",
      icon: <Sliders size={18} />,
      color: "var(--gta-pink)",
      description: "Auto-partition question marks into VTU step types (Principle, Derivation, Diagram, Final Output).",
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>VTU Scheme Matrix: BCS304 (Module 1)</span>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Sub-Question Q1(b) — Stack Operations</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '6px', padding: '3px 8px' }}>
              <CheckCircle2 size={12} color="#22c55e" />
              <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: '600' }}>10/10 Marks Allocated</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {/* Criteria Item 1 - Principle/Formula */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '9px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', background: 'rgba(230, 0, 126, 0.12)', color: 'var(--gta-pink)', border: '1px solid rgba(230, 0, 126, 0.25)', borderRadius: '4px', padding: '1px 6px', fontWeight: '700' }}>
                    Principle/Formula
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>LIFO Discipline & Stack Pointer Invariant</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--gta-pink)', fontWeight: 'bold' }}>Max: 3 pts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ width: '30%', height: '100%', background: 'var(--gta-pink)', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', left: '30%', top: '-3px', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px var(--gta-pink)' }}></div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '30px', textAlign: 'right' }}>30%</span>
              </div>
            </div>

            {/* Criteria Item 2 - Diagram/Labels */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '9px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', background: 'rgba(0, 203, 214, 0.12)', color: 'var(--gta-cyan)', border: '1px solid rgba(0, 203, 214, 0.25)', borderRadius: '4px', padding: '1px 6px', fontWeight: '700' }}>
                    Diagram/Labels
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>Memory Array Layout & TOP Pointer Frame</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--gta-cyan)', fontWeight: 'bold' }}>Max: 2 pts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ width: '20%', height: '100%', background: 'var(--gta-cyan)', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', left: '20%', top: '-3px', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px var(--gta-cyan)' }}></div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '30px', textAlign: 'right' }}>20%</span>
              </div>
            </div>

            {/* Criteria Item 3 - Intermediate Steps */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '9px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', background: 'rgba(168, 85, 247, 0.12)', color: 'var(--gta-purple)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '4px', padding: '1px 6px', fontWeight: '700' }}>
                    Intermediate Steps
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>Push/Pop Algorithmic Logic & Boundary Checks</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--gta-purple)', fontWeight: 'bold' }}>Max: 3 pts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ width: '30%', height: '100%', background: 'var(--gta-purple)', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', left: '30%', top: '-3px', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px var(--gta-purple)' }}></div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '30px', textAlign: 'right' }}>30%</span>
              </div>
            </div>

            {/* Criteria Item 4 - Final Answer */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '9px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', background: 'rgba(249, 115, 22, 0.12)', color: 'var(--gta-orange)', border: '1px solid rgba(249, 115, 22, 0.25)', borderRadius: '4px', padding: '1px 6px', fontWeight: '700' }}>
                    Final Answer/Units
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>Time & Space Complexity Proof (O(1))</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--gta-orange)', fontWeight: 'bold' }}>Max: 2 pts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative' }}>
                  <div style={{ width: '20%', height: '100%', background: 'var(--gta-orange)', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', left: '20%', top: '-3px', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px var(--gta-orange)' }}></div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '30px', textAlign: 'right' }}>20%</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'left', borderTop: '1px solid var(--panel-border)', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span>
            Strict Mark Balance: Sum of criteria marks (10M) strictly equals printed question total.
          </div>
        </div>
      )
    },
    {
      title: "AI Model Answer & Semantic Anchors",
      icon: <KeyRound size={18} />,
      color: "var(--gta-cyan)",
      description: "Establish single source of truth with essential concept nodes, formula anchors, and synonym tolerance.",
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>VTU Model Answer Specification</span>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Single Source of Truth (Anti-Hallucination Verified)</div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-cyan)', fontWeight: '600', background: 'rgba(0, 203, 214, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--panel-border-cyan)' }}>
              BCS304: Q1(b)
            </span>
          </div>

          <div style={{ flex: 1, background: 'rgba(0,0,0,0.25)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '11px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '11.5px', color: 'var(--text-secondary)', textAlign: 'left', lineHeight: '1.55' }}>
            <div style={{ color: 'var(--text-cyan)', fontWeight: '700', marginBottom: '4px' }}># Standard VTU Benchmark Model Answer:</div>
            A Stack is a linear data structure adhering to the <span style={{ background: 'rgba(0, 203, 214, 0.15)', color: 'var(--text-cyan)', border: '1px solid var(--gta-cyan)', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>LIFO (Last-In-First-Out)</span> discipline. All operations occur at the TOP index.<br /><br />
            • <strong>Push(item):</strong> Increment TOP and insert item after checking <span style={{ background: 'rgba(0, 203, 214, 0.15)', color: 'var(--text-cyan)', border: '1px solid var(--gta-cyan)', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>TOP != MAX - 1</span> to prevent <em>Stack Overflow</em>.<br />
            • <strong>Pop():</strong> Retrieve item and decrement TOP after checking <span style={{ background: 'rgba(0, 203, 214, 0.15)', color: 'var(--text-cyan)', border: '1px solid var(--gta-cyan)', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>TOP != -1</span> to prevent <em>Stack Underflow</em>.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'left' }}>Required Keyword Nodes & Semantic Anchors:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ background: 'rgba(0, 203, 214, 0.1)', border: '1px solid var(--gta-cyan)', borderRadius: '4px', padding: '3px 7px', fontSize: '10px', color: 'var(--text-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={10} /> LIFO Discipline
              </span>
              <span style={{ background: 'rgba(0, 203, 214, 0.1)', border: '1px solid var(--gta-cyan)', borderRadius: '4px', padding: '3px 7px', fontSize: '10px', color: 'var(--text-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={10} /> Overflow: TOP == MAX-1
              </span>
              <span style={{ background: 'rgba(0, 203, 214, 0.1)', border: '1px solid var(--gta-cyan)', borderRadius: '4px', padding: '3px 7px', fontSize: '10px', color: 'var(--text-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={10} /> Underflow: TOP == -1
              </span>
              <span style={{ background: 'rgba(0, 203, 214, 0.1)', border: '1px solid var(--gta-cyan)', borderRadius: '4px', padding: '3px 7px', fontSize: '10px', color: 'var(--text-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={10} /> O(1) Time Complexity
              </span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textAlign: 'left', marginTop: '2px' }}>
              ⚡ <em>Semantic Invariant:</em> Tolerates equivalent technical phrasing and valid synonyms without requiring verbatim sentence matching.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Module Choice Tree & Mark Partitioning",
      icon: <Network size={18} />,
      color: "var(--gta-purple)",
      description: "Structure 5-Module VTU choices (Q1 OR Q2), sub-question branches, and strict mark allocation.",
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Module Choice Tree: Module 1 (BCS304)</span>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>University Scheme: Answer Any ONE Full Question</div>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--gta-purple)', fontWeight: 'bold' }}>Max Answerable: 20 pts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center' }}>
            {/* Choice Option A - Main Question 1 */}
            <div style={{ background: 'rgba(92, 10, 135, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '8px', padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Choice Option A: Main Q1 (20 Marks Total)</span>
                <span style={{ fontSize: '10.5px', color: 'var(--gta-purple)', fontWeight: 'bold' }}>Primary Branch</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>Q1 (a) - Define Data Structures & Classification Tree</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '4px' }}>10 pts</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>Q1 (b) - Stack Operations with Overflow / Underflow Checks</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '4px' }}>10 pts</span>
                </div>
              </div>
            </div>

            {/* OR Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--panel-border)' }}></div>
              <span style={{ fontSize: '10px', color: 'var(--gta-purple)', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(168, 85, 247, 0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                ── OR ALTERNATIVE CHOICE ──
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--panel-border)' }}></div>
            </div>

            {/* Choice Option B - Main Question 2 */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Choice Option B: Main Q2 (20 Marks Total)</span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Elective Branch</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>Q2 (a) - Circular Queue Operations & Pointer Wrapping</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '4px' }}>10 pts</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>Q2 (b) - Infix to Postfix Conversion & Operator Stack</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '4px' }}>10 pts</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'left', borderTop: '1px solid var(--panel-border)', paddingTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--gta-purple)', fontWeight: 'bold' }}>✓</span>
            Choice Engine: Automatically grades best attempted full question per module (5 Modules = 100 Marks Total).
          </div>
        </div>
      )
    },
    {
      title: "Automated Feedback Matrix & Penalties",
      icon: <MessageSquare size={18} />,
      color: "var(--gta-orange)",
      description: "Program automated feedback triggers, partial-credit conditions, and penalty rules.",
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Granular Rubric Evaluation Bands</span>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Step-Level Feedback & Exact Mark Deductions</div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--gta-orange)', fontWeight: '600', background: 'rgba(249, 115, 22, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(249, 115, 22, 0.25)' }}>
              Strictness: 80% (VTU Standard)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {/* Feedback Band 1 - 90-100% */}
            <div style={{ borderLeft: '3px solid #22c55e', background: 'rgba(34, 197, 94, 0.04)', padding: '7px 10px', borderRadius: '0 8px 8px 0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#22c55e' }}>Band: 90% - 100% (Exemplary Full Mastery)</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Full Credit (9-10 pts)</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                "Flawless LIFO stack mechanics with explicit boundary checks (TOP == MAX - 1 and TOP == -1). Complete diagrammatic illustration and valid O(1) complexity justification."
              </p>
            </div>

            {/* Feedback Band 2 - 50-89% */}
            <div style={{ borderLeft: '3px solid var(--gta-orange)', background: 'rgba(255, 150, 0, 0.04)', padding: '7px 10px', borderRadius: '0 8px 8px 0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--gta-orange)' }}>Band: 50% - 89% (Proficient with Deductions)</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Partial Credit (5-8 pts)</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                "Sound conceptual explanation of stack operations. Deducted 1 mark: omitted overflow/underflow boundary state condition checks before pointer operations."
              </p>
            </div>

            {/* Feedback Band 3 - 0-49% */}
            <div style={{ borderLeft: '3px solid #ef4444', background: 'rgba(239, 68, 68, 0.04)', padding: '7px 10px', borderRadius: '0 8px 8px 0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#ef4444' }}>Band: 0% - 49% (Conceptual Gaps / Deficient)</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Deficient (0-4 pts)</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                "Missing LIFO definition and core pointer manipulation logic. Revisit BCS304 Module 1 Stack Primitives and memory layout."
              </p>
            </div>
          </div>

          {/* Active Penalty Conditions Strip */}
          <div style={{ background: 'rgba(249, 115, 22, 0.06)', border: '1px solid rgba(249, 115, 22, 0.2)', borderRadius: '6px', padding: '6px 10px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={12} color="var(--gta-orange)" />
              <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                <strong>Penalty Rule:</strong> -1 Mark for omitted boundary check (Overflow/Underflow)
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--gta-orange)', fontWeight: 'bold' }}>Enforced</span>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    setActiveStep(prev => (prev + 1) % steps.length);
  };

  autoPlayRef.current = nextStep;

  // Autoplay loop with clean interval
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (autoPlayRef.current) autoPlayRef.current();
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, activeStep]);

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
          VTU Scheme & Rubric Pipeline
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
        maxWidth: '720px', 
        margin: '0 auto 40px', 
        fontSize: '14px', 
        lineHeight: '1.6' 
      }}>
        Preview how DeepScript ingests university schemes, auto-extracts step-level criteria, binds verified model answers, and enforces module choice rules.
      </p>

      {/* Main Tour Grid Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) 1.55fr',
        gap: '40px',
        alignItems: 'stretch',
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
                  background: isActive ? 'rgba(255,255,255,0.03)' : 'transparent',
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
                  width: '100%',
                  boxShadow: isActive ? `0 4px 16px ${step.color}15` : 'none'
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
          padding: '22px',
          minHeight: '390px',
          maxHeight: '430px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15)'
        }}>
          {/* Subtle Ambient Backlight Glow inside Mockup */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-20%',
            width: '180px',
            height: '180px',
            background: `radial-gradient(circle, ${steps[activeStep].color}18 0%, transparent 70%)`,
            filter: 'blur(35px)',
            pointerEvents: 'none'
          }}></div>

          {/* Render Active Mockup */}
          <div style={{ flex: 1, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
            {steps[activeStep].mockup}
          </div>
        </div>
      </div>
    </section>
  );
};
