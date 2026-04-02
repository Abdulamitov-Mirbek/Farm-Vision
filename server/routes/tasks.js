// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware'); // ✅ ИСПРАВЛЕНО: импортируем protect

// Все маршруты требуют авторизации
router.use(protect); // ✅ используем protect

router.get('/', taskController.getAllTasks);
router.get('/stats', taskController.getTaskStats);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;