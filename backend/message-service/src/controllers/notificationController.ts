import { Request, Response } from "express";
import redisClient from "../config/redis";
import { INotificationService } from "../services/interfaces/INotificationService";
import { HttpResponse } from "../shared/constants/httpResponse";

export class NotificationController {
    constructor(private notificationService: INotificationService) { }

    public notificationStream = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        try {
            const subClient = redisClient.duplicate();
            await subClient.connect();

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.flushHeaders();
            const unread = await this.notificationService.getUnreads(id);
            res.write(`event: init\ndata: ${JSON.stringify(unread.result)}\n\n`);

            await subClient.subscribe(`notifications:${id}`, (message) => {
                res.write(`data: ${message}\n\n`);
            });

            req.on('close', async () => {
                console.log(`SSE connection closed by client: ${id}`);
                await subClient.unsubscribe(`notifications:${id}`);
                await subClient.quit();
            });

        } catch (error) {
            console.error("SSE connection error:", error);
            res.status(500).json({ message: HttpResponse.SSE_CONECTION_ERROR });
        }
    }


    public readAllNotifications = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const result = await this.notificationService.markAllAsRead(id);
        res.status(result.status).json({ message: result.message });
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