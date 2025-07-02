import { Router } from "express";
import { UserRepository } from "../repositories/implementation/UserRepository";
import { RequestRepository } from "../repositories/implementation/RequestRepository";
import { RequestService } from "../services/implementation/requestService";
import { RequestController } from "../controllers/requestController";
import { protectedRoute } from "../middlewares/protectedRoute";
import { adminRoute } from "../middlewares/adminRoute";

const router = Router();

const requestRepo = new RequestRepository();
const userRepo = new UserRepository();
const requestService = new RequestService(requestRepo, userRepo);
const requestController = new RequestController(requestService);

router.get("/requests", requestController.getAllRequests);
router.post("/request/:id", protectedRoute, requestController.createRequest);
router.get("/request/:id", requestController.getRequest);
router.delete("/request/:id", protectedRoute, requestController.deleteRequest);
router.patch("/request/:id", adminRoute, requestController.updateOrganizerRequest);

export default router;
