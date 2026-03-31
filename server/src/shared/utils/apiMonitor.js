import axios from 'axios';

export const ApiMonitor = (config) => {
  const { apiKey, serviceName, ingestUrl } = config;

  return async (req, res, next) => {
    const start = Date.now();
    const originalEnd = res.end;

    // Ignore telemetry endpoints to prevent recursive POST loops
    if (req.path.includes('/api/hit') || req.path.includes('/api/analytics')) {
      return next();
    }

    res.end = function(chunk, encoding) {
      res.end = originalEnd;
      const result = res.end(chunk, encoding);
      
      const duration = Date.now() - start;
      
      const hitData = {
        serviceName: serviceName || 'Unknown Service',
        endpoint: req.route ? req.baseUrl + req.route.path : req.path,
        method: req.method,
        statusCode: res.statusCode,
        latencyMs: duration,
        userAgent: req.headers['user-agent'] || 'unknown',
        ip: req.ip || req.connection.remoteAddress
      };

      axios.post(ingestUrl, hitData, {
        headers: { 
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }).catch(err => {
        // Silent fail for monitoring to avoid breaking main app
      });

      return result;
    };

    next();
  };
};
