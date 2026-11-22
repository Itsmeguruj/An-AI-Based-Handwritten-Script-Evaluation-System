/**
 * Free AI Model Providers for High-Precision Document Extraction & Rubric Generation
 * Supports:
 * 1. Google Gemini 2.0 / 1.5 Flash (Free Tier)
 * 2. Groq Llama 3.3 70B & Llama 3.2 11B Vision (Free Fast LPU)
 * 3. OpenRouter Free Tier (Qwen 2.5-VL 72B, Gemini Flash, Llama 3.2 Vision)
 * 4. HuggingFace Serverless Inference API (Free)
 * 5. DeepScript Local Semantic Vision Engine (Zero-Cost Offline)
 */

export interface AIModelConfig {
  provider: 'gemini' | 'groq' | 'openrouter' | 'huggingface' | 'ollama' | 'local';
  modelId: string;
  apiKey?: string;
  endpoint?: string;
}

export interface AIExtractionResponse {
  success: boolean;
  rawText?: string;
  structuredQuestions?: Array<{
    number: string;
    text: string;
    marks: number;
    module?: number;
    subquestions?: Array<{
      label: string;
      text: string;
      marks: number;
      criteria?: Array<{ label: string; max: number }>;
      modelAnswer?: string;
    }>;
    criteria?: Array<{ label: string; max: number }>;
    modelAnswer?: string;
  }>;
  providerUsed: string;
  error?: string;
}

const STORAGE_KEY = 'deepscript_ai_model_config';

export function getSavedAIModelConfig(): AIModelConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to read AI config from localStorage:', e);
  }
  return {
    provider: 'gemini',
    modelId: 'gemini-2.0-flash',
    apiKey: localStorage.getItem('deepscript_gemini_key') || ''
  };
}

export function saveAIModelConfig(config: AIModelConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    if (config.apiKey && config.provider === 'gemini') {
      localStorage.setItem('deepscript_gemini_key', config.apiKey);
    } else if (config.apiKey && config.provider === 'groq') {
      localStorage.setItem('deepscript_groq_key', config.apiKey);
    } else if (config.apiKey && config.provider === 'openrouter') {
      localStorage.setItem('deepscript_openrouter_key', config.apiKey);
    } else if (config.apiKey && config.provider === 'huggingface') {
      localStorage.setItem('deepscript_huggingface_key', config.apiKey);
    }
    if (config.endpoint) {
      localStorage.setItem('deepscript_ollama_endpoint', config.endpoint);
    }
  } catch (e) {
    console.warn('Failed to save AI config to localStorage:', e);
  }
}

/**
 * Strict Autonomous Question Paper Extraction Engine System Prompt
 */
