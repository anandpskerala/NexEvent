export interface ICoupon {
    id?: string;
    couponCode: string;
    couponName: string;
    description: string;
    discount: number;
    startDate: Date;
    endDate: Date;
    status?: string;
    minAmount: number;
    maxAmount: number;
}