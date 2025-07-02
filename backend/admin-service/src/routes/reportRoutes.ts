import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { ReportRepository } from "../repositories/implementation/ReportRepository";
import { ReportService } from "../services/implementation/reportService";
import { ReportController } from "../controllers/reportController";
import { validate } from "../middlewares/validate";
import { reportSchema } from "../shared/validators/reportSchema";

const router = Router();

const reportRepo = new ReportRepository();
const reportService = new ReportService(reportRepo);
const reportController = new ReportController(reportService);

router.post("/", validate(reportSchema), reportController.createReport);
router.put("/:id/status", protectedRoute, reportController.updateReport);
router.delete("/:id", protectedRoute, reportController.deleteReport);
router.get("/", reportController.getReports);

export default router;
