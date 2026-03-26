import config from '../../config/index.js';
import logger from '../../config/logger.js';
import rabbitmq from '../../config/rabbitmq.js';

import { CircuitBreaker } from './CircuitBreaker.js';
import { ConfirmChannelManager } from './ConfirmChannelManager.js';
import { RetryStrategy } from './RetryStrategy.js';
import { EventProducer } from './eventProducer.js';

/**
 * Factory function to create an instance of EventProducer with its dependencies. It allows for optional overrides of the logger, RabbitMQ connection manager, channel manager, circuit breaker, and retry strategy. If no overrides are provided, it uses default implementations and configurations.
 * @param {Object} [overrides] - Optional overrides for dependencies.
 * @param {Object} [overrides.logger] - Custom logger instance.
 * @param {Object} [overrides.rabbitmq] - Custom RabbitMQ connection manager.
 * @param {string} [overrides.queueName] - Custom queue name.
 * @param {Object} [overrides.channelManager] - Custom channel manager.
 * @param {Object} [overrides.circuitBreaker] - Custom circuit breaker instance.
 * @param {Object} [overrides.retryStrategy] - Custom retry strategy instance.
 * @returns {EventProducer}
 */
export function createEventProducer(overrides = {}) {
    const log = overrides.logger ?? logger;
    const rmq = overrides.rabbitmq ?? rabbitmq;
    const queueName = overrides.queueName ?? config.rabbitmq.queue;
}