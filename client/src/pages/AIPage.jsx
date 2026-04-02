// src/pages/AIPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import aiService from "../services/aiService";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  Send,
  Sparkles,
  MessageCircle,
  History,
  BookOpen,
  Thermometer,
  Droplets,
  Sprout,
  Leaf,
  Calendar,
  Clock,
  ChevronRight,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Plus,
  Search,
  Filter,
  X,
  Mic,
  Paperclip,
  Settings,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MessageSquare,
  Star,
  Zap,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Globe,
  Image,
  Camera,
  Maximize2,
  Minimize2,
  Upload,
  Code,
} from "lucide-react";

const AIPage = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Состояния
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showHistory, setShowHistory] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [aiStatus, setAiStatus] = useState("offline");
  const [selectedModel, setSelectedModel] = useState("deepseek-chat");
  const [showSettings, setShowSettings] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [apiKeyPresent, setApiKeyPresent] = useState(false);
  const [availableModels] = useState([
    { id: "deepseek-chat", name: "DeepSeek Chat", vision: true },
    { id: "deepseek-coder", name: "DeepSeek Coder", vision: false },
  ]);

  // Состояния для изображений
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Классы для темы
  const themeClasses = {
    page: theme === "dark" ? "bg-gray-900" : "bg-gray-50",
    card:
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200",
    sidebar:
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200",
    text: {
      primary: theme === "dark" ? "text-white" : "text-gray-900",
      secondary: theme === "dark" ? "text-gray-400" : "text-gray-600",
      muted: theme === "dark" ? "text-gray-500" : "text-gray-400",
    },
    message: {
      user: "bg-gradient-to-r from-green-600 to-green-700 text-white",
      assistant:
        theme === "dark"
          ? "bg-gray-700 text-white border-gray-600"
          : "bg-white text-gray-800 border-gray-100",
      error:
        theme === "dark"
          ? "bg-red-900/30 text-red-300 border-red-800"
          : "bg-red-50 text-red-800 border-red-200",
      local:
        theme === "dark"
          ? "bg-yellow-900/30 text-yellow-300 border-yellow-800"
          : "bg-yellow-50 text-gray-800 border-yellow-200",
      image:
        theme === "dark"
          ? "bg-blue-900/30 text-blue-300 border-blue-800"
          : "bg-blue-50 text-blue-800 border-blue-200",
    },
    input:
      theme === "dark"
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
        : "bg-white border-gray-200 text-gray-900",
    button: {
      primary:
        "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white",
      secondary:
        theme === "dark"
          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700",
      ghost:
        theme === "dark"
          ? "hover:bg-gray-700 text-gray-400"
          : "hover:bg-gray-100 text-gray-500",
    },
    border: theme === "dark" ? "border-gray-700" : "border-gray-200",
    hover: theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50",
    active:
      theme === "dark"
        ? "bg-gray-700 border-l-4 border-green-500"
        : "bg-green-50 border-l-4 border-green-500",
    imagePreview:
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200",
  };

  // Проверка наличия API ключа
  useEffect(() => {
    const checkApiKey = () => {
      // Проверяем DeepSeek API ключ
      const key =
        import.meta.env.VITE_DEEPSEEK_API_KEY ||
        import.meta.env.VITE_GROQ_API_KEY;

      setApiKeyPresent(!!key);
      setAiStatus(key ? "online" : "offline");

      if (!key) {
        console.warn(
          "⚠️ DeepSeek API ключ не найден. Будет использован локальный режим.",
        );
      } else {
        console.log("✅ DeepSeek API ключ найден");
      }
    };

    checkApiKey();
  }, []);

  // Загрузка истории при монтировании
  useEffect(() => {
    loadSuggestions();

    const welcomeMessage = getWelcomeMessage();
    setMessages([
      {
        id: 1,
        type: "assistant",
        content: welcomeMessage,
        timestamp: new Date().toISOString(),
      },
    ]);

    inputRef.current?.focus();
  }, [language, theme, apiKeyPresent]);

  // Скролл к последнему сообщению
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Авто-сохранение сообщений
  useEffect(() => {
    if (messages.length > 1) {
      saveCurrentConversation();
    }
  }, [messages]);

  const getWelcomeMessage = () => {
    const model = apiKeyPresent ? "DeepSeek AI" : "локальный";

    const messages = {
      ru: `👋 Здравствуйте! Я **Farm Culture** - ваш AI-ассистент на базе **${model}**. 
    
🌾 **Моя специализация - сельское хозяйство**, но я могу помочь с любыми вопросами:

**Сельское хозяйство:**
• 🌱 Посев и сбор урожая
• 💧 Полив и удобрения
• 🐛 Диагностика болезней растений по фото
• 📅 Планирование работ
• 🌾 Прогнозы урожайности

**Новые возможности:**
• 📸 **Анализ изображений** - загрузите фото растения и я определю болезнь
• 🌿 Распознавание сорняков и вредителей
• 🔬 Оценка состояния почвы по фото

**Общие вопросы:**
• 💬 Написание текстов и стихов
• 🔧 Советы по рецептам
• 💻 Помощь с программированием
• 🗣️ Просто общение

Задайте мне любой вопрос или загрузите фото растения! Я всегда рад помочь! 🌟`,

      en: `👋 Hello! I am **Farm Culture** - your AI assistant powered by **${model}**. 
    
🌾 **My specialization is agriculture**, but I can help with any questions:

**Agriculture:**
• 🌱 Sowing and harvesting
• 💧 Irrigation and fertilizers
• 🐛 Plant disease diagnosis by photo
• 📅 Work planning
• 🌾 Yield forecasts

**New features:**
• 📸 **Image analysis** - upload a plant photo and I'll diagnose diseases
• 🌿 Weed and pest recognition
• 🔬 Soil condition assessment from photos

**General questions:**
• 💬 Writing texts and poems
• 🔧 Recipe advice
• 💻 Programming help
• 🗣️ Just chatting

Ask me anything or upload a plant photo! I'm always happy to help! 🌟`,

      kg: `👋 Саламатсызбы! Мен **Farm Culture** - сиздин AI жардамчы, **${model}** негизинде иштейм. 
    
🌾 **Менин адистигим - айыл чарба**, бирок мен каалаган суроолорго жардам бере алам:

**Айыл чарба:**
• 🌱 Себүү жана түшүм жыйноо
• 💧 Сугаруу жана жер семирткичтер
• 🐛 Өсүмдүк ооруларын сүрөт аркылуу аныктоо
• 📅 Иштерди пландоо
• 🌾 Түшүмдүүлүк болжолдору

**Жаңы мүмкүнчүлүктөр:**
• 📸 **Сүрөттөрдү анализдөө** - өсүмдүктүн сүрөтүн жүктөп, ооруну аныктайм
• 🌿 Отоо чөптөрдү жана зыянкечтерди таануу
• 🔬 Топурактын абалын сүрөт аркылуу баалоо

**Жалпы суроолор:**
• 💬 Тексттер жана ырлар жазуу
• 🔧 Рецепттер боюнча кеңештер
• 💻 Программалоо боюнча жардам
• 🗣️ Жөн эле сүйлөшүү

Кандай гана суроо берсеңиз же өсүмдүктүн сүрөтүн жүктөсөңүз болот! Жардам берүүгө даярмын! 🌟`,
    };

    return messages[language] || messages.ru;
  };

  const loadSuggestions = () => {
    const suggestionsByLang = {
      ru: [
        { icon: <Sprout size={18} />, text: "Когда лучше сеять пшеницу?" },
        { icon: <Droplets size={18} />, text: "Как часто поливать кукурузу?" },
        { icon: <Leaf size={18} />, text: "Определить болезнь растения" },
        {
          icon: <Image size={18} />,
          text: "📸 Проанализировать фото растения",
        },
        { icon: <Calendar size={18} />, text: "План работ на месяц" },
        { icon: <Code size={18} />, text: "Напиши код для парсинга данных" },
      ],
      en: [
        { icon: <Sprout size={18} />, text: "When to sow wheat?" },
        { icon: <Droplets size={18} />, text: "How often to water corn?" },
        { icon: <Leaf size={18} />, text: "Identify plant disease" },
        { icon: <Image size={18} />, text: "📸 Analyze plant photo" },
        { icon: <Calendar size={18} />, text: "Monthly work plan" },
        { icon: <Code size={18} />, text: "Write code for data parsing" },
      ],
      kg: [
        { icon: <Sprout size={18} />, text: "Буудай качан себилет?" },
        {
          icon: <Droplets size={18} />,
          text: "Жүгөрүнү канча жолу сугаруу керек?",
        },
        { icon: <Leaf size={18} />, text: "Өсүмдүк оорусун аныктоо" },
        { icon: <Image size={18} />, text: "📸 Өсүмдүктүн сүрөтүн анализдөө" },
        { icon: <Calendar size={18} />, text: "Айлык иш планы" },
        { icon: <Code size={18} />, text: "Маалымат парсинги үчүн код жаз" },
      ],
    };
    setSuggestions(suggestionsByLang[language] || suggestionsByLang.ru);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Обработка загрузки изображения
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(
        language === "ru"
          ? "Пожалуйста, выберите изображение"
          : language === "en"
            ? "Please select an image"
            : "Сүрөт тандаңыз",
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(
        language === "ru"
          ? "Файл слишком большой (макс. 10MB)"
          : language === "en"
            ? "File too large (max 10MB)"
            : "Файл өтө чоң (макс. 10MB)",
      );
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setShowImagePreview(true);
    };
    reader.readAsDataURL(file);
  };

  // Анализ изображения
  const analyzeImage = async () => {
    if (!selectedImage || !imagePreview) return;

    setImageLoading(true);
    setLoading(true);

    try {
      // Добавляем сообщение с изображением
      const userMessage = {
        id: Date.now(),
        type: "user",
        content:
          language === "ru"
            ? "📸 Проанализируйте это растение"
            : language === "en"
              ? "📸 Analyze this plant"
              : "📸 Бул өсүмдүктү анализдеңиз",
        image: imagePreview,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setTypingIndicator(true);

      // Отправляем на анализ
      const response = await aiService.analyzeImage(selectedImage, {
        language,
        type: "plant_disease",
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: response.analysis || response.message || "Анализ завершен",
        imageAnalysis: true,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setAnalysisResult(response);
    } catch (error) {
      console.error("Image analysis error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content:
          language === "ru"
            ? "❌ Извините, не удалось проанализировать изображение. Попробуйте позже."
            : language === "en"
              ? "❌ Sorry, could not analyze the image. Please try again."
              : "❌ Кечиресиз, сүрөттү анализдөө мүмкүн болбой калды. Кийинчерээк аракет кылыңыз.",
        timestamp: new Date().toISOString(),
        error: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setImageLoading(false);
      setLoading(false);
      setTypingIndicator(false);
      setShowImagePreview(false);
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedImage) || loading) return;

    // Если есть изображение, анализируем его
    if (selectedImage && imagePreview) {
      await analyzeImage();
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);
    setTypingIndicator(true);

    try {
      const context = {
        language,
        userData: {
          name: user?.name || "Фермер",
          email: user?.email,
        },
        farmData: {
          name: user?.farmName || "Farm Vision",
          totalArea: "145.4",
          crops: "пшеница, кукуруза, подсолнечник",
        },
        model: selectedModel,
      };

      const response = await aiService.sendMessage(inputValue, context);

      const aiMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: response.message || response.answer || "...",
        timestamp: response.timestamp || new Date().toISOString(),
        local: response.local || false,
        error: !response.success,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Send message error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content:
          language === "ru"
            ? "❌ Извините, произошла ошибка. Попробуйте позже."
            : language === "en"
              ? "❌ Sorry, an error occurred. Please try again."
              : "❌ Кечиресиз, ката кетти. Кийинчерээк аракет кылыңыз.",
        timestamp: new Date().toISOString(),
        error: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTypingIndicator(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.text);
    inputRef.current?.focus();
  };

  const startNewConversation = () => {
    const welcomeMessage = getWelcomeMessage();
    setMessages([
      {
        id: Date.now(),
        type: "assistant",
        content: welcomeMessage,
        timestamp: new Date().toISOString(),
      },
    ]);
    setActiveConversation(null);
    setInputValue("");
    setSelectedImage(null);
    setImagePreview(null);
    setShowImagePreview(false);
    inputRef.current?.focus();
  };

  const saveCurrentConversation = () => {
    if (messages.length <= 1) return;

    const conversation = {
      id: activeConversation?.id || Date.now(),
      title: messages[1]?.content?.substring(0, 50) || "Новый разговор",
      messages,
      timestamp: new Date().toISOString(),
    };

    const updated = [
      conversation,
      ...conversations.filter((c) => c.id !== conversation.id),
    ].slice(0, 20);
    setConversations(updated);
    localStorage.setItem("ai_conversations", JSON.stringify(updated));
    setActiveConversation(conversation);
  };

  const loadConversation = (conv) => {
    setMessages(conv.messages);
    setActiveConversation(conv);
    setShowHistory(false);
  };

  const deleteConversation = (id, e) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    localStorage.setItem("ai_conversations", JSON.stringify(updated));

    if (activeConversation?.id === id) {
      startNewConversation();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const clearHistory = () => {
    if (
      window.confirm(
        language === "ru"
          ? "Очистить всю историю чатов?"
          : language === "en"
            ? "Clear all chat history?"
            : "Бардык чат тарыхын тазалоо?",
      )
    ) {
      setConversations([]);
      localStorage.removeItem("ai_conversations");
      startNewConversation();
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setShowImagePreview(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div
      className={`flex h-[calc(100vh-4rem)] transition-colors duration-300 ${themeClasses.page}`}
    >
      {/* Боковая панель с историей */}
      <div
        className={`${showHistory ? "w-80" : "w-0"} transition-all duration-300 border-r overflow-hidden ${themeClasses.sidebar} ${themeClasses.border}`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`font-semibold flex items-center ${themeClasses.text.primary}`}
            >
              <History size={18} className="mr-2" />
              {language === "ru"
                ? "История"
                : language === "en"
                  ? "History"
                  : "Тарых"}
            </h2>
            <div className="flex items-center space-x-1">
              <button
                onClick={clearHistory}
                className={`p-2 rounded-lg transition-colors ${themeClasses.button.ghost}`}
                title={
                  language === "ru"
                    ? "Очистить историю"
                    : language === "en"
                      ? "Clear history"
                      : "Тарыхты тазалоо"
                }
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={startNewConversation}
                className={`p-2 rounded-lg transition-colors ${themeClasses.button.ghost}`}
                title={
                  language === "ru"
                    ? "Новый чат"
                    : language === "en"
                      ? "New chat"
                      : "Жаңы чат"
                }
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.length === 0 ? (
              <div
                className={`text-center py-8 text-sm ${themeClasses.text.muted}`}
              >
                {language === "ru"
                  ? "Нет сохраненных чатов"
                  : language === "en"
                    ? "No saved chats"
                    : "Сакталган чаттар жок"}
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => loadConversation(conv)}
                  className={`group p-3 rounded-lg cursor-pointer transition-all ${
                    activeConversation?.id === conv.id
                      ? themeClasses.active
                      : themeClasses.hover
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${themeClasses.text.primary}`}
                      >
                        {conv.title}
                      </p>
                      <p className={`text-xs mt-1 ${themeClasses.text.muted}`}>
                        {new Date(conv.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteConversation(conv.id, e)}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity ${themeClasses.button.ghost}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Статус AI */}
          <div
            className={`mt-4 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {aiStatus === "online" ? (
                  <Wifi size={16} className="text-green-500 mr-2" />
                ) : (
                  <WifiOff size={16} className="text-yellow-500 mr-2" />
                )}
                <span className={`text-sm ${themeClasses.text.secondary}`}>
                  {aiStatus === "online"
                    ? language === "ru"
                      ? "DeepSeek AI"
                      : language === "en"
                        ? "DeepSeek AI"
                        : "DeepSeek AI"
                    : language === "ru"
                      ? "Локальный режим"
                      : language === "en"
                        ? "Local mode"
                        : "Жергиликтүү режим"}
                </span>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1 rounded ${themeClasses.button.ghost}`}
              >
                <Settings size={16} />
              </button>
            </div>

            {showSettings && (
              <div className={`mt-3 pt-3 border-t ${themeClasses.border}`}>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={themeClasses.text.secondary}>
                      DeepSeek API ключ:
                    </span>
                    <span
                      className={
                        apiKeyPresent ? "text-green-600" : "text-red-600"
                      }
                    >
                      {apiKeyPresent ? "✓ Установлен" : "✗ Не найден"}
                    </span>
                  </div>
                </div>
                <label
                  className={`text-xs block mb-1 ${themeClasses.text.secondary}`}
                >
                  {language === "ru"
                    ? "Модель"
                    : language === "en"
                      ? "Model"
                      : "Модель"}
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className={`w-full text-sm border rounded-lg p-2 ${
                    theme === "dark"
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  disabled={!apiKeyPresent}
                >
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} {model.vision ? "👁️" : ""}
                    </option>
                  ))}
                </select>
                <div className="mt-2 space-y-1">
                  <p
                    className={`text-xs flex items-center ${themeClasses.text.muted}`}
                  >
                    <CheckCircle size={12} className="mr-1 text-green-500" />
                    {language === "ru"
                      ? "Анализ изображений доступен"
                      : language === "en"
                        ? "Image analysis available"
                        : "Сүрөттөрдү анализдөө мүмкүн"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Основная область чата */}
      <div
        className={`flex-1 flex flex-col transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Шапка чата */}
        <div
          className={`flex items-center justify-between p-4 border-b ${themeClasses.border}`}
        >
          <div className="flex items-center">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`lg:hidden p-2 rounded-lg mr-2 ${themeClasses.button.ghost}`}
            >
              {showHistory ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRightIcon size={20} />
              )}
            </button>

            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h1
                  className={`text-xl font-semibold flex items-center ${themeClasses.text.primary}`}
                >
                  Farm Culture AI
                  {aiStatus === "online" ? (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      {language === "ru"
                        ? "DeepSeek"
                        : language === "en"
                          ? "DeepSeek"
                          : "DeepSeek"}
                    </span>
                  ) : (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {language === "ru"
                        ? "Локальный"
                        : language === "en"
                          ? "Local"
                          : "Жергиликтүү"}
                    </span>
                  )}
                </h1>
                <p className={`text-sm ${themeClasses.text.muted}`}>
                  {apiKeyPresent
                    ? "С поддержкой изображений"
                    : "Локальный режим"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={startNewConversation}
              className={`p-2 rounded-lg transition-colors ${themeClasses.button.ghost}`}
              title={
                language === "ru"
                  ? "Новый чат"
                  : language === "en"
                    ? "New chat"
                    : "Жаңы чат"
              }
            >
              <Plus size={20} />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-4 py-2 rounded-lg transition-colors ${themeClasses.button.secondary}`}
            >
              {language === "ru"
                ? "На дашборд"
                : language === "en"
                  ? "To Dashboard"
                  : "Дашбордго"}
            </button>
          </div>
        </div>

        {/* Область сообщений */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            theme === "dark" ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[80%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Аватар */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.type === "user"
                      ? "bg-green-600 ml-2"
                      : "bg-gradient-to-br from-green-500 to-green-600 mr-2"
                  }`}
                >
                  {msg.type === "user" ? (
                    <span className="text-white text-sm font-bold">
                      {user?.name?.[0] || "U"}
                    </span>
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>

                {/* Сообщение */}
                <div
                  className={`group relative rounded-2xl px-4 py-3 ${
                    msg.type === "user"
                      ? themeClasses.message.user
                      : msg.error
                        ? themeClasses.message.error
                        : msg.imageAnalysis
                          ? themeClasses.message.image
                          : msg.local
                            ? themeClasses.message.local
                            : themeClasses.message.assistant
                  } ${msg.type !== "user" ? "rounded-bl-none shadow-sm" : "rounded-br-none"}`}
                >
                  {/* Если есть изображение в сообщении */}
                  {msg.image && (
                    <div className="mb-3">
                      <img
                        src={msg.image}
                        alt="Uploaded"
                        className="max-w-full max-h-64 rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  {msg.type === "assistant" ? (
                    <div
                      className={`prose prose-sm max-w-none ${
                        theme === "dark" ? "prose-invert" : ""
                      }`}
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}

                  <div
                    className={`flex items-center justify-between mt-2 text-xs ${
                      msg.type === "user"
                        ? "text-green-200"
                        : themeClasses.text.muted
                    }`}
                  >
                    <span>{formatTime(msg.timestamp)}</span>

                    {msg.type === "assistant" && !msg.error && (
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyMessage(msg.content)}
                          className={`p-1 rounded ${themeClasses.button.ghost}`}
                          title={language === "ru" ? "Копировать" : "Copy"}
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.local && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-200">
                      локально
                    </div>
                  )}

                  {msg.imageAnalysis && (
                    <div className="absolute -top-2 -left-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
                      📸 анализ
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Индикатор печатания */}
          {typingIndicator && (
            <div className="flex justify-start">
              <div
                className={`flex items-center space-x-2 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                }`}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Предпросмотр изображения */}
        {showImagePreview && imagePreview && (
          <div
            className={`p-4 border-t ${themeClasses.border} ${themeClasses.imagePreview}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-sm font-medium flex items-center ${themeClasses.text.primary}`}
              >
                <Image size={16} className="mr-2 text-green-500" />
                {language === "ru"
                  ? "Предпросмотр изображения"
                  : language === "en"
                    ? "Image preview"
                    : "Сүрөттү алдын ала көрүү"}
              </span>
              <button
                onClick={clearSelectedImage}
                className={`p-1 rounded ${themeClasses.button.ghost}`}
              >
                <X size={16} />
              </button>
            </div>
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-lg shadow-md"
              />
              <button
                onClick={analyzeImage}
                disabled={imageLoading}
                className={`absolute top-2 right-2 px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1 shadow-md ${
                  imageLoading ? "opacity-50 cursor-not-allowed" : ""
                } ${themeClasses.button.primary}`}
              >
                {imageLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>
                      {language === "ru"
                        ? "Анализ..."
                        : language === "en"
                          ? "Analyzing..."
                          : "Анализ..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>
                      {language === "ru"
                        ? "Анализировать"
                        : language === "en"
                          ? "Analyze"
                          : "Анализдөө"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Быстрые вопросы (когда нет сообщений) */}
        {messages.length <= 1 && !showImagePreview && (
          <div
            className={`px-4 py-3 border-t ${themeClasses.border} ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <p className={`text-xs mb-2 ${themeClasses.text.muted}`}>
              {language === "ru"
                ? "Быстрые вопросы:"
                : language === "en"
                  ? "Quick questions:"
                  : "Тез суроолор:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-full transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-green-600">{suggestion.icon}</span>
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Поле ввода */}
        <div
          className={`p-4 border-t ${themeClasses.border} ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === "ru"
                    ? "Задайте вопрос или загрузите фото растения..."
                    : language === "en"
                      ? "Ask a question or upload a plant photo..."
                      : "Суроо бериңиз же өсүмдүктүн сүрөтүн жүктөңүз..."
                }
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-colors ${themeClasses.input}`}
                rows="2"
                disabled={loading}
              />

              <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                {/* Кнопка загрузки изображения */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-lg transition-colors ${themeClasses.button.ghost}`}
                  title={
                    language === "ru"
                      ? "Загрузить изображение"
                      : language === "en"
                        ? "Upload image"
                        : "Сүрөт жүктөө"
                  }
                >
                  <Image size={18} />
                </button>

                {/* Кнопка камеры */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className={`p-2 rounded-lg transition-colors ${themeClasses.button.ghost}`}
                  title={
                    language === "ru"
                      ? "Сделать фото"
                      : language === "en"
                        ? "Take photo"
                        : "Сүрөткө тартуу"
                  }
                >
                  <Camera size={18} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={loading || (!inputValue.trim() && !selectedImage)}
              className={`px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md ${themeClasses.button.primary}`}
            >
              <span>
                {language === "ru"
                  ? "Отправить"
                  : language === "en"
                    ? "Send"
                    : "Жөнөтүү"}
              </span>
              <Send size={18} />
            </button>
          </div>

          {/* Информация */}
          <div className="flex items-center justify-between mt-3 text-xs">
            <div
              className={`flex items-center space-x-4 ${themeClasses.text.muted}`}
            >
              <span className="flex items-center">
                <Sparkles size={12} className="mr-1 text-green-500" />
                {apiKeyPresent ? "DeepSeek AI" : "Локальный режим"}
              </span>
              <span className="flex items-center">
                <Image size={12} className="mr-1 text-blue-500" />
                {language === "ru"
                  ? "Поддержка изображений"
                  : language === "en"
                    ? "Image support"
                    : "Сүрөттөрдү колдоо"}
              </span>
              <span className="flex items-center">
                <Globe size={12} className="mr-1 text-purple-500" />
                {language === "ru"
                  ? "3 языка"
                  : language === "en"
                    ? "3 languages"
                    : "3 тил"}
              </span>
            </div>
            <span className={themeClasses.text.muted}>
              {language === "ru"
                ? "Работает на DeepSeek"
                : language === "en"
                  ? "Powered by DeepSeek"
                  : "DeepSeek менен иштейт"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPage;
