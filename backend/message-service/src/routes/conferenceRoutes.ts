import { Router } from "express";
import { ConferenceService } from "../services/conferenceService";
import { ConferenceController } from "../controllers/conferenceController";

const router = Router();

const service = new ConferenceService();
const controller = new ConferenceController(service);

router.post("/token", controller.getToken);

export default router;
