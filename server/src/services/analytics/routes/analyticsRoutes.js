import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { AnalyticsService } from '../services/analyticsService.js';
import analyticsRepository from '../repositories/analyticsRepository.js';
import authenticate from '../../../shared/middlewares/authenticate.js';

const analyticsService = new AnalyticsService(analyticsRepository);
const analyticsController = new AnalyticsController(analyticsService);

const analyticsRouter = Router();

analyticsRouter.use(authenticate);

analyticsRouter.get('/overview', analyticsController.getOverview);
analyticsRouter.get('/traffic', analyticsController.getTrafficTrends);
analyticsRouter.get('/endpoints', analyticsController.getEndpoints);
analyticsRouter.get('/status-codes', analyticsController.getStatusCodeDistribution);
analyticsRouter.get('/errors', analyticsController.getErrors);
analyticsRouter.get('/performance', analyticsController.getPerformance);
analyticsRouter.get('/trace', analyticsController.getRecentHits);

export default analyticsRouter;
