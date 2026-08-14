import mongoose from 'mongoose';

const studentScriptSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  studentName: {
    type: String,
    default: 'Student'
  },
  examId: {
    type: String,
    required: true,
    trim: true
  },
  paperName: {
    type: String,
    required: true,
    trim: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING_PARSING', 'NEEDS_COORDINATOR_REVIEW', 'READY_FOR_EVALUATION', 'EVALUATED'],
    default: 'NEEDS_COORDINATOR_REVIEW'
  },
  pageUrls: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('StudentScript', studentScriptSchema);
