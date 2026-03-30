
export default class BaseApiKeyRepository {
    
    constructor(model) {
        this.model = model
    };

    async create(apiKeyData) {
        throw new Error('Method not implemented');
    }

    async findByKeyValue(keyValue, includeInactive) {
        throw new Error('Method not implemented');
    }

    async findByClientId(clientId, filters) {
        throw new Error('Method not implemented');
    }

    async countByClientId(clientId, filters) {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }
}