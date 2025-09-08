import { Router } from "express";
import { UploadController } from "../controllers/uploadController";

const router = Router();

const uploadController = new UploadController();

router.post("/signature", uploadController.getSignedInfo);


export default router;