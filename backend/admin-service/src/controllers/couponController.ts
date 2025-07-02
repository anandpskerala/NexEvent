import { Request, Response } from "express";
import { ICouponService } from "../services/interfaces/ICouponService";


export class CouponController {
    constructor(private couponService: ICouponService) { }

    public createCoupon = async (req: Request, res: Response): Promise<void> => {
        const { couponCode, couponName, description, discount, startDate, endDate, minAmount, maxAmount } = req.body;
        const result = await this.couponService.createCoupon({
            couponCode,
            couponName,
            description,
            discount,
            startDate,
            endDate,
            minAmount,
            maxAmount
        })
        res.status(result.status).json({ message: result.message });
    }

    public getCoupon = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const result = await this.couponService.getCouponInfo(id);
        res.status(result.status).json({ message: result.message, coupon: result.coupon });
    }

    public getCoupons = async (req: Request, res: Response): Promise<void> => {
        const { search = "", page = 1, limit = 10 } = req.query;
        const result = await this.couponService.getCoupons(search as string, page as number, limit as number);
        res.status(result.status).json({
            message: result.message,
            total: result.total,
            page: result.page,
            pages: result.pages,
            coupons: result.coupons
        })
    }


    public updateCoupon = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const { couponCode, couponName, description, discount, startDate, endDate, minAmount, maxAmount, status } = req.body;
        const result = await this.couponService.updateCoupon(id ,{
            couponCode,
            couponName,
            description,
            discount,
            startDate,
            endDate,
            minAmount,
            maxAmount,
            status
        });
        res.status(result.status).json({ message: result.message });
    }

    public deleteCoupon = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const result = await this.couponService.deleteCoupon(id);
        res.status(result.status).json({ message: result.message });
    }
}