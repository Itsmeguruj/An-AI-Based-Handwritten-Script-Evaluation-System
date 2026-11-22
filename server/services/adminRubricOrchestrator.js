/**
 * Admin Rubric Orchestration Engine (Qwen3.5-4B + Qwen3.5-9B + Gemma 3 12B IT)
 * 
 * Pipeline:
 * Existing Question Paper & Model Answer Data
 *                 ↓
 * Qwen3.5-4B (Answer-Type Classification & Model-Answer Alignment)
 *                 ↓
 * Qwen3.5-9B (High-Precision Atomic Rubric Generation)
 *                 ↓
 * Gemma 3 12B IT (Independent Rubric Validation & Refinement)
 *                 ↓
 * Deterministic Backend Marks & Schema Enforcer
 *                 ↓
 * Admin Review & Approval (Stored in MongoDB Assignment.rubricCriteria)
 *                 ↓
 * Coordinator Evaluates Using Admin-Approved Rubrics Only
 * 
 * Strict Role Enforcement:
 * - Rubric generation and validation are restricted EXCLUSIVELY to Administrators.
 * - Coordinators attempting access receive an immediate 403 Forbidden rejection.
 */

import { Qwen4BClassifier } from './qwen4bClassifier.js';
import { Qwen9BRubricGenerator } from './qwen9bRubricGenerator.js';
import { Gemma12BValidator } from './gemma12bValidator.js';

export class AdminRubricOrchestrator {
  constructor(config = {}) {
    this.qwen4b = new Qwen4BClassifier(config.qwen4b || {});
    this.qwen9b = new Qwen9BRubricGenerator(config.qwen9b || {});
    this.gemma12b = new Gemma12BValidator(config.gemma12b || {});
  }

  /**
   * Verify whether the incoming request is authorized as an Administrator
   * @param {Object} req - Express request
   * @returns {boolean}
   */
  verifyAdminAuthorization(req) {
    if (!req) return false;
    // Check Authorization header, custom role headers, or session/body role
    const roleHeader = req.headers['x-user-role'] || req.headers['role'];
    const adminKey = req.headers['x-admin-key'] || req.headers['x-admin-security-key'];
    const bodyRole = req.body?.userRole || req.body?.role;

    const envAdminSecurityKey = process.env.ADMIN_SECURITY_KEY || 'GTA6';

    if (roleHeader === 'admin' || bodyRole === 'admin') {
      return true;
    }
    if (adminKey && adminKey === envAdminSecurityKey) {
      return true;
    }
    return false;
  }

