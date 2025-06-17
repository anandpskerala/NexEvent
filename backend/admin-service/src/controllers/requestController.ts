import { Request, Response } from "express";
import { RequestService } from "../services/requestService";
import { StatusCode } from "../shared/constants/statusCode";


export class RequestController {
    constructor(private requestService: RequestService) {}

    public createRequest = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { featureTitle, category, priority, description, useCase, additionalInfo} = req.body;

        if (!userId || !featureTitle || featureTitle.trim() === "", !category || !priority || !description || description.trim() === "" || 
            !useCase || useCase.trim() === "") {
                res.status(StatusCode.BAD_REQUEST).json({message: "Fill all the required fields"});
                return;
        }

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
}