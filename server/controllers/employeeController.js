// server/controllers/employeeController.js
const Employee = require('../models/Employee');
const Field = require('../models/Field');
const Equipment = require('../models/Equipment');

// Получить всех сотрудников
exports.getAllEmployees = async (req, res) => {
  try {
    const { status, department, search } = req.query;
    
    const query = { userId: req.user._id };
    
    if (status) query.status = status;
    if (department) query.department = department;
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }
    
    const employees = await Employee.find(query)
      .populate('assignedFields', 'name')
      .populate('assignedEquipment', 'name')
      .sort({ lastName: 1, firstName: 1 });
    
    const stats = await Employee.getStats(req.user._id);
    
    res.json({
      success: true,
      employees,
      stats
    });
  } catch (error) {
    console.error('Ошибка получения сотрудников:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Получить сотрудника по ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('assignedFields', 'name area')
      .populate('assignedEquipment', 'name model');
    
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Сотрудник не найден' });
    }
    
    res.json({ success: true, employee });
  } catch (error) {
    console.error('Ошибка получения сотрудника:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Создать сотрудника
exports.createEmployee = async (req, res) => {
  try {
    const employeeData = {
      userId: req.user._id,
      ...req.body
    };
    
    const employee = new Employee(employeeData);
    await employee.save();
    
    res.status(201).json({ success: true, employee });
  } catch (error) {
    console.error('Ошибка создания сотрудника:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Обновить сотрудника
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Сотрудник не найден' });
    }
    
    res.json({ success: true, employee });
  } catch (error) {
    console.error('Ошибка обновления сотрудника:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Удалить сотрудника
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Сотрудник не найден' });
    }
    
    res.json({ success: true, message: 'Сотрудник удален' });
  } catch (error) {
    console.error('Ошибка удаления сотрудника:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Обновить статус сотрудника
exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );
    
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Сотрудник не найден' });
    }
    
    res.json({ success: true, employee });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};