// server/controllers/authController.js
const User = require("../models/User");
const { generateToken } = require("../config/auth");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Регистрация нового пользователя
 */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { username, name, email, password, farmName, location, phone, role } =
      req.body;
    const finalUsername = username || name;

    if (!finalUsername) {
      return res.status(400).json({
        success: false,
        message: "Имя пользователя обязательно.",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Пользователь с таким email уже существует.",
      });
    }

    user = await User.findOne({ username: finalUsername });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Пользователь с таким именем уже существует.",
      });
    }

    user = new User({
      username: finalUsername,
      email,
      password,
      farmName: farmName || "",
      location: location || "",
      phone: phone || "",
      role: role || "user",
      isActive: true,
    });

    await user.save();

    const token = user.generateAuthToken();
    const userResponse = await User.findById(user._id).select("-password");

    res.status(201).json({
      success: true,
      message: "Регистрация успешна!",
      token,
      user: {
        id: userResponse._id,
        name: userResponse.username,
        email: userResponse.email,
        phone: userResponse.phone || "",
        farmName: userResponse.farmName || "",
        role: userResponse.role,
        avatar: userResponse.avatar || "",
        bio: userResponse.bio || "",
        location: userResponse.location || "",
        createdAt: userResponse.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Ошибка регистрации:", error);
    console.error("🔥 ERROR DETAILS:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при регистрации.",
      debug: error.message,
    });
  }
};

/**
 * Вход пользователя
 */
exports.login = async (req, res) => {
  try {
    console.log("🔵 ========== LOGIN ATTEMPT ==========");
    console.log("📦 Request body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    console.log("📧 Email:", email);

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("❌ User not found with email:", email);
      return res.status(401).json({
        success: false,
        message: "Неверный email или пароль.",
      });
    }

    console.log("✅ User found:", {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    if (!user.isActive) {
      console.log("❌ User is not active:", email);
      return res.status(401).json({
        success: false,
        message: "Учетная запись заблокирована. Обратитесь к администратору.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log("❌ Invalid password for user:", email);
      return res.status(401).json({
        success: false,
        message: "Неверный email или пароль.",
      });
    }

    await user.updateLastLogin();

    const token = user.generateAuthToken();

    console.log("✅ Login successful for:", email);
    console.log("🔵 ========== LOGIN SUCCESS ==========");

    res.json({
      success: true,
      message: "Вход выполнен успешно!",
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        phone: user.phone || "",
        farmName: user.farmName || "",
        role: user.role,
        avatar: user.avatar || "",
        bio: user.bio || "",
        location: user.location || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("🔴 ========== LOGIN ERROR ==========");
    console.error("❌ Error:", error);
    console.error("❌ Stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Ошибка сервера при входе.",
    });
  }
};

/**
 * Получение информации о текущем пользователе
 */
exports.getMe = async (req, res) => {
  try {
    console.log("🔵 ===== authController.getMe =====");
    console.log("User ID from req.user:", req.user?._id);

    if (!req.user || !req.user._id) {
      console.log("❌ No user in request");
      return res.status(401).json({
        success: false,
        message: "Не авторизован",
      });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден.",
      });
    }

    console.log("✅ User found:", user.email);

    const userResponse = {
      id: user._id,
      name: user.username,
      email: user.email,
      phone: user.phone || "",
      farmName: user.farmName || "",
      role: user.role || "user",
      avatar: user.avatar || "",
      bio: user.bio || "",
      location: user.location || "",
      createdAt: user.createdAt,
      isActive: user.isActive,
    };

    console.log("✅ Sending user response");

    res.json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("🔴 Ошибка получения пользователя:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении информации о пользователе.",
    });
  }
};

/**
 * Обновление профиля пользователя
 */
exports.updateProfile = async (req, res) => {
  try {
    console.log("🔵 ===== authController.updateProfile =====");
    console.log("User ID:", req.user._id);
    console.log("Request body:", req.body);

    const updates = req.body;
    const updateFields = {};

    // Обновление username (если пришло как name)
    if (updates.name !== undefined && updates.name !== req.user.username) {
      const existingUser = await User.findOne({
        username: updates.name,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Пользователь с таким именем уже существует.",
        });
      }
      updateFields.username = updates.name;
    }

    // Обновление email
    if (updates.email !== undefined && updates.email !== req.user.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Пользователь с таким email уже существует.",
        });
      }
      updateFields.email = updates.email;
    }

    // Обновление остальных полей
    if (updates.phone !== undefined) updateFields.phone = updates.phone;
    if (updates.farmName !== undefined)
      updateFields.farmName = updates.farmName;
    if (updates.bio !== undefined) updateFields.bio = updates.bio;
    if (updates.location !== undefined)
      updateFields.location = updates.location;
    if (updates.avatar !== undefined) updateFields.avatar = updates.avatar;

    console.log("Update fields to apply:", updateFields);

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Нет данных для обновления",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    console.log("✅ User updated successfully");

    const userResponse = {
      id: user._id,
      name: user.username,
      email: user.email,
      phone: user.phone || "",
      farmName: user.farmName || "",
      role: user.role,
      avatar: user.avatar || "",
      bio: user.bio || "",
      location: user.location || "",
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      message: "Профиль успешно обновлен.",
      user: userResponse,
    });
  } catch (error) {
    console.error("🔴 Ошибка обновления профиля:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message:
          field === "email"
            ? "Email уже используется"
            : field === "username"
              ? "Имя пользователя уже используется"
              : "Данные уже существуют",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Ошибка сервера при обновлении профиля.",
    });
  }
};

/**
 * Смена пароля
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Текущий пароль неверен.",
      });
    }

    user.password = newPassword;
    await user.save();

    const token = user.generateAuthToken();

    res.json({
      success: true,
      message: "Пароль успешно изменен.",
      token,
    });
  } catch (error) {
    console.error("❌ Ошибка смены пароля:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при смене пароля.",
    });
  }
};

/**
 * Запрос на сброс пароля
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь с таким email не найден.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    res.json({
      success: true,
      message: "Инструкции по сбросу пароля отправлены на email.",
      resetToken:
        process.env.NODE_ENV === "development" ? resetToken : undefined,
      resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
    });
  } catch (error) {
    console.error("❌ Ошибка запроса сброса пароля:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при запросе сброса пароля.",
    });
  }
};

/**
 * Сброс пароля
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Недействительный или истекший токен сброса пароля.",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const authToken = user.generateAuthToken();

    res.json({
      success: true,
      message: "Пароль успешно изменен.",
      token: authToken,
    });
  } catch (error) {
    console.error("❌ Ошибка сброса пароля:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при сбросе пароля.",
    });
  }
};

/**
 * Выход пользователя
 */
exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Выход выполнен успешно.",
    });
  } catch (error) {
    console.error("❌ Ошибка выхода:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при выходе.",
    });
  }
};

/**
 * Удаление учетной записи
 */
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Неверный пароль.",
      });
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: "Учетная запись успешно удалена.",
    });
  } catch (error) {
    console.error("❌ Ошибка удаления учетной записи:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка сервера при удалении учетной записи.",
    });
  }
};
