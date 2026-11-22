/**
 * MODEL 3: Qwen3.5-4B – Lightweight Document Understanding & Question Classification Adapter
 * 
 * Responsibilities:
 * 1. Question identification and subquestion hierarchy mapping.
 * 2. Answer-type classification:
 *    - THEORETICAL: Definitions, explanations, characteristics, advantages, comparisons.
 *    - MATHEMATICAL: Formulas, substitution, intermediate steps, derivations, final answer, units.
 *    - ENGINEERING: Working principles, architecture, algorithms, diagrams, step-by-step logic.
 *    - DIAGRAM_BASED: Schematics, flowcharts, circuits, blocks, labels, connections.
 * 3. Question-to-Model-Answer alignment:
 *    - Matches each question/subquestion with its corresponding official model answer section.
 *    - Flags ambiguous or unaligned pairs for Admin review.
 * 
 * Hardware Compatibility:
 * - 4B parameter footprint fits directly in NVIDIA RTX 3050 (4 GB VRAM) in 4-bit / 8-bit mode (~2.2 GB VRAM).
 * - Supports HuggingFace Serverless Inference / Ollama / local zero-cost deterministic NLP parsing.
 */

export const ANSWER_TYPES = {
  THEORETICAL: 'THEORETICAL',
  MATHEMATICAL: 'MATHEMATICAL',
  ENGINEERING: 'ENGINEERING',
  DIAGRAM_BASED: 'DIAGRAM_BASED'
};

export class Qwen4BClassifier {
  constructor(config = {}) {
    this.endpoint = config.endpoint || process.env.QWEN_4B_ENDPOINT || '';
    this.apiKey = config.apiKey || process.env.QWEN_API_KEY || process.env.HF_TOKEN || '';
    this.modelName = config.modelName || 'Qwen/Qwen2.5-3B-Instruct';
  }

  /**
   * Classify answer type based on question text and expected response characteristics
   * @param {string} questionText
   * @returns {{ answerType: string, confidence: number, rationale: string }}
   */
  classifyAnswerType(questionText = '') {
    const qLower = questionText.toLowerCase();

    // 0. Sparse Matrix & Data Structures Visual Detection (Exempt from pure math)
    if (/\b(?:sparse\s+matrix|triplet\s+representation|linked\s+list\s+representation)\b/i.test(qLower)) {
      return {
        answerType: ANSWER_TYPES.DIAGRAM_BASED,
        confidence: 0.99,
        rationale: 'Question explicitly requires sparse matrix visual reproduction, 3-tuple mapping, and linked list diagram.'
      };
    }

    // 1. Diagram / Visual-Based Answer Detection (MANDATORY RULE: Exact reproduction of figures, trees, matrices, graphs, flowcharts, tables, diagrams)
    if (/\b(?:draw|sketch|illustrate|construct|trace)\b.*?\b(?:flowchart|block\s+diagram|circuit|schematic|graph|architecture|layout|timing\s+diagram|tree|binary\s+tree|bst|figure|matrix|table)\b/i.test(qLower) ||
        /\b(?:neat\s+diagram|flowchart|circuit\s+diagram|block\s+diagram|binary\s+tree|search\s+tree|winner\s+tree|sparse\s+matrix|adjacency\s+matrix|state\s+diagram|truth\s+table)\b/i.test(qLower)) {
      return {
        answerType: ANSWER_TYPES.DIAGRAM_BASED,
        confidence: 0.98,
        rationale: 'Question explicitly requires drawing, constructing, and labeling an exact visual reproduction (figure, tree, matrix, graph, flowchart, table, or diagram).'
      };
    }

    // 2. Mathematical & Numerical Answer Detection (Excludes CS data structures matrices like sparse matrix)
    if (!qLower.includes('sparse matrix') &&
        (/\b(?:derive|derivation|calculate|compute|solve|find\s+the\s+roots|evaluate\s+the\s+postfix|integral|differential|matrix|determinant|eigen|quadratic|discriminant)\b/i.test(qLower) ||
        /[=^√∫∑∏λθπ≤≥≠]|\b\d+\s*[-+*/]\s*\d+\b/.test(questionText))) {
      // Differentiate engineering derivations with diagrams vs pure math
      if (/\b(?:derive|derivation|proof)\b/i.test(qLower) && /\b(?:work-energy|kinetic|theorem|fluid|thermo|stress|torque)\b/i.test(qLower)) {
        return {
          answerType: ANSWER_TYPES.ENGINEERING,
          confidence: 0.96,
          rationale: 'Engineering physical derivation requiring governing laws, free-body analysis, and integration.'
        };
      }
      return {
        answerType: ANSWER_TYPES.MATHEMATICAL,
        confidence: 0.97,
        rationale: 'Numerical or algebraic problem requiring formula identification, substitution, and calculation.'
      };
    }

    // 3. Engineering & Systems Answer Detection
    if (/\b(?:c\s+program|algorithm|working\s+principle|functional\s+units|architecture|microprocessor|cpu|registers|pipeline|cache|stack|queue|linked\s+list)\b/i.test(qLower)) {
      return {
        answerType: ANSWER_TYPES.ENGINEERING,
        confidence: 0.95,
        rationale: 'Technical engineering question requiring architectural concepts, code logic, or systemic procedures.'
      };
    }

    // 4. Default: Theoretical Answer
    return {
      answerType: ANSWER_TYPES.THEORETICAL,
      confidence: 0.94,
      rationale: 'Descriptive, conceptual, or comparative academic question.'
    };
  }

