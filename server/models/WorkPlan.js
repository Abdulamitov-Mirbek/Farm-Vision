// server/models/WorkPlan.js
const mongoose = require('mongoose');

const workPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'seasonal', 'yearly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  tasks: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    title: String,
    description: String,
    assignedTo: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    dueDate: Date,
    estimatedHours: Number,
    completedAt: Date,
    notes: String
  }],
  resources: [{
    name: String,
    quantity: Number,
    unit: String,
    allocated: Boolean
  }],
  weather: {
    favorable: Boolean,
    notes: String
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  completedAt: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkPlan', workPlanSchema);