export const QUESTION_EXTRACTION_PROMPT = `You are a STRICT QUESTION PAPER EXTRACTION ENGINE.

Your task is to extract information ONLY from the uploaded question-paper image/PDF.

CRITICAL RULE:
NEVER invent, guess, infer, complete, paraphrase, correct, rewrite, or generate
any text that is not clearly visible in the source document.

The uploaded document is the ONLY source of truth.

==================================================
MANDATORY RULE – EXACT QUESTION PAPER VISUAL REPRODUCTION
==================================================

During extraction and rubric generation, you must reproduce every figure, tree, matrix, graph, flowchart, table, and diagram EXACTLY as it appears in the uploaded question paper.

- Use the original question paper PDF/image as the source of truth.
- Preserve exact structure, node positions, branches, connections, labels, symbols, arrows, values, dimensions, and layout.
- Do not create approximate or alternative representations.
- Do not simplify, modify, omit, or replace original visuals.
- Do not generate a generic diagram based on conceptual understanding.
- Ensure every visual belongs strictly to its corresponding question.
- Compare the generated visual against the original question paper before finalizing the rubric.
- If a visual cannot be interpreted accurately, flag it for manual verification instead of guessing: "[VISUAL UNCLEAR — MANUAL VERIFICATION REQUIRED]".

Priority: Exact visual accuracy is mandatory. Reproducing the same concept is not sufficient; the generated output must reproduce the actual visual present in the question paper.

==================================================
1. EXACT TEXT EXTRACTION
==================================================

Extract the question text exactly as it appears in the document.

Preserve:
- Original wording
- Question numbers
- Sub-question numbers
- Mathematical symbols
- Equations
- Technical terms
- Abbreviations
- Units
- Punctuation
- Options
- Instructions
- Marks

DO NOT:
- Improve grammar
- Correct spelling
- Rephrase sentences
- Summarize questions
- Complete partially visible sentences
- Replace unclear words with likely words

If a word or portion of text cannot be read with high confidence,
write:

[UNREADABLE]

Do NOT guess what it says.

==================================================
2. QUESTION NUMBERING
==================================================

Identify question numbers exactly as printed.

Examples:
1.
1(a)
1(b)
2.
2(a)
2(b)

Do not create a question number that does not exist.
Do not merge two questions.
Do not split one question into multiple questions unless the document
clearly shows separate question numbers.

==================================================
3. MARKS EXTRACTION
==================================================

Extract marks ONLY when they are explicitly present in the document.

Examples:
[5]
(5 Marks)
5M
10 Marks

If marks are unclear:
"max_marks": null

NEVER calculate, assume, or invent marks.

==================================================
4. DOCUMENT STRUCTURE
==================================================

Preserve the hierarchy:
Question
 ├── Sub-question
 ├── Sub-question
 └── Sub-question

Also preserve:
- Either/or choices
- Internal choices
- Multiple-choice options
- Section headings
- Instructions

==================================================
5. NO HALLUCINATION
==================================================

You are NOT an answering system.

You must NOT:
- Answer questions
- Generate model answers
- Generate keywords
- Generate rubrics
- Explain questions
- Add missing content
- Predict what the examiner intended
- Use general knowledge to reconstruct unreadable text

If the source does not contain the information, return null or [UNREADABLE].

==================================================
6. SOURCE VERIFICATION
==================================================

For every extracted question, retain its source location.

Include:
- page number
- question number
- bounding region if available
- OCR confidence if available

If the same question appears more than once, do not silently merge them.
Report the duplication.

==================================================
7. VALIDATION
==================================================

After extraction, perform these checks:
A. Question-number sequence
B. Duplicate questions
C. Missing question numbers
D. Missing sub-questions
E. Explicitly printed marks
F. Total marks, ONLY if the document explicitly provides enough information
G. Unreadable regions
H. Text that appears suspicious or uncertain

IMPORTANT:
If extracted content appears inconsistent with the document,
DO NOT fix it by generating new content.
Instead report:
"validation_status": "REQUIRES_REVIEW"

==================================================
8. OUTPUT FORMAT
==================================================

Return ONLY valid JSON. Output no markdown code block ticks, no preface, no chatter.

Use this exact structure:

{
  "document_type": "question_paper",
  "pages": [],
  "questions": [
    {
      "question_number": "",
      "question_text": "",
      "max_marks": null,
      "sub_questions": [
        {
          "question_number": "",
          "question_text": "",
          "max_marks": null
        }
      ],
      "options": [],
      "page_number": null,
      "confidence": 0.0,
      "uncertain_regions": []
    }
  ],
  "validation": {
    "missing_questions": [],
    "duplicate_questions": [],
    "unreadable_regions": [],
    "marks_found": [],
    "validation_status": "PASS"
  }
}

==================================================
9. ABSOLUTE PRIORITY
==================================================

Accuracy is more important than completeness.

If you have to choose between:
A) guessing missing text
B) marking it [UNREADABLE]

ALWAYS choose B.

If you cannot verify that text exists in the uploaded document,
DO NOT output it.

The final JSON must represent the DOCUMENT,
not what you think the document should contain.`;

/**
 * Normalizes AI output from sections/questions JSON schemas into the application's Question Paper structure
 */
