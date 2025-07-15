import { IUser } from "../types/IUser";
import { UserDTO } from "../dtos/userDTO";
import { toOrganizerDTO } from "./organizerMapper";
import { IRequest } from "../types/IRequest";

export const toUserDTO = (user: IUser): UserDTO => ({
  id: user.id ? user.id : '',
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phoneNumber: user.phoneNumber ? user.phoneNumber.toString() : undefined,
  image: user.image,
  authProvider: user.authProvider,
  roles: user.roles,
  isBlocked: user.isBlocked,
  isVerified: user.isVerified,
  organizer: user.organizer ? toOrganizerDTO(user.organizer as IRequest) : null,
  createdAt: user.createdAt ? user.createdAt : '',
});

export const toUsersDTO = (users: IUser[]): UserDTO[] => users.map(toUserDTO);