  /**
   * Align each question with its corresponding section in the official model answer text
   * @param {Array<{ id: string|number, question: string, number?: string }>} questions
   * @param {string} modelAnswerText
   * @returns {Array<Object>} Questions with aligned model answer excerpts and alignment status
   */
  alignQuestionsWithModelAnswer(questions = [], modelAnswerText = '') {
    if (!questions || questions.length === 0) return [];
    if (!modelAnswerText || modelAnswerText.trim().length < 15) {
      return questions.map(q => ({
        ...q,
        alignedModelAnswer: '',
        alignmentStatus: 'UNALIGNED_NO_MODEL_TEXT',
        answerType: this.classifyAnswerType(q.question || '').answerType
      }));
    }

    const cleanModel = modelAnswerText.trim();
    const alignedList = [];

    questions.forEach((q, idx) => {
      const qNum = (q.number || String(q.id || idx + 1)).trim();
      const qNumClean = qNum.toLowerCase().replace(/[^a-z0-9]/g, '');
      const qText = (q.question || '').trim();
      const { answerType, rationale } = this.classifyAnswerType(qText);

      // Attempt multi-strategy alignment:
      // Strategy 1: Explicit Question Header Match in Model Answer (e.g., "Ans 1(a):", "Q1.", "Question 1")
      const headerRegex = new RegExp(`(?:ans(?:wer)?|q(?:uestion)?)\\.?\\s*${qNumClean}[\\s:\\)\\-\\.]([\\s\\S]*?)(?=(?:ans(?:wer)?|q(?:uestion)?)\\.?\\s*[0-9]+[a-z]?[\\s:\\)\\-\\.]|$)`, 'i');
      let match = cleanModel.match(headerRegex);

      let alignedText = '';
      let status = 'CONFIDENT_ALIGNMENT';

      if (match && match[1] && match[1].trim().length > 20) {
        alignedText = match[1].trim();
      } else {
        // Strategy 2: Keyword overlap matching between question prompt and model answer paragraphs
        const qKeywords = qText
          .toLowerCase()
          .split(/[^a-z0-9_]+/i)
          .filter(w => w.length > 3 && !['explain', 'with', 'write', 'define', 'what', 'state', 'the', 'and', 'for', 'marks'].includes(w));

        const paragraphs = cleanModel.split(/\n\s*\n+/);
        let bestPara = '';
        let bestScore = 0;

        paragraphs.forEach(p => {
          const pLower = p.toLowerCase();
          let score = 0;
          qKeywords.forEach(k => {
            if (pLower.includes(k)) score++;
          });
          if (score > bestScore) {
            bestScore = score;
            bestPara = p;
          }
        });

        if (bestScore >= 2 && bestPara.trim().length > 20) {
          alignedText = bestPara.trim();
          status = 'KEYWORD_ALIGNED';
        } else {
          // Strategy 3: Fallback section slice or global reference
          alignedText = cleanModel.slice(0, 500);
          status = 'UNCERTAIN_ADMIN_REVIEW_REQUIRED';
        }
      }

      alignedList.push({
        ...q,
        answerType,
        answerTypeRationale: rationale,
        alignedModelAnswer: alignedText,
        alignmentStatus: status
      });
    });

    return alignedList;
  }
}

export default Qwen4BClassifier;