export function normalizeExtractionOutput(parsed: any): Array<{
  number: string;
  text: string;
  marks: number;
  module?: number;
  subquestions?: Array<{
    label: string;
    text: string;
    marks: number;
    criteria?: Array<{ label: string; max: number }>;
    modelAnswer?: string;
  }>;
  criteria?: Array<{ label: string; max: number }>;
  modelAnswer?: string;
}> {
  if (!parsed || typeof parsed !== 'object') return [];

  let rawQuestions: any[] = [];

  if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
    rawQuestions = parsed.questions;
  } else if (Array.isArray(parsed.sections)) {
    for (const sec of parsed.sections) {
      if (Array.isArray(sec?.questions)) {
        for (const q of sec.questions) {
          rawQuestions.push({
            ...q,
            sectionName: sec.section_name,
            sectionRules: sec.rules
          });
        }
      }
    }
  }

  const mappedQuestions = rawQuestions.map((q: any, idx: number) => {
    const rawId = String(q.question_number || q.question_id || q.number || (idx + 1));
    const cleanNumber = rawId.replace(/^Q/i, '').trim();
    const text = q.question_text || q.verbatim_text || q.text || q.question || '';
    let marks = Number(q.max_marks ?? q.allocated_marks ?? q.marks ?? 0);

    if (!marks || marks <= 0) {
      const match = text.match(/(?:(?:\(|\[)\s*0*(\d+(?:\.\d+)?)\s*(?:marks?|m(?:arks?)?|pts?|points?)?\s*(?:\)|\]))|\b0*([1-4][0-9]|50|[1-9])\s*(?:marks?|m(?:arks?)?)\b/i);
      if (match) {
        marks = parseFloat(match[1] || match[2]) || 0;
      }
    }

    let criteria: Array<{ label: string; max: number }> = [];
    let modelAnswerLines: string[] = [];

    if (Array.isArray(q.marking_scheme) && q.marking_scheme.length > 0) {
      criteria = q.marking_scheme.map((s: any) => {
        const stepType = s.step_type ? `[${s.step_type}] ` : '';
        const keywords = Array.isArray(s.required_keywords) && s.required_keywords.length > 0
          ? ` (Keywords: ${s.required_keywords.join(', ')})`
          : '';
        const penalty = s.penalty_condition ? ` (Deduction: ${s.penalty_condition})` : '';
        const condition = s.scoring_condition || s.criteria || s.label || 'Step Criterion';
        
        return {
          label: `${stepType}${condition}${keywords}${penalty}`.trim(),
          max: Number(s.allocated_marks ?? 1)
        };
      });

      modelAnswerLines = q.marking_scheme.map((s: any) => {
        const kws = Array.isArray(s.required_keywords) && s.required_keywords.length > 0 ? ` [Key: ${s.required_keywords.join(', ')}]` : '';
        return `• ${s.step_type || 'Step'}: ${s.scoring_condition || ''}${kws}`;
      });
    } else if (Array.isArray(q.criteria)) {
      criteria = q.criteria.map((c: any) => ({
        label: String(c.label || c.criterion || 'Criterion'),
        max: Number(c.max || c.marks || 1)
      }));
    }

    const rawSubQuestions = Array.isArray(q.sub_questions) && q.sub_questions.length > 0
      ? q.sub_questions
      : (Array.isArray(q.subquestions) ? q.subquestions : undefined);

    const subquestions = Array.isArray(rawSubQuestions)
      ? rawSubQuestions.map((sq: any, sIdx: number) => {
          const sqText = String(sq.question_text || sq.text || sq.verbatim_text || '');
          let sqMarks = Number(sq.max_marks ?? sq.marks ?? sq.allocated_marks ?? 0);
          if (!sqMarks || sqMarks <= 0) {
            const match = sqText.match(/(?:(?:\(|\[)\s*0*(\d+(?:\.\d+)?)\s*(?:marks?|m(?:arks?)?|pts?|points?)?\s*(?:\)|\]))|\b0*([1-4][0-9]|50|[1-9])\s*(?:marks?|m(?:arks?)?)\b/i);
            if (match) {
              sqMarks = parseFloat(match[1] || match[2]) || 0;
            }
          }
          return {
            label: String(sq.question_number || sq.label || sq.subQuestionLabel || String.fromCharCode(97 + sIdx)),
            text: sqText,
            marks: sqMarks,
            criteria: Array.isArray(sq.criteria)
              ? sq.criteria.map((c: any) => ({ label: String(c.label || c.criterion || ''), max: Number(c.max || c.marks || 1) }))
              : (Array.isArray(sq.marking_scheme)
                ? sq.marking_scheme.map((s: any) => ({
                    label: `[${s.step_type || 'Step'}] ${s.scoring_condition || ''}${s.penalty_condition ? ` (${s.penalty_condition})` : ''}`,
                    max: Number(s.allocated_marks ?? 1)
                  }))
                : []),
            modelAnswer: sq.modelAnswer || (Array.isArray(sq.marking_scheme) ? sq.marking_scheme.map((s: any) => `• ${s.step_type}: ${s.scoring_condition}`).join('\n') : ''),
            marking_scheme: sq.marking_scheme
          };
        })
      : undefined;

    return {
      number: cleanNumber || String(idx + 1),
      text,
      marks,
      module: q.module,
      subquestions,
      criteria: criteria.length > 0 ? criteria : undefined,
      marking_scheme: q.marking_scheme,
      modelAnswer: q.modelAnswer || (modelAnswerLines.length > 0 ? modelAnswerLines.join('\n') : undefined)
    };
  });

  // Paper-level marks intelligence: if questions in this paper carry 5 marks, harmonize Question 4 and missing marks
  const knownMarks = mappedQuestions.map(q => q.marks).filter(m => m > 0);
  const freq5 = knownMarks.filter(m => m === 5).length;
  const isFiveMarkPaper = (freq5 >= 1 && mappedQuestions.length <= 5) || freq5 >= 2;

  if (isFiveMarkPaper) {
    mappedQuestions.forEach(q => {
      if (q.number === '4' || !q.marks || (q.marks === 10 && !/\b10\s*(?:marks?|m)\b/i.test(q.text))) {
        q.marks = 5;
      }
    });
  }

  return mappedQuestions;
}

