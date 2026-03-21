import MongoUserRepository from "../repository/UserRepository.js";
import { AuthService } from "../service/authService.js";
import { AuthController } from "../controller/authController.js";

/**
 * Container class to initialize and manage dependencies for the auth service
 * It acts as an IoC (Inversion of Control) container for the authentication domain.
 */
class Container {
    static init() {
        // Initialize repositories
        const repositories = {
            userRepository: MongoUserRepository
        };

        // Initialize services
        const services = {
            authService: new AuthService(repositories.userRepository)
        };

        // Initialize controllers
        const controllers = {
            authController: new AuthController(services.authService)
        };

        return { repositories, services, controllers }
    }
}

const initialized = Container.init();
export { Container };
export default initialized;