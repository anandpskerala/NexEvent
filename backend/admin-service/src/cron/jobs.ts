import cron from "node-cron";
import { CouponRepository } from "../repositories/CouponRepository";

const couponRepo = new CouponRepository();

cron.schedule("0 0 * * *", async () => {
  await couponRepo.updateExpired();
});