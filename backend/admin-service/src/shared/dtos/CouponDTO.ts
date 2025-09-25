import { ICoupon } from "../types/ICoupon";

export interface CouponDTO {
    id: string;
    couponCode: string;
    couponName: string;
    description: string;
    discount: number;
    startDate: Date;
    endDate: Date;
    status: string;
    minAmount: number;
    maxAmount: number;
    createdAt: string;
    updatedAt: string;
}

export const toCouponDTO = (entity: ICoupon): CouponDTO => {
    return {
        id: entity.id as string,
        couponCode: entity.couponCode,
        couponName: entity.couponName,
        description: entity.description,
        discount: entity.discount,
        startDate: entity.startDate,
        endDate: entity.endDate,
        status: entity.status as string,
        minAmount: entity.minAmount,
        maxAmount: entity.maxAmount,
        createdAt: entity.createdAt as string,
        updatedAt: entity.updatedAt as string
    };
}