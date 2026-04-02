// server/routes/users.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,      // ✅ вместо getProfile
  updateMyProfile,   // ✅ вместо updateProfile
  getUserStats,
  getUserActivities
} = require('../controllers/userController');

// Все маршруты защищены
router.use(protect);

// GET /api/users - получить всех пользователей
router.route('/')
  .get(getAllUsers);
//  .post(createUser); // закомментировано, так как нет функции

// GET /api/users/profile - получить профиль текущего пользователя
// PUT /api/users/profile - обновить профиль
router.route('/profile')
  .get(getMyProfile)      // ✅ используем getMyProfile
  .put(updateMyProfile);   // ✅ используем updateMyProfile

// GET /api/users/me/stats - статистика пользователя
router.get('/me/stats', getUserStats);

// GET /api/users/me/activities - активности пользователя
router.get('/me/activities', getUserActivities);

// GET /api/users/:id - получить пользователя по ID
// PUT /api/users/:id - обновить пользователя
// DELETE /api/users/:id - удалить пользователя
router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;