// server/routes/users.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  getUserStats,
  getUserActivities,
} = require("../controllers/userController");

// Все маршруты защищены
router.use(protect);

// ✅ ВАЖНО: Конкретные маршруты ДО маршрутов с параметрами!

// GET /api/users - получить всех пользователей
router.get("/", getAllUsers);

// GET /api/users/profile - получить профиль текущего пользователя
// PUT /api/users/profile - обновить профиль
router.route("/profile").get(getMyProfile).put(updateMyProfile);

// GET /api/users/stats - статистика пользователя
router.get("/stats", getUserStats);

// GET /api/users/me/stats - статистика пользователя (альтернативный URL)
router.get("/me/stats", getUserStats);

// GET /api/users/me/activities - активности пользователя
router.get("/me/activities", getUserActivities);

// ✅ Маршруты с параметрами ДОЛЖНЫ БЫТЬ В КОНЦЕ!
// GET /api/users/:id - получить пользователя по ID
// PUT /api/users/:id - обновить пользователя
// DELETE /api/users/:id - удалить пользователя
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
