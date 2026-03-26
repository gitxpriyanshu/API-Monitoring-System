/**
 * List of error message patterns and codes that are considered retryable. This includes common network-related errors and RabbitMQ-specific errors that indicate transient issues with the connection or channel. The isRetryable function uses this list to determine if an error should trigger a retry attempt.
 * @constant {string[]}
 */
const RETRYABLE_PATTERNS = [
    'channel closed',
    'connection closed',
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'buffer full',
    'heartbeat timeout',
    'not available',
    'server connection closed',
];

/**
 * Determines if an error is retryable based on its message or code.
 * @param {*} err - The error object to check.
 * @returns {boolean} - True if the error is retryable, false otherwise.
 */
export function isRetryable(err) {
    if (!err) {
        return false;
    }

    const msg = (err.message || '').toLowerCase()
    const code = (err.code || '').toUpperCase();

    if (code === 'ENOTFOUND') return true;

    return RETRYABLE_PATTERNS.some(
        (p) => msg.includes(p.toLowerCase()) || code.includes(p.toUpperCase())
    )
}

/**
 * Implements a retry strategy with exponential backoff and jitter for handling transient errors when publishing messages to RabbitMQ. The strategy allows for a configurable number of maximum retries, base delay, maximum delay, and jitter factor to randomize the delay and avoid thundering herd problems. The shouldRetry method determines if another retry attempt should be made based on the current attempt count, while the wait method returns a promise that resolves after the calculated delay for the next retry attempt.
 * @class RetryStrategy
 * @constructor
 * @param {Object} [opts] - Optional configuration for the retry strategy.
 * @param {number} [opts.maxRetries=3] - Maximum number of retry attempts.
 * @param {number} [opts.baseDelayMs=200] - Base delay in milliseconds for the exponential backoff.
 * @param {number} [opts.maxDelayMs=5000] - Maximum delay in milliseconds for the exponential backoff.
 * @param {number} [opts.jitterFactor=0.3] - Jitter factor to randomize the delay.
 */
export class RetryStrategy {
    constructor(opts = {}) {
        this.maxRetries = opts.maxRetries ?? 3;
        this.baseDelayMs = opts.baseDelayMs ?? 200;
        this.maxDelayMs = opts.maxDelayMs ?? 5000;
        this.jitterFactor = opts.jitterFactor ?? 0.3;
    }

    /**
     * Determines if another retry attempt should be made based on the current attempt count.
     * @param {number} attempt - The current attempt count.
     * @returns {boolean} - True if another retry attempt should be made, false otherwise.
     */
    shouldRetry(attempt) {
        return attempt < this.maxRetries;
    };
}