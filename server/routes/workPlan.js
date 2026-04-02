// server/routes/workPlan.js
const express = require('express');
const router = express.Router();
const workPlanController = require('../controllers/workPlanController');
const { protect } = require('../middleware/authMiddleware'); // ✅ ИСПРАВЛЕНО: protect вместо authMiddleware

// Все маршруты требуют авторизации
router.use(protect); // ✅ protect вместо authMiddleware

router.get('/', workPlanController.getAllPlans);
router.post('/', workPlanController.createPlan);
router.get('/:id', workPlanController.getPlanById);
router.put('/:id', workPlanController.updatePlan);
router.patch('/:id/status', workPlanController.updatePlanStatus);
router.delete('/:id', workPlanController.deletePlan);
router.post('/:id/tasks', workPlanController.addTaskToPlan);
router.patch('/:planId/tasks/:taskIndex', workPlanController.updateTaskStatus);

module.exports = router;