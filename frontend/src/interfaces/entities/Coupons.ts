export interface ICoupon {
    id: string;
    couponCode: string;
    couponName: string;
    description: string;
    discount: number;
    startDate: string;
    endDate: string;
    status: string;
    minAmount: number;
    maxAmount: number;
    createdAt: string;
    updatedAt: string;
}