import { IReport, ReportActions } from "../../shared/types/IReport";
import { ReportPaginationType, ReportReturnType } from "../../shared/types/returnTypes";

export interface IReportService {
    createRequest(data: IReport): Promise<ReportReturnType>;
    getAllReports(page: number, limit: number): Promise<ReportPaginationType>;
    updateRequest(id: string, status: ReportActions): Promise<ReportReturnType>;
    deleteReport(id: string): Promise<ReportReturnType>;
}