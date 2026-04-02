// server/models/Supplier.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  name: {
    type: String,
    required: [true, 'Название компании обязательно'],
    trim: true
  },
  
  contactPerson: {
    type: String,
    trim: true
  },
  
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  phone: {
    type: String,
    required: [true, 'Телефон обязателен'],
    trim: true
  },
  
  alternativePhone: {
    type: String,
    trim: true
  },
  
  address: {
    street: String,
    city: String,
    region: String,
    country: String,
    postalCode: String
  },
  
  website: {
    type: String,
    trim: true
  },
  
  category: {
    type: String,
    enum: ['seeds', 'fertilizers', 'equipment', 'animals', 'feed', 'chemicals', 'fuel', 'services', 'other'],
    required: true
  },
  
  products: [{
    name: String,
    description: String,
    unit: String,
    price: Number
  }],
  
  paymentTerms: {
    type: String,
    default: 'prepaid' // prepaid, credit, partial
  },
  
  creditDays: {
    type: Number,
    default: 0
  },
  
  taxNumber: {
    type: String,
    trim: true
  },
  
  bankDetails: {
    bankName: String,
    accountNumber: String,
    swiftCode: String,
    iban: String
  },
  
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  
  contracts: [{
    number: String,
    startDate: Date,
    endDate: Date,
    file: String
  }],
  
  notes: {
    type: String,
    default: ''
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active'
  },
  
  lastOrderDate: {
    type: Date
  },
  
  totalOrders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Индексы для поиска
supplierSchema.index({ userId: 1, name: 1 });
supplierSchema.index({ userId: 1, category: 1 });
supplierSchema.index({ userId: 1, status: 1 });

// Статистика
supplierSchema.statics.getStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } }
      }
    }
  ]);
  
  const byCategory = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    ...(stats[0] || { total: 0, active: 0, inactive: 0 }),
    byCategory
  };
};

module.exports = mongoose.model('Supplier', supplierSchema);