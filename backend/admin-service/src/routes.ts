import { Router } from "express";
import { protectedRoute } from "./middlewares/protectedRoutes";
import { CategoryController } from "./controllers/categoryController";
import { CategoryService } from "./services/categoryService";
import { CategoryRepository } from "./repositories/CategoryRepository";
import { CouponRepository } from "./repositories/CouponRepository";
import { CouponService } from "./services/couponService";
import { CouponController } from "./controllers/couponController";
import { organizerRoute } from "./middlewares/organizerRoute";
import { RequestController } from "./controllers/requestController";
import { RequestService } from "./services/requestService";
import { RequestRepository } from "./repositories/RequestRepository";


const routes = Router();

const categoryRepo = new CategoryRepository();
const couponRepo = new CouponRepository();
const requestRepo = new RequestRepository();

const categoryService = new CategoryService(categoryRepo);
const couponService = new CouponService(couponRepo);
const requestService = new RequestService(requestRepo);

const categoryController = new CategoryController(categoryService);
const couponController = new CouponController(couponService);
const requestController = new RequestController(requestService);

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

routes.post("/request", organizerRoute, requestController.createRequest);
routes.get("/request/:id", requestController.getRequest);
routes.get("/requests", requestController.getRequests);
routes.patch("/request/:id", protectedRoute, requestController.updateRequest);
routes.delete("/request/:id", protectedRoute, requestController.deleteRequest);

export default routes;