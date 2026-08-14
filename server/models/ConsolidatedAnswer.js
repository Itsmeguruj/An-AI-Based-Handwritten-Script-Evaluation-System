import mongoose from 'mongoose';

const consolidatedAnswerSchema = new mongoose.Schema({
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
  question_id: {
    type: String,
    required: true
  },
  combined_text: {
    type: String,
    required: true
  },
  block_ids: {
    type: [String],
    default: []
  },
  is_manually_overridden: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ConsolidatedAnswer', consolidatedAnswerSchema);
