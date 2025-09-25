import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { UnreadPaginationType, UnreadReturnType } from "../../shared/types/ReturnType";
import logger from "../../shared/utils/logger";
import { INotificationService } from "../interfaces/INotificationService";
import { toNotificationDTO } from "../../shared/dtos/NotificationDTO";

@injectable()
export class NotificationService implements INotificationService {
    constructor(@inject("INotificationRepository") private _repo: INotificationRepository) {}

    public async getUnreads(userId: string): Promise<UnreadReturnType> {
        try {
            if (!userId) {
                return {
                    message: HttpResponse.ID_MISSING,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const unreads = await this._repo.getUnreadByUser(userId);
            return {
                message: HttpResponse.MESSAGES_FETCHED,
                status: StatusCode.OK,
                result: unreads.map(item => toNotificationDTO(item))
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
            await this._repo.markAsRead(userId);
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
            const result = await this._repo.getAllNotification(userId, offset, limit, isRead);
            return {
                message: HttpResponse.NOTIFICATION_FETCHED,
                status: StatusCode.OK,
                notifications: result.notifications.map(item => toNotificationDTO(item)),
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