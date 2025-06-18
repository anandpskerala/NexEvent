import { RequestRepository } from "../repositories/RequestRepository";
import { StatusCode } from "../shared/constants/statusCode";
import { IRequests } from "../shared/types/IRequests";
import { fetchUsers } from "../shared/utils/getUsers";

export class RequestService {
    constructor(private repo: RequestRepository) { }

    public async createRequest(data: IRequests) {
        try {
            const request = await this.repo.createRequest(data);
            return {
                message: "Request created",
                status: StatusCode.CREATED,
                request
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getRequest(id: string) {
        try {
            const request = await this.repo.getRequest(id);
            return {
                message: "Request fetched",
                status: StatusCode.OK,
                request
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getAllRequest(page: number, limit: number) {
        try {
            const skip = (page - 1) * limit;
            const result = await this.repo.getRequests(skip, limit);
            const userIds = result.items.map((item: IRequests) => item.userId);

            const userMap = await fetchUsers(userIds);

            const enrichedRequests = result.items.map((item: IRequests) => {
                const user = userMap[item.userId.toString()];
                return {
                    ...item,
                    user,
                };
            });
            return {
                message: "Request fetched",
                status: StatusCode.OK,
                total: result.total,
                page,
                pages: Math.ceil(result.total / limit),
                requests: enrichedRequests
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateRequest(id: string, status: "pending" | "accepted" | "rejected") {
        try {
            await this.repo.updateRequest(id, { status });
            return {
                message: "Status Updated",
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

    public async deleteRequest(id: string) {
        try {
            if (!id) {
                return {
                    message: "ID is required",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const res = await this.repo.deleteRequest(id);
            if (!res) {
                return {
                    message: "Failed to delete the request",
                    status: StatusCode.BAD_REQUEST
                }
            }

            return {
                message: "Request deleted",
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