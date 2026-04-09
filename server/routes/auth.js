// server/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Настройка multer для загрузки аватаров
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Только изображения (jpeg, jpg, png, gif)"));
    }
  },
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Управление аутентификацией пользователей
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         farmName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 */

// ============ ПУБЛИЧНЫЕ МАРШРУТЫ (без авторизации) ============

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: "ivanov"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ivan@farm.kg"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "password123"
 *               farmName:
 *                 type: string
 *                 example: "Ивановская ферма"
 *               phone:
 *                 type: string
 *                 example: "+996555123456"
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 *       500:
 *         description: Ошибка сервера
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ivan@farm.kg"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               rememberMe:
 *                 type: boolean
 *                 description: Запомнить устройство (увеличивает срок токена)
 *                 example: false
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Неверный email или пароль
 *       500:
 *         description: Ошибка сервера
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Запрос на сброс пароля
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Инструкции по сбросу пароля отправлены на email
 *       404:
 *         description: Пользователь с таким email не найден
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Сброс пароля по токену
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Пароль успешно изменен
 *       400:
 *         description: Недействительный или истекший токен
 */
router.post("/reset-password", authController.resetPassword);

// ============ ПРИВАТНЫЕ МАРШРУТЫ (требуют авторизацию) ============

// Все маршруты ниже требуют авторизацию
router.use(protect);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 */
router.get("/me", authController.getMe);

/**
 * @swagger
 * /api/auth/avatar:
 *   post:
 *     summary: Загрузка аватара пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Файл изображения (jpeg, jpg, png, gif)
 *     responses:
 *       200:
 *         description: Аватар успешно загружен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 avatar:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Файл не загружен или неверный формат
 *       401:
 *         description: Не авторизован
 */
router.post("/avatar", upload.single("avatar"), async (req, res) => {
  try {
    console.log("📸 ===== НАЧАЛО ЗАГРУЗКИ =====");
    console.log(
      "📸 req.user:",
      req.user ? { id: req.user._id, email: req.user.email } : "ОТСУТСТВУЕТ",
    );
    console.log(
      "📸 req.file:",
      req.file
        ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
          }
        : "ОТСУТСТВУЕТ",
    );
    console.log("📸 req.body:", req.body);
    console.log(
      "📸 req.headers.authorization:",
      req.headers.authorization ? "ЕСТЬ" : "НЕТ",
    );

    if (!req.file) {
      console.log("❌ Файл отсутствует в запросе!");
      return res
        .status(400)
        .json({ success: false, message: "Файл не загружен" });
    }

    if (!req.user || !req.user._id) {
      console.log("❌ Пользователь не авторизован!");
      return res
        .status(401)
        .json({ success: false, message: "Не авторизован" });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    console.log("📸 avatarUrl:", avatarUrl);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true },
    ).select("-password");

    if (!user) {
      console.log("❌ Пользователь не найден в БД!");
      return res
        .status(404)
        .json({ success: false, message: "Пользователь не найден" });
    }

    console.log("✅ Аватар обновлен для:", user.username);
    console.log("📸 ===== КОНЕЦ ЗАГРУЗКИ =====");

    res.json({
      success: true,
      message: "Аватар успешно загружен",
      avatar: avatarUrl,
      user: { id: user._id, name: user.username, avatar: user.avatar },
    });
  } catch (error) {
    console.error("❌ ===== ОШИБКА В CATCH =====");
    console.error("❌ name:", error.name);
    console.error("❌ message:", error.message);
    console.error("❌ stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Ошибка сервера при загрузке аватара",
    });
  }
});

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Смена пароля
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Пароль успешно изменен
 *       401:
 *         description: Неверный текущий пароль
 */
router.post("/change-password", authController.changePassword);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Обновление профиля пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               farmName:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   region:
 *                     type: string
 *     responses:
 *       200:
 *         description: Профиль успешно обновлен
 */
router.put("/profile", authController.updateProfile);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход из системы
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: Удаление аккаунта
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Аккаунт успешно удален
 *       401:
 *         description: Неверный пароль
 */
router.delete("/delete-account", authController.deleteAccount);

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: Тестовый маршрут для проверки работы auth
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Информация о доступных маршрутах
 */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "✅ Auth routes are working!",
    availableEndpoints: {
      public: [
        "POST /register",
        "POST /login",
        "POST /forgot-password",
        "POST /reset-password",
      ],
      private: [
        "GET /me",
        "POST /avatar",
        "POST /change-password",
        "PUT /profile",
        "POST /logout",
        "DELETE /delete-account",
      ],
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
