import { Types } from "mongoose";
import { StatusCode } from "../../shared/constants/statusCode";
import { CloudinaryService } from "../../shared/utils/cloudinary";
import { IRequest } from "../../shared/types/IRequest";
import { UserReturnType, RequestPaginationType, RequestReturnType } from "../../shared/types/ReturnType";
import logger from "../../shared/utils/logger";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { IRequestRepository } from "../../repositories/interfaces/IRequestRepository";
import { IRequestService } from "../interfaces/IRequestService";
import { HttpResponse } from "../../shared/constants/httpResponse";

export class RequestService implements IRequestService {
    private cloudinary: CloudinaryService;

    constructor(private requestRepo: IRequestRepository, private userRepo: IUserRepository) {
        this.cloudinary = new CloudinaryService();
    }

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

            const existing = await this.requestRepo.findByUserID(data.userId.toString());
            if (existing) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.ALREADY_REQUESTED
                }
            }

            await this.requestRepo.create(data);
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

            const request = await this.requestRepo.findByUserID(userId);
            return {
                status: StatusCode.OK,
                message: HttpResponse.REQUEST_FETCHED,
                request: request ? request : undefined
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

            const request = await this.requestRepo.findByID(reqId);
            if (!request) {
                return {
                    message: HttpResponse.REQUEST_DOESNT_EXISTS,
                    status: StatusCode.NOT_FOUND
                }
            }

            if (request.documents) {
                this.cloudinary.deleteImage(request.documents);
            }

            await this.requestRepo.delete(request.id as string);
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
            const total = await this.requestRepo.countDocs();
            const requests = await this.requestRepo.getRequests(skip, limit);
            return {
                message: HttpResponse.REQUEST_FETCHED,
                status: StatusCode.OK,
                requests: requests,
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

            const request = await this.requestRepo.findByUserID(userId);
            if (!request) {
                return {
                    message: HttpResponse.REQUEST_DOESNT_EXISTS,
                    status: StatusCode.NOT_FOUND
                }
            }
            await this.requestRepo.updateRequest(userId, action, rejectionReason);
            if (action === "accepted") {
                await this.userRepo.addRole(userId, "organizer");
                await this.userRepo.update(userId, {organizer: new Types.ObjectId(request.id)});
            }
            const user = await this.userRepo.findByID(userId);

            return {
                message: `Request ${action}`,
                status: StatusCode.OK,
                user: user? user: undefined
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