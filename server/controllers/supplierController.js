// server/controllers/supplierController.js
const Supplier = require('../models/Supplier');

// Получить всех поставщиков
exports.getAllSuppliers = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    const query = { userId: req.user._id };
    
    if (category) query.category = category;
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const suppliers = await Supplier.find(query).sort({ name: 1 });
    const stats = await Supplier.getStats(req.user._id);
    
    res.json({
      success: true,
      suppliers,
      stats
    });
  } catch (error) {
    console.error('Ошибка получения поставщиков:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Получить поставщика по ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Поставщик не найден' });
    }
    
    res.json({ success: true, supplier });
  } catch (error) {
    console.error('Ошибка получения поставщика:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Создать поставщика
exports.createSupplier = async (req, res) => {
  try {
    const supplierData = {
      userId: req.user._id,
      ...req.body
    };
    
    const supplier = new Supplier(supplierData);
    await supplier.save();
    
    res.status(201).json({ success: true, supplier });
  } catch (error) {
    console.error('Ошибка создания поставщика:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Обновить поставщика
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Поставщик не найден' });
    }
    
    res.json({ success: true, supplier });
  } catch (error) {
    console.error('Ошибка обновления поставщика:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Удалить поставщика
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Поставщик не найден' });
    }
    
    res.json({ success: true, message: 'Поставщик удален' });
  } catch (error) {
    console.error('Ошибка удаления поставщика:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Обновить статус поставщика
exports.updateSupplierStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );
    
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Поставщик не найден' });
    }
    
    res.json({ success: true, supplier });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};