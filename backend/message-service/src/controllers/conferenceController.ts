import { Request, Response } from "express";
import { ConferenceService } from "../services/implementation/conferenceService";

export class ConferenceController {
    constructor(private conferenceService: ConferenceService) {}

    public getToken = async (req: Request, res: Response): Promise<void> => {
        const { identity, room} = req.body;
        const result = await this.conferenceService.createToken(identity, room);
        res.status(result.status).json({message: result.message, token: result.token});
    }
}