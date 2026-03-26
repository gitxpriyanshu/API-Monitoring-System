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

    // 100 (a) => 1 => a <== 99 (a)
    /**
     * Returns a promise that resolves to a RabbitMQ confirm channel. If the channel is already established, it returns it immediately. 
     * If the channel is in the process of being established, it waits for that process to complete and then returns the channel. 
     * If no channel exists and one is not currently being established, it initiates the creation of a new confirm channel.
     * @returns {Promise<any>} A promise that resolves to a RabbitMQ confirm channel.
     * @throws Will throw an error if the channel cannot be established after retrying.
     */
    async getChannel() {
        if (this._channel) return this._channel;

        if (this._connecting) {
            return new Promise((resolve, reject) => {
                this._connectWaiters.push({ resolve, reject })
            })
        }

        return this._connect()
    }
}