import { Router } from "express";
import { ConferenceController } from "../controllers/conferenceController";
import { container } from "../containers";

const router = Router();

const controller = container.resolve(ConferenceController);

router.post("/token", controller.getToken);

export default router;