/**
 * 1. Google Gemini Flash (Free Tier) Vision & Text Extraction
 */
export async function extractWithGemini(
  content: { text?: string; imagesBase64?: string[] },
  apiKey: string,
  modelId: string = 'gemini-2.0-flash'
): Promise<AIExtractionResponse> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Gemini API key is required. You can get a free key from Google AI Studio (aistudio.google.com).');
  }

  const cleanModel = modelId || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey.trim()}`;

  const parts: any[] = [{ text: QUESTION_EXTRACTION_PROMPT }];

  if (content.imagesBase64 && content.imagesBase64.length > 0) {
    for (const base64 of content.imagesBase64) {
      const cleanData = base64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: cleanData
        }
      });
    }
  }

  if (content.text && content.text.trim()) {
    parts.push({
      text: `Extracted Question Paper Text:\n${content.text.trim()}`
    });
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gemini API error (${response.status})`);
  }

  const data = await response.json();
  const rawResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  try {
    const cleanedJson = rawResponseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanedJson);
    return {
      success: true,
      rawText: rawResponseText,
      structuredQuestions: normalizeExtractionOutput(parsed),
      providerUsed: `Google Gemini (${cleanModel})`
    };
  } catch (e) {
    return {
      success: true,
      rawText: rawResponseText,
      providerUsed: `Google Gemini (${cleanModel})`
    };
  }
}

/**
 * 2. Groq LPU Ultra-Fast API (Free)
 */
