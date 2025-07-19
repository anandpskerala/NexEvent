import { container } from "tsyringe";
import { CategoryRepository } from "../repositories/implementation/CategoryRepository";
import { ICategoryRepository } from "../repositories/interfaces/ICategoryRepository";
import { CouponRepository } from "../repositories/implementation/CouponRepository";
import { ICouponRepository } from "../repositories/interfaces/ICouponRepository";
import { IReportRepository } from "../repositories/interfaces/IReportRepository";
import { ReportRepository } from "../repositories/implementation/ReportRepository";
import { IRequestRepository } from "../repositories/interfaces/IRequestRepository";
import { RequestRepository } from "../repositories/implementation/RequestRepository";

export function registerRepositories() {
  container.register<ICategoryRepository>("ICategoryRepository", { useClass: CategoryRepository });
  container.register<ICouponRepository>("ICouponRepository", { useClass: CouponRepository });
  container.register<IReportRepository>("IReportRepository", { useClass: ReportRepository });
  container.register<IRequestRepository>("IRequestRepository", { useClass: RequestRepository });
}