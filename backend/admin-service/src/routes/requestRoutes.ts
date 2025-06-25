import { Router } from "express";
import { organizerRoute } from "../middlewares/organizerRoute";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { RequestRepository } from "../repositories/RequestRepository";
import { RequestService } from "../services/requestService";
import { RequestController } from "../controllers/requestController";

const router = Router();

const requestRepo = new RequestRepository();
const requestService = new RequestService(requestRepo);
const requestController = new RequestController(requestService);

router.post("/", organizerRoute, requestController.createRequest);
router.get("/:id", requestController.getRequest);
router.get("/", requestController.getRequests);
router.patch("/:id", protectedRoute, requestController.updateRequest);
router.delete("/:id", protectedRoute, requestController.deleteRequest);

export default router;
