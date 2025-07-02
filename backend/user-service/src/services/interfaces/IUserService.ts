import { UserPaginationType, UserReturnType, UsersReturnType } from "../../shared/types/ReturnTypes";

export interface IUserService {
    getAllUsers(search: string, page: number, limit: number, role?: string, status?: string, myID?: string): Promise<UserPaginationType>;
    getUserDetails(userId: string): Promise<UserReturnType>;
    verifyUser(userId: string): Promise<UserReturnType>;
    updateProfile(email: string, firstName: string, lastName: string, phoneNumber: number): Promise<UserReturnType>;
    updateProfileImage(userId: string, image: string): Promise<UserReturnType>;
    updateUser(email: string, firstName: string, lastName: string, phoneNumber: number, roles: string[], isBlocked: boolean): Promise<UserReturnType>;
    deleteUser(id: string): Promise<UserReturnType>;
    getUsersBulk(ids: string[]): Promise<UsersReturnType>;
}