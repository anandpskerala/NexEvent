import { Router } from "express";
import { BookingRepository } from "../repositories/implementation/BookingRepository";
import { EventRepository } from "../repositories/implementation/EventRepository";
import { PaymentRepository } from "../repositories/implementation/PaymentRepository";
import { WalletRepository } from "../repositories/implementation/WalletRepository";
import { BookingService } from "../services/implementation/bookingService";
import { BookingController } from "../controllers/bookingController";
import { protectedRoute } from "../middlewares/protectedRoute";
import { validate } from "../middlewares/validate";
import { bookingSchema, failedBookingSchema } from "../shared/validators/bookingSchema";

const router = Router();

const bookingRepo = new BookingRepository();
const eventRepo = new EventRepository();
const paymentRepo = new PaymentRepository();
const walletRepo = new WalletRepository();
const bookingService = new BookingService(bookingRepo, eventRepo, paymentRepo, walletRepo);
const bookingController = new BookingController(bookingService);

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
