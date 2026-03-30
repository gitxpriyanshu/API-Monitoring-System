import express from "express";
import clientDependencies from "../Dependencies/dependencies.js"
import authenticate from "../../../shared/middlewares/authenticate.js"


const router = express.Router();


const { clientController } = clientDependencies.controller


router.use(authenticate);


router.post("/admin/clients/onboard", (req, res, next) => clientController.createClient(req, res, next))


router.post("/admin/clients/:clientId/users", (req, res, next) => clientController.createClientUser(req, res, next))


router.post("/admin/clients/:clientId/api/keys", (req, res, next) => clientController.createApiKey(req, res, next))


router.get("/keys", (req, res, next) => clientController.getClientApiKeys(req, res, next))
router.post("/keys", (req, res, next) => clientController.createApiKey(req, res, next))
router.delete("/keys/:keyId", (req, res, next) => clientController.deleteApiKey(req, res, next))

export default router;