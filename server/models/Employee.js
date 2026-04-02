// server/models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  firstName: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true
  },
  
  lastName: {
    type: String,
    required: [true, 'Фамилия обязательна'],
    trim: true
  },
  
  position: {
    type: String,
    required: [true, 'Должность обязательна'],
    trim: true
  },
  
  department: {
    type: String,
    enum: ['field', 'livestock', 'equipment', 'management', 'other'],
    default: 'field'
  },
  
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  phone: {
    type: String,
    trim: true
  },
  
  address: {
    type: String,
    trim: true
  },
  
  hireDate: {
    type: Date,
    default: Date.now
  },
  
  salary: {
    type: Number,
    min: 0
  },
  
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'seasonal', 'contractor'],
    default: 'full-time'
  },
  
  status: {
    type: String,
    enum: ['active', 'on-leave', 'terminated'],
    default: 'active'
  },
  
  skills: [{
    type: String,
    trim: true
  }],
  
  assignedFields: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field'
  }],
  
  assignedEquipment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  }],
  
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  
  notes: {
    type: String,
    default: ''
  },
  
  documents: [{
    name: String,
    url: String,
    uploadDate: Date
  }]
}, {
  timestamps: true
});

// Индексы для поиска
employeeSchema.index({ userId: 1, lastName: 1, firstName: 1 });
employeeSchema.index({ userId: 1, position: 1 });
employeeSchema.index({ userId: 1, department: 1 });
employeeSchema.index({ userId: 1, status: 1 });

// Полное имя
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Статистика - ИСПРАВЛЕНО!
employeeSchema.statics.getStats = async function(userId) {
  // Для MongoDB версии 4+ можно использовать просто userId как строку
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        onLeave: { $sum: { $cond: [{ $eq: ['$status', 'on-leave'] }, 1, 0] } },
        terminated: { $sum: { $cond: [{ $eq: ['$status', 'terminated'] }, 1, 0] } }
      }
    }
  ]);
  
  const byDepartment = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$department',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    ...(stats[0] || { total: 0, active: 0, onLeave: 0, terminated: 0 }),
    byDepartment
  };
};

module.exports = mongoose.model('Employee', employeeSchema);