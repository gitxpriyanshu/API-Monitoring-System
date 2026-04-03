import config from "../../../shared/config/index.js";
import { APPLICATION_ROLES } from "../../../shared/constants/roles.js";
import ResponseFormatter from "../../../shared/utils/responseFormatter.js"


export class AuthController {
    constructor(authService) {
        if (!authService) {
            throw new Error("authService is Required");
        }

        this.authService = authService
    };

    
    async onboardSuperAdmin(req, res, next) {
        try {
            const { username, email, password } = req.body;

            const superAdminData = {
                username, email, password, role: APPLICATION_ROLES.SUPER_ADMIN
            };

            const { token, user } = await this.authService.onboardSuperAdmin(superAdminData);

            res.cookie("authToken", token, {
                httpOnly: config.cookie.httpOnly,
                secure: true,
                maxAge: config.cookie.expiresIn,
                sameSite: 'none'
            });

            res.status(201).json(ResponseFormatter.success({ ...user, token }, "Super admin created successfully", 201))
        } catch (error) {
            next(error)
        }
    };

    
    async register(req, res, next) {
        try {
            const { username, email, password, role } = req.body;
            const userData = {
                username, email, password, role: role || APPLICATION_ROLES.CLIENT_VIEWER
            };

            const { token, user } = await this.authService.register(userData);

            res.cookie("authToken", token, {
                httpOnly: config.cookie.httpOnly,
                secure: true,
                maxAge: config.cookie.expiresIn,
                sameSite: 'none'
            });

            res.status(201).json(ResponseFormatter.success({ ...user, token }, "User created successfully", 201))
        } catch (error) {
            next(error)
        }
    };

    // Public signup — create a client admin for their own workspace
    async signup(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const userData = {
                username, email, password, role: APPLICATION_ROLES.CLIENT_ADMIN
            };

            const { token, user } = await this.authService.register(userData);

            res.cookie("authToken", token, {
                httpOnly: config.cookie.httpOnly,
                secure: true,
                maxAge: config.cookie.expiresIn,
                sameSite: 'none'
            });

            res.status(201).json(ResponseFormatter.success({ ...user, token }, "Account created successfully", 201))
        } catch (error) {
            next(error)
        }
    };

    
    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const { user, token } = await this.authService.login(username, password);

            res.cookie("authToken", token, {
                httpOnly: config.cookie.httpOnly,
                secure: true,
                maxAge: config.cookie.expiresIn,
                sameSite: 'none'
            });

            res.status(200).json(ResponseFormatter.success({ ...user, token }, "User LoggedIn successfully", 200))
        } catch (error) {
            next(error)
        }
    };

    
    async getProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await this.authService.getProfile(userId);

            res.status(200).json(ResponseFormatter.success(result, "Profile fetched successfully", 200))
        } catch (error) {
            next(error)
        }
    }

    
    async logout(req, res, next) {
        try {
            res.clearCookie("authToken", {
                httpOnly: config.cookie.httpOnly,
                secure: true,
                sameSite: 'none'
            })
            res.status(200).json(ResponseFormatter.success({}, "Logout successful", 200))
        } catch (error) {
            next(error)
        }
    }
}
