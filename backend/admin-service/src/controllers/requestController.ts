import { Request, Response } from "express";
import { IRequestService } from "../services/interfaces/IRequestService";


export class RequestController {
    constructor(private requestService: IRequestService) {}

    public createRequest = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { featureTitle, category, priority, description, useCase, additionalInfo} = req.body;

        const data = {
            userId,
            featureTitle,
            category,
            priority,
            description,
            useCase,
            additionalInfo
        }
        const result = await this.requestService.createRequest(data);
        res.status(result.status).json({message: result.message, request: result.request});
    }

    public getRequest = async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const result = await this.requestService.getRequest(id);
        res.status(result.status).json({message: result.message, request: result.request});
    }

    public getRequests = async (req: Request, res: Response): Promise<void> => {
        const { page = 1, limit = 10 } = req.query;
        const result = await this.requestService.getAllRequest(Number(page), Number(limit));
        res.status(result.status).json({
            message: result.message,
            total: result.total,
            page: result.page,
            pages: result.pages,
            requests: result.requests
        })
    }

    public updateRequest = async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const { status } = req.body;
        const result = await this.requestService.updateRequest(id, status);
        res.status(result.status).json({message: result.message});
    }

    public deleteRequest = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const result = await this.requestService.deleteRequest(id);
        res.status(result.status).json({message: result.message});
    }}