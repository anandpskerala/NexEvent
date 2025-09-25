import { StatusCode } from "../../shared/constants/statusCode";
import { ICoupon } from "../../shared/types/ICoupon";
import { ICouponRepository } from "../../repositories/interfaces/ICouponRepository";
import { CouponPaginationType, CouponReturnType } from "../../shared/types/ReturnType";
import { ICouponService } from "../interfaces/ICouponService";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { inject, injectable } from "tsyringe";
import { toCouponDTO } from "../../shared/dtos/CouponDTO";

@injectable()
export class CouponService implements ICouponService {
    constructor(@inject("ICouponRepository") private _repo: ICouponRepository) { }

    public async createCoupon(data: ICoupon): Promise<CouponReturnType> {
        const exists = await this._repo.findByName(data.couponName);
        if (exists) {
            return {
                message: HttpResponse.COUPON_ALREADY_EXISTS,
                status: StatusCode.BAD_REQUEST
            }
        }
        const coupon = await this._repo.create(data);
        return {
            message: HttpResponse.COUPON_CREATED,
            status: StatusCode.CREATED,
            coupon: toCouponDTO(coupon)
        }
    }

    public async getCouponInfo(couponCode: string): Promise<CouponReturnType> {
        const coupon = await this._repo.findByCode(couponCode);
        if (!coupon) {
            return {
                message: HttpResponse.COUPON_DOESNT_EXISTS,
                status: StatusCode.NOT_FOUND
            }
        }

        return {
            message: HttpResponse.COUPON_FETCHED,
            status: StatusCode.OK,
            coupon: toCouponDTO(coupon)
        }
    }

    public async getCoupons(name: string, page: number, limit: number): Promise<CouponPaginationType> {
        const result = await this._repo.findAll(name, page, limit);
        return {
            message: HttpResponse.COUPON_FETCHED,
            status: StatusCode.OK,
            total: result.total,
            page,
            pages: Math.ceil(result.total / limit),
            coupons: result.items.map(item => toCouponDTO(item))
        }
    }

    public async updateCoupon(id: string, coupon: ICoupon): Promise<CouponReturnType> {
        const existing = await this._repo.findByID(id as string);
        if (!existing) {
            return {
                message: HttpResponse.COUPON_DOESNT_EXISTS,
                status: StatusCode.NOT_FOUND
            }
        }

        await this._repo.update(existing.id as string, coupon);
        return {
            message: HttpResponse.COUPON_UPDATED,
            status: StatusCode.OK
        }

    }


    public async deleteCoupon(id: string): Promise<CouponReturnType> {
        const existing = await this._repo.findByID(id);
        if (!existing) {
            return {
                message: HttpResponse.COUPON_DOESNT_EXISTS,
                status: StatusCode.NOT_FOUND
            }
        }

        await this._repo.delete(id);
        return {
            message: HttpResponse.COUPON_DELETED,
            status: StatusCode.OK
        }
    }
}