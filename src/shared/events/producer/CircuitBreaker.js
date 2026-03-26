

/**
 * Enum for circuit breaker states.
 * @readonly
 * @enum {string}
 */
export const CircuitState = Object.freeze({
    CLOSED: 'CLOSED',
    OPEN: "OPEN",
    HALF_OPEN: 'HALF_OPEN'
})

/**
 * A simple implementation of the Circuit Breaker pattern in JavaScript. This class allows you to wrap calls to external services and automatically handle failures by opening the circuit after a certain number of consecutive failures, and then allowing a limited number of test requests after a cooldown period to determine if the service has recovered.
 * 
 * Usage:
 * const circuitBreaker = new CircuitBreaker({ failureThreshold: 5, cooldownMs: 30000 }
 * circuitBreaker.allowRequest() // returns true if request is allowed, false if circuit is open
 * circuitBreaker.onSuccess() // call this when a request succeeds
 * circuitBreaker.onFailure() // call this when a request fails
 * 
 * The circuit breaker will automatically transition between states (CLOSED, OPEN, HALF_OPEN) based on the success and failure of requests, and will log state changes and metrics for monitoring purposes.
 */
export class CircuitBreaker {
    /**
     * Creates a new CircuitBreaker instance with the specified options.
     * @param {Object} opts - Configuration options for the circuit breaker.
     * @param {number} [opts.failureThreshold=5] - The number of consecutive failures before opening the circuit.
     * @param {number} [opts.cooldownMs=30000] - The cooldown period in milliseconds before allowing a test request.
     * @param {number} [opts.halfOpenMaxAttempts=3] - The maximum number of test requests allowed in the HALF_OPEN state.
     * @param {Object} [opts.logger=console] - The logger to use for logging circuit breaker events.
     */
    constructor(opts = {}) {
        this.failureThreshold = opts.failureThreshold ?? 5;
        this.cooldownMs = opts.cooldownMs ?? 30_000;
        this.halfOpenMaxAttempts = opts.halfOpenMaxAttempts ?? 3;
        this.logger = opts.logger ?? console;

        this._state = CircuitState.CLOSED;
        this._failures = 0;
        this._lastFailureTime = 0;
        this._halfOpenAttempts = 0;
        this._halfOpenSuccesses = 0;
    };

}
