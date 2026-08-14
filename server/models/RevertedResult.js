import mongoose from 'mongoose';

const revertedResultSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  serialNo: {
    type: String,
    required: true,
    trim: true
  },
  studentBookletId: {
    type: String,
    default: 'N/A',
    trim: true
  },
  paperName: {
    type: String,
    required: true,
    trim: true
  },
  studentAnswerFileName: {
    type: String,
    required: true,
    trim: true
  },
  coordinatorName: {
    type: String,
    required: true,
    trim: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  questionResults: {
    type: Array,
    default: []
  },
  evaluatedAt: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Evaluated & Reverted'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('RevertedResult', revertedResultSchema);
