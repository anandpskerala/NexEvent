import { OrganizerDTO } from "../dtos/organizerDTO";
import { IRequest } from "../types/IRequest";

export const toOrganizerDTO = (user: IRequest): OrganizerDTO => ({
  id: user.id ?? '',
  userId: user.userId ? user.userId.toString() : '',
  organization: user.organization ?? '',
  website: user.website ?? '',
  status: user.status ?? 'pending',
});