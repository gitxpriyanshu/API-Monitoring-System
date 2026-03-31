const axios = require('axios');

/**
 * Official API Monitor SDK for Express.js Apps
 * Attaches to response events to silently track latency, status codes, and traffic.
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.apiKey - Your secret monitoring API key
 * @param {string} [config.serviceName='Unknown-Service'] - Name of your microservice
 * @param {string} [config.ingestUrl] - The URL to push data (Prod URL by default)
 * @param {boolean} [config.debug=false] - If true, failed pushes will console.error
 */
function ApiMonitor(config) {
  if (!config || !config.apiKey) {
    throw new Error('[ApiMonitor SDK] Failed to initialize: apiKey is strictly required.');
  }

  const {
    apiKey,
    serviceName = 'Unknown-Service',
    ingestUrl = 'https://api-monitoring-backend-n8ln.onrender.com/api/hit',
    debug = false
  } = config;

  return function (req, res, next) {
    const start = Date.now();
    const originalEnd = res.end;

    // Skip tracking for the ingest endpoint itself to avoid infinite loops
    if (req.path.includes('/api/hit')) {
      return next();
    }

    // Attach to the 'end' event to accurately measure latency after response goes out
    res.end = function (chunk, encoding) {
      res.end = originalEnd;
      const result = res.end(chunk, encoding);

      const duration = Date.now() - start;

      // Extract accurate route. req.route captures defined Express routes logic e.g., /api/users/:id
      // instead of hardcoded params like /api/users/123 -> /api/users/undefined 
      const endpoint = req.route ? (req.baseUrl || '') + req.route.path : req.path;

      const hitData = {
        serviceName,
        endpoint,
        method: req.method,
        statusCode: res.statusCode,
        latencyMs: duration,
        userAgent: req.headers['user-agent'] || 'unknown',
        ip: req.ip || (req.connection && req.connection.remoteAddress) || '127.0.0.1'
      };

      // Asynchronously ship to SaaS (silent fail architecture to protect client app)
      axios.post(ingestUrl, hitData, {
        headers: { 
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // Ensure we don't block the Node event loop if network drops
      })
      .then(() => {
        if (debug) console.log(`[ApiMonitor SDK] Logged: ${hitData.method} ${hitData.endpoint} in ${hitData.latencyMs}ms`);
      })
      .catch((err) => {
        if (debug) console.error(`[ApiMonitor SDK] Could not push data to monitoring server: ${err.message}`);
      });

      return result;
    };

    next();
  };
}

module.exports = ApiMonitor;
