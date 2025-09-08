import { inject, injectable } from "tsyringe";
import { TOPICS } from "../../kafka/topics";
import { IRequestRepository } from "../../repositories/interfaces/IRequestRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { INotification } from "../../shared/types/INotification";
import { IRequests } from "../../shared/types/IRequests";
import { RequestPaginationType, RequestReturnType } from "../../shared/types/ReturnType";
import { fetchUsers } from "../../shared/utils/getUsers";
import logger from "../../shared/utils/logger";
import { IKafkaProducer } from "../../kafka/producer/IKafkaProducer";


@injectable()
export class RequestService {
    constructor(
        @inject("IRequestRepository") private _repo: IRequestRepository,
        @inject("IKafkaProducer") private _producer: IKafkaProducer
    ) {
    }

    public async createRequest(data: IRequests): Promise<RequestReturnType> {
        try {
            const request = await this._repo.createRequest(data);
            return {
                message: HttpResponse.REQUEST_CREATED,
                status: StatusCode.CREATED,
                request
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getRequest(id: string): Promise<RequestReturnType> {
        try {
            const request = await this._repo.getRequest(id);
            return {
                message: HttpResponse.REQUEST_FETCHED,
                status: StatusCode.OK,
                request
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getAllRequest(page: number, limit: number): Promise<RequestPaginationType> {
        try {
            const skip = (page - 1) * limit;
            const result = await this._repo.getRequests(skip, limit);
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
                message: HttpResponse.REQUEST_FETCHED,
                status: StatusCode.OK,
                total: result.total,
                page,
                pages: Math.ceil(result.total / limit),
                requests: enrichedRequests
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateRequest(id: string, status: "pending" | "accepted" | "rejected"): Promise<RequestReturnType> {
        try {
            const request = await this._repo.updateRequest(id, { status });
            if (request) {
                this._producer.sendData<INotification>(TOPICS.NEW_NOTIFICATION, {
                    userId: request.userId,
                    title: "Feature request update",
                    type: "request",
                    message: `Your feature request has been ${status}`
                })
            }
            return {
                message: HttpResponse.STATUS_UPDATED,
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

    public async deleteRequest(id: string): Promise<RequestReturnType> {
        try {
            if (!id) {
                return {
                    message: HttpResponse.ID_MISSING,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const res = await this._repo.deleteRequest(id);
            if (!res) {
                return {
                    message: HttpResponse.REQUEST_DELETION_FAILED,
                    status: StatusCode.BAD_REQUEST
                }
            }

            return {
                message: HttpResponse.REQUEST_DELETED,
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
}