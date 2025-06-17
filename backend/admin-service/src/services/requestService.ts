import { RequestRepository } from "../repositories/RequestRepository";
import { StatusCode } from "../shared/constants/statusCode";
import { IRequests } from "../shared/types/IRequests";

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
            return {
                message: "Request fetched",
                status: StatusCode.CREATED,
                total: result.total,
                page,
                pages: Math.ceil(result.total / limit),
                requests: result.items
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