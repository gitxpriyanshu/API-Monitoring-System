import ApiHit from '../../../shared/models/ApiHits.js';
import postgres from '../../../shared/config/postgres.js';
import logger from '../../../shared/config/logger.js';

class ProcessorRepository {
    async saveRawHit(eventData) {
        try {
            const hit = new ApiHit({
                eventId: eventData.eventId,
                timestamp: eventData.timestamp,
                serviceName: eventData.serverName,
                endpoint: eventData.endpoint,
                method: eventData.method,
                statusCode: eventData.statusCode,
                latencyMs: eventData.latencyMs,
                clientId: eventData.clientId,
                apiKeyId: eventData.apiKeyId,
                ip: eventData.ip,
                userAgent: eventData.userAgent,
            });

            await hit.save();
            logger.info('Raw hit saved to MongoDB', { eventId: eventData.eventId });
            return hit;
        } catch (error) {
            if (error.code === 11000) {
                logger.warn('Duplicate event skipped', { eventId: eventData.eventId });
                return null;
            }
            logger.error('Error saving raw hit to MongoDB', { error: error.message });
            throw error;
        }
    }

    getTimeBucket(timestamp) {
        const d = new Date(timestamp);
        d.setMinutes(0, 0, 0);
        return d.toISOString();
    }

    async upsertMetrics(eventData) {
        const isError = eventData.statusCode >= 400 ? 1 : 0;
        const latency = eventData.latencyMs;
        const timeBucket = this.getTimeBucket(eventData.timestamp);

        const query = `
            INSERT INTO endpoint_metrics
                (client_id, service_name, endpoint, method, time_bucket, total_hits, error_hits, avg_latency, min_latency, max_latency)
            VALUES
                ($1, $2, $3, $4, $5, 1, $6, $7, $7, $7)
            ON CONFLICT (client_id, service_name, endpoint, method, time_bucket)
            DO UPDATE SET
                total_hits  = endpoint_metrics.total_hits + 1,
                error_hits  = endpoint_metrics.error_hits + $6,
                avg_latency = ROUND(
                    ((endpoint_metrics.avg_latency * endpoint_metrics.total_hits) + $7)
                    / (endpoint_metrics.total_hits + 1),
                    3
                ),
                min_latency = LEAST(endpoint_metrics.min_latency, $7),
                max_latency = GREATEST(endpoint_metrics.max_latency, $7),
                updated_at  = CURRENT_TIMESTAMP
        `;

        const values = [
            eventData.clientId.toString(),
            eventData.serverName,
            eventData.endpoint,
            eventData.method,
            timeBucket,
            isError,
            latency,
        ];

        try {
            await postgres.query(query, values);
            logger.info('Metrics upserted to PostgreSQL', {
                eventId: eventData.eventId,
                clientId: eventData.clientId,
                endpoint: eventData.endpoint,
            });
        } catch (error) {
            logger.error('Error upserting metrics to PostgreSQL', { error: error.message });
            throw error;
        }
    }
}

export default new ProcessorRepository();
