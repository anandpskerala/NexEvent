import { Router } from "express";
import { BookingRepository } from "../repositories/BookingRepository";
import { AnalyticService } from "../services/analyticService";
import { AnalyticsController } from "../controllers/analyticsController";

const router = Router();

const bookingRepo = new BookingRepository();
const analyticService = new AnalyticService(bookingRepo);
const analyticsController = new AnalyticsController(analyticService);

router.get("/analytics/revenue", analyticsController.getRevenueReports);
router.get("/analytics/topselling", analyticsController.getTopSellingReports);

export default router;
