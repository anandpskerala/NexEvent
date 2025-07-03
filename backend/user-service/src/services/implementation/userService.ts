import { CloudinaryService } from "../../shared/utils/cloudinary";
import { StatusCode } from "../../shared/constants/statusCode";
import { UserRepository } from "../../repositories/implementation/UserRepository";
import { UserPaginationType, UserReturnType, UsersReturnType } from "../../shared/types/ReturnType";
import logger from "../../shared/utils/logger";
import { IUserService } from "../interfaces/IUserService";
import { HttpResponse } from "../../shared/constants/httpResponse";

export class UserService implements IUserService {
    private cloudinary: CloudinaryService;

    constructor(private userRepo: UserRepository) {
        this.cloudinary = new CloudinaryService();
    }

    public async getAllUsers(search: string, page: number, limit: number, role?: string, status?: string, myID?: string): Promise<UserPaginationType> {
        try {
            const result = await this.userRepo.getAllUsers(search, page, limit, role, status, myID);
            return {
                message: HttpResponse.USER_FETCHED,
                status: StatusCode.OK,
                total: result.total,
                users: result.users,
                page,
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

    public async getUserDetails(userId: string): Promise<UserReturnType> {
        try {
            if (!userId || userId.trim() == "") {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.INVALID_USER_ID
                }
            }

            const user = await this.userRepo.findByID(userId);
            if (!user) {
                return {
                    status: StatusCode.NOT_FOUND,
                    message: HttpResponse.USER_NOT_FOUND
                }
            }
            return {
                status: StatusCode.OK,
                message: HttpResponse.USER_FETCHED,
                user: user
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async verifyUser(userId: string): Promise<UserReturnType> {
        try {
            if (!userId) {
                return {
                    message: HttpResponse.INVALID_USER_ID,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const user = await this.userRepo.findByID(userId);
            if (!user) {
                return {
                    message: HttpResponse.USER_NOT_FOUND,
                    status: StatusCode.NOT_FOUND
                }
            }

            return {
                message: "",
                status: StatusCode.OK,
                user
            }
        } catch (error) {
            logger.error(error)
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateProfile(email: string, firstName: string, lastName: string, phoneNumber: number): Promise<UserReturnType> {
        try {
            if (!firstName || firstName.trim() === "" || !email || email.trim() === "" || !lastName || !phoneNumber) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.MISSING_FIELDS
                }
            }

            let user = await this.userRepo.findByEmail(email);
            if (!user) {
                return {
                    status: StatusCode.NOT_FOUND,
                    message: HttpResponse.USER_NOT_FOUND
                }
            }

            this.userRepo.update(user.id as string, {email, firstName, lastName, phoneNumber});
            user = await this.userRepo.findByEmail(email);

            return {
                status: StatusCode.OK,
                message: HttpResponse.PROFILE_UPDATED,
                user: user ? user : undefined
            }
        } catch (error) {
            logger.error(error)
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateProfileImage(userId: string, image: string): Promise<UserReturnType> {
        try {
            if (!image || image.trim() === "") {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: HttpResponse.MISSING_FIELDS
                };
            }

            let user = await this.userRepo.findByID(userId);
            if (!user) {
                return {
                    status: StatusCode.NOT_FOUND,
                    message: HttpResponse.USER_NOT_FOUND
                }
            }

            if (user.image) {
                await this.cloudinary.deleteImage(user.image);
            }

            await this.userRepo.updateProfileImage(userId, image)
            user = { ...user, image: image };
            return {
                status: StatusCode.OK,
                message: HttpResponse.PROFILE_IMG_UPDATED,
                user
            }
        } catch (error) {
            logger.error(error)
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateUser(email: string, firstName: string, lastName: string, phoneNumber: number, roles: string[], isBlocked: boolean): Promise<UserReturnType> {
        try {
            await this.userRepo.updateUser(email, firstName, lastName, phoneNumber, roles, isBlocked)
            const user = await this.userRepo.findByEmail(email);
            return {
                message: HttpResponse.USER_UPDATED,
                status: StatusCode.OK,
                user: user ? user : undefined
            }
        } catch (error) {
            logger.error(error)
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async deleteUser(id: string): Promise<UserReturnType> {
        try {
            const user = await this.userRepo.findByID(id);
            if (!user) {
                return {
                    message: HttpResponse.USER_NOT_FOUND,
                    status: StatusCode.NOT_FOUND
                }
            }
            await this.userRepo.delete(id);
            return {
                message: HttpResponse.USER_DELETED,
                status: StatusCode.OK,
                user
            }
        } catch (error) {
            logger.error(error)
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getUsersBulk(ids: string[]): Promise<UsersReturnType> {
        try {
            if (!Array.isArray(ids) || ids.length === 0) {
                return {
                    message: HttpResponse.NEED_NONEMPTY_ARRAY,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const users = await this.userRepo.getBulkUsers(ids);
            return {
                message: HttpResponse.USER_FETCHED,
                status: StatusCode.OK,
                users
            }
        } catch (error) {
            logger.error(error)
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

}