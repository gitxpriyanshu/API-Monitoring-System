import amqplib from 'amqplib';
import config from '../../shared/config/index.js';
import logger from '../../shared/config/logger.js';
import mongodb from '../../shared/config/mongodb.js';
import postgres from '../../shared/config/postgres.js';
import processorRepository from './repositories/ProcessorRepository.js';

const QUEUE_NAME = config.rabbitmq.queue;
const DLQ_NAME = `${QUEUE_NAME}.dlq`;
const MAX_RETRIES = 3;

async function processMessage(eventData) {
    await processorRepository.saveRawHit(eventData);
    await processorRepository.upsertMetrics(eventData);
}

async function startConsumer() {
    try {
        await mongodb.connect();
        await postgres.testConnection();

        logger.info('Processor: all DB connections established');

        const connection = await amqplib.connect(config.rabbitmq.url);
        const channel = await connection.createChannel();

        await channel.assertQueue(DLQ_NAME, { durable: true });

        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': '',
                'x-dead-letter-routing-key': DLQ_NAME,
            },
        });

        channel.prefetch(10);

        logger.info(`Processor: consuming from queue "${QUEUE_NAME}"`);

        channel.consume(QUEUE_NAME, async (msg) => {
            if (!msg) return;

            let eventData;
            let attempt = 0;

            try {
                const parsed = JSON.parse(msg.content.toString());
                eventData = parsed.data;

                if (!eventData) throw new Error('Missing data field in message');

                const headers = msg.properties.headers || {};
                attempt = headers['x-retry-count'] || 0;

                await processMessage(eventData);
                channel.ack(msg);

                logger.info('Message processed successfully', {
                    eventId: eventData.eventId,
                    attempt,
                });
            } catch (error) {
                logger.error('Error processing message', {
                    error: error.message,
                    attempt,
                    eventId: eventData?.eventId,
                });

                attempt += 1;

                if (attempt >= MAX_RETRIES) {
                    logger.warn('Max retries reached, sending to DLQ', {
                        eventId: eventData?.eventId,
                        attempt,
                    });
                    channel.nack(msg, false, false);
                } else {
                    setTimeout(() => {
                        try {
                            channel.nack(msg, false, true);
                        } catch (e) {
                            logger.error('Error requeuing message', { error: e.message });
                        }
                    }, 1000 * attempt);
                }
            }
        });

        const gracefulShutdown = async (signal) => {
            logger.info(`Processor received ${signal}, shutting down...`);
            try {
                await channel.close();
                await connection.close();
                await mongodb.disconnect();
                await postgres.close();
                logger.info('Processor shutdown complete');
                process.exit(0);
            } catch (error) {
                logger.error('Error during processor shutdown', { error: error.message });
                process.exit(1);
            }
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        connection.on('error', (err) => {
            logger.error('RabbitMQ connection error', { error: err.message });
            process.exit(1);
        });

        connection.on('close', () => {
            logger.warn('RabbitMQ connection closed, exiting...');
            process.exit(1);
        });

    } catch (error) {
        logger.error('Processor startup failed', { error: error.message });
        process.exit(1);
    }
}

startConsumer();
