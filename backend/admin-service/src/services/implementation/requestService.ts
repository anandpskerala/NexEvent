import { inject, injectable } from "tsyringe";
import { TOPICS } from "../../kafka/topics";
import { IRequestRepository } from "../../repositories/interfaces/IRequestRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { INotification } from "../../shared/types/INotification";
import { IRequests } from "../../shared/types/IRequests";
import { RequestPaginationType, RequestReturnType } from "../../shared/types/ReturnType";
import { fetchUsers } from "../../shared/utils/getUsers";
import { IKafkaProducer } from "../../kafka/producer/IKafkaProducer";
import { toRequestDTO } from "../../shared/dtos/RequestDTO";


@injectable()
export class RequestService {
    constructor(
        @inject("IRequestRepository") private _repo: IRequestRepository,
        @inject("IKafkaProducer") private _producer: IKafkaProducer
    ) {
    }

    public async createRequest(data: IRequests): Promise<RequestReturnType> {
        const request = await this._repo.createRequest(data);
        return {
            message: HttpResponse.REQUEST_CREATED,
            status: StatusCode.CREATED,
            request: toRequestDTO(request)
        }
    }

    public async getRequest(id: string): Promise<RequestReturnType> {
        const request = await this._repo.getRequest(id);
        return {
            message: HttpResponse.REQUEST_FETCHED,
            status: StatusCode.OK,
            request: request ? toRequestDTO(request) : request
        }
    }

    public async getAllRequest(page: number, limit: number): Promise<RequestPaginationType> {
        const skip = (page - 1) * limit;
        const result = await this._repo.getRequests(skip, limit);
        const userIds = result.items.map((item: IRequests) => item.userId);

        const userMap = await fetchUsers(userIds);

        const enrichedRequests = result.items.map((item: IRequests) => {
            const user = userMap[item.userId.toString()];
            return {
                ...toRequestDTO(item),
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

    }

    public async updateRequest(id: string, status: "pending" | "accepted" | "rejected"): Promise<RequestReturnType> {
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

    }

    public async deleteRequest(id: string): Promise<RequestReturnType> {
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
    }
}