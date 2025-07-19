import { container } from "tsyringe";
import { ICategoryService } from "../services/interfaces/ICategoryService";
import { CategoryService } from "../services/implementation/categoryService";
import { ICouponService } from "../services/interfaces/ICouponService";
import { CouponService } from "../services/implementation/couponService";
import { IReportService } from "../services/interfaces/IReportService";
import { ReportService } from "../services/implementation/reportService";
import { IRequestService } from "../services/interfaces/IRequestService";
import { RequestService } from "../services/implementation/requestService";

export function registerServices() {
  container.register<ICategoryService>("ICategoryService", { useClass: CategoryService });
  container.register<ICouponService>("ICouponService", {useClass: CouponService});
  container.register<IReportService>("IReportService", {useClass: ReportService});
  container.register<IRequestService>("IRequestService", {useClass: RequestService});
}