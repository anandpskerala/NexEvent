import { inject, injectable } from "tsyringe";
import { TOPICS } from "../../kafka/topics";
import { IReportRepository } from "../../repositories/interfaces/IReportRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { INotification } from "../../shared/types/INotification";
import { IReport, ReportActions } from "../../shared/types/IReport";
import { ReportPaginationType, ReportReturnType } from "../../shared/types/ReturnType";
import logger from "../../shared/utils/logger";
import { IReportService } from "../interfaces/IReportService";
import { IKafkaProducer } from "../../kafka/producer/IKafkaProducer";

@injectable()
export class ReportService implements IReportService {
    constructor(
        @inject("IReportRepository") private _repo: IReportRepository,
        @inject("IKafkaProducer") private _producer: IKafkaProducer
    ) {
     }

    public async createRequest(data: IReport): Promise<ReportReturnType> {
        try {
            if (!data) {
                return {
                    message: HttpResponse.MISSING_FIELDS,
                    status: StatusCode.BAD_REQUEST
                }
            }
            const exists = await this._repo.findDuplicate(data.userId, data.reportedBy);
            if (exists) {
                return {
                    message: HttpResponse.ALREADY_REPORTED,
                    status: StatusCode.BAD_REQUEST
                };
            }
            const doc = await this._repo.createReport(data);
            return {
                message: HttpResponse.REPORT_SENT,
                status: StatusCode.CREATED,
                data: doc
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getAllReports(page: number, limit: number): Promise<ReportPaginationType> {
        try {
            const offset = (page - 1) * limit;
            const result = await this._repo.getReports(offset, limit);
            return {
                message: HttpResponse.REPORT_FETCHED,
                status: StatusCode.OK,
                total: result.total,
                page,
                pages: Math.ceil(result.total / limit),
                reports: result.items
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateRequest(id: string, status: ReportActions): Promise<ReportReturnType> {
        try {
            const report = await this._repo.updateReport(id, { status });
            if (report) {
                this._producer.sendData<INotification>(TOPICS.NEW_NOTIFICATION, {
                    userId: report.reportedBy,
                    title: "User report update",
                    type: "report",
                    message: `Your report has been ${status}`
                })
            }
            return {
                message: HttpResponse.REPORT_UPDATED,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async deleteReport(id: string): Promise<ReportReturnType> {
        try {
            await this._repo.deleteRequest(id);
            return {
                message: HttpResponse.REPORT_DELETED,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}