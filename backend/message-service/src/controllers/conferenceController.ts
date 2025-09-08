import { Request, Response } from "express";
import { IConferenceService } from "../services/interfaces/IConferenceService";
import { inject, injectable } from "tsyringe";

@injectable()
export class ConferenceController {
    constructor(@inject("IConferenceService") private _conferenceService: IConferenceService) {}

    public getToken = async (req: Request, res: Response): Promise<void> => {
        const { identity, room} = req.body;
        const result = await this._conferenceService.createToken(identity, room);
        res.status(result.status).json({message: result.message, token: result.token});
    }
}