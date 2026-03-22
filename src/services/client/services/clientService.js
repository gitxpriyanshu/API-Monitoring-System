
import logger from "../../../shared/config/logger.js";
import { APPLICATION_ROLES, isValidClientRole } from "../../../shared/constants/roles.js";
import AppError from "../../../shared/utils/AppError.js";
import { v4 as uudiv4 } from "uuid";
import crypto from 'crypto';

/**
 * ClientService class to handle business logic related to clients
 */
export class ClientService {
    constructor(dependencies) {
        if (!dependencies) throw new Error('Dependencies are required');
        if (!dependencies.clientRepository) throw new Error('ClientRepository is required');
        if (!dependencies.apiKeyRepository) throw new Error('ApiKeyRepository is required');
        if (!dependencies.userRepository) throw new Error('UserRepository is required');

        this.clientRepository = dependencies.clientRepository;
        this.apiKeyRepository = dependencies.apiKeyRepository;
        this.userRepository = dependencies.userRepository;
    };

    formatClientForResponse(user) {
        const userObj = user.toObject ? user.toObject() : { ...user };
        delete userObj.password;
        return userObj;
    };

    generateSlug(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    canUserAccessClient(user, clientId) {
        if (user.role === APPLICATION_ROLES.SUPER_ADMIN) return true;
        return user.clientId && user.clientId.toString() === clientId.toString();
    }

    async createClient(clientData, adminUser) {
        try {
            const { name, email, description, website } = clientData;
            const slug = this.generateSlug(name);

            const exisitingClient = await this.clientRepository.findBySlug(slug);
            if (exisitingClient) {
                throw new AppError(`Client with slug ${slug} already exists`, 400);
            }

            const client = await this.clientRepository.create({
                name, slug, email, description, website,
                createdBy: adminUser.userId
            });

            return client;
        } catch (error) {
            logger.error('Error creating client:', error);
            throw error;
        }
    };
}