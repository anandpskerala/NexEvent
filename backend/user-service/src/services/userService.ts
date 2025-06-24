import { CloudinaryService } from "../shared/utils/cloudinary";
import { StatusCode } from "../shared/constants/statusCode";
import { UserRepository } from "../repositories/UserRepository";
import { UserPaginationType, UserReturnType } from "../shared/types/ReturnTypes";

export class UserService {
    private cloudinary: CloudinaryService;

    constructor(private userRepo: UserRepository) {
        this.cloudinary = new CloudinaryService();
    }

    public async getAllUsers(search: string, page: number, limit: number, role?: string, status?: string, myID?: string): Promise<UserPaginationType> {
        try {
            const result = await this.userRepo.getAllUsers(search, page, limit, role, status, myID);
            return {
                message: "Fetched users",
                status: StatusCode.OK,
                total: result.total,
                users: result.users,
                page,
                pages: Math.ceil(result.total / limit)
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getUserDetails(userId: string): Promise<UserReturnType> {
        try {
            if (!userId || userId.trim() == "") {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "Invalid user id found"
                }
            }

            const user = await this.userRepo.findByID(userId);
            if (!user) {
                return {
                    status: StatusCode.NOT_FOUND,
                    message: "User not found"
                }
            }
            return {
                status: StatusCode.OK,
                message: "Fetched user details",
                user: user
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async verifyUser(userId: string): Promise<UserReturnType> {
        try {
            if (!userId) {
                return {
                    message: "User ID is missing",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const user = await this.userRepo.findByID(userId);
            if (!user) {
                return {
                    message: "User not found",
                    status: StatusCode.NOT_FOUND
                }
            }

            return {
                message: "",
                status: StatusCode.OK,
                user
            }
        } catch (error) {
            console.error(error)
            return {
                message: "Internal Server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateProfile(email: string, firstName: string, lastName: string, phoneNumber: number): Promise<UserReturnType> {
        try {
            if (!firstName || firstName.trim() === "" || !email || email.trim() === "" || !lastName || !phoneNumber) {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "All fields are required"
                }
            }

            let user = await this.userRepo.findByEmail(email);
            if (!user) {
                return {
                    status: StatusCode.NOT_FOUND,
                    message: "User not found"
                }
            }

            this.userRepo.update(user.id as string, {email, firstName, lastName, phoneNumber});
            user = await this.userRepo.findByEmail(email);

            return {
                status: StatusCode.OK,
                message: "Profile updated",
                user: user ? user : undefined
            }
        } catch (error) {
            console.error(error)
            return {
                message: "Internal Server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateProfileImage(userId: string, image: string): Promise<UserReturnType> {
        try {
            if (!image || image.trim() === "") {
                return {
                    status: StatusCode.BAD_REQUEST,
                    message: "All fields are required"
                };
            }

            let user = await this.userRepo.findByID(userId);
            if (!user) {
                return {
                    status: StatusCode.NOT_FOUND,
                    message: "User not found"
                }
            }

            if (user.image) {
                await this.cloudinary.deleteImage(user.image);
            }

            await this.userRepo.updateProfileImage(userId, image)
            user = { ...user, image: image };
            return {
                status: StatusCode.OK,
                message: "Profile image updated",
                user
            }
        } catch (error) {
            console.error(error)
            return {
                message: "Internal Server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateUser(email: string, firstName: string, lastName: string, phoneNumber: number, roles: string[], isBlocked: boolean): Promise<UserReturnType> {
        try {
            await this.userRepo.updateUser(email, firstName, lastName, phoneNumber, roles, isBlocked)
            const user = await this.userRepo.findByEmail(email);
            return {
                message: "User Updated",
                status: StatusCode.OK,
                user: user ? user : undefined
            }
        } catch (error) {
            console.error(error)
            return {
                message: "Internal Server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async deleteUser(id: string): Promise<UserReturnType> {
        try {
            const user = await this.userRepo.findByID(id);
            if (!user) {
                return {
                    message: "User not found",
                    status: StatusCode.NOT_FOUND
                }
            }
            await this.userRepo.delete(id);
            return {
                message: "User deleted",
                status: StatusCode.OK,
                user
            }
        } catch (error) {
            console.error(error)
            return {
                message: "Internal Server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getUsersBulk(ids: string[]) {
        try {
            if (!Array.isArray(ids) || ids.length === 0) {
                return {
                    message: "ids must be a non-empty array",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const users = await this.userRepo.getBulkUsers(ids);
            return {
                message: "Fetched users",
                status: StatusCode.OK,
                users
            }
        } catch (error) {
            console.error(error)
            return {
                message: "Internal Server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

}