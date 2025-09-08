import { PrismaClient, RequestStatus } from "@prisma/client";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { IRequest } from "../../shared/types/IRequest";
import { injectable } from "tsyringe";

const prisma = new PrismaClient();

@injectable()
export class RequestRepository implements IRequestRepository {
    async findByUserID(userId: string): Promise<IRequest | undefined> {
        const doc = await prisma.organizerRequest.findFirst({
            where: { userId },
            include: { user: true },
        });

        return doc ?? undefined;
    }

    async create(item: Partial<IRequest>): Promise<IRequest> {
        const doc = await prisma.organizerRequest.create({
            data: {
                userId: item.userId!,
                organization: item.organization!,
                website: item.website!,
                reason: item.reason!,
                documents: item.documents!,
                status: item.status!,
                rejectionReason: item.rejectionReason,
            },
        });

        return doc;
    }

    async countDocs(): Promise<number> {
        return prisma.organizerRequest.count();
    }

    async getRequests(skip: number, limit: number): Promise<IRequest[]> {
        return prisma.organizerRequest.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { user: true },
        });
    }

    async updateRequest(userId: string, action: RequestStatus, rejectionReason?: string): Promise<void> {
        await prisma.organizerRequest.updateMany({
            where: { userId },
            data: {
                status: action,
                rejectionReason,
            },
        });
    }

    async update(id: string, item: Partial<IRequest>): Promise<void> {
        await prisma.organizerRequest.update({
            where: { id },
            data: {
                ...(item.organization && { organization: item.organization }),
                ...(item.website && { website: item.website }),
                ...(item.reason && { reason: item.reason }),
                ...(item.documents && { documents: item.documents }),
                ...(item.status && { status: item.status }),
                ...(item.rejectionReason !== undefined && { rejectionReason: item.rejectionReason }),
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.organizerRequest.delete({ where: { id } });
    }

    async findByID(id: string): Promise<IRequest | undefined> {
        const doc = await prisma.organizerRequest.findUnique({
            where: { id },
            include: { user: true },
        });

        return doc ?? undefined;
    }
}
