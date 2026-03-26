import ResponseFormatter from '../utils/responseFormatter.js';
import logger from '../config/logger.js';
import clientContainer from '../../services/client/Dependencies/dependencies.js';

/**
 * Middleware to validate API keys against database
 * Used for external services posting events
 */
const validateApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            logger.warn('API request without API key', {
                path: req.path,
                ip: req.ip,
            });
            return res
                .status(401)
                .json(ResponseFormatter.error('API key is required', 401));
        }
    } catch (error) {
        logger.error('Error validating API key:', error);
        return res
            .status(500)
            .json(ResponseFormatter.error('Internal server error', 500));
    }
};

export default validateApiKey;