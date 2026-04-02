const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    
    // Создаем директорию для логов, если ее нет
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
  
  /**
   * Запись лога
   */
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      pid: process.pid
    };
    
    // Вывод в консоль
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    
    // Запись в файл
    this.writeToFile(logEntry);
  }
  
  /**
   * Запись в файл
   */
  writeToFile(logEntry) {
    try {
      const date = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logDir, `${date}.log`);
      
      const logLine = JSON.stringify(logEntry) + '\n';
      
      fs.appendFileSync(logFile, logLine, 'utf8');
    } catch (error) {
      console.error('Ошибка записи лога в файл:', error);
    }
  }
  
  /**
   * Методы для разных уровней логирования
   */
  info(message, data = {}) {
    this.log('info', message, data);
  }
  
  warn(message, data = {}) {
    this.log('warn', message, data);
  }
  
  error(message, data = {}) {
    this.log('error', message, data);
  }
  
  debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }
  
  /**
   * Логирование HTTP запросов
   */
  http(req, res, next) {
    const start = Date.now();
    
    // Логируем после завершения запроса
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent'),
        ip: req.ip,
        userId: req.user?._id
      };
      
      if (res.statusCode >= 400) {
        this.warn('HTTP Request', logData);
      } else {
        this.info('HTTP Request', logData);
      }
    });
    
    next();
  }
  
  /**
   * Логирование ошибок базы данных
   */
  database(error, operation, collection, query = {}) {
    this.error('Database Error', {
      operation,
      collection,
      error: error.message,
      query: this.sanitizeQuery(query)
    });
  }
  
  /**
   * Очистка чувствительных данных из запроса
   */
  sanitizeQuery(query) {
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...query };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    
    return sanitized;
  }
  
  /**
   * Получение логов за период
   */
  getLogs(date, level = 'all') {
    try {
      const logFile = path.join(this.logDir, `${date}.log`);
      
      if (!fs.existsSync(logFile)) {
        return [];
      }
      
      const logData = fs.readFileSync(logFile, 'utf8');
      const logs = logData
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line))
        .filter(log => level === 'all' || log.level === level);
      
      return logs;
    } catch (error) {
      console.error('Ошибка чтения логов:', error);
      return [];
    }
  }
  
  /**
   * Очистка старых логов
   */
  cleanupOldLogs(daysToKeep = 30) {
    try {
      const files = fs.readdirSync(this.logDir);
      const now = new Date();
      
      files.forEach(file => {
        if (file.endsWith('.log')) {
          const dateStr = file.replace('.log', '');
          const fileDate = new Date(dateStr);
          const ageInDays = (now - fileDate) / (1000 * 60 * 60 * 24);
          
          if (ageInDays > daysToKeep) {
            const filePath = path.join(this.logDir, file);
            fs.unlinkSync(filePath);
            this.info(`Удален старый лог-файл: ${file}`);
          }
        }
      });
    } catch (error) {
      this.error('Ошибка очистки старых логов:', error);
    }
  }
}

module.exports = new Logger();