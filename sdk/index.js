const axios = require('axios');

/**
 * Initializes the API Monitoring Middleware for Express
 * @param {Object} options 
 * @param {string} options.apiKey Your client API Key generated from the User Dashboard
 * @param {string} [options.serviceName="default-service"] A label for your microservice
 * @param {string} [options.ingestUrl="http://localhost:5001/api/hit"] The backend ingest URL
 */
function ApiMonitor(options = {}) {
    const { 
        apiKey, 
        serviceName = 'default-service',
        ingestUrl = 'http://localhost:5001/api/hit' 
    } = options;

    if (!apiKey) {
        console.warn('\x1b[33m%s\x1b[0m', '⚠️ API Monitor: Missing API Key. Tracking is completely disabled.');
    } else {
        console.log('\x1b[32m%s\x1b[0m', `✅ API Monitor SDK Initialized for service: [${serviceName}]`);
    }

    return (req, res, next) => {
        // Skip tracking if no API key is provided
        if (!apiKey) return next();

        const startTime = Date.now();

        // Hook into the 'finish' event of the Express response safely
        res.on('finish', () => {
            const latencyMs = Date.now() - startTime;
            
            // Reconstruct the exact route path if possible (e.g. /users/:id instead of /users/123)
            const endpoint = req.route ? req.baseUrl + req.route.path : req.originalUrl || req.url;

            const payload = {
                serviceName,
                endpoint,
                method: req.method,
                statusCode: res.statusCode,
                latencyMs,
            };

            // Fire and forget - send metrics asynchronously without blocking the client response
            axios.post(ingestUrl, payload, {
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                },
                timeout: 5000 // Ensure we don't hang local socket connections
            }).catch(err => {
                // Silently drop errors (like Circuit Breaker blocks or ingestion unreachability)
                // so we NEVER crash the client's actual application.
            });
        });

        next();
    };
}

module.exports = { ApiMonitor };
