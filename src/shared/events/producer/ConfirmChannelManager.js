import { EventEmitter } from "node:events"

/**
 * Manages a single RabbitMQ confirm channel, ensuring it is recreated if it closes or encounters an error.
 * Provides a getChannel() method that returns a promise which resolves to a ready-to-use confirm channel.
 * If the channel is currently being established, additional calls to getChannel() will wait for the same channel to be ready.
 * Emits 'drain' event when the channel's write buffer is drained, and 'error' event if the channel encounters an error.
 */
export class ConfirmChannelManager extends EventEmitter {
    /**
     * 
     * @param {{ rabbitmq: any, logger?: any }} param0 - Configuration object containing the RabbitMQ connection manager and an optional logger.
     * @throws Will throw an error if the rabbitmq connection manager is not provided.
     */
    constructor({ rabbitmq, logger }) {
        super();

        if (!rabbitmq) throw new Error("Confirm Channel Manager requires rabbitmq connection manager");

        this._rabbitmq = rabbitmq;
        this._logger = logger ?? console;
        this._channel = null;
        this._connecting = false;
        this._connectWaiters = [];
    }
}