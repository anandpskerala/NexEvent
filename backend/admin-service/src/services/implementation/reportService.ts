import { inject, injectable } from "tsyringe";
import { TOPICS } from "../../kafka/topics";
import { IReportRepository } from "../../repositories/interfaces/IReportRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { INotification } from "../../shared/types/INotification";
import { IReport, ReportActions } from "../../shared/types/IReport";
import { ReportPaginationType, ReportReturnType } from "../../shared/types/ReturnType";
import { IReportService } from "../interfaces/IReportService";
import { IKafkaProducer } from "../../kafka/producer/IKafkaProducer";
import { toReportDTO } from "../../shared/dtos/ReportDTO";

@injectable()
export class ReportService implements IReportService {
    constructor(
        @inject("IReportRepository") private _repo: IReportRepository,
        @inject("IKafkaProducer") private _producer: IKafkaProducer
    ) {
    }

    public async createRequest(data: IReport): Promise<ReportReturnType> {
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
            data: toReportDTO(doc)
        }
    }

    public async getAllReports(page: number, limit: number): Promise<ReportPaginationType> {
        const offset = (page - 1) * limit;
        const result = await this._repo.getReports(offset, limit);
        return {
            message: HttpResponse.REPORT_FETCHED,
            status: StatusCode.OK,
            total: result.total,
            page,
            pages: Math.ceil(result.total / limit),
            reports: result.items.map(item => toReportDTO(item))
        }
    }

    public async updateRequest(id: string, status: ReportActions): Promise<ReportReturnType> {
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

    }

    public async deleteReport(id: string): Promise<ReportReturnType> {
        await this._repo.deleteRequest(id);
        return {
            message: HttpResponse.REPORT_DELETED,
            status: StatusCode.OK
        }
    }
}