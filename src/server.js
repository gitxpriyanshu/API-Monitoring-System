import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './shared/config/index.js';
import logger from './shared/config/logger.js';
import mongodb from './shared/config/mongodb.js';
import postgres from './shared/config/postgres.js';
import rabbitmq from './shared/config/rabbitmq.js';
import errorHandler from './shared/middlewares/errorHandler.js';
import ResponseFormatter from './shared/utils/responseFormatter.js';
import cookieParser from "cookie-parser"

// Routers
import authRouter from "./services/auth/routes/authRouter.js";
import clientRouter from './services/client/routes/clientRoutes.js';

/**
 * Initialize Express app
 */
const app = express();

/**
 * Middlewares
 */
app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Request logging middleware
 * Logs the HTTP method, path, IP address, and user agent for each incoming request.
 */
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    next()
})

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.status(200).json(
        ResponseFormatter.success(
            {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            },
            'Service is healthy'
        )
    );
});

/**
 * Root endpoint
 * Provides basic information about the API service and available endpoints.
 */
app.get("/", (req, res) => {
    res.status(200).json(
        ResponseFormatter.success(
            {
                service: 'API Hit Monitoring System',
                version: '1.0.0',
                endpoints: {
                    health: '/health',
                    auth: '/api/auth',
                    ingest: '/api/hit',
                    analytics: '/api/analytics',
                },
            },
            'API Hit Monitoring Service'
        )
    )
});

/**
 * API Routes
 */
app.use("/api/auth", authRouter);
app.use("/api", clientRouter)

/**
 * 404 Handler
 */
app.use((req, res) => {
    res.status(404).json(ResponseFormatter.error("Endpoint not found", 404))
})

app.use(errorHandler)

/**
 * Initialize database connections and start the server
 */
async function initializeConnection() {
    try {
        logger.info("Initializing database connections...");

        // Connect to MongoDB;
        await mongodb.connect();

        // Connect to PG;
        await postgres.testConnection();

        // Connect to RabbitMQ;
        await rabbitmq.connect();

        logger.info("All connections established successfully");
    } catch (error) {
        logger.error("Failed to initialize connections:", error);
        throw error;
    }
}