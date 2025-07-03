import { ICoupon } from "../../shared/types/ICoupon";
import { CouponPaginationType, CouponReturnType } from "../../shared/types/ReturnType";

export interface ICouponService {
    createCoupon(data: ICoupon): Promise<CouponReturnType>;
    getCouponInfo(couponCode: string): Promise<CouponReturnType>;
    getCoupons(name: string, page: number, limit: number): Promise<CouponPaginationType>;
    updateCoupon(id: string, coupon: ICoupon): Promise<CouponReturnType>;
    deleteCoupon(id: string): Promise<CouponReturnType>;
    
}