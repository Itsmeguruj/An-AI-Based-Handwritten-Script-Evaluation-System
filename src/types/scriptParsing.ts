export type ScriptStatus = 
  | 'PENDING_PARSING'
  | 'NEEDS_COORDINATOR_REVIEW'
  | 'READY_FOR_EVALUATION'
  | 'EVALUATED';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PolygonPoint {
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
}

export interface CircledQuestionMarker {
  detected: boolean;
  questionNumber: string; // e.g. "1", "2", "4", "6", "1a", "2b"
  rawLabel?: string;      // e.g. "①", "④", "4)", "Q2"
  subQuestion?: string;   // e.g. "a", "b"
  bbox: BoundingBox;      // Circle boundary coordinates in percentage
  confidence: number;     // 0.0 to 1.0
  circleShape?: 'circle' | 'oval' | 'rounded_rect' | 'irregular';
  radiusPercent?: number;
}

export interface ParsingConfidenceMetrics {
  circledDetectionConf: number;   // Metric 1: Circle/oval contour quality (0.0 to 1.0)
  questionOcrConf: number;        // Metric 2: Question number OCR recognition (0.0 to 1.0)
  handwritingConf: number;        // Metric 3: Handwritten content density & clarity (0.0 to 1.0)
  boundaryAccuracyConf: number;   // Metric 4: Answer boundary tightness & fit (0.0 to 1.0)
  blockAssociationConf: number;   // Metric 5: Answer block to rubric question match (0.0 to 1.0)
  continuationConf: number;       // Metric 6: Cross-page continuation detection (0.0 to 1.0)
  overallConf: number;            // Composite overall confidence (0.0 to 1.0)
}

export interface StudentScript {
  id: string;
  studentId: string;
  studentName?: string;
  examId: string;
  paperName: string;
  totalPages: number;
  status: ScriptStatus;
  createdAt: string;
  pageUrls?: string[];
}

export interface ExtractedBlock {
  id: string;
  script_id: string;
  page_number: number;
  question_id: string; // e.g. "Q1a", "Q5b", "UNKNOWN"
  module_number: number;
  raw_text: string;
  confidence_score: number; // 0.0 to 1.0
  is_continuation: boolean;
  bounding_box?: BoundingBox;
  polygon?: PolygonPoint[]; // Precise polygon boundary points
  circled_marker?: CircledQuestionMarker; // Visual circled question number anchor
  confidence_metrics?: ParsingConfidenceMetrics; // 6-dimension independent confidence scores
  detected_orientation?: 'portrait' | 'landscape';
  text_lines_count?: number;
  ink_density?: number;
}

export interface ConsolidatedAnswer {
  id: string;
  script_id: string;
  question_id: string;
  combined_text: string;
  block_ids: string[];
  is_manually_overridden: boolean;
}

export interface ReassignBlockPayload {
  block_id: string;
  new_question_id: string;
  new_module: number;
}

export interface MergeBlocksPayload {
  target_question_id: string;
  ordered_block_ids: string[];
}

export interface CreateBlockPayload {
  page_number: number;
  question_id: string;
  module_number: number;
  raw_text: string;
  bounding_box?: BoundingBox;
  polygon?: PolygonPoint[];
}

export interface UpdateBlockPayload {
  block_id: string;
  raw_text?: string;
  question_id?: string;
  module_number?: number;
  is_continuation?: boolean;
  confidence_score?: number;
  bounding_box?: BoundingBox;
  polygon?: PolygonPoint[];
}

export interface SplitBlockPayload {
  block_id: string;
  split_index: number;
  new_question_id_2?: string;
}

export interface DeleteBlockPayload {
  block_id: string;
}

export interface UpdateConsolidatedPayload {
  question_id: string;
  combined_text: string;
}

export interface ScriptBlocksResponse {
  script: StudentScript;
  blocks: ExtractedBlock[];
  consolidatedAnswers: ConsolidatedAnswer[];
}
