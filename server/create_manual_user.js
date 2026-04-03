import mongodb from './src/shared/config/mongodb.js';
import authDependencies from './src/services/auth/Dependencies/dependencies.js';
import { APPLICATION_ROLES } from './src/shared/constants/roles.js';
import logger from './src/shared/config/logger.js';

async function createUser() {
    try {
        await mongodb.connect();
        logger.info("Connected to MongoDB for manual user creation");

        const { authService } = authDependencies.services;

        const userData = {
            username: "admin_test",
            email: "admin_test@example.com",
            password: "Admin@2026!",
            role: "super_admin"
        };

        const result = await authService.register(userData);
        
        console.log("\n==========================================");
        console.log("USER CREATED SUCCESSFULLY");
        console.log("Username: admin_test");
        console.log("Email: admin_test@example.com");
        console.log("Password: password123");
        console.log("Role: super_admin");
        console.log("==========================================\n");

        await mongodb.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Failed to create user:", error.message);
        process.exit(1);
    }
}

createUser();
