const db = require('../db');
const { catchAsync } = require('../middleware/errorHandler');

const healthCheck = catchAsync(async (req, res) => {
  const startTime = Date.now();
  
  // Check database connection
  try {
    await db.execute('SELECT 1');
    const dbStatus = 'healthy';
    const dbLatency = Date.now() - startTime;
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: dbStatus,
        latency: `${dbLatency}ms`
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: {
        status: 'unhealthy',
        error: error.message
      }
    });
  }
});

module.exports = { healthCheck };
