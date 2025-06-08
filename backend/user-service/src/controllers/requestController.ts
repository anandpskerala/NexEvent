import { Request, Response } from "express";
import { Types } from "mongoose";
import { RequestService } from "../services/requestService";

export class RequestController {
    constructor(private request: RequestService) {};

    public createRequest = async (req: Request, res: Response): Promise<void> => {
        const userId = req.params.id;
        const { organization, website, reason, documents } = req.body;
        const result = await this.request.createRequest({userId: new Types.ObjectId(userId), organization, website, reason, documents});
        res.status(result.status).json({message: result.message});
    }

    public getRequest = async (req: Request, res: Response): Promise<void> => {
        const userId = req.params.id;
        const result = await this.request.getRequest(userId);
        res.status(result.status).json({message: result.message, request: result.request});
    }

    public deleteRequest = async (req: Request, res: Response): Promise<void> => {
        const reqId = req.params.id;
        const result = await this.request.deleteRequest(reqId);
        res.status(result.status).json({message: result.message});
    }

    public getAllRequests = async (req: Request, res: Response): Promise<void> => {
        const { page = 1, limit = 10 } = req.query;
        const result = await this.request.getAllRequests(page as number, limit as number);
        res.status(result.status).json({requests: result.requests, page: result.page, pages: result.pages, total: result.total})
    }

    public updateOrganizerRequest = async (req: Request, res: Response): Promise<void> => {
        const userId = req.params.id
        const { action, rejectionReason } = req.body;

        const result = await this.request.updateRequest(userId, action, rejectionReason);
        res.status(result.status).json({message: result.message});
    }
}