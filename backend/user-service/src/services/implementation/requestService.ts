import { StatusCode } from "../../shared/constants/statusCode";
import { IRequest } from "../../shared/types/IRequest";
import { UserReturnType, RequestPaginationType, RequestReturnType } from "../../shared/types/ReturnType";
import logger from "../../shared/utils/logger";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { IRequestRepository } from "../../repositories/interfaces/IRequestRepository";
import { IRequestService } from "../interfaces/IRequestService";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { toUserDTO } from "../../shared/mappers/userMapper";
import { toRequestDTO, toRequestsDTO } from "../../shared/mappers/requestMapper";
import { inject, injectable } from "tsyringe";
import { ICloudinaryService } from "../interfaces/ICloudinaryService";

@injectable()
export class RequestService implements IRequestService {
    constructor(
        @inject("IRequestRepository") private _requestRepo: IRequestRepository, 
        @inject("IUserRepository") private _userRepo: IUserRepository,
        @inject("ICloudinaryService") private _cloudinary: ICloudinaryService
    ) {}

    public async createRequest(data: Partial<IRequest>): Promise<RequestReturnType> {
        try {
            if (!data.userId) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.USER_NOT_FOUND
                }
            }

            if (!data.organization || data.organization.trim() === "" || !data.reason || data.reason.trim() === "" || !data.documents || data.documents.trim() === "") {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.MISSING_FIELDS
                }
            }

            const existing = await this._requestRepo.findByUserID(data.userId.toString());
            if (existing) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.ALREADY_REQUESTED
                }
            }

            await this._requestRepo.create(data);
            return {
                status: StatusCode.CREATED,
                message: HttpResponse.REQUEST_SENT
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async getRequest(userId: string): Promise<RequestReturnType> {
        try {
            if (!userId || userId.trim() === "") {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.INVALID_USER_ID
                }
            }

            const request = await this._requestRepo.findByUserID(userId);
            return {
                status: StatusCode.OK,
                message: HttpResponse.REQUEST_FETCHED,
                request: request ? toRequestDTO(request) : undefined
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async deleteRequest(reqId: string): Promise<RequestReturnType> {
        try {
            if (!reqId || reqId.trim() === "") {
                return {
                    message: HttpResponse.REQUEST_ID_INVALID,
                    status: StatusCode.BAD_REQUEST
                };
            }

            const request = await this._requestRepo.findByID(reqId);
            if (!request) {
                return {
                    message: HttpResponse.REQUEST_DOESNT_EXISTS,
                    status: StatusCode.NOT_FOUND
                }
            }

            if (request.documents) {
                this._cloudinary.deleteImage(request.documents);
            }

            await this._requestRepo.delete(request.id as string);
            return {
                message: HttpResponse.REAPPLY,
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

    public async getAllRequests(page: number, limit: number): Promise<RequestPaginationType> {
        try {
            const skip = (page - 1) * limit;
            const total = await this._requestRepo.countDocs();
            const requests = await this._requestRepo.getRequests(skip, limit);
            return {
                message: HttpResponse.REQUEST_FETCHED,
                status: StatusCode.OK,
                requests: toRequestsDTO(requests),
                total,
                page,
                pages: Math.ceil(total / limit),
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateRequest(userId: string, action: string, rejectionReason?: string): Promise<UserReturnType> {
        try {
            if (!userId || userId.trim() === "" || !action || action.trim() === "") {
                return {
                    message: HttpResponse.MISSING_FIELDS,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const request = await this._requestRepo.findByUserID(userId);
            if (!request) {
                return {
                    message: HttpResponse.REQUEST_DOESNT_EXISTS,
                    status: StatusCode.NOT_FOUND
                }
            }
            await this._requestRepo.updateRequest(userId, action, rejectionReason);
            if (action === "accepted") {
                await this._userRepo.addRole(userId, "organizer");
                await this._userRepo.update(userId, {organizerId: request.id});
            }
            const user = await this._userRepo.findByID(userId);

            return {
                message: `Request ${action}`,
                status: StatusCode.OK,
                user: user? toUserDTO(user): undefined
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