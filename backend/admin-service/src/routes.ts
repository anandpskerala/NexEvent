import { Router } from "express";
import { protectedRoute } from "./middlewares/protectedRoutes";
import { CategoryController } from "./controllers/categoryController";
import { CategoryService } from "./services/categoryService";
import { CategoryRepository } from "./repositories/CategoryRepository";
import { CouponRepository } from "./repositories/CouponRepository";
import { CouponService } from "./services/couponService";
import { CouponController } from "./controllers/couponController";


const routes = Router();

const categoryRepo = new CategoryRepository();
const couponRepo = new CouponRepository();

const categoryService = new CategoryService(categoryRepo);
const couponService = new CouponService(couponRepo);

const categoryController = new CategoryController(categoryService);
const couponController = new CouponController(couponService);

routes.post("/category", protectedRoute, categoryController.createCategory);
routes.get("/categories", categoryController.getCategories);
routes.get("/category/:id", categoryController.getCategory);
routes.patch("/category/:id", protectedRoute, categoryController.updateCategory);
routes.delete("/category/:id", protectedRoute, categoryController.deleteCategory);

routes.post("/coupon", protectedRoute, couponController.createCoupon);
routes.get("/coupons", couponController.getCoupons);
routes.get("/coupon/:id", couponController.getCoupon);
routes.patch("/coupon/:id", protectedRoute, couponController.updateCoupon);
routes.delete("/coupon/:id", protectedRoute, couponController.deleteCoupon);

export default routes;