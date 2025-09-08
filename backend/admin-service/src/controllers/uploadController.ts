import { Request, Response } from "express";
import crypto from "crypto";
import { config } from "../config";
import { injectable } from "tsyringe";

@injectable()
export class UploadController {
    constructor() { }

    public getSignedInfo = async (req: Request, res: Response): Promise<void> => {
        const timestamp = Math.floor(Date.now() / 1000);
        const paramsToSign = `timestamp=${timestamp}&upload_preset=${config.cloudinary.preset}`;

        const signature = crypto
            .createHash('sha1')
            .update(paramsToSign + config.cloudinary.secret)
            .digest('hex');

        res.json({
            timestamp,
            signature,
            apiKey: config.cloudinary.apiKey,
            cloudName: config.cloudinary.cloudName,
        });
    }
}