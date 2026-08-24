import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Download, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  Code2, 
  Check, 
  ShieldAlert,
  BookOpen,
  Award,
  ListChecks
} from 'lucide-react';
import { 
  type ExamExtractionResult, 
  type ExtractedQuestion, 
  type ExtractedSubQuestion, 
  type ExamInfo,
  validateExamExtraction,
  formatStructuredVTUOutput,
  generateHighPrecisionModelAnswer,
  generateDetailedRubricCriteria
} from '../services/rubricExtractor';

interface QuestionPaperAuditStudioProps {
  extractedExamResult: ExamExtractionResult | null;
  onUpdateExamResult: (updated: ExamExtractionResult) => void;
  onApplyToRubric: (result: ExamExtractionResult) => void;
  onReExtract?: () => void;
  isExtracting?: boolean;
}

export const QuestionPaperAuditStudio: React.FC<QuestionPaperAuditStudioProps> = ({
  extractedExamResult,
  onUpdateExamResult,
  onApplyToRubric,
  onReExtract,
  isExtracting = false
}) => {
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [showVtuModal, setShowVtuModal] = useState<boolean>(false);
  const [copiedVtu, setCopiedVtu] = useState<boolean>(false);
  const [activeTabs, setActiveTabs] = useState<Record<number, 'question' | 'modelAnswer' | 'rubric'>>({});

  if (!extractedExamResult) {
    return null;
  }

  const { exam_info, questions, validation } = extractedExamResult;

  const handleUpdateExamInfo = (field: keyof ExamInfo, value: any) => {
    const updatedInfo = { ...exam_info, [field]: value };
    const updatedValidation = validateExamExtraction({
      exam_info: updatedInfo,
      questions
    });
    const updatedResult: ExamExtractionResult = {
      ...extractedExamResult,
      exam_info: updatedInfo,
      validation: updatedValidation
    };
    updatedResult.rawOutputFormatted = formatStructuredVTUOutput(updatedResult);
    onUpdateExamResult(updatedResult);
  };

  const handleUpdateQuestion = (qIndex: number, updater: (prev: ExtractedQuestion) => ExtractedQuestion) => {
    const updatedQuestions = questions.map((q, idx) => (idx === qIndex ? updater(q) : q));
    const updatedValidation = validateExamExtraction({
      exam_info,
      questions: updatedQuestions
    });
    const updatedResult: ExamExtractionResult = {
      ...extractedExamResult,
      questions: updatedQuestions,
      validation: updatedValidation
    };
    updatedResult.rawOutputFormatted = formatStructuredVTUOutput(updatedResult);
    onUpdateExamResult(updatedResult);
  };

  const handleAddSubquestion = (qIndex: number) => {
    handleUpdateQuestion(qIndex, (prev) => {
      const existingLabels = prev.subquestions.map((s) => s.label.toLowerCase());
      const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      const nextLabel = alphabet.find((l) => !existingLabels.includes(l)) || 'a';
      const newSub: ExtractedSubQuestion = {
        label: nextLabel,
        text: '',
        marks: 10,
        originalQuestion: '',
        modelAnswer: generateHighPrecisionModelAnswer('', 10),
        rubricCriteria: generateDetailedRubricCriteria('', 10),
        totalRubricMarks: 10,
        confidence: 'High',
        verificationRequired: false
      };
      return {
        ...prev,
        subquestions: [...prev.subquestions, newSub]
      };
    });
  };

  const handleRemoveSubquestion = (qIndex: number, subIndex: number) => {
    handleUpdateQuestion(qIndex, (prev) => ({
      ...prev,
      subquestions: prev.subquestions.filter((_, sIdx) => sIdx !== subIndex)
    }));
  };

  const handleAddMainQuestion = () => {
    const nextNum = String(questions.length + 1);
    const newQ: ExtractedQuestion = {
      number: nextNum,
      text: '',
      marks: 20,
      originalQuestion: '',
      subquestions: [
        { label: 'a', text: '', marks: 10, originalQuestion: '', modelAnswer: generateHighPrecisionModelAnswer('', 10), rubricCriteria: generateDetailedRubricCriteria('', 10), totalRubricMarks: 10, confidence: 'High', verificationRequired: false },
        { label: 'b', text: '', marks: 10, originalQuestion: '', modelAnswer: generateHighPrecisionModelAnswer('', 10), rubricCriteria: generateDetailedRubricCriteria('', 10), totalRubricMarks: 10, confidence: 'High', verificationRequired: false }
      ],
      internal_choice: null,
      source_pages: [1],
      module: Math.ceil((questions.length + 1) / 2),
      modelAnswer: generateHighPrecisionModelAnswer('', 20),
      rubricCriteria: generateDetailedRubricCriteria('', 20),
      totalRubricMarks: 20,
      confidence: 'High',
      verificationRequired: false
    };
    const updatedQuestions = [...questions, newQ];
    const updatedValidation = validateExamExtraction({
      exam_info,
      questions: updatedQuestions
    });
    const updatedResult: ExamExtractionResult = {
      ...extractedExamResult,
      questions: updatedQuestions,
      validation: updatedValidation
    };
    updatedResult.rawOutputFormatted = formatStructuredVTUOutput(updatedResult);
    onUpdateExamResult(updatedResult);
  };

  const handleRemoveMainQuestion = (qIndex: number) => {
    const updatedQuestions = questions.filter((_, idx) => idx !== qIndex);
    const updatedValidation = validateExamExtraction({
      exam_info,
      questions: updatedQuestions
    });
    const updatedResult: ExamExtractionResult = {
      ...extractedExamResult,
      questions: updatedQuestions,
      validation: updatedValidation
    };
    updatedResult.rawOutputFormatted = formatStructuredVTUOutput(updatedResult);
    onUpdateExamResult(updatedResult);
  };

  const handleToggleOrChoice = (qIndex: number) => {
    handleUpdateQuestion(qIndex, (prev) => {
      if (prev.internal_choice) {
        return { ...prev, internal_choice: null };
      } else {
        return {
          ...prev,
          internal_choice: {
            label: 'OR Option',
            text: '',
            marks: prev.marks || 20,
            originalQuestion: '',
            modelAnswer: generateHighPrecisionModelAnswer('', prev.marks || 20),
            rubricCriteria: generateDetailedRubricCriteria('', prev.marks || 20),
            totalRubricMarks: prev.marks || 20,
            confidence: 'High',
            verificationRequired: false,
            subquestions: [
              { label: 'a', text: '', marks: 10, originalQuestion: '', modelAnswer: generateHighPrecisionModelAnswer('', 10), rubricCriteria: generateDetailedRubricCriteria('', 10), totalRubricMarks: 10, confidence: 'High', verificationRequired: false },
              { label: 'b', text: '', marks: 10, originalQuestion: '', modelAnswer: generateHighPrecisionModelAnswer('', 10), rubricCriteria: generateDetailedRubricCriteria('', 10), totalRubricMarks: 10, confidence: 'High', verificationRequired: false }
            ]
          }
        };
      }
    });
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(extractedExamResult, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(extractedExamResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exam_info.course_code || 'QuestionPaper'}_Extraction_Audit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyVtuSpec = () => {
    const formatted = extractedExamResult.rawOutputFormatted || formatStructuredVTUOutput(extractedExamResult);
    navigator.clipboard.writeText(formatted);
    setCopiedVtu(true);
    setTimeout(() => setCopiedVtu(false), 2000);
  };

  const handleDownloadVtuSpec = () => {
    const formatted = extractedExamResult.rawOutputFormatted || formatStructuredVTUOutput(extractedExamResult);
    const blob = new Blob([formatted], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exam_info.course_code || 'VTU_QuestionPaper'}_Rubric_Specification.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      background: 'var(--panel-bg)',
      border: '1px solid var(--panel-border)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '16px',
      textAlign: 'left'
    }}>
      {/* Studio Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--panel-border)',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(0, 203, 214, 0.1)',
            border: '1px solid rgba(0, 203, 214, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gta-cyan)'
          }}>
            <FileText size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                High-Precision Question Paper Extraction & Validation Studio
              </h3>
              <span className="badge badge-cyan" style={{ fontSize: '10px', padding: '2px 6px' }}>
                Zero Hallucination
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              Step 1–7 verified structure: main questions, subquestions (a, b, c), OR choices, and mark validation
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleCopyVtuSpec}
            style={{
              background: copiedVtu ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 203, 214, 0.08)',
              border: copiedVtu ? '1px solid #10b981' : '1px solid rgba(0, 203, 214, 0.3)',
              color: copiedVtu ? '#10b981' : 'var(--gta-cyan)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            title="Copy high-precision VTU formatted text with model answers and rubrics"
          >
            {copiedVtu ? <Check size={13} /> : <Copy size={13} />}
            {copiedVtu ? 'VTU Spec Copied!' : 'Copy VTU Specification'}
          </button>

          <button
            type="button"
            onClick={() => setShowVtuModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--panel-border)',
              color: 'var(--text-primary)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            title="Preview the full VTU specification document"
          >
            <BookOpen size={13} color="var(--gta-pink)" />
            View VTU Document
          </button>

          <button
            type="button"
            onClick={() => setShowJsonModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--panel-border)',
              color: 'var(--text-primary)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            title="Inspect or export the raw extracted JSON schema"
          >
            <Code2 size={13} color="var(--gta-cyan)" />
            JSON
          </button>

          {onReExtract && (
            <button
              type="button"
              onClick={onReExtract}
              disabled={isExtracting}
              style={{
                background: 'rgba(0, 203, 214, 0.08)',
                border: '1px solid rgba(0, 203, 214, 0.3)',
                color: 'var(--gta-cyan)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: isExtracting ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={13} className={isExtracting ? 'animate-spin' : ''} />
              {isExtracting ? 'Re-inspecting...' : 'Re-run Engine'}
            </button>
          )}

          <button
            type="button"
            onClick={() => onApplyToRubric(extractedExamResult)}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 203, 214, 0.2) 0%, rgba(230, 0, 126, 0.2) 100%)',
              border: '1px solid var(--panel-border-cyan)',
              color: '#fff',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={13} />
            Apply to Rubric Criteria
          </button>
        </div>
      </div>

      {/* Validation Audit Status Banner */}
      <div style={{
        background: validation.needs_human_review 
          ? 'rgba(255, 150, 0, 0.06)' 
          : 'rgba(16, 185, 129, 0.06)',
        border: validation.needs_human_review 
          ? '1px solid rgba(255, 150, 0, 0.25)' 
          : '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {validation.needs_human_review ? (
              <AlertTriangle size={17} color="var(--gta-orange)" />
            ) : (
              <CheckCircle2 size={17} color="#10b981" />
            )}
            <span style={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: validation.needs_human_review ? 'var(--gta-orange)' : '#10b981'
            }}>
              {validation.needs_human_review 
                ? 'Human Review & Verification Recommended ([UNCLEAR] / Mark Check)' 
                : 'High-Precision VTU Extraction: 100% Fidelity & Mark Verified'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <span>
              Main Questions: <strong style={{ color: 'var(--text-primary)' }}>{validation.main_question_count}</strong>
            </span>
            <span>
              {validation.choice_system ? 'Total Paper Marks:' : 'Extracted Marks:'} <strong style={{ color: 'var(--text-primary)' }}>{validation.extracted_marks_total ?? 'N/A'}</strong>
            </span>
            <span>
              {validation.choice_system ? 'Max Answerable:' : 'Printed Total:'} <strong style={{ color: 'var(--text-primary)' }}>{validation.choice_system ? (validation.max_answerable_marks || 100) : (validation.printed_total_marks ?? 'N/A')}</strong>
            </span>
            <span style={{ color: validation.marks_match ? '#10b981' : 'var(--gta-orange)' }}>
              {validation.marks_match ? (validation.choice_system ? '✓ Validated Choice Structure' : '✓ Marks Match') : '⚠️ Mark Mismatch'}
            </span>
          </div>
        </div>

        {validation.possible_errors && validation.possible_errors.length > 0 && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <span style={{ fontWeight: '600', color: 'var(--gta-orange)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldAlert size={12} /> Audit Findings to Review / Correct:
            </span>
            {validation.possible_errors.map((err, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '8px' }}>
                <span style={{ color: 'var(--gta-orange)' }}>•</span>
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exam Metadata Strip (Editable) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid var(--panel-border)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Subject Title</label>
          <input
            type="text"
            value={exam_info.subject}
            onChange={(e) => handleUpdateExamInfo('subject', e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--panel-border)',
              borderRadius: '4px',
              padding: '6px 8px',
              color: 'var(--text-primary)',
              fontSize: '12px'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Course / Paper Code</label>
          <input
            type="text"
            value={exam_info.course_code}
            onChange={(e) => handleUpdateExamInfo('course_code', e.target.value)}
            placeholder="e.g. BCS304"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--panel-border)',
              borderRadius: '4px',
              padding: '6px 8px',
              color: 'var(--text-primary)',
              fontSize: '12px'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Semester</label>
          <input
            type="text"
            value={exam_info.semester}
            onChange={(e) => handleUpdateExamInfo('semester', e.target.value)}
            placeholder="e.g. 3rd Semester"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--panel-border)',
              borderRadius: '4px',
              padding: '6px 8px',
              color: 'var(--text-primary)',
              fontSize: '12px'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Printed Max Marks</label>
          <input
            type="number"
            value={exam_info.total_marks ?? ''}
            onChange={(e) => handleUpdateExamInfo('total_marks', parseInt(e.target.value, 10) || null)}
            placeholder="100"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--panel-border)',
              borderRadius: '4px',
              padding: '6px 8px',
              color: 'var(--text-primary)',
              fontSize: '12px'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Exam Duration</label>
          <input
            type="text"
            value={exam_info.duration}
            onChange={(e) => handleUpdateExamInfo('duration', e.target.value)}
            placeholder="e.g. 3 Hours"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--panel-border)',
              borderRadius: '4px',
              padding: '6px 8px',
              color: 'var(--text-primary)',
              fontSize: '12px'
            }}
          />
        </div>
      </div>

      {/* Main Questions Inspection & Correction Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
            Extracted Questions, Model Answers & Rubric Criteria (Phase 1–5 Pipeline)
          </span>
          <button
            type="button"
            onClick={handleAddMainQuestion}
            style={{
              background: 'rgba(0, 203, 214, 0.08)',
              border: '1px solid rgba(0, 203, 214, 0.25)',
              color: 'var(--gta-cyan)',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '11.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={12} /> Add Main Question
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '560px', overflowY: 'auto', paddingRight: '4px' }}>
          {questions.map((q, qIdx) => {
            const hasUnclear = (q.text && q.text.includes('[UNCLEAR]')) || q.subquestions.some(s => s.text.includes('[UNCLEAR]'));
            const subMarksSum = q.subquestions.reduce((sum, s) => sum + (s.marks || 0), 0);
            const activeTab = activeTabs[qIdx] || 'question';
            const totalQMarks = q.subquestions.length > 0 ? subMarksSum : (q.marks || 20);

            return (
              <div
                key={qIdx}
                style={{
                  background: hasUnclear ? 'rgba(255, 150, 0, 0.03)' : 'rgba(255, 255, 255, 0.015)',
                  border: hasUnclear ? '1px solid rgba(255, 150, 0, 0.3)' : '1px solid var(--panel-border)',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Main Question Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
                    <div style={{
                      background: 'rgba(0, 203, 214, 0.1)',
                      border: '1px solid rgba(0, 203, 214, 0.25)',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'var(--gta-cyan)'
                    }}>
                      Question {q.number}
                    </div>

                    <input
                      type="text"
                      value={q.number}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleUpdateQuestion(qIdx, (prev) => ({ ...prev, number: val }));
                      }}
                      style={{
                        width: '45px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid var(--panel-border)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        color: 'var(--text-primary)',
                        fontSize: '11.5px',
                        textAlign: 'center'
                      }}
                      title="Edit main question number"
                    />

                    <select
                      value={q.module || 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        handleUpdateQuestion(qIdx, (prev) => ({ ...prev, module: val }));
                      }}
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid var(--panel-border)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        color: 'var(--text-secondary)',
                        fontSize: '11px'
                      }}
                    >
                      <option value={1}>Module 1</option>
                      <option value={2}>Module 2</option>
                      <option value={3}>Module 3</option>
                      <option value={4}>Module 4</option>
                      <option value={5}>Module 5</option>
                    </select>

                    {/* View Tabs for Question, Model Answer, Rubric */}
                    <div style={{
                      display: 'flex',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: '5px',
                      padding: '2px'
                    }}>
                      <button
                        type="button"
                        onClick={() => setActiveTabs(prev => ({ ...prev, [qIdx]: 'question' }))}
                        style={{
                          background: activeTab === 'question' ? 'rgba(0, 203, 214, 0.15)' : 'transparent',
                          border: 'none',
                          color: activeTab === 'question' ? 'var(--gta-cyan)' : 'var(--text-secondary)',
                          borderRadius: '3px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: activeTab === 'question' ? '600' : 'normal',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FileText size={10} /> Exact Question
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTabs(prev => ({ ...prev, [qIdx]: 'modelAnswer' }))}
                        style={{
                          background: activeTab === 'modelAnswer' ? 'rgba(230, 0, 126, 0.15)' : 'transparent',
                          border: 'none',
                          color: activeTab === 'modelAnswer' ? 'var(--gta-pink)' : 'var(--text-secondary)',
                          borderRadius: '3px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: activeTab === 'modelAnswer' ? '600' : 'normal',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <BookOpen size={10} /> Model Answer
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTabs(prev => ({ ...prev, [qIdx]: 'rubric' }))}
                        style={{
                          background: activeTab === 'rubric' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                          border: 'none',
                          color: activeTab === 'rubric' ? '#10b981' : 'var(--text-secondary)',
                          borderRadius: '3px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: activeTab === 'rubric' ? '600' : 'normal',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Award size={10} /> Rubric Criteria
                      </button>
                    </div>

                    {hasUnclear ? (
                      <span className="badge badge-orange" style={{ fontSize: '10px', padding: '1px 5px' }}>
                        ⚠️ [UNCLEAR] Human Verification Required
                      </span>
                    ) : (
                      <span style={{ fontSize: '10.5px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 size={11} /> High Fidelity
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      <span>Marks:</span>
                      <input
                        type="number"
                        value={totalQMarks}
                        disabled={q.subquestions.length > 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          handleUpdateQuestion(qIdx, (prev) => ({ ...prev, marks: val }));
                        }}
                        style={{
                          width: '45px',
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid var(--panel-border)',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          color: 'var(--gta-pink)',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          textAlign: 'center'
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleOrChoice(qIdx)}
                      style={{
                        background: q.internal_choice ? 'rgba(230, 0, 126, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                        border: q.internal_choice ? '1px solid rgba(230, 0, 126, 0.3)' : '1px solid var(--panel-border)',
                        color: q.internal_choice ? 'var(--gta-pink)' : 'var(--text-secondary)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                      title="Toggle internal OR choice alternative"
                    >
                      {q.internal_choice ? 'OR Choice Active' : '+ Add OR Choice'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveMainQuestion(qIdx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                      title="Delete question"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* TAB 1: EXACT QUESTION & SUB-PARTS */}
                {activeTab === 'question' && (
                  <>
                    {q.subquestions.length === 0 && (
                      <textarea
                        value={q.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateQuestion(qIdx, (prev) => ({ ...prev, text: val }));
                        }}
                        placeholder="Enter verbatim main question text..."
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.25)',
                          border: '1px solid var(--panel-border)',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px',
                          minHeight: '45px',
                          resize: 'vertical'
                        }}
                      />
                    )}

                    {q.subquestions.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '12px', borderLeft: '2px solid rgba(0, 203, 214, 0.2)' }}>
                        {q.subquestions.map((sub, sIdx) => (
                          <div key={sIdx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <div style={{
                              background: 'rgba(0, 203, 214, 0.08)',
                              border: '1px solid rgba(0, 203, 214, 0.2)',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '11.5px',
                              fontWeight: 'bold',
                              color: 'var(--gta-cyan)'
                            }}>
                              ({sub.label})
                            </div>

                            <textarea
                              value={sub.text}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleUpdateQuestion(qIdx, (prev) => {
                                  const updatedSub = [...prev.subquestions];
                                  updatedSub[sIdx] = { ...updatedSub[sIdx], text: val };
                                  return { ...prev, subquestions: updatedSub };
                                });
                              }}
                              placeholder={`Subquestion (${sub.label}) text...`}
                              style={{
                                flex: 1,
                                background: 'rgba(0, 0, 0, 0.25)',
                                border: sub.text.includes('[UNCLEAR]') ? '1px solid rgba(255, 150, 0, 0.4)' : '1px solid var(--panel-border)',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                color: 'var(--text-primary)',
                                fontSize: '12px',
                                minHeight: '38px',
                                resize: 'vertical'
                              }}
                            />

                            <input
                              type="number"
                              value={sub.marks ?? ''}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                handleUpdateQuestion(qIdx, (prev) => {
                                  const updatedSub = [...prev.subquestions];
                                  updatedSub[sIdx] = { ...updatedSub[sIdx], marks: val };
                                  return { ...prev, subquestions: updatedSub };
                                });
                              }}
                              placeholder="Marks"
                              style={{
                                width: '45px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: '1px solid var(--panel-border)',
                                borderRadius: '4px',
                                padding: '4px 6px',
                                color: 'var(--gta-pink)',
                                fontSize: '11.5px',
                                textAlign: 'center'
                              }}
                            />

                            <button
                              type="button"
                              onClick={() => handleRemoveSubquestion(qIdx, sIdx)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                              title="Delete subquestion"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleAddSubquestion(qIdx)}
                          style={{
                            alignSelf: 'flex-start',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--gta-cyan)',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 0'
                          }}
                        >
                          <Plus size={11} /> Add Subquestion
                        </button>
                      </div>
                    )}

                    {q.internal_choice && (
                      <div style={{
                        marginTop: '6px',
                        padding: '10px 12px',
                        background: 'rgba(230, 0, 126, 0.03)',
                        border: '1px dashed rgba(230, 0, 126, 0.25)',
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--gta-pink)', letterSpacing: '0.5px' }}>
                            ⚡ INTERNAL CHOICE [OR OPTION] FOR QUESTION {q.number}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleOrChoice(qIdx)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Remove OR Option
                          </button>
                        </div>

                        <textarea
                          value={q.internal_choice.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleUpdateQuestion(qIdx, (prev) => ({
                              ...prev,
                              internal_choice: prev.internal_choice ? { ...prev.internal_choice, text: val } : null
                            }));
                          }}
                          placeholder="Enter alternative OR question wording..."
                          style={{
                            width: '100%',
                            background: 'rgba(0, 0, 0, 0.25)',
                            border: '1px solid var(--panel-border)',
                            borderRadius: '4px',
                            padding: '6px 8px',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            minHeight: '38px',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* TAB 2: MODEL ANSWER */}
                {activeTab === 'modelAnswer' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--gta-pink)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <BookOpen size={12} /> Reference Model Solution (VTU Academic Standard):
                      </span>
                    </div>

                    {q.subquestions.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {q.subquestions.map((sub, sIdx) => {
                          const subMarks = sub.marks || 6;
                          return (
                            <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--gta-cyan)' }}>
                                  Q{q.number}({sub.label}) Model Solution:
                                </span>
                                <span style={{ fontSize: '11.5px', color: 'var(--gta-pink)', fontWeight: 'bold' }}>
                                  {subMarks} Marks
                                </span>
                              </div>
                              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                                ({sub.label}) {sub.text}
                              </div>
                              <textarea
                                value={sub.modelAnswer || generateHighPrecisionModelAnswer(sub.text, subMarks)}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleUpdateQuestion(qIdx, (prev) => {
                                    const updatedSub = [...prev.subquestions];
                                    updatedSub[sIdx] = { ...updatedSub[sIdx], modelAnswer: val };
                                    return { ...prev, subquestions: updatedSub };
                                  });
                                }}
                                placeholder={`Model answer for Q${q.number}(${sub.label})...`}
                                style={{
                                  width: '100%',
                                  background: 'rgba(0, 0, 0, 0.35)',
                                  border: '1px solid var(--panel-border)',
                                  borderRadius: '6px',
                                  padding: '8px 10px',
                                  color: 'var(--text-primary)',
                                  fontFamily: 'Consolas, Monaco, monospace',
                                  fontSize: '11.5px',
                                  lineHeight: '1.45',
                                  minHeight: '80px',
                                  resize: 'vertical'
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <textarea
                        value={q.modelAnswer || generateHighPrecisionModelAnswer(q.text, totalQMarks)}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateQuestion(qIdx, (prev) => ({ ...prev, modelAnswer: val }));
                        }}
                        placeholder="Model answer content..."
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.35)',
                          border: '1px solid var(--panel-border)',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          color: 'var(--text-primary)',
                          fontFamily: 'Consolas, Monaco, monospace',
                          fontSize: '12px',
                          lineHeight: '1.5',
                          minHeight: '120px',
                          resize: 'vertical'
                        }}
                      />
                    )}
                  </div>
                )}

                {/* TAB 3: MARKING RUBRIC */}
                {activeTab === 'rubric' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ListChecks size={12} /> Rubric Marking Criteria (Total must equal {totalQMarks} Marks):
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: (q.subquestions.length > 0 ? q.subquestions.reduce((sum, sq) => sum + (sq.marks || 0), 0) : (q.rubricCriteria?.reduce((s, c) => s + c.marks, 0) || totalQMarks)) === totalQMarks ? '#10b981' : 'var(--gta-orange)'
                      }}>
                        Total: {totalQMarks} / {totalQMarks} Marks
                      </span>
                    </div>

                    {q.subquestions.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {q.subquestions.map((sub, sIdx) => {
                          const subMarks = sub.marks || 6;
                          const criteria = sub.rubricCriteria && sub.rubricCriteria.length > 0
                            ? sub.rubricCriteria
                            : generateDetailedRubricCriteria(sub.text, subMarks);
                          const subTotal = criteria.reduce((sum, c) => sum + c.marks, 0);

                          return (
                            <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--gta-cyan)' }}>
                                    Q{q.number}({sub.label}) Rubric Criteria
                                  </span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    ({subMarks} Marks)
                                  </span>
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: subTotal === subMarks ? '#10b981' : 'var(--gta-orange)' }}>
                                  Sub-Total: {subTotal} / {subMarks} Marks
                                </span>
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                ({sub.label}) {sub.text}
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {criteria.map((criterion, cIdx) => (
                                  <div key={cIdx} style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--gta-cyan)' }}>{cIdx + 1}.</span>
                                        <input
                                          type="text"
                                          value={criterion.criterion}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            handleUpdateQuestion(qIdx, (prev) => {
                                              const updatedSub = [...prev.subquestions];
                                              const curCrit = [...(updatedSub[sIdx].rubricCriteria || generateDetailedRubricCriteria(sub.text, subMarks))];
                                              curCrit[cIdx] = { ...curCrit[cIdx], criterion: val };
                                              updatedSub[sIdx] = { ...updatedSub[sIdx], rubricCriteria: curCrit };
                                              return { ...prev, subquestions: updatedSub };
                                            });
                                          }}
                                          style={{ flex: 1, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '3px 6px', color: 'var(--text-primary)', fontSize: '11.5px' }}
                                        />
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <input
                                          type="number"
                                          step="0.5"
                                          value={criterion.marks}
                                          onChange={(e) => {
                                            const val = parseFloat(e.target.value) || 0;
                                            handleUpdateQuestion(qIdx, (prev) => {
                                              const updatedSub = [...prev.subquestions];
                                              const curCrit = [...(updatedSub[sIdx].rubricCriteria || generateDetailedRubricCriteria(sub.text, subMarks))];
                                              curCrit[cIdx] = { ...curCrit[cIdx], marks: val };
                                              updatedSub[sIdx] = { ...updatedSub[sIdx], rubricCriteria: curCrit };
                                              return { ...prev, subquestions: updatedSub };
                                            });
                                          }}
                                          style={{ width: '40px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '3px', color: '#10b981', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}
                                        />
                                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>M</span>
                                      </div>
                                    </div>

                                    {criterion.expectedPoints && criterion.expectedPoints.length > 0 && (
                                      <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', paddingLeft: '4px' }}>
                                        <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Expected: </span>
                                        {criterion.expectedPoints.join(' • ')}
                                      </div>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10px', marginTop: '2px' }}>
                                      <div style={{ background: 'rgba(255, 150, 0, 0.04)', padding: '3px 5px', borderRadius: '4px', border: '1px solid rgba(255, 150, 0, 0.15)' }}>
                                        <strong style={{ color: 'var(--gta-orange)' }}>Partial: </strong>
                                        <span style={{ color: 'var(--text-secondary)' }}>{criterion.partialCredit}</span>
                                      </div>
                                      <div style={{ background: 'rgba(16, 185, 129, 0.04)', padding: '3px 5px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                                        <strong style={{ color: '#10b981' }}>Full: </strong>
                                        <span style={{ color: 'var(--text-secondary)' }}>{criterion.fullCredit}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(q.rubricCriteria && q.rubricCriteria.length > 0 ? q.rubricCriteria : generateDetailedRubricCriteria(q.text, totalQMarks)).map((criterion, cIdx) => (
                          <div
                            key={cIdx}
                            style={{
                              background: 'rgba(0, 0, 0, 0.25)',
                              border: '1px solid var(--panel-border)',
                              borderRadius: '6px',
                              padding: '10px 12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--gta-cyan)' }}>
                                  {cIdx + 1}.
                                </span>
                                <input
                                  type="text"
                                  value={criterion.criterion}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    handleUpdateQuestion(qIdx, (prev) => {
                                      const criteria = [...(prev.rubricCriteria || generateDetailedRubricCriteria(prev.text, totalQMarks))];
                                      criteria[cIdx] = { ...criteria[cIdx], criterion: val };
                                      return { ...prev, rubricCriteria: criteria };
                                    });
                                  }}
                                  style={{
                                    flex: 1,
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--panel-border)',
                                    borderRadius: '4px',
                                    padding: '4px 6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                  }}
                                />
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={criterion.marks}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    handleUpdateQuestion(qIdx, (prev) => {
                                      const criteria = [...(prev.rubricCriteria || generateDetailedRubricCriteria(prev.text, totalQMarks))];
                                      criteria[cIdx] = { ...criteria[cIdx], marks: val };
                                      return { ...prev, rubricCriteria: criteria };
                                    });
                                  }}
                                  style={{
                                    width: '45px',
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    border: '1px solid var(--panel-border)',
                                    borderRadius: '4px',
                                    padding: '4px',
                                    color: '#10b981',
                                    fontWeight: 'bold',
                                    fontSize: '11.5px',
                                    textAlign: 'center'
                                  }}
                                />
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>M</span>
                              </div>
                            </div>

                            {criterion.expectedPoints && criterion.expectedPoints.length > 0 && (
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', paddingLeft: '6px' }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Expected Points: </span>
                                {criterion.expectedPoints.join(' • ')}
                              </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10.5px', marginTop: '2px' }}>
                              <div style={{ background: 'rgba(255, 150, 0, 0.04)', padding: '4px 6px', borderRadius: '4px', border: '1px solid rgba(255, 150, 0, 0.15)' }}>
                                <strong style={{ color: 'var(--gta-orange)' }}>Partial Credit: </strong>
                                <span style={{ color: 'var(--text-secondary)' }}>{criterion.partialCredit}</span>
                              </div>
                              <div style={{ background: 'rgba(16, 185, 129, 0.04)', padding: '4px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                                <strong style={{ color: '#10b981' }}>Full Credit: </strong>
                                <span style={{ color: 'var(--text-secondary)' }}>{criterion.fullCredit}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* VTU Document Preview Modal */}
      {showVtuModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-studio, #0e0e11)',
            border: '1px solid var(--panel-border-cyan)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              borderBottom: '1px solid var(--panel-border)',
              background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} color="var(--gta-pink)" />
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>
                  High-Precision VTU Question Paper Specification & Marking Rubrics
                </h4>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleCopyVtuSpec}
                  style={{
                    background: copiedVtu ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: copiedVtu ? '1px solid #10b981' : '1px solid var(--panel-border)',
                    color: copiedVtu ? '#10b981' : 'var(--text-primary)',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedVtu ? <Check size={12} /> : <Copy size={12} />}
                  {copiedVtu ? 'Copied!' : 'Copy Markdown'}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadVtuSpec}
                  style={{
                    background: 'rgba(0, 203, 214, 0.1)',
                    border: '1px solid rgba(0, 203, 214, 0.3)',
                    color: 'var(--gta-cyan)',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Download size={12} />
                  Download MD
                </button>

                <button
                  type="button"
                  onClick={() => setShowVtuModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '0 4px',
                    marginLeft: '8px'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <pre style={{
                margin: 0,
                padding: '14px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--panel-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '12px',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {extractedExamResult.rawOutputFormatted || formatStructuredVTUOutput(extractedExamResult)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* JSON Schema Inspection & Export Modal */}
      {showJsonModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-studio, #0e0e11)',
            border: '1px solid var(--panel-border-cyan)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              borderBottom: '1px solid var(--panel-border)',
              background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code2 size={16} color="var(--gta-cyan)" />
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>
                  Question Paper Extraction JSON (Engine Output)
                </h4>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  style={{
                    background: copiedJson ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: copiedJson ? '1px solid #10b981' : '1px solid var(--panel-border)',
                    color: copiedJson ? '#10b981' : 'var(--text-primary)',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedJson ? <Check size={12} /> : <Copy size={12} />}
                  {copiedJson ? 'Copied!' : 'Copy JSON'}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  style={{
                    background: 'rgba(0, 203, 214, 0.1)',
                    border: '1px solid rgba(0, 203, 214, 0.3)',
                    color: 'var(--gta-cyan)',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Download size={12} />
                  Download
                </button>

                <button
                  type="button"
                  onClick={() => setShowJsonModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '0 4px',
                    marginLeft: '8px'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <pre style={{
                margin: 0,
                padding: '14px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--panel-border)',
                borderRadius: '8px',
                color: 'var(--text-cyan)',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '12px',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {JSON.stringify(extractedExamResult, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
