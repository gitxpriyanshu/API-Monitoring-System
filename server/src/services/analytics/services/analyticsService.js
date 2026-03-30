import analyticsRepository from '../repositories/analyticsRepository.js';
import logger from '../../../shared/config/logger.js';
import AppError from '../../../shared/utils/AppError.js';

export class AnalyticsService {
    constructor(repository) {
        this.repository = repository;
    }

    async getOverview(clientId) {
        try {
            if (!clientId) throw new AppError('Client ID is required', 400);
            const data = await this.repository.getOverviewMetrics(clientId.toString());
            logger.info('Overview metrics fetched', { clientId });
            return data;
        } catch (error) {
            logger.error('Error fetching overview metrics', { error: error.message, clientId });
            throw error;
        }
    }

    async getTrafficTrends(clientId, hours = 24) {
        try {
            if (!clientId) throw new AppError('Client ID is required', 400);
            const parsedHours = Math.min(Math.max(parseInt(hours, 10) || 24, 1), 168);
            const data = await this.repository.getTrafficTrends(clientId.toString(), parsedHours);
            logger.info('Traffic trends fetched', { clientId, hours: parsedHours });
            return data;
        } catch (error) {
            logger.error('Error fetching traffic trends', { error: error.message, clientId });
            throw error;
        }
    }

    async getEndpoints(clientId) {
        try {
            if (!clientId) throw new AppError('Client ID is required', 400);
            const data = await this.repository.getEndpointBreakdown(clientId.toString());
            logger.info('Endpoint breakdown fetched', { clientId });
            return data;
        } catch (error) {
            logger.error('Error fetching endpoint breakdown', { error: error.message, clientId });
            throw error;
        }
    }

    async getStatusCodeDistribution(clientId) {
        try {
            if (!clientId) throw new AppError('Client ID is required', 400);
            const data = await this.repository.getStatusCodeDistribution(clientId.toString());
            logger.info('Status code distribution fetched', { clientId });
            return data;
        } catch (error) {
            logger.error('Error fetching status code distribution', { error: error.message, clientId });
            throw error;
        }
    }

    async getErrors(clientId) {
        try {
            if (!clientId) throw new AppError('Client ID is required', 400);
            const data = await this.repository.getErrorBreakdown(clientId.toString());
            logger.info('Error breakdown fetched', { clientId });
            return data;
        } catch (error) {
            logger.error('Error fetching error breakdown', { error: error.message, clientId });
            throw error;
        }
    }

    async getPerformance(clientId) {
        try {
            if (!clientId) throw new AppError('Client ID is required', 400);
            const data = await this.repository.getPerformanceMetrics(clientId.toString());
            logger.info('Performance metrics fetched', { clientId });
            return data;
        } catch (error) {
            logger.error('Error fetching performance metrics', { error: error.message, clientId });
            throw error;
        }
    }

    async getRecentHits(clientId, limit = 50) {
        try {
            if (!clientId) throw new AppError('Client ID is required', 400);
            const data = await this.repository.getRecentHits(clientId.toString(), limit);
            logger.info('Recent hits fetched', { clientId });
            return data;
        } catch (error) {
            logger.error('Error fetching recent hits', { error: error.message, clientId });
            throw error;
        }
    }
}
