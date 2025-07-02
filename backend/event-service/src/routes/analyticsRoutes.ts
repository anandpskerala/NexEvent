import { Router } from "express";
import { BookingRepository } from "../repositories/implementation/BookingRepository";
import { AnalyticService } from "../services/implementation/analyticService";
import { AnalyticsController } from "../controllers/analyticsController";

const router = Router();

const bookingRepo = new BookingRepository();
const analyticService = new AnalyticService(bookingRepo);
const analyticsController = new AnalyticsController(analyticService);

router.get("/analytics/revenue", analyticsController.getRevenueReports);
router.get("/analytics/topselling", analyticsController.getTopSellingReports);

export default router;
