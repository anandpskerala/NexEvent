import { IRequest } from "../types/IRequest";
import { RequestDTO } from "../dtos/requestDTO";
import { toUserDTO } from "./userMapper";

export function toRequestDTO(request: IRequest): RequestDTO {
  return {
    id: request.id,
    user: toUserDTO(request.user!),
    organization: request.organization,
    website: request.website ?? null,
    reason: request.reason,
    documents: request.documents,
    status: request.status,
    rejectionReason: request.rejectionReason ?? null,
    createdAt: request.createdAt?.toString() ?? new Date().toISOString(),
    updatedAt: request.updatedAt?.toString() ?? new Date().toISOString(),
  };
};


export const toRequestsDTO = (users: IRequest[]): RequestDTO[] => users.map(toRequestDTO);
