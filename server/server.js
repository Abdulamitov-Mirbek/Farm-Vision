// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDatabase, closeDatabase } = require("./config/db");

// Импорт для Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Импорт маршрутов
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const fieldRoutes = require("./routes/fields");
const taskRoutes = require("./routes/tasks");
const diaryRoutes = require("./routes/diary");
const weatherRoutes = require("./routes/weather");
const aiRoutes = require("./routes/ai");
const analyticsRoutes = require("./routes/analytics");
const huggingfaceRoutes = require("./routes/huggingface-proxy");
const resourceRoutes = require("./routes/resources");
const animalRoutes = require("./routes/animals");
const workPlanRoutes = require("./routes/workPlan");
const equipmentRoutes = require("./routes/equipment");
const weeklyTaskRoutes = require("./routes/weeklyTasks");
const employeeRoutes = require("./routes/employees");
const supplierRoutes = require("./routes/suppliers");
const notificationRoutes = require("./routes/notifications");

const { protect } = require("./middleware/authMiddleware");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(require("./config/cors")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ГЛАВНЫЙ API МАРШРУТ - информация о всех доступных эндпоинтах
app.get("/api", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const endpoints = {
    success: true,
    message: "🌾 Global Agri API",
    version: "1.0.0",
    documentation: `${baseUrl}/api-docs`,
    timestamp: new Date().toISOString(),
    status: "online",
    database: "connected to MongoDB Atlas",
    availableEndpoints: {
      auth: {
        public: [
          {
            method: "POST",
            path: "/api/auth/register",
            description: "Регистрация",
          },
          { method: "POST", path: "/api/auth/login", description: "Вход" },
          {
            method: "POST",
            path: "/api/auth/forgot-password",
            description: "Забыли пароль",
          },
          {
            method: "POST",
            path: "/api/auth/reset-password",
            description: "Сброс пароля",
          },
        ],
        private: [
          { method: "GET", path: "/api/auth/me", description: "Мой профиль" },
          {
            method: "PUT",
            path: "/api/auth/profile",
            description: "Обновить профиль",
          },
          {
            method: "POST",
            path: "/api/auth/change-password",
            description: "Сменить пароль",
          },
          { method: "POST", path: "/api/auth/logout", description: "Выход" },
        ],
      },
      users: {
        private: [
          {
            method: "GET",
            path: "/api/users/profile",
            description: "Профиль пользователя",
          },
          {
            method: "PUT",
            path: "/api/users/profile",
            description: "Обновить профиль",
          },
        ],
      },
      // ✅ ПОЛЯ (FIELDS)
      fields: {
        private: [
          {
            method: "GET",
            path: "/api/fields",
            description: "Получить все поля",
          },
          { method: "POST", path: "/api/fields", description: "Создать поле" },
          {
            method: "GET",
            path: "/api/fields/stats",
            description: "Статистика полей",
          },
          {
            method: "GET",
            path: "/api/fields/:id",
            description: "Получить поле по ID",
          },
          {
            method: "PUT",
            path: "/api/fields/:id",
            description: "Обновить поле",
          },
          {
            method: "DELETE",
            path: "/api/fields/:id",
            description: "Удалить поле",
          },
          {
            method: "PATCH",
            path: "/api/fields/:id/status",
            description: "Обновить статус поля",
          },
        ],
      },
      // ✅ ЖИВОТНЫЕ (ANIMALS)
      animals: {
        private: [
          {
            method: "GET",
            path: "/api/animals",
            description: "Получить всех животных",
          },
          {
            method: "POST",
            path: "/api/animals",
            description: "Создать животное",
          },
          {
            method: "GET",
            path: "/api/animals/stats",
            description: "Статистика животных",
          },
          {
            method: "GET",
            path: "/api/animals/:id",
            description: "Получить животное по ID",
          },
          {
            method: "PUT",
            path: "/api/animals/:id",
            description: "Обновить животное",
          },
          {
            method: "DELETE",
            path: "/api/animals/:id",
            description: "Удалить животное",
          },
          {
            method: "PATCH",
            path: "/api/animals/:id/health",
            description: "Обновить здоровье",
          },
          {
            method: "POST",
            path: "/api/animals/:id/vaccinations",
            description: "Добавить вакцинацию",
          },
        ],
      },
      // ✅ РЕСУРСЫ (RESOURCES)
      resources: {
        private: [
          {
            method: "GET",
            path: "/api/resources",
            description: "Получить все ресурсы",
          },
          {
            method: "POST",
            path: "/api/resources",
            description: "Создать ресурс",
          },
          {
            method: "GET",
            path: "/api/resources/stats",
            description: "Статистика ресурсов",
          },
          {
            method: "GET",
            path: "/api/resources/:id",
            description: "Получить ресурс по ID",
          },
          {
            method: "PUT",
            path: "/api/resources/:id",
            description: "Обновить ресурс",
          },
          {
            method: "DELETE",
            path: "/api/resources/:id",
            description: "Удалить ресурс",
          },
          {
            method: "PATCH",
            path: "/api/resources/:id/quantity",
            description: "Обновить количество",
          },
        ],
      },
      // ✅ ДНЕВНИК (DIARY)
      diary: {
        private: [
          {
            method: "GET",
            path: "/api/diary",
            description: "Получить все записи",
          },
          { method: "POST", path: "/api/diary", description: "Создать запись" },
          {
            method: "GET",
            path: "/api/diary/stats",
            description: "Статистика дневника",
          },
          {
            method: "GET",
            path: "/api/diary/:id",
            description: "Получить запись по ID",
          },
          {
            method: "PUT",
            path: "/api/diary/:id",
            description: "Обновить запись",
          },
          {
            method: "DELETE",
            path: "/api/diary/:id",
            description: "Удалить запись",
          },
        ],
      },
      // ✅ ЗАДАЧИ (TASKS)
      tasks: {
        private: [
          {
            method: "GET",
            path: "/api/tasks",
            description: "Получить все задачи",
          },
          { method: "POST", path: "/api/tasks", description: "Создать задачу" },
          {
            method: "GET",
            path: "/api/tasks/stats",
            description: "Статистика задач",
          },
          {
            method: "GET",
            path: "/api/tasks/:id",
            description: "Получить задачу по ID",
          },
          {
            method: "PUT",
            path: "/api/tasks/:id",
            description: "Обновить задачу",
          },
          {
            method: "DELETE",
            path: "/api/tasks/:id",
            description: "Удалить задачу",
          },
          {
            method: "PATCH",
            path: "/api/tasks/:id/status",
            description: "Обновить статус",
          },
        ],
      },
      // ✅ ПОГОДА (WEATHER)
      weather: {
        public: [
          {
            method: "GET",
            path: "/api/weather",
            description: "Текущая погода",
          },
          {
            method: "GET",
            path: "/api/weather/forecast",
            description: "Прогноз на 7 дней",
          },
        ],
      },
      // ✅ AI
      ai: {
        private: [
          {
            method: "POST",
            path: "/api/ai/chat",
            description: "Чат с AI-ассистентом",
          },
          {
            method: "POST",
            path: "/api/ai/analyze",
            description: "Анализ данных",
          },
          {
            method: "POST",
            path: "/api/ai/recommend",
            description: "Рекомендации",
          },
        ],
      },
      // ✅ АНАЛИТИКА
      analytics: {
        private: [
          {
            method: "GET",
            path: "/api/analytics/yield",
            description: "Аналитика урожайности",
          },
          {
            method: "GET",
            path: "/api/analytics/financial",
            description: "Финансовая аналитика",
          },
          {
            method: "GET",
            path: "/api/analytics/fields",
            description: "Аналитика по полям",
          },
        ],
      },
      // ✅ ТЕХНИКА
      equipment: {
        private: [
          {
            method: "GET",
            path: "/api/equipment",
            description: "Получить всю технику",
          },
          {
            method: "POST",
            path: "/api/equipment",
            description: "Добавить технику",
          },
          {
            method: "PUT",
            path: "/api/equipment/:id",
            description: "Обновить технику",
          },
          {
            method: "DELETE",
            path: "/api/equipment/:id",
            description: "Удалить технику",
          },
        ],
      },
      // ✅ СОТРУДНИКИ
      employees: {
        private: [
          {
            method: "GET",
            path: "/api/employees",
            description: "Получить всех сотрудников",
          },
          {
            method: "POST",
            path: "/api/employees",
            description: "Добавить сотрудника",
          },
          {
            method: "PUT",
            path: "/api/employees/:id",
            description: "Обновить сотрудника",
          },
          {
            method: "DELETE",
            path: "/api/employees/:id",
            description: "Удалить сотрудника",
          },
        ],
      },
      // ✅ ПОСТАВЩИКИ
      suppliers: {
        private: [
          {
            method: "GET",
            path: "/api/suppliers",
            description: "Получить всех поставщиков",
          },
          {
            method: "POST",
            path: "/api/suppliers",
            description: "Добавить поставщика",
          },
          {
            method: "PUT",
            path: "/api/suppliers/:id",
            description: "Обновить поставщика",
          },
          {
            method: "DELETE",
            path: "/api/suppliers/:id",
            description: "Удалить поставщика",
          },
        ],
      },
      // ✅ УВЕДОМЛЕНИЯ
      notifications: {
        private: [
          {
            method: "GET",
            path: "/api/notifications",
            description: "Получить уведомления",
          },
          {
            method: "GET",
            path: "/api/notifications/unread",
            description: "Непрочитанные уведомления",
          },
          {
            method: "PUT",
            path: "/api/notifications/:id/read",
            description: "Отметить как прочитанное",
          },
          {
            method: "PUT",
            path: "/api/notifications/read-all",
            description: "Отметить все как прочитанные",
          },
          {
            method: "DELETE",
            path: "/api/notifications/:id",
            description: "Удалить уведомление",
          },
        ],
      },
      // ✅ ПЛАНЫ РАБОТ
      workplans: {
        private: [
          {
            method: "GET",
            path: "/api/workplans",
            description: "Получить планы работ",
          },
          {
            method: "POST",
            path: "/api/workplans",
            description: "Создать план работ",
          },
          {
            method: "PUT",
            path: "/api/workplans/:id",
            description: "Обновить план работ",
          },
          {
            method: "DELETE",
            path: "/api/workplans/:id",
            description: "Удалить план работ",
          },
        ],
      },
      // ✅ ЕЖЕНЕДЕЛЬНЫЕ ЗАДАЧИ
      weeklyTasks: {
        private: [
          {
            method: "GET",
            path: "/api/weekly-tasks",
            description: "Получить задачи на неделю",
          },
          {
            method: "POST",
            path: "/api/weekly-tasks",
            description: "Создать задачу",
          },
          {
            method: "PUT",
            path: "/api/weekly-tasks/:id",
            description: "Обновить задачу",
          },
          {
            method: "DELETE",
            path: "/api/weekly-tasks/:id",
            description: "Удалить задачу",
          },
        ],
      },
    },
  };

  res.json(endpoints);
});

