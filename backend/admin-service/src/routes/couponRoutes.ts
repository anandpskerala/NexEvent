import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { CouponRepository } from "../repositories/CouponRepository";
import { CouponService } from "../services/couponService";
import { CouponController } from "../controllers/couponController";

const router = Router();

const couponRepo = new CouponRepository();
const couponService = new CouponService(couponRepo);
const couponController = new CouponController(couponService);

router.post("/", protectedRoute, couponController.createCoupon);
router.get("/", couponController.getCoupons);
router.get("/:id", couponController.getCoupon);
router.patch("/:id", protectedRoute, couponController.updateCoupon);
router.delete("/:id", protectedRoute, couponController.deleteCoupon);

export default router;
