import logger from "../config/logger.js"
import ResponseFormatter from "../utils/responseFormatter.js"

// Agent
const errorHandler = (err, req, res, next) => {
    let statusCode = req.statusCode || 500;
    let message = err.message || "Internal server error";
    let errors = err.errors || null

    logger.error('Error occurred:', {
        message: err.message,
        statusCode,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json(ResponseFormatter.error(message, statusCode, errors))
}

export default errorHandler;