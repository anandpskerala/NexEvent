import { StatusCode } from "../shared/constants/statusCode";
import { CouponRepository } from "../repositories/CouponRepository";
import { ICoupon } from "../shared/types/ICoupon";
import logger from "../shared/utils/logger";

export class CouponService {
    constructor(private repo: CouponRepository) { }

    public async createCoupon(data: ICoupon) {
        try {
            const exists = await this.repo.findByName(data.couponName);
            if (exists) {
                return {
                    message: "Already a coupon exists with same name",
                    status: StatusCode.BAD_REQUEST
                }
            }
            const coupon = await this.repo.create(data);
            return {
                message: "Coupon created",
                status: StatusCode.CREATED,
                coupon
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getCouponInfo(couponCode: string) {
        try {
            const coupon = await this.repo.findByCode(couponCode);
            if (!coupon) {
                return {
                    message: "Coupon doesn't exists",
                    status: StatusCode.NOT_FOUND
                }
            }

            return {
                message: "Coupon fetched",
                status: StatusCode.OK,
                coupon
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getCoupons(name: string, page: number, limit: number) {
        try {
            const result = await this.repo.findAll(name, page, limit);
            return {
                message: "Fetched the coupons",
                status: StatusCode.OK,
                total: result.total,
                page,
                pages: Math.ceil(result.total / limit),
                coupons: result.items
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateCoupon(id: string, coupon: ICoupon) {
        try {
            const existing = await this.repo.findByID(id as string);
            if (!existing) {
                return {
                    message: "Coupon doesn't exists",
                    status: StatusCode.NOT_FOUND
                }
            }

            await this.repo.update(existing.id as string, coupon);
            return {
                message: "Coupon updated",
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async deleteCoupon(id: string) {
            try {
                const existing = await this.repo.findByID(id);
                if (!existing) {
                    return {
                        message: "Coupon doesn't exists",
                        status: StatusCode.NOT_FOUND
                    }
                }
    
                await this.repo.delete(id);
                return {
                    message: "Coupon deleted",
                    status: StatusCode.OK
                }
            } catch (error) {
                logger.error(error);
                return {
                    message: "Internal server error",
                    status: StatusCode.INTERNAL_SERVER_ERROR
                }
            }
        }
}