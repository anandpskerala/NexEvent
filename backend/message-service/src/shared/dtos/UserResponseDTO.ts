import { IUser } from "../types/IUser";

export interface UserResponseDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
    unreadCount: number;
}

export const toUserDto = (entity: IUser): UserResponseDTO => {
    return {
        id: entity.id as string,
        firstName: entity.firstName,
        lastName: entity.lastName,
        email: entity.email,
        image: entity.image,
        unreadCount: entity.unreadCount as number
    }
}