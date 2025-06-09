import { IUser } from "../../shared/types/user";

export interface IUserRepository {
    findByID(id: string): Promise<IUser | undefined>;
    findByEmail(email: string, authProvider?: string): Promise<IUser | undefined>;
    create(item: Partial<IUser>): Promise<IUser>;
    update(id: string, item: Partial<IUser>): Promise<void>;
    delete(id: string): Promise<void>;
    updateProfileImage(id: string, image: string): Promise<void>;
    updateUser(email: string, firstName: string, lastName: string, phoneNumber: number, roles?: string[], isBlocked?: boolean): Promise<void>;
    addRole(id: string, role: string): Promise<void>;
    getBulkUsers(ids: string[]): Promise<IUser[]> 
}