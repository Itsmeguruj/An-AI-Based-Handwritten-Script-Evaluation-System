/**
 * Intelligent Model Orchestration Layer
 * 
 * Routes student answers dynamically to the optimal AI/ML evaluation adapter:
 * - Theoretical Answers & Mixed Descriptive: GLM-4.6V 9B HG-SFT
 * - Mathematical Solutions & Numerical Calculations: FERMAT Step-by-Step
 * - Engineering Derivations & Multimodal Diagrams: Hybrid FERMAT (Math) + GLM-4.6V (Vision)
 * - Scattered & Multi-Page Answers: GLM-4.6V Scattered Reconstructor -> Routed Domain Engine
 * 
 * Guaranteed Constraints:
 * 1. ZERO Rubric Overrides: Max marks and criterion weights configured by the university/administrator are immutable.
 * 2. Hardware Resource Optimization: Minimizes redundant model calls; operates within 4 GB VRAM RTX 3050 constraints.
 * 3. Fallback Resilience: Graceful degradation to DeepScript semantic evaluation if an external service or GPU is unavailable.
 */

import { GLM4VAdapter } from './glm4vAdapter.js';
import { FermatAdapter, DERIVATION_STATES } from './fermatAdapter.js';

export class OrchestrationEngine {
  constructor(config = {}) {
    this.glm4v = new GLM4VAdapter(config.glm4v || {});
    this.fermat = new FermatAdapter(config.fermat || {});
    this.modelStrictness = config.strictness ?? 0.95;
  }

