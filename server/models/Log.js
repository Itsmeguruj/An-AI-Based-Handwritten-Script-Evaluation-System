import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  actorRole: {
    type: String,
    required: true,
    enum: ['admin', 'coordinator']
  },
  actorName: {
    type: String,
    required: true
  },
  browser: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Log', logSchema);
