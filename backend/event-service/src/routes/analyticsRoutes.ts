import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController";
import { container } from "../containers";

const router = Router();

const analyticsController = container.resolve(AnalyticsController)

router.get("/analytics/revenue", analyticsController.getRevenueReports);
router.get("/analytics/topselling", analyticsController.getTopSellingReports);

export default router;
