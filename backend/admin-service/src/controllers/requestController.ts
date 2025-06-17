import { Request, Response } from "express";
import { RequestService } from "../services/requestService";
import { StatusCode } from "../shared/constants/statusCode";


export class RequestController {
    constructor(private requestService: RequestService) {}

    public createRequest = async (req: Request, res: Response): Promise<void> => {
        const { userId, featureTitle, category, priority, description, useCase, additionalInfo} = req.body;

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
}