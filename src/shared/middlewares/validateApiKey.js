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

        // Get client and API key from database
        const result = await clientContainer.services.clientServices.getClientByApiKey(apiKey);

        if (!result) {
            logger.warn('Invalid API key attempted', {
                path: req.path,
                ip: req.ip,
                apiKey: apiKey.substring(0, 8) + '...', // Log partial key for security
            });
            return res
                .status(403)
                .json(ResponseFormatter.error('Invalid API key', 403));
        }

        const { client, apiKey: apiKeyObj } = result;

        // Check if client is active
        if (!client.isActive) {
            logger.warn('Inactive client attempted API access', {
                path: req.path,
                ip: req.ip,
                clientId: client._id,
            });
            return res
                .status(403)
                .json(ResponseFormatter.error('Client account is inactive', 403));
        }
    } catch (error) {
        logger.error('Error validating API key:', error);
        return res
            .status(500)
            .json(ResponseFormatter.error('Internal server error', 500));
    }
};

export default validateApiKey;