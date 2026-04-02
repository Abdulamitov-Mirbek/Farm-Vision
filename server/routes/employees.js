// server/routes/employees.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// Все маршруты защищены
router.use(protect);

router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.patch('/:id/status', employeeController.updateEmployeeStatus);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;