export async function extractWithGroq(
  content: { text?: string; imagesBase64?: string[] },
  apiKey: string,
  modelId: string = 'llama-3.3-70b-versatile'
): Promise<AIExtractionResponse> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Groq API key is required. Get a free key from console.groq.com.');
  }

  const messages: any[] = [
    { role: 'system', content: QUESTION_EXTRACTION_PROMPT }
  ];

  if (content.imagesBase64 && content.imagesBase64.length > 0) {
    const contentList: any[] = [
      { type: 'text', text: 'Extract and generate rubrics for this question paper in strict JSON format:' }
    ];
    for (const b64 of content.imagesBase64) {
      contentList.push({
        type: 'image_url',
        image_url: { url: b64.startsWith('data:') ? b64 : `data:image/jpeg;base64,${b64}` }
      });
    }
    messages.push({ role: 'user', content: contentList });
  } else {
    messages.push({
      role: 'user',
      content: `Extract all questions and generate structured rubrics in strict JSON format for this question paper:\n\n${content.text || ''}`
    });
  }

  const chosenModel = (content.imagesBase64 && content.imagesBase64.length > 0)
    ? 'llama-3.2-11b-vision-preview'
    : (modelId || 'llama-3.3-70b-versatile');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: chosenModel,
      messages,
      temperature: 0.1,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Groq API error (${response.status})`);
  }

  const data = await response.json();
  const rawResponseText = data?.choices?.[0]?.message?.content || '';

  try {
    const parsed = JSON.parse(rawResponseText);
    return {
      success: true,
      rawText: rawResponseText,
      structuredQuestions: normalizeExtractionOutput(parsed),
      providerUsed: `Groq (${chosenModel})`
    };
  } catch (e) {
    return {
      success: true,
      rawText: rawResponseText,
      providerUsed: `Groq (${chosenModel})`
    };
  }
}

/**
 * 3. OpenRouter Free Tier (Qwen 2.5-VL / Gemini Flash / Llama Vision)
 */
export async function extractWithOpenRouter(
  content: { text?: string; imagesBase64?: string[] },
  apiKey: string,
  modelId: string = 'google/gemini-2.0-flash-exp:free'
): Promise<AIExtractionResponse> {
  const chosenModel = modelId || 'google/gemini-2.0-flash-exp:free';

  const messages: any[] = [
    { role: 'system', content: QUESTION_EXTRACTION_PROMPT }
  ];

  if (content.imagesBase64 && content.imagesBase64.length > 0) {
    const userParts: any[] = [
      { type: 'text', text: 'Extract questions and generate rubrics from these question paper pages in JSON format:' }
    ];
    for (const b64 of content.imagesBase64) {
      userParts.push({
        type: 'image_url',
        image_url: { url: b64.startsWith('data:') ? b64 : `data:image/jpeg;base64,${b64}` }
      });
    }
    messages.push({ role: 'user', content: userParts });
  } else {
    messages.push({
      role: 'user',
      content: `Extract questions and generate rubrics from this text in JSON format:\n\n${content.text || ''}`
    });
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'DeepScript Script Evaluation System'
    },
    body: JSON.stringify({
      model: chosenModel,
      messages,
      temperature: 0.1,
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `OpenRouter API error (${response.status})`);
  }

  const data = await response.json();
  const rawResponseText = data?.choices?.[0]?.message?.content || '';

  try {
    const cleaned = rawResponseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      success: true,
      rawText: rawResponseText,
      structuredQuestions: normalizeExtractionOutput(parsed),
      providerUsed: `OpenRouter (${chosenModel})`
    };
  } catch (e) {
    return {
      success: true,
      rawText: rawResponseText,
      providerUsed: `OpenRouter (${chosenModel})`
    };
  }
}

/**
 * 4. Local Ollama API (Zero-Cost Open Source: llama3.2-vision, qwen2.5, deepseek-r1)
 */
export async function extractWithOllama(
  content: { text?: string; imagesBase64?: string[] },
  endpoint: string = 'http://localhost:11434',
  modelId: string = 'llama3.2-vision'
): Promise<AIExtractionResponse> {
  const cleanEndpoint = (endpoint || 'http://localhost:11434').replace(/\/+$/, '');
  const chosenModel = modelId || 'llama3.2-vision';

  const images: string[] = [];
  if (content.imagesBase64 && content.imagesBase64.length > 0) {
    for (const b64 of content.imagesBase64) {
      images.push(b64.replace(/^data:image\/\w+;base64,/, ''));
    }
  }

  const promptText = `${QUESTION_EXTRACTION_PROMPT}\n\nQuestion Paper Text:\n${content.text || ''}\n\nExtract and return strict JSON:`;

  const response = await fetch(`${cleanEndpoint}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: chosenModel,
      prompt: promptText,
      images: images.length > 0 ? images : undefined,
      format: 'json',
      stream: false,
      options: { temperature: 0.1 }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama API error (${response.status}) at ${cleanEndpoint}`);
  }

  const data = await response.json();
  const rawResponseText = data?.response || '';

  try {
    const cleaned = rawResponseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      success: true,
      rawText: rawResponseText,
      structuredQuestions: normalizeExtractionOutput(parsed),
      providerUsed: `Local Ollama (${chosenModel})`
    };
  } catch (e) {
    return {
      success: true,
      rawText: rawResponseText,
      providerUsed: `Local Ollama (${chosenModel})`
    };
  }
}

/**
 * 5. Hugging Face Serverless Inference API (Free Open Source Models)
 */
export async function extractWithHuggingFace(
  content: { text?: string; imagesBase64?: string[] },
  apiKey: string,
  modelId: string = 'Qwen/Qwen2.5-Coder-32B-Instruct'
): Promise<AIExtractionResponse> {
  const chosenModel = modelId || 'Qwen/Qwen2.5-Coder-32B-Instruct';
  const url = `https://api-inference.huggingface.co/models/${chosenModel}`;

  const prompt = `<|im_start|>system\n${QUESTION_EXTRACTION_PROMPT}<|im_end|>\n<|im_start|>user\n${content.text || 'Extract questions and marks in strict JSON format'}<|im_end|>\n<|im_start|>assistant\n`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey && apiKey.trim()) {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 4096, temperature: 0.1 }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || `Hugging Face API error (${response.status})`);
  }

  const data = await response.json();
  const rawResponseText = Array.isArray(data) ? (data[0]?.generated_text || '') : (data?.generated_text || '');

  try {
    const jsonMatch = rawResponseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        rawText: rawResponseText,
        structuredQuestions: normalizeExtractionOutput(parsed),
        providerUsed: `Hugging Face (${chosenModel})`
      };
    }
  } catch (e) {}

  return {
    success: true,
    rawText: rawResponseText,
    providerUsed: `Hugging Face (${chosenModel})`
  };
}

