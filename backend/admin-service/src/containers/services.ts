import { container } from "tsyringe";
import { ICategoryService } from "../services/interfaces/ICategoryService";
import { CategoryService } from "../services/implementation/categoryService";
import { ICouponService } from "../services/interfaces/ICouponService";
import { CouponService } from "../services/implementation/couponService";
import { IReportService } from "../services/interfaces/IReportService";
import { ReportService } from "../services/implementation/reportService";
import { IRequestService } from "../services/interfaces/IRequestService";
import { RequestService } from "../services/implementation/requestService";
import { ICloudinaryService } from "../services/interfaces/ICloudinaryService";
import { CloudinaryService } from "../services/implementation/cloudinaryService";
import { IKafkaProducer } from "../kafka/producer/IKafkaProducer";
import { KafkaProducer } from "../kafka/producer/kafkaProducer";
import { Kafka } from "kafkajs";
import kafka from "../kafka";

export function registerServices() {
  container.register<ICategoryService>("ICategoryService", { useClass: CategoryService });
  container.register<ICouponService>("ICouponService", {useClass: CouponService});
  container.register<IReportService>("IReportService", {useClass: ReportService});
  container.register<IRequestService>("IRequestService", {useClass: RequestService});
  container.register<ICloudinaryService>("ICloudinaryService", {useClass: CloudinaryService});
  container.register<IKafkaProducer>("IKafkaProducer", {useClass: KafkaProducer});
  container.registerInstance(Kafka, kafka);
}