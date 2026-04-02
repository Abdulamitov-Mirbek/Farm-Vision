// server/controllers/equipmentController.js
const Equipment = require('../models/Equipment');

// Получить всю технику
const getEquipment = async (req, res) => {
  try {
    console.log('📦 Getting all equipment...');
    const equipment = await Equipment.find({});
    console.log(`✅ Found ${equipment.length} items`);
    
    res.json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Создать технику
const createEquipment = async (req, res) => {
  try {
    console.log('📦 Creating:', req.body);
    const equipment = await Equipment.create(req.body);
    res.status(201).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  getEquipment,
  createEquipment
};