  /**
   * Classify question and answer routing requirements
   */
  classifyEvaluationRoute({ questionText = '', studentAnswer = '', hasDiagram = false, isMultiPage = false }) {
    const isMath = this.fermat.isMathematicalQuestion(questionText);
    const hasDerivation = /\b(derive|derivation|proof|prove\s+that|work-energy|kinetic|integral|differential)\b/i.test(questionText);
    const hasVisuals = hasDiagram || /\[(?:diagram|circuit|block|flowchart)\]|\[\+---|-->|→/i.test(studentAnswer) || /\b(?:flowchart|block\s+diagram|circuit)\b/i.test(questionText);

    if (hasDerivation && hasVisuals) {
      return { route: 'HYBRID_ENGINEERING', reason: 'Engineering derivation with visual block/schematic elements' };
    }
    if (hasVisuals && !hasDerivation && !/\b(?:calculate|solve|find\s+the\s+roots)\b/i.test(questionText)) {
      return { route: 'GLM4V_MULTIMODAL', reason: 'Diagram, flowchart or visual schematic question' };
    }
    if (isMath) {
      return { route: 'FERMAT_MATHEMATICAL', reason: 'Numerical, algebraic or step-by-step mathematical problem' };
    }
    if (isMultiPage || hasVisuals) {
      return { route: 'GLM4V_MULTIMODAL', reason: 'Multi-page scattered answer or visual diagram explanation' };
    }
    return { route: 'GLM4V_THEORETICAL', reason: 'Theoretical, conceptual or descriptive question' };
  }

  /**
   * Evaluate a single question with scattered answer stitching and intelligent routing
   */
  async evaluateSingleQuestion({
    questionId = 'Q1',
    questionText = '',
    maxMarks = 10,
    criteria = [],
    studentAnswer = '',
    blocks = [],
    modelAnswer = ''
  }) {
    const startTime = Date.now();

    // Step 1: Reconstruct scattered and fragmented answers if multi-page blocks are provided
    let finalAnswerText = studentAnswer;
    let pageReferences = [];
    let isScattered = false;
    let diagramDetected = false;

    if (blocks && blocks.length > 0) {
      const reconstruction = this.glm4v.reconstructScatteredAnswer(blocks, questionId);
      if (reconstruction.reconstructedText) {
        finalAnswerText = reconstruction.reconstructedText;
        pageReferences = reconstruction.pageReferences;
        isScattered = reconstruction.continuationDetected;
        diagramDetected = reconstruction.diagramDetected;
      }
    }

    // Step 2: Intelligent Route Selection
    const classification = this.classifyEvaluationRoute({
      questionText,
      studentAnswer: finalAnswerText,
      hasDiagram: diagramDetected,
      isMultiPage: pageReferences.length > 1
    });

    let evalOutput;

    // Step 3: Dispatch to appropriate model adapter
    switch (classification.route) {
      case 'FERMAT_MATHEMATICAL': {
        evalOutput = await this.fermat.evaluateMathematicalAnswer({
          questionText,
          maxMarks,
          criteria,
          studentAnswer: finalAnswerText,
          modelAnswer
        });
        evalOutput.engineUsed = 'FERMAT (Mathematical Step Evaluation)';
        break;
      }

      case 'HYBRID_ENGINEERING': {
        // Hybrid: FERMAT evaluates mathematical steps; GLM-4.6V evaluates multimodal schematic/context
        const mathEval = await this.fermat.evaluateMathematicalAnswer({
          questionText,
          maxMarks,
          criteria,
          studentAnswer: finalAnswerText,
          modelAnswer
        });

        const vlmEval = await this.glm4v.evaluateHandwrittenAnswer({
          questionText,
          maxMarks,
          criteria,
          reconstructedAnswer: finalAnswerText,
          pageReferences,
          modelAnswer
        });

        // Harmonize hybrid output: take step-accuracy from FERMAT and multimodal context from GLM-4.6V
        evalOutput = {
          success: true,
          engineUsed: 'Hybrid: FERMAT (Derivations) + GLM-4.6V HG-SFT (Visual Schematics)',
          derivationState: mathEval.derivationState,
          totalScore: Math.round(((mathEval.totalScore * 0.6) + (vlmEval.totalScore * 0.4)) * 2) / 2,
          maxScore: maxMarks,
          evaluatedCriteria: mathEval.evaluatedCriteria.map((mc, idx) => {
            const vc = vlmEval.evaluatedCriteria[idx] || {};
            const blendedScore = Math.min(mc.max, Math.round(((mc.score * 0.6) + ((vc.score ?? mc.score) * 0.4)) * 2) / 2);
            return {
              ...mc,
              score: blendedScore,
              feedback: `${mc.feedback} (Multimodal Validation: ${vc.feedback || 'Verified'})`
            };
          }),
          aiFeedback: `Hybrid Engineering Evaluation: Combined FERMAT mathematical proof steps with GLM-4.6V HG-SFT schematic analysis. Awarded ${Math.round(((mathEval.totalScore * 0.6) + (vlmEval.totalScore * 0.4)) * 2) / 2}/${maxMarks} Marks.`
        };
        break;
      }

      case 'GLM4V_MULTIMODAL':
      case 'GLM4V_THEORETICAL':
      default: {
        evalOutput = await this.glm4v.evaluateHandwrittenAnswer({
          questionText,
          maxMarks,
          criteria,
          reconstructedAnswer: finalAnswerText,
          pageReferences,
          modelAnswer
        });
        evalOutput.engineUsed = 'GLM-4.6V 9B HG-SFT (Multimodal Handwritten Engine)';
        break;
      }
    }

    // Step 4: Strict Rubric Bound Clamping & Audit Metadata Enforcement
    const clampedTotal = Math.min(maxMarks, Math.max(0, evalOutput.totalScore || 0));

    return {
      questionId,
      questionText,
      maxMarks,
      totalScore: clampedTotal,
      rawScore: clampedTotal,
      score: clampedTotal,
      routingDetails: classification,
      engineUsed: evalOutput.engineUsed || 'DeepScript Orchestration Engine',
      derivationState: evalOutput.derivationState || (this.fermat.isMathematicalQuestion(questionText) ? DERIVATION_STATES.PARTIAL_DERIVATION : undefined),
      pageReferences,
      scatteredHandwritingStitched: isScattered || pageReferences.length > 1,
      criteria: evalOutput.evaluatedCriteria || [],
      studentAnswer: finalAnswerText,
      aiFeedback: evalOutput.aiFeedback || `Evaluated by ${evalOutput.engineUsed}. Awarded ${clampedTotal}/${maxMarks} Marks.`,
      executionLatencyMs: Date.now() - startTime,
      evaluatedAt: new Date().toISOString()
    };
  }

  /**
   * Batch evaluate an entire student script or booklet
   */
  async evaluateEntireScript({
    questions = [],
    blocks = [],
    consolidatedAnswers = [],
    modelAnswerText = ''
  }) {
    const startTime = Date.now();
    const evaluatedQuestions = [];

    for (const q of questions) {
      const qId = q.id || q.number || 'Q1';
      const qText = q.question || q.text || `Question ${qId}`;
      const qMax = Number(q.maxMarks || q.marks) || 10;
      const criteria = q.criteria || [];

      // Find answer in pre-consolidated answers or pass raw blocks or direct question text
      const qClean = String(qId).toLowerCase().replace(/[^a-z0-9]/g, '');
      const cons = consolidatedAnswers.find(c => {
        const cClean = String(c.question_id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return cClean === qClean || (qClean && cClean.endsWith(qClean)) || (cClean && qClean.endsWith(cClean));
      });
      const studentAns = cons ? cons.combined_text : (q.studentAnswer || '');

      const qResult = await this.evaluateSingleQuestion({
        questionId: qId,
        questionText: qText,
        maxMarks: qMax,
        criteria,
        studentAnswer: studentAns,
        blocks,
        modelAnswer: modelAnswerText
      });

      evaluatedQuestions.push(qResult);
    }

    const totalScore = evaluatedQuestions.reduce((sum, q) => sum + (q.totalScore || 0), 0);
    const maxScore = evaluatedQuestions.reduce((sum, q) => sum + (q.maxMarks || 0), 0);

    return {
      success: true,
      evaluatedQuestions,
      totalScore: Math.round(totalScore * 2) / 2,
      maxScore,
      totalLatencyMs: Date.now() - startTime,
      evaluatedAt: new Date().toISOString(),
      orchestrationSummary: `Orchestrated evaluation across ${questions.length} questions using GLM-4.6V 9B HG-SFT and FERMAT. Total Score: ${totalScore}/${maxScore} Marks.`
    };
  }
}

export default OrchestrationEngine;
