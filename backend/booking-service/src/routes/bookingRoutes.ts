import { Router } from "express";
import { BookingController } from "../controllers/bookingController";
import { protectedRoute } from "../middlewares/protectedRoute";
import { validate } from "../middlewares/validate";
import { bookingSchema, failedBookingSchema } from "../shared/validators/bookingSchema";
import { container } from "../containers";

const router = Router();

const bookingController = container.resolve(BookingController);

router.post("/booking", validate(bookingSchema), bookingController.create);
router.get("/booking/:id", bookingController.getBooking);
router.patch("/booking/:id", bookingController.cancelBooking);
router.put("/booking/:id", protectedRoute, bookingController.cancelAllBookings);
router.get("/bookings/:id", bookingController.getBookings);
router.post("/failed/booking", validate(failedBookingSchema), bookingController.failedBooking);
router.get("/organizer/booking", protectedRoute, bookingController.getOrganizerBookings);
router.get("/ticket/download/:id", bookingController.downloadTicket);
router.get("/coupon/check", bookingController.checkCoupon);
router.get("/verify/booking/:id", bookingController.verifyBooking);

export default router;
