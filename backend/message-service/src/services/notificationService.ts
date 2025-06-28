import { NotificationRepository } from "../repositories/NotificationRepository";
import { StatusCode } from "../shared/constants/statusCode";
import logger from "../shared/utils/logger";

export class NotificationService {
    constructor(private repo: NotificationRepository) {}

    public async getUnreads(userId: string) {
        try {
            if (!userId) {
                return {
                    message: "User IS is missing",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const unreads = await this.repo.getUnreadByUser(userId);
            return {
                message: "Fetched unread messages",
                status: StatusCode.OK,
                result: unreads
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async markAllAsRead(userId: string) {
        try {
            await this.repo.markAsRead(userId);
            return {
                message: "All notifications marked as read",
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getAllNotification(userId: string, page: number, limit: number, isRead: boolean = true) {
        try {
            const offset = (page - 1) * limit;
            const result = await this.repo.getAllNotification(userId, offset, limit, isRead)
            return {
                message: "Fetched notifications",
                status: StatusCode.OK,
                notifications: result.notifications,
                total: result.total,
                page: page,
                pages: Math.ceil(result.total / limit)
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}