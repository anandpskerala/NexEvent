import { Router } from "express";
import { RequestController } from "../controllers/requestController";
import { protectedRoute } from "../middlewares/protectedRoute";
import { adminRoute } from "../middlewares/adminRoute";
import { container } from "../containers";

const router = Router();

const requestController = container.resolve(RequestController);

router.get("/requests", requestController.getAllRequests);
router.post("/request/:id", protectedRoute, requestController.createRequest);
router.get("/request/:id", requestController.getRequest);
router.delete("/request/:id", protectedRoute, requestController.deleteRequest);
router.patch("/request/:id", adminRoute, requestController.updateOrganizerRequest);

export default router;