// Тестовый маршрут для проверки соединения
app.get("/api/ping", (req, res) => {
  res.json({
    success: true,
    message: "pong",
    timestamp: new Date().toISOString(),
  });
});

// Маршрут для проверки авторизации
app.get("/api/check-auth", protect, (req, res) => {
  res.json({
    success: true,
    message: "Вы авторизованы",
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.username,
      role: req.user.role,
    },
  });
});

// Тестовые маршруты
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API test endpoint works!",
    endpoints: [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/me",
      "/api/users/profile",
      "/api/ai/chat",
      "/api/fields",
      "/api/animals",
      "/api/resources",
      "/api/diary",
      "/api/tasks",
    ],
  });
});

// Настройка Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Global Agri API",
      version: "1.0.0",
      description: "API для сельскохозяйственного приложения Global Agri",
      contact: {
        name: "Поддержка API",
        email: "support@globalagri.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Локальный сервер",
      },
      {
        url: "https://your-production-server.com",
        description: "Продакшн сервер",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js", "./server.js"],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Подключаемся к MongoDB Atlas
connectToDatabase()
  .then(() => {
    // Swagger UI
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpecs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Global Agri API Документация",
      }),
    );

    // JSON версия спецификации Swagger
    app.get("/api-docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpecs);
    });

    // Маршруты
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/fields", fieldRoutes);
    app.use("/api/tasks", taskRoutes);
    app.use("/api/diary", diaryRoutes);
    app.use("/api/weather", weatherRoutes);
    app.use("/api/ai", aiRoutes);
    app.use("/api/analytics", analyticsRoutes);
    app.use("/api/huggingface", huggingfaceRoutes);
    app.use("/api/resources", resourceRoutes);
    app.use("/api/animals", animalRoutes);
    app.use("/api/workplans", workPlanRoutes);
    app.use("/api/equipment", equipmentRoutes);
    app.use("/api/weekly-tasks", weeklyTaskRoutes);
    app.use("/api/employees", employeeRoutes);
    app.use("/api/suppliers", supplierRoutes);
    app.use("/api/notifications", notificationRoutes);
    app.use("/uploads", express.static("uploads"));

    // Базовый маршрут (корень)
    app.get("/", (req, res) => {
      res.json({
        message: "Global Agri API работает",
        status: "online",
        database: "connected to MongoDB Atlas",
        documentation: `http://localhost:${PORT}/api-docs`,
        api: `http://localhost:${PORT}/api`,
        timestamp: new Date(),
      });
    });

    // Обработка 404 для несуществующих маршрутов
    app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: `Маршрут ${req.originalUrl} не найден`,
        availableEndpoints:
          "Проверьте /api для списка всех доступных эндпоинтов",
      });
    });

    // Обработка ошибок
    app.use(require("./middleware/errorMiddleware"));

    // Запуск сервера
    const server = app.listen(PORT, () => {
      console.log("🚀 Сервер запущен на порту", PORT);
      console.log("📊 База данных:", process.env.DB_NAME);
      console.log("🌐 Режим:", process.env.NODE_ENV || "development");
      console.log(
        "📚 Swagger документация: http://localhost:" + PORT + "/api-docs",
      );
      console.log("🔍 API информация: http://localhost:" + PORT + "/api");
      console.log(
        "🏓 Проверка соединения: http://localhost:" + PORT + "/api/ping",
      );
      console.log("🌾 Все API маршруты загружены:");
      console.log("   - /api/fields");
      console.log("   - /api/animals");
      console.log("   - /api/resources");
      console.log("   - /api/diary");
      console.log("   - /api/tasks");
      console.log("   - /api/equipment");
      console.log("   - /api/employees");
      console.log("   - /api/suppliers");
      console.log("   - /api/notifications");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\n🛑 Получен сигнал завершения...");
      await closeDatabase();
      server.close(() => {
        console.log("👋 Сервер остановлен");
        process.exit(0);
      });
    });

    process.on("SIGTERM", async () => {
      console.log("\n🛑 Получен сигнал SIGTERM...");
      await closeDatabase();
      server.close(() => {
        console.log("👋 Сервер остановлен");
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error("❌ Не удалось запустить сервер:", error);
    process.exit(1);
  });
