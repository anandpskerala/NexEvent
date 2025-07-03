import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { UnreadPaginationType, UnreadReturnType } from "../../shared/types/ReturnType";
import logger from "../../shared/utils/logger";

export class NotificationService {
    constructor(private repo: INotificationRepository) {}

    public async getUnreads(userId: string): Promise<UnreadReturnType> {
        try {
            if (!userId) {
                return {
                    message: HttpResponse.ID_MISSING,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const unreads = await this.repo.getUnreadByUser(userId);
            return {
                message: HttpResponse.MESSAGES_FETCHED,
                status: StatusCode.OK,
                result: unreads
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async markAllAsRead(userId: string): Promise<UnreadReturnType> {
        try {
            await this.repo.markAsRead(userId);
            return {
                message: HttpResponse.ALL_READ,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getAllNotification(userId: string, page: number, limit: number, isRead: boolean = true): Promise<UnreadPaginationType> {
        try {
            const offset = (page - 1) * limit;
            const result = await this.repo.getAllNotification(userId, offset, limit, isRead)
            return {
                message: HttpResponse.NOTIFICATION_FETCHED,
                status: StatusCode.OK,
                notifications: result.notifications,
                total: result.total,
                page: page,
                pages: Math.ceil(result.total / limit)
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}