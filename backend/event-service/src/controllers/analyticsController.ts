import { Request, Response } from "express";
import { AnalyticService } from "../services/analyticService";
import { GroupBy } from "../shared/types/RevenueAnalytics";

export class AnalyticsController {
    constructor(private analyticService: AnalyticService) {

    }

    public getRevenueReports = async (req: Request, res: Response): Promise<void> => {
        const { mode = "today", organizerId = "" } = req.query;
        const result = await this.analyticService.getBookingAnalytics(mode as GroupBy, organizerId !== "" ? organizerId as string: undefined);
        res.status(result.status).json({message: result.message, report: result.analytics});
    }

    public getTopSellingReports = async (req: Request, res: Response): Promise<void> => {
        const { mode = "today", limit = 10, organizerId = "" } = req.query;
        const result = await this.analyticService.getTopAnalytics(mode as GroupBy, organizerId !== "" ? organizerId as string: undefined, Number(limit));
        res.status(result.status).json({message: result.message, report: result.analytics});
    }
}