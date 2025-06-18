import { ReportRepository } from "../repositories/ReportRepository";
import { StatusCode } from "../shared/constants/statusCode";
import { IReport, ReportActions } from "../shared/types/IReport";

export class ReportService {
    constructor(private repo: ReportRepository) { }

    public async createRequest(data: IReport) {
        try {
            if (!data) {
                return {
                    message: "Fill all the required fields",
                    status: StatusCode.BAD_REQUEST
                }
            }
            const exists = await this.repo.findDuplicate(data.userId, data.reportedBy);
            if (exists) {
                return {
                    message: "You have already reported the user",
                    status: StatusCode.BAD_REQUEST
                };
            }
            const doc = await this.repo.createReport(data);
            return {
                message: "Report sent",
                status: StatusCode.CREATED,
                data: doc
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getAllReports(page: number, limit: number) {
        try {
            const offset = (page - 1) * limit;
            const result = await this.repo.getReports(offset, limit);
            return {
                message: "Reports fetched",
                status: StatusCode.OK,
                total: result.total,
                page,
                pages: Math.ceil(result.total / limit),
                reports: result.items
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateRequest(id: string, status: ReportActions) {
        try {
            await this.repo.updateReport(id,  {status});
            return {
                message: "Report updated",
                status: StatusCode.OK
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async deleteReport(id: string) {
        try {
            await this.repo.deleteRequest(id);
            return {
                message: "Report deleted",
                status: StatusCode.OK
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}