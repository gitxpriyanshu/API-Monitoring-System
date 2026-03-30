import express from "express";
import clientDependencies from "../Dependencies/dependencies.js"
import authenticate from "../../../shared/middlewares/authenticate.js"

// Create a new router instance
const router = express.Router();

// Destructure the clientController from the dependencies
const { clientController } = clientDependencies.controller

// Apply authentication middleware to all routes in this router
router.use(authenticate);

// Onboard a new client
router.post("/admin/clients/onboard", (req, res, next) => clientController.createClient(req, res, next))

// Create a user for a client
router.post("/admin/clients/:clientId/users", (req, res, next) => clientController.createClientUser(req, res, next))

// Create API key for a client
router.post("/admin/clients/:clientId/api/keys", (req, res, next) => clientController.createApiKey(req, res, next))

// Self-service API key management (based on user's clientId)
router.get("/keys", (req, res, next) => clientController.getClientApiKeys(req, res, next))
router.post("/keys", (req, res, next) => clientController.createApiKey(req, res, next))
router.delete("/keys/:keyId", (req, res, next) => clientController.deleteApiKey(req, res, next))

export default router;