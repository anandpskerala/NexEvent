import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService";
import redisClient from "../config/redis";

export class NotificationController {
    constructor(private notificationService: NotificationService) { }

    public notificationStream = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        const subClient = redisClient.duplicate();
        await subClient.connect()

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const unread = await this.notificationService.getUnreads(id);
        res.write(`event: init\ndata: ${JSON.stringify(unread.result)}\n\n`);

        subClient.subscribe(`notifications:${id}`, (message) => {
            res.write(`data: ${message}\n\n`);
        });

        req.on('close', () => {
            subClient.unsubscribe(`notifications:${id}`);
            subClient.quit();
        });
    }

    public readAllNotifications = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const result = await this.notificationService.markAllAsRead(id);
        res.status(result.status).json({message: result.message});
    }

    public getAllNotifications = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { page = 1, limit = 10, isRead = true } = req.query;
        const result = await this.notificationService.getAllNotification(id, Number(page), Number(limit), isRead as boolean);
        res.status(result.status).json({
            message: result.message,
            notifications: result.notifications,
            page: result.page,
            pages: result.pages,
            total: result.total
        })
    }
}