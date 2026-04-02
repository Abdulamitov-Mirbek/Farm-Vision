// server/routes/ai.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// ✅ ИСПРАВЛЕНО: Используем DeepSeek API вместо Groq
const OpenAI = require("openai");

// Инициализация DeepSeek (совместим с OpenAI SDK)
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY, // Ваш новый DeepSeek API ключ
  baseURL: "https://api.deepseek.com/v1", // Важно! Указываем базовый URL DeepSeek
});

// @desc    Отправка сообщения к AI
// @route   POST /api/ai/chat
// @access  Private
router.post("/chat", protect, async (req, res) => {
  try {
    const { message, language = "ru" } = req.body;

    console.log("📥 AI Request:", { message, userId: req.user._id });

    // Проверяем наличие ключа DeepSeek
    if (!process.env.DEEPSEEK_API_KEY) {
      console.log("⚠️ DEEPSEEK_API_KEY не найден, использую локальные ответы");
      return res.json({
        success: true,
        message: generateLocalResponse(message),
        local: true,
      });
    }

    // Системные промпты на разных языках
    const systemPrompts = {
      ru: "Ты - Farm Culture, полезный AI-ассистент для фермеров. Отвечай кратко, дружелюбно и по делу.",
      en: "You are Farm Culture, a helpful AI assistant for farmers. Answer concisely and friendly.",
      kg: "Сен - Farm Culture, дыйкандарга жардам берүүчү AI-жардамчы. Кыска, достук мамиледе жана так жооп бер.",
    };

    // ✅ ИСПРАВЛЕНО: Запрос к DeepSeek API
    const completion = await deepseek.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompts[language] || systemPrompts.ru,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "deepseek-chat", // DeepSeek модель
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiMessage = completion.choices[0]?.message?.content;
    console.log("✅ Ответ от DeepSeek получен");

    res.json({
      success: true,
      message: aiMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ DeepSeek API Error:", error);

    // Пробуем другой формат ошибки
    if (error.response) {
      console.error("API Response Error:", error.response.data);
    }

    res.json({
      success: true,
      message: generateLocalResponse(req.body.message),
      local: true,
      timestamp: new Date().toISOString(),
    });
  }
});

// Тестовый маршрут без авторизации
router.get("/ping", (req, res) => {
  res.json({
    success: true,
    message: "AI service is alive",
    deepseekKeyPresent: !!process.env.DEEPSEEK_API_KEY,
  });
});

// Локальная генерация ответов (запасной вариант) - ваш код остается без изменений
function generateLocalResponse(message) {
  // ... ваш существующий код ...
}

module.exports = router;
