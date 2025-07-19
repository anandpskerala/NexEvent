import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import { ReviewController } from "../controllers/reviewController";
import { container } from "../containers";

const router = Router();

const controller = container.resolve(ReviewController);

router.post("/", protectedRoute, controller.addReview);
router.get("/:id", controller.getReviews);

export default router;