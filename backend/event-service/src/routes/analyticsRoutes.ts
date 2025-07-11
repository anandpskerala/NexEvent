import { Router } from "express";
import { AnalyticsRepository } from "../repositories/implementation/AnalyticsRepository";
import { AnalyticService } from "../services/implementation/analyticService";
import { AnalyticsController } from "../controllers/analyticsController";

const router = Router();

const analyticsRepo = new AnalyticsRepository();
const analyticService = new AnalyticService(analyticsRepo);
const analyticsController = new AnalyticsController(analyticService);

router.get("/analytics/revenue", analyticsController.getRevenueReports);
router.get("/analytics/topselling", analyticsController.getTopSellingReports);

export default router;
