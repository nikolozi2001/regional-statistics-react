const express = require('express');
const cors = require('cors');
const compression = require('compression');
const config = require('./config/config');
const logger = require('./logger');
const { errorHandler } = require('./middleware/errorHandler');
const { 
  securityHeaders, 
  apiLimiter, 
  requestLogger, 
  sanitizeInput 
} = require('./middleware/security');

// Import routes
const routes = require('./routes/routes');

const app = express();
const PORT = config.port;

// Security middleware
app.use(securityHeaders);
app.use(compression());

// CORS configuration
app.use(cors(config.cors));

// Rate limiting
app.use('/api/', apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging and sanitization
app.use(requestLogger);
app.use(sanitizeInput);

// API routes
app.use('/api', routes);

// Health check endpoint (before error handler)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`
    }
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📡 API available at: http://0.0.0.0:${PORT}/api`);
  logger.info(`💓 Health check at: http://0.0.0.0:${PORT}/health`);
});

module.exports = app;
  
  console.log(`GET /api/mainInfo - Language: ${lang}`);
  
  const query = `SELECT id, title_ge, title_en, data, tooltip_ge, tooltip_en FROM main_info`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching main info:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    // Transform the data to use the appropriate language title
    const transformedRows = results.map(row => ({
      id: row.id,
      title: row[titleColumn] || row.title_ge || row.title_en || 'No title available',
      title_ge: row.title_ge,
      title_en: row.title_en,
      data: row.data,
      tooltip_ge: row.tooltip_ge,
      tooltip_en: row.tooltip_en
    }));

    console.log(`Successfully retrieved ${results.length} main_info records for language: ${lang}`);
    
    res.status(200).json({
      success: true,
      language: lang,
      count: transformedRows.length,
      data: transformedRows
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at: http://192.168.1.27:${PORT}/api/test`);
});
