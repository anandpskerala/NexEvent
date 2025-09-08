import { Request, Response } from "express";
import { INotificationService } from "../services/interfaces/INotificationService";
import { HttpResponse } from "../shared/constants/httpResponse";
import logger from "../shared/utils/logger";
import { addClient, broadcastInit, removeClient } from "../shared/utils/sseManager";
import { inject, injectable } from "tsyringe";

@injectable()
export class NotificationController {
    constructor(@inject("INotificationService") private _notificationService: INotificationService) { }

    public notificationStream = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            if (!id) {
                res.status(400).json({ message: "User ID is required" });
                return;
            }

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.flushHeaders?.();

            const heartbeat = setInterval(() => {
                res.write(':keep-alive\n\n');
            }, 30000);

            addClient(id, res);

            const unread = await this._notificationService.getUnreads(id);
            broadcastInit(id, unread.result);

            req.on("close", () => {
                logger.info(`SSE disconnected for user: ${id}`);
                removeClient(id);
                clearInterval(heartbeat);
            });

            req.on("aborted", () => {
                logger.info(`Client aborted connection for user: ${id}`);
                removeClient(id);
                clearInterval(heartbeat);
            });

        } catch (error) {
            console.error("SSE connection error:", error);
            res.status(500).json({ message: HttpResponse.SSE_CONECTION_ERROR });
        }
    }


    public readAllNotifications = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const result = await this._notificationService.markAllAsRead(id);
        res.status(result.status).json({ message: result.message });
    }

    public getAllNotifications = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { page = 1, limit = 10, isRead = 'false' } = req.query;
        const result = await this._notificationService.getAllNotification(id, Number(page), Number(limit), isRead === 'true');
        res.status(result.status).json({
            message: result.message,
            notifications: result.notifications,
            page: result.page,
            pages: result.pages,
            total: result.total
        })
    }
}