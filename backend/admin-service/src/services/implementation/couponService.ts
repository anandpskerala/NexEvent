import { StatusCode } from "../../shared/constants/statusCode";
import { ICoupon } from "../../shared/types/ICoupon";
import logger from "../../shared/utils/logger";
import { ICouponRepository } from "../../repositories/interfaces/ICouponRepository";
import { CouponPaginationType, CouponReturnType } from "../../shared/types/returnTypes";
import { ICouponService } from "../interfaces/ICouponService";
import { HttpResponse } from "../../shared/constants/httpResponse";

export class CouponService implements ICouponService {
    constructor(private repo: ICouponRepository) { }

    public async createCoupon(data: ICoupon): Promise<CouponReturnType> {
        try {
            const exists = await this.repo.findByName(data.couponName);
            if (exists) {
                return {
                    message: HttpResponse.COUPON_ALREADY_EXISTS,
                    status: StatusCode.BAD_REQUEST
                }
            }
            const coupon = await this.repo.create(data);
            return {
                message: HttpResponse.COUPON_CREATED,
                status: StatusCode.CREATED,
                coupon
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getCouponInfo(couponCode: string): Promise<CouponReturnType> {
        try {
            const coupon = await this.repo.findByCode(couponCode);
            if (!coupon) {
                return {
                    message: HttpResponse.COUPON_DOESNT_EXISTS,
                    status: StatusCode.NOT_FOUND
                }
            }

            return {
                message: HttpResponse.COUPON_FETCHED,
                status: StatusCode.OK,
                coupon
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getCoupons(name: string, page: number, limit: number): Promise<CouponPaginationType> {
        try {
            const result = await this.repo.findAll(name, page, limit);
            return {
                message: HttpResponse.COUPON_FETCHED,
                status: StatusCode.OK,
                total: result.total,
                page,
                pages: Math.ceil(result.total / limit),
                coupons: result.items
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateCoupon(id: string, coupon: ICoupon): Promise<CouponReturnType> {
        try {
            const existing = await this.repo.findByID(id as string);
            if (!existing) {
                return {
                    message: HttpResponse.COUPON_DOESNT_EXISTS,
                    status: StatusCode.NOT_FOUND
                }
            }

            await this.repo.update(existing.id as string, coupon);
            return {
                message: HttpResponse.COUPON_UPDATED,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async deleteCoupon(id: string): Promise<CouponReturnType> {
            try {
                const existing = await this.repo.findByID(id);
                if (!existing) {
                    return {
                        message: HttpResponse.COUPON_DOESNT_EXISTS,
                        status: StatusCode.NOT_FOUND
                    }
                }
    
                await this.repo.delete(id);
                return {
                    message: HttpResponse.COUPON_DELETED,
                    status: StatusCode.OK
                }
            } catch (error) {
                logger.error(error);
                return {
                    message: HttpResponse.INTERNAL_SERVER_ERROR,
                    status: StatusCode.INTERNAL_SERVER_ERROR
                }
            }
        }
}