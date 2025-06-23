import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService";
import { redisSubClient } from "../config/redis";

export class NotificationController {
    constructor(private notificationService: NotificationService) { }

    public notificationStream = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        redisSubClient.subscribe(`notifications:${id}`, (message) => {
            res.write(`data: ${message}\n\n`);
        });

        req.on('close', () => {
            redisSubClient.unsubscribe();
            redisSubClient.quit();
        });
    }
}