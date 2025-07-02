import { Request, Response } from "express";
import { IReportService } from "../services/interfaces/IReportService";

export class ReportController {
    constructor(private reportService: IReportService) {}

    public createReport = async (req: Request, res: Response): Promise<void> => {
        const {userId, reportType, reportedBy, description, evidence} = req.body;
        const result = await this.reportService.createRequest({
            userId,
            reportType,
            reportedBy,
            description,
            evidence
        });
        res.status(result.status).json({message: result.message, data: result.data});
    }

    public getReports = async (req: Request, res: Response): Promise<void> => {
        const { page = 1, limit = 10 } = req.query;
        const result = await this.reportService.getAllReports(Number(page), Number(limit));
        res.status(result.status).json({
            message: result.message, 
            total: result.total,
            page: result.page,
            pages: result.pages,
            reports: result.reports
        });
    }

    public updateReport = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { status } = req.body;
        const result = await this.reportService.updateRequest(id, status);
        res.status(result.status).json({message: result.message});
    }

    public deleteReport = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const result = await this.reportService.deleteReport(id);
        res.status(result.status).json({message: result.message});
    }
}