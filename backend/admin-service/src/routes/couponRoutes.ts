import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import { CouponController } from "../controllers/couponController";
import { validate } from "../middlewares/validate";
import { createCoupon } from "../shared/validators/couponSchema";
import { container } from "../containers";

const router = Router();

const couponController = container.resolve(CouponController);

router.post("/", protectedRoute, validate(createCoupon), couponController.createCoupon);
router.get("/", couponController.getCoupons);
router.get("/:id", couponController.getCoupon);
router.patch("/:id", protectedRoute, validate(createCoupon), couponController.updateCoupon);
router.delete("/:id", protectedRoute, couponController.deleteCoupon);

export default router;
