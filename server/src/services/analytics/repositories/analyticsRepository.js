import postgres from '../../../shared/config/postgres.js';
import logger from '../../../shared/config/logger.js';
import ApiHit from '../../../shared/models/ApiHits.js';
import mongoose from 'mongoose';

class AnalyticsRepository {
    async getOverviewMetrics(clientId) {
        const query = `
            SELECT
                COALESCE(SUM(total_hits), 0)::INTEGER        AS total_hits,
                COALESCE(SUM(error_hits), 0)::INTEGER        AS total_errors,
                COALESCE(ROUND(AVG(avg_latency)::NUMERIC, 2), 0) AS avg_latency,
                COUNT(DISTINCT service_name)::INTEGER        AS unique_services,
                COUNT(DISTINCT endpoint)::INTEGER            AS unique_endpoints
            FROM endpoint_metrics
            WHERE client_id = $1
        `;

        const result = await postgres.query(query, [clientId]);
        const row = result.rows[0];

        const totalHits = parseInt(row.total_hits, 10);
        const totalErrors = parseInt(row.total_errors, 10);
        const successHits = totalHits - totalErrors;

        const errorRate = totalHits > 0
            ? parseFloat(((totalErrors / totalHits) * 100).toFixed(2))
            : 0;

        const successRate = totalHits > 0
            ? parseFloat(((successHits / totalHits) * 100).toFixed(2))
            : 0;

        return {
            totalHits,
            totalErrors,
            successHits,
            avgLatency: parseFloat(row.avg_latency) || 0,
            errorRate,
            successRate,
            uniqueServices: parseInt(row.unique_services, 10),
            uniqueEndpoints: parseInt(row.unique_endpoints, 10),
        };
    }

    async getTrafficTrends(clientId, hours = 24) {
        const query = `
            SELECT
                time_bucket,
                SUM(total_hits)::INTEGER  AS total_hits,
                SUM(error_hits)::INTEGER  AS error_hits,
                ROUND(AVG(avg_latency)::NUMERIC, 2) AS avg_latency
            FROM endpoint_metrics
            WHERE client_id = $1
              AND time_bucket >= NOW() - INTERVAL '1 hour' * $2
            GROUP BY time_bucket
            ORDER BY time_bucket ASC
        `;

        const result = await postgres.query(query, [clientId, hours]);
        return result.rows.map(row => ({
            timeBucket: row.time_bucket,
            totalHits: parseInt(row.total_hits, 10),
            errorHits: parseInt(row.error_hits, 10),
            avgLatency: parseFloat(row.avg_latency) || 0,
        }));
    }

    async getEndpointBreakdown(clientId) {
        const query = `
            SELECT
                service_name,
                endpoint,
                method,
                SUM(total_hits)::INTEGER        AS total_hits,
                SUM(error_hits)::INTEGER         AS error_hits,
                ROUND(AVG(avg_latency)::NUMERIC, 2) AS avg_latency,
                ROUND(MIN(min_latency)::NUMERIC, 2) AS min_latency,
                ROUND(MAX(max_latency)::NUMERIC, 2) AS max_latency
            FROM endpoint_metrics
            WHERE client_id = $1
            GROUP BY service_name, endpoint, method
            ORDER BY total_hits DESC
        `;

        const result = await postgres.query(query, [clientId]);
        return result.rows.map(row => {
            const totalHits = parseInt(row.total_hits, 10);
            const errorHits = parseInt(row.error_hits, 10);
            const successHits = totalHits - errorHits;
            const errorRate = totalHits > 0
                ? parseFloat(((errorHits / totalHits) * 100).toFixed(2))
                : 0;
            const successRate = totalHits > 0
                ? parseFloat(((successHits / totalHits) * 100).toFixed(2))
                : 0;

            return {
                serviceName: row.service_name,
                endpoint: row.endpoint,
                method: row.method,
                totalHits,
                errorHits,
                successHits,
                errorRate,
                successRate,
                avgLatency: parseFloat(row.avg_latency) || 0,
                minLatency: parseFloat(row.min_latency) || 0,
                maxLatency: parseFloat(row.max_latency) || 0,
            };
        });
    }

