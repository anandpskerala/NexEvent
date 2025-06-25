import { NotificationRepository } from "../repositories/NotificationRepository";
import { StatusCode } from "../shared/constants/statusCode";

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
            console.log(error);
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
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}