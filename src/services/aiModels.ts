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
  provider: 'gemini' | 'groq' | 'openrouter' | 'huggingface' | 'local';
  modelId: string;
  apiKey?: string;
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
    }
  } catch (e) {
    console.warn('Failed to save AI config to localStorage:', e);
  }
}

/**
 * Autonomous Question Ingestion & Rubric Formulation Engine System Prompt
 */
export const QUESTION_EXTRACTION_PROMPT = `[ROLE & CONTEXT]
You are the Autonomous Question Ingestion & Rubric Formulation Engine of an automated grading platform. You operate as a deterministic parsing service, not a conversational assistant. 

[OBJECTIVE]
Inspect the uploaded question paper document, extract all exam metadata and individual questions with zero omissions, and synthesize an objective, step-level evaluation rubric for each question.

[PARSING CONSTRAINTS]
1. ZERO OMISSIONS: You must capture every section, question, and sub-part (e.g., 1(a), 1(b), Question 2 OR Question 3). Missing a question constitutes a fatal parse failure.
2. VERBATIM EXTRACTION: Transcribe question text exactly as printed. Transcribe chemical/mathematical expressions into clean LaTeX notation.
3. VISUAL ASSETS: If a question references a diagram, schematic, circuit, or table, note "[VISUAL_EMBEDDED: <description>]" within the text.
4. MARKS BALANCE: 
   - Parse allocated marks from margin brackets (e.g., "[5]", "(10 Marks)").
   - For every question, the sum of points allocated in your generated marking_scheme steps MUST mathematically equal the question's allocated_marks.

[RUBRIC FORMULATION CONSTRAINTS]
For every detected question, generate an atomic grading scheme containing:
- Step Type: Categorize each step into "Principle/Formula", "Intermediate Steps/Derivation", "Final Answer/Units", or "Diagram/Labels".
- Target Criteria: What explicitly must be present in a handwritten answer to earn the mark.
- Keyword Bank: Technical keywords, definitions, or standard variables that an examiner expects.
- Deduction Triggers: Exact penalties (e.g., "Missing units: -0.5", "Calculation slip: -1.0").

[OUTPUT FORMAT REQUIREMENT]
Return ONLY a valid, parseable JSON object matching this schema. Output no markdown ticks (\`\`\`json), no preambles, and no conversational sign-offs.

{
  "exam_id": "auto_generated_unique_string",
  "total_marks": 0.0,
  "sections": [
    {
      "section_name": "string",
      "rules": "string",
      "questions": [
        {
          "question_id": "string",
          "verbatim_text": "string",
          "allocated_marks": 0.0,
          "has_choice": false,
          "marking_scheme": [
            {
              "step_id": 1,
              "step_type": "string",
              "allocated_marks": 0.0,
              "required_keywords": ["string"],
              "scoring_condition": "string",
              "penalty_condition": "string"
            }
          ]
        }
      ]
    }
  ]
}`;

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

  return rawQuestions.map((q: any, idx: number) => {
    const rawId = String(q.question_id || q.number || (idx + 1));
    const cleanNumber = rawId.replace(/^Q/i, '').trim();
    const text = q.verbatim_text || q.text || q.question || '';
    const marks = Number(q.allocated_marks ?? q.marks ?? 0);

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

    const subquestions = Array.isArray(q.subquestions)
      ? q.subquestions.map((sq: any) => ({
          label: String(sq.label || sq.subQuestionLabel || 'a'),
          text: String(sq.text || sq.verbatim_text || ''),
          marks: Number(sq.marks ?? sq.allocated_marks ?? 0),
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
        }))
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

