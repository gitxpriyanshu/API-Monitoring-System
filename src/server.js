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