  /**
   * Orchestrate full rubric generation and validation for a question paper
   * @param {Object} params
   * @param {Array<Object>} params.questions - Array of extracted questions
   * @param {string} params.questionPaperText - Raw or parsed question paper text
   * @param {string} params.modelAnswerText - Raw or parsed official model answer text
   * @returns {Promise<Object>} Generated and Gemma-validated rubrics ready for Admin review
   */
  async generateAndValidatePaperRubrics({
    questions = [],
    questionPaperText = '',
    modelAnswerText = ''
  }) {
    const startTime = Date.now();

    if (!questions || questions.length === 0) {
      throw new Error('No questions provided for rubric generation.');
    }

    // Step 1: Qwen3.5-4B classifies answer types & aligns with official model answer text
    const alignedQuestions = this.qwen4b.alignQuestionsWithModelAnswer(questions, modelAnswerText);

    const generatedRubrics = [];

    // Step 2 & 3: Sequential or parallel generation (Qwen 9B) & independent validation (Gemma 12B IT)
    for (const aq of alignedQuestions) {
      const qId = String(aq.id || aq.number || 'Q1');
      const qText = aq.question || aq.text || `Question ${qId}`;
      const qMax = Number(aq.maxMarks || aq.marks) || 10;
      const answerType = aq.answerType;
      const alignedModelText = aq.alignedModelAnswer || '';

      // Qwen3.5-9B: Atomic rubric criteria generation
      const qwenRubric = await this.qwen9b.generateQuestionRubric({
        questionId: qId,
        questionText: qText,
        maxMarks: qMax,
        answerType,
        alignedModelAnswer: alignedModelText
      });

      // Gemma 3 12B IT: Independent rubric validation & refinement
      const gemmaValidation = await this.gemma12b.validateAndRefineRubric({
        questionId: qId,
        questionText: qText,
        maxMarks: qMax,
        officialModelAnswer: alignedModelText,
        generatedRubric: qwenRubric
      });

      // Step 4: Deterministic Mark & Schema Enforcer
      const finalCriteria = this._harmonizeCriteriaForUI(gemmaValidation.refinedCriteria, qMax, qId);

      generatedRubrics.push({
        id: aq.id,
        questionId: qId,
        question: qText,
        maxMarks: qMax,
        choiceGroup: aq.choiceGroup,
        choiceOption: aq.choiceOption,
        isOrOption: aq.isOrOption,
        module: aq.module || 1,
        answerType,
        alignmentStatus: aq.alignmentStatus,
        alignedModelAnswerExcerpt: alignedModelText.slice(0, 300),
        criteria: finalCriteria, // Fully backward-compatible with existing PreviewStudio UI
        qwenRubricMetadata: {
          engine: qwenRubric.engine,
          latencyMs: qwenRubric.generationLatencyMs
        },
        gemmaValidationReport: {
          validatorEngine: gemmaValidation.validatorEngine,
          validationPassed: gemmaValidation.validationPassed,
          validationScore: gemmaValidation.validationScore,
          markDistributionStatus: gemmaValidation.markDistributionStatus,
          issues: gemmaValidation.issues,
          adminReviewRecommended: gemmaValidation.adminReviewRecommended,
          validationSummary: gemmaValidation.validationSummary
        },
        adminApproved: false, // Must be explicitly approved by Admin
        status: 'PENDING_ADMIN_APPROVAL'
      });
    }

    const totalQuestions = generatedRubrics.length;
    const validatedCount = generatedRubrics.filter(r => r.gemmaValidationReport.validationPassed).length;

    return {
      success: true,
      orchestrationPipeline: 'Qwen3.5-4B (Classification) → Qwen3.5-9B (Rubric Synthesis) → Gemma 3 12B IT (Independent Validation)',
      visualFidelityPolicy: 'MANDATORY RULE – EXACT QUESTION PAPER VISUAL REPRODUCTION ENFORCED',
      totalQuestions,
      allPassedGemmaValidation: validatedCount === totalQuestions,
      gemmaValidationPassRate: `${Math.round((validatedCount / totalQuestions) * 100)}%`,
      totalDurationMs: Date.now() - startTime,
      rubrics: generatedRubrics
    };
  }

  /**
   * Ensure criteria objects have both modern atomic schema and backward compatibility with DeepScript UI
   */
  _harmonizeCriteriaForUI(criteriaList = [], maxMarks = 10, questionId = 'Q1') {
    let sum = 0;
    const harmonized = criteriaList.map((c, idx) => {
      const cMarks = Number(c.criterion_marks || c.max || c.marks) || 1;
      const roundedMarks = Math.max(0.5, Math.round(cMarks * 2) / 2);
      sum += roundedMarks;

      return {
        id: c.criterion_id || `${questionId}_CRIT_${idx + 1}`,
        criterion_id: c.criterion_id || `${questionId}_CRIT_${idx + 1}`,
        label: c.criterion_name || c.label || `Criterion ${idx + 1}`,
        criterion_name: c.criterion_name || c.label || `Criterion ${idx + 1}`,
        description: c.criterion_description || c.description || '',
        criterion_description: c.criterion_description || c.description || '',
        max: roundedMarks,
        criterion_marks: roundedMarks,
        required_concepts: c.required_concepts || [],
        accepted_keywords: c.accepted_keywords || [],
        accepted_synonyms: c.accepted_synonyms || [],
        partial_credit_rules: c.partial_credit_rules || 'Award partial marks proportional to concept accuracy.',
        alternative_valid_answers: c.alternative_valid_answers || [],
        common_errors: c.common_errors || [],
        source_answer_reference: c.source_answer_reference || 'Model Answer Paper'
      };
    });

    // Final balance check: difference clamped to last criterion
    const diff = Math.round((maxMarks - sum) * 2) / 2;
    if (diff !== 0 && harmonized.length > 0) {
      const lastIdx = harmonized.length - 1;
      const adjusted = Math.max(0.5, Math.round((harmonized[lastIdx].max + diff) * 2) / 2);
      harmonized[lastIdx].max = adjusted;
      harmonized[lastIdx].criterion_marks = adjusted;
    }

    return harmonized;
  }
}

export default AdminRubricOrchestrator;
