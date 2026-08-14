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
}

export interface ScriptBlocksResponse {
  script: StudentScript;
  blocks: ExtractedBlock[];
  consolidatedAnswers: ConsolidatedAnswer[];
}
