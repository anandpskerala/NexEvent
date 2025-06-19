import { ICoupon } from "../../shared/types/ICoupon";

export interface ICouponRepository {
    findByName(name: string): Promise<ICoupon | undefined>;
    findByCode(couponCode: string): Promise<ICoupon | undefined>;
    findAll(name?: string, page?: number, limit?: number): Promise<{ items: ICoupon[], total: number }>;
    findByID(id: string): Promise<ICoupon | undefined>;
    create(item: Partial<ICoupon>): Promise<ICoupon>;
    update(id: string, item: Partial<ICoupon>): Promise<void>;
    delete(id: string): Promise<void>;
    updateExpired(): Promise<void>;
}