import mongoose from 'mongoose';

const extractedBlockSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  script_id: {
    type: String,
    required: true,
    index: true
  },
  page_number: {
    type: Number,
    required: true
  },
  question_id: {
    type: String,
    required: true,
    default: 'UNKNOWN'
  },
  module_number: {
    type: Number,
    default: 1
  },
  raw_text: {
    type: String,
    required: true
  },
  confidence_score: {
    type: Number,
    default: 0.8
  },
  is_continuation: {
    type: Boolean,
    default: false
  },
  bounding_box: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 100 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ExtractedBlock', extractedBlockSchema);
