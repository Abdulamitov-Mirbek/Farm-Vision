// routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// ===========================================
// СУЩЕСТВУЮЩИЕ ФЕРМЕРСКИЕ МАРШРУТЫ
// ===========================================
router.post("/advice", protect, aiController.getAdvice);
router.get("/daily-tips", protect, aiController.getDailyTips);
router.post("/diagnose", protect, aiController.diagnosePlant);
router.get("/predictions", protect, aiController.getPredictions);
router.get("/history/:userId", protect, aiController.getChatHistory);
router.delete("/history/:userId", protect, aiController.clearChatHistory);
router.post("/feedback", protect, aiController.submitFeedback);

// ===========================================
// НОВЫЕ УНИВЕРСАЛЬНЫЕ МАРШРУТЫ
// ===========================================
router.post("/universal-chat", protect, aiController.universalChat);
router.post("/generate-code", protect, aiController.generateCode);
router.post("/translate", protect, aiController.translateText);
router.post("/analyze", protect, aiController.analyzeDocument);
router.post("/create-content", protect, aiController.createContent);
router.post("/ask", protect, aiController.askQuestion);
router.post("/stream", protect, aiController.streamChat);

// Проверка статуса
router.get("/status", (req, res) => {
  res.json({
    success: true,
    status: "online",
    features: {
      farming: ["advice", "diagnose", "predictions", "tips"],
      universal: ["chat", "code", "translate", "analyze", "content", "qa"],
      streaming: true,
    },
    model: "deepseek-chat",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
