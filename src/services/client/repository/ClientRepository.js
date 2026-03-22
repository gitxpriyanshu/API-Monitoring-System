import BaseClientRepository from "./BaseClientRepository.js";
import Client from "../../../shared/models/Client.js";
import logger from "../../../shared/config/logger.js"

/**
 * MongoClientRepository class to handle database operations related to clients
 * This class extends the BaseClientRepository and provides implementations for creating clients, finding clients by ID or slug, and finding/counting clients based on filters. It uses Mongoose for database interactions and includes error handling and logging for each operation.
 */
class MongoClientRepository extends BaseClientRepository {
    constructor() {
        super(Client)
    }

    /**
     * Creates a new client
     * @param {Object} clientData 
     * @returns {Promise<Object>}
     */
    async create(clientData) {
        try {
            const client = new this.model(clientData);
            await client.save();

            logger.info('Client created in MongoDB', {
                mongoId: client._id,
                slug: client.slug
            });

            return client;
        } catch (error) {
            logger.error('Error creating client in db', error);
            throw error
        }
    }

    /**
     * Find a client by ID
     * @param {string} clientId - The ID of the client
     * @returns {Promise<Object|null>} - The client object or null if not found
     */
    async findById(clientId) {
        try {
            const client = await this.model.findById(clientId);

            logger.info('Client details from MongoDB', client);

            return client
        } catch (error) {
            logger.error('Error finding client in db by id', error);
            throw error
        }
    }
}

export default new MongoClientRepository();