import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { container } from "../containers";
import { validate } from "../middlewares/validate";
import { reportSchema } from "../shared/validators/reportSchema";
import { ReportController } from "../controllers/reportController";

const router = Router();


const reportController = container.resolve(ReportController);

router.post("/", validate(reportSchema), reportController.createReport);
router.put("/:id/status", protectedRoute, reportController.updateReport);
router.delete("/:id", protectedRoute, reportController.deleteReport);
router.get("/", reportController.getReports);

export default router;
