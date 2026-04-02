// server/routes/weeklyTasks.js
const express = require('express');
const router = express.Router();
const weeklyTaskController = require('../controllers/weeklyTaskController');
const { protect } = require('../middleware/authMiddleware');

// Все маршруты защищены
router.use(protect);

router.get('/', weeklyTaskController.getAllTasks);
router.post('/', weeklyTaskController.createTask);
router.get('/stats', weeklyTaskController.getTaskStats);
router.put('/:id', weeklyTaskController.updateTask);
router.patch('/:id/complete', weeklyTaskController.completeTask);
router.delete('/:id', weeklyTaskController.deleteTask);

module.exports = router;