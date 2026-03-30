import ResponseFormatter from '../../../shared/utils/responseFormatter.js';
import logger from '../../../shared/config/logger.js';

export class AnalyticsController {
    constructor(analyticsService) {
        if (!analyticsService) throw new Error('AnalyticsService is required');
        this.analyticsService = analyticsService;
    }

    getOverview = async (req, res, next) => {
        try {
            const clientId = req.user.clientId;
            const data = await this.analyticsService.getOverview(clientId);
            res.status(200).json(ResponseFormatter.success(data, 'Overview metrics fetched'));
        } catch (error) {
            next(error);
        }
    };

    getTrafficTrends = async (req, res, next) => {
        try {
            const clientId = req.user.clientId;
            const { hours } = req.query;
            const data = await this.analyticsService.getTrafficTrends(clientId, hours);
            res.status(200).json(ResponseFormatter.success(data, 'Traffic trends fetched'));
        } catch (error) {
            next(error);
        }
    };

    getEndpoints = async (req, res, next) => {
        try {
            const clientId = req.user.clientId;
            const data = await this.analyticsService.getEndpoints(clientId);
            res.status(200).json(ResponseFormatter.success(data, 'Endpoint breakdown fetched'));
        } catch (error) {
            next(error);
        }
    };

    getStatusCodeDistribution = async (req, res, next) => {
        try {
            const clientId = req.user.clientId;
            const data = await this.analyticsService.getStatusCodeDistribution(clientId);
            res.status(200).json(ResponseFormatter.success(data, 'Status code distribution fetched'));
        } catch (error) {
            next(error);
        }
    };

    getErrors = async (req, res, next) => {
        try {
            const clientId = req.user.clientId;
            const data = await this.analyticsService.getErrors(clientId);
            res.status(200).json(ResponseFormatter.success(data, 'Error breakdown fetched'));
        } catch (error) {
            next(error);
        }
    };

    getPerformance = async (req, res, next) => {
        try {
            const clientId = req.user.clientId;
            const data = await this.analyticsService.getPerformance(clientId);
            res.status(200).json(ResponseFormatter.success(data, 'Performance metrics fetched'));
        } catch (error) {
            next(error);
        }
    };

    getRecentHits = async (req, res, next) => {
        try {
            const clientId = req.user.clientId;
            const { limit } = req.query;
            const data = await this.analyticsService.getRecentHits(clientId, limit);
            res.status(200).json(ResponseFormatter.success(data, 'Recent hits fetched'));
        } catch (error) {
            next(error);
        }
    };
}
