import logger from "../../../shared/config/logger.js";
import ApiKey from "../../../shared/models/ApiKey.js"
import BaseApiKeyRepository from "./BaseApikeyRepository.js"


class MongoApiKeyRepository extends BaseApiKeyRepository {
    constructor() {
        super(ApiKey)
    }

    
    async create(apiKeyData) {
        try {
            const apiKey = new this.model(apiKeyData);
            await apiKey.save();
            logger.info('API key created in database', { keyId: apiKey.keyId });
            return apiKey;
        } catch (error) {
            logger.error('Error creating API key in database:', error);
            throw error;
        }
    }

    
    async findByKeyValue(keyValue, includeInactive = false) {
        try {
            const filter = { keyValue };
            if (!includeInactive) {
                filter.isActive = true;
            }

            const apiKey = await this.model.findOne(filter).populate('clientId');
            return apiKey;
        } catch (error) {
            logger.error('Error finding API key by value:', error);
            throw error;
        }
    }

    
    async findByClientId(clientId, filters = {}) {
        try {
            const query = { clientId, ...filters };
            const apiKeys = await this.model.find(query)
                .populate('createdBy', 'username email')
                .sort({ createdAt: -1 });

            return apiKeys;
        } catch (error) {
            logger.error('Error finding API keys by client ID:', error);
            throw error;
        }
    }

    
    async countByClientId(clientId, filters = {}) {
        try {
            const query = { clientId, ...filters };
            const count = await this.model.countDocuments(query);
            return count;
        } catch (error) {
            logger.error('Error counting API keys:', error);
            throw error;
        }
    }

    
    async findById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            logger.error('Error finding API key by ID:', error);
            throw error;
        }
    }

    
    async delete(id) {
        try {
            await this.model.findByIdAndDelete(id);
            return true;
        } catch (error) {
            logger.error('Error deleting API key from DB:', error);
            throw error;
        }
    }
}

export default new MongoApiKeyRepository();