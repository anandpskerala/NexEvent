import { Router } from "express";
import { organizerRoute } from "../middlewares/organizerRoute";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { container } from "../containers";
import { RequestController } from "../controllers/requestController";
import { validate } from "../middlewares/validate";
import { requestSchema } from "../shared/validators/requestSchema";

const router = Router();

const requestController = container.resolve(RequestController);

router.post("/", organizerRoute, validate(requestSchema), requestController.createRequest);
router.get("/:id", requestController.getRequest);
router.get("/", requestController.getRequests);
router.patch("/:id", protectedRoute, requestController.updateRequest);
router.delete("/:id", protectedRoute, requestController.deleteRequest);

export default router;
