import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import { ReviewController } from "../controllers/reviewController";
import { ReviewService } from "../services/implementation/reviewService";
import { ReviewRepository } from "../repositories/implementation/ReviewRepository";

const router = Router();

const repo =  new ReviewRepository();
const service = new ReviewService(repo)
const controller = new ReviewController(service);

router.post("/", protectedRoute, controller.addReview);
router.get("/:id", controller.getReviews);

export default router;