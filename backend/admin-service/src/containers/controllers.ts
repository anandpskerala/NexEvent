import { container } from "tsyringe";
import { CategoryController } from "../controllers/categoryController";
import { CouponController } from "../controllers/couponController";
import { ReportController } from "../controllers/reportController";
import { RequestController } from "../controllers/requestController";

export function registerControllers () {
    container.register<CategoryController>(CategoryController, {useClass: CategoryController});
    container.register<CouponController>(CouponController, {useClass: CouponController});
    container.register<ReportController>(ReportController, {useClass: ReportController});
    container.register<RequestController>(RequestController, {useClass: RequestController});
}