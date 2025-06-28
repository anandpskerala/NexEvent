import { Types } from "mongoose";
import { StatusCode } from "../shared/constants/statusCode";
import { CloudinaryService } from "../shared/utils/cloudinary";
import { RequestRepository } from "../repositories/RequestRepository";
import { UserRepository } from "../repositories/UserRepository";
import { IRequest } from "../shared/types/IRequest";
import { UserReturnType, RequestPaginationType, RequestReturnType } from "../shared/types/ReturnTypes";
import logger from "../shared/utils/logger";

export class RequestService {
    private cloudinary: CloudinaryService;

    constructor(private requestRepo: RequestRepository, private userRepo: UserRepository) {
        this.cloudinary = new CloudinaryService();
    }

    public async createRequest(data: Partial<IRequest>): Promise<RequestReturnType> {
        try {
            if (!data.userId) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "User not found"
                }
            }

            if (!data.organization || data.organization.trim() === "" || !data.reason || data.reason.trim() === "" || !data.documents || data.documents.trim() === "") {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "Fill all the required fields"
                }
            }

            const existing = await this.requestRepo.findByUserID(data.userId.toString());
            if (existing) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "There is already a request present for this account"
                }
            }

            await this.requestRepo.create(data);
            return {
                status: StatusCode.CREATED,
                message: "Request sent"
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async getRequest(userId: string): Promise<RequestReturnType> {
        try {
            if (!userId || userId.trim() === "") {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "User ID is missing"
                }
            }

            const request = await this.requestRepo.findByUserID(userId);
            return {
                status: StatusCode.OK,
                message: "Fetched request",
                request: request ? request : undefined
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async deleteRequest(reqId: string): Promise<RequestReturnType> {
        try {
            if (!reqId || reqId.trim() === "") {
                return {
                    message: "Request ID is missing",
                    status: StatusCode.BAD_REQUEST
                };
            }

            const request = await this.requestRepo.findByID(reqId);
            if (!request) {
                return {
                    message: "Request doesn't exists",
                    status: StatusCode.NOT_FOUND
                }
            }

            if (request.documents) {
                this.cloudinary.deleteImage(request.documents);
            }

            await this.requestRepo.delete(request.id as string);
            return {
                message: "You can re-apply now",
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

    public async getAllRequests(page: number, limit: number): Promise<RequestPaginationType> {
        try {
            const skip = (page - 1) * limit;
            const total = await this.requestRepo.countDocs();
            const requests = await this.requestRepo.getRequests(skip, limit);
            return {
                message: "Request fetched",
                status: StatusCode.OK,
                requests: requests,
                total,
                page,
                pages: Math.ceil(total / limit),
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateRequest(userId: string, action: string, rejectionReason?: string): Promise<UserReturnType> {
        try {
            if (!userId || userId.trim() === "" || !action || action.trim() === "") {
                return {
                    message: "Fill all the required fields",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const request = await this.requestRepo.findByUserID(userId);
            if (!request) {
                return {
                    message: "Request Not found",
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
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}