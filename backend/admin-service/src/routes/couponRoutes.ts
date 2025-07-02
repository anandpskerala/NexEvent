import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { CouponRepository } from "../repositories/implementation/CouponRepository";
import { CouponService } from "../services/implementation/couponService";
import { CouponController } from "../controllers/couponController";
import { validate } from "../middlewares/validate";
import { createCoupon } from "../shared/validators/couponSchema";

const router = Router();

const couponRepo = new CouponRepository();
const couponService = new CouponService(couponRepo);
const couponController = new CouponController(couponService);

router.post("/", protectedRoute, validate(createCoupon), couponController.createCoupon);
router.get("/", couponController.getCoupons);
router.get("/:id", couponController.getCoupon);
router.patch("/:id", protectedRoute, validate(createCoupon), couponController.updateCoupon);
router.delete("/:id", protectedRoute, couponController.deleteCoupon);

export default router;
