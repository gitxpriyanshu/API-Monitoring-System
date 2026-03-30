import MongoUserRepository from "../repository/UserRepository.js";
import { AuthService } from "../service/authService.js";
import { AuthController } from "../controller/authController.js";


class Container {
    static init() {
        
        const repositories = {
            userRepository: MongoUserRepository
        };

        
        const services = {
            authService: new AuthService(repositories.userRepository)
        };

        
        const controllers = {
            authController: new AuthController(services.authService)
        };

        return { repositories, services, controllers }
    }
}

const initialized = Container.init();
export { Container };
export default initialized;