import axios from 'axios';

/**
 * Initializes the API Monitoring Middleware for Express
 * @param {Object} options 
 * @param {string} options.apiKey Your client API Key generated from the User Dashboard
 * @param {string} [options.serviceName="default-service"] A label for your microservice
 * @param {string} [options.ingestUrl="http://localhost:5000/api/hit"] The backend ingest URL
 */
function ApiMonitor(options = {}) {
    const { 
        apiKey, 
        serviceName = 'default-service',
        ingestUrl = 'http://localhost:5000/api/hit' 
    } = options;

    if (!apiKey) {
        console.warn('⚠️ API Monitor: Missing API Key. Tracking is completely disabled.');
    } else {
        console.log(`✅ API Monitor SDK Initialized for service: [${serviceName}]`);
    }

    return (req, res, next) => {
        // Skip tracking if no API key is provided OR if it's an internal system call (prevent infinite loop)
        if (!apiKey || req.path.startsWith('/api/hit') || req.path.startsWith('/api/analytics')) return next();

        const startTime = Date.now();

        // Hook into the 'finish' event of the Express response safely
        res.on('finish', () => {
            const latencyMs = Date.now() - startTime;
            
            // Reconstruct the exact route path if possible
            const endpoint = req.route ? req.baseUrl + req.route.path : req.originalUrl || req.url;

            const payload = {
                serviceName,
                endpoint,
                method: req.method,
                statusCode: res.statusCode,
                latencyMs,
            };

            // Fire and forget - send metrics asynchronously
            axios.post(ingestUrl, payload, {
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                },
                timeout: 5000 
            }).catch(err => {
                // Silently drop errors
            });
        });

        next();
    };
}

export { ApiMonitor };
