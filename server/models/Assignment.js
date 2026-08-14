import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  coordinatorId: {
    type: String,
    required: true,
    index: true
  },
  coordinatorName: {
    type: String,
    required: true,
    trim: true
  },
  coordinatorEmail: {
    type: String,
    trim: true
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
  modelAnswerName: {
    type: String,
    default: ''
  },
  studentAnswerFileName: {
    type: String,
    required: true,
    trim: true
  },
  rubricName: {
    type: String,
    default: 'Custom Interactive Rubric'
  },
  questionPaperText: {
    type: String,
    default: ''
  },
  modelAnswerText: {
    type: String,
    default: ''
  },
  paperDataUrl: {
    type: String,
    default: ''
  },
  modelAnswerDataUrl: {
    type: String,
    default: ''
  },
  rubricCriteria: {
    type: Array,
    default: []
  },
  questionSet: {
    type: String,
    default: 'Set-A'
  },
  assignedAt: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Assignment', assignmentSchema);
