import { AllIReports, IReport } from "../../shared/types/IReport";

export interface IReportRepository {
    createReport(data: Partial<IReport>): Promise<IReport>;
    getReport(id: string): Promise<IReport | undefined>;
    updateReport(id: string, data: Partial<IReport>): Promise<IReport | undefined>;
    getReports(offset: number, limit: number): Promise<AllIReports>;
    findDuplicate(userId: string, reportedBy: string): Promise<boolean>;
    deleteRequest(id: string): Promise<void>;
}