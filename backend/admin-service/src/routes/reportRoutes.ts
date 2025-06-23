import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { ReportRepository } from "../repositories/ReportRepository";
import { ReportService } from "../services/reportService";
import { ReportController } from "../controllers/reportController";

const router = Router();

const reportRepo = new ReportRepository();
const reportService = new ReportService(reportRepo);
const reportController = new ReportController(reportService);

router.post("/", reportController.createReport);
router.put("/:id/status", protectedRoute, reportController.updateReport);
router.delete("/:id", protectedRoute, reportController.deleteReport);
router.get("/", reportController.getReports);

export default router;
