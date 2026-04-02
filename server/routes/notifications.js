// server/routes/notifications.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Все маршруты защищены
router.use(protect);

router.get('/', notificationController.getAllNotifications);
router.get('/stats', notificationController.getStats);
router.get('/:id', notificationController.getNotificationById);
router.post('/', notificationController.createNotification);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.delete('/clear/read', notificationController.clearAllRead);

module.exports = router;