    async getStatusCodeDistribution(clientId) {
        const query = `
            SELECT
                CASE
                    WHEN em.method = em.method THEN NULL
                END,
                FLOOR(status_data.status_code / 100) * 100 AS status_group,
                COUNT(*)::INTEGER AS count
            FROM endpoint_metrics em
            CROSS JOIN LATERAL (
                SELECT generate_series(1, em.total_hits) AS n,
                       CASE WHEN generate_series(1, em.total_hits) <= (em.total_hits - em.error_hits)
                            THEN 200
                            ELSE 500
                       END AS status_code
            ) AS status_data
            WHERE em.client_id = $1
            GROUP BY status_group
            ORDER BY status_group
        `;

        const simpleQuery = `
            SELECT
                SUM(total_hits - error_hits)::INTEGER AS success_hits,
                SUM(error_hits)::INTEGER               AS error_hits
            FROM endpoint_metrics
            WHERE client_id = $1
        `;

        const result = await postgres.query(simpleQuery, [clientId]);
        const row = result.rows[0];
        const successHits = parseInt(row.success_hits, 10) || 0;
        const errorHits = parseInt(row.error_hits, 10) || 0;

        return [
            { statusGroup: '2xx', label: 'Success', count: successHits },
            { statusGroup: '4xx/5xx', label: 'Error', count: errorHits },
        ];
    }

    async getErrorBreakdown(clientId) {
        const query = `
            SELECT
                service_name,
                endpoint,
                method,
                SUM(error_hits)::INTEGER  AS error_hits,
                SUM(total_hits)::INTEGER  AS total_hits,
                ROUND((SUM(error_hits)::NUMERIC / NULLIF(SUM(total_hits), 0) * 100), 2) AS error_rate
            FROM endpoint_metrics
            WHERE client_id = $1
              AND error_hits > 0
            GROUP BY service_name, endpoint, method
            ORDER BY error_hits DESC
        `;

        const result = await postgres.query(query, [clientId]);
        return result.rows.map(row => ({
            serviceName: row.service_name,
            endpoint: row.endpoint,
            method: row.method,
            errorHits: parseInt(row.error_hits, 10),
            totalHits: parseInt(row.total_hits, 10),
            errorRate: parseFloat(row.error_rate) || 0,
        }));
    }

    async getPerformanceMetrics(clientId) {
        const query = `
            SELECT
                service_name,
                endpoint,
                method,
                ROUND(AVG(avg_latency)::NUMERIC, 2) AS avg_latency,
                ROUND(MIN(min_latency)::NUMERIC, 2) AS min_latency,
                ROUND(MAX(max_latency)::NUMERIC, 2) AS max_latency,
                SUM(total_hits)::INTEGER             AS total_hits
            FROM endpoint_metrics
            WHERE client_id = $1
            GROUP BY service_name, endpoint, method
            ORDER BY avg_latency DESC
        `;

        const result = await postgres.query(query, [clientId]);
        return result.rows.map(row => ({
            serviceName: row.service_name,
            endpoint: row.endpoint,
            method: row.method,
            avgLatency: parseFloat(row.avg_latency) || 0,
            minLatency: parseFloat(row.min_latency) || 0,
            maxLatency: parseFloat(row.max_latency) || 0,
            totalHits: parseInt(row.total_hits, 10),
        }));
    }

    async getRecentHits(clientId, limit = 50) {
        if (!clientId) return [];
        
        let mongoClientId;
        try {
            mongoClientId = new mongoose.Types.ObjectId(clientId);
        } catch (error) {
            logger.error('Invalid clientId for MongoDB query', { clientId });
            return [];
        }

        return await ApiHit.find({ clientId: mongoClientId })
            .sort({ timestamp: -1 })
            .limit(parseInt(limit, 10))
            .lean();
    }
}

export default new AnalyticsRepository();
