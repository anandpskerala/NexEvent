import { IReport, ReportActions, ReportTypes } from "../types/IReport";

export interface ReportDTO {
    id: string;
    userId: string;
    reportType: ReportTypes;
    reportedBy: string;
    status: ReportActions;
    description: string;
    evidence?: string;
    createdAt: string;
    updatedAt: string
}

export const toReportDTO = (entity: IReport): ReportDTO => {
    return {
        id: entity.id as string,
        userId: entity.userId,
        reportType: entity.reportType,
        reportedBy: entity.reportedBy,
        status: entity.status as ReportActions,
        description: entity.description,
        evidence: entity.evidence,
        createdAt: entity.createdAt as string,
        updatedAt: entity.updatedAt as string
    };
}