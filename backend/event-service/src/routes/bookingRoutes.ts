import { Router } from "express";
import { BookingRepository } from "../repositories/BookingRepository";
import { EventRepository } from "../repositories/EventRepository";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { WalletRepository } from "../repositories/WalletRepository";
import { BookingService } from "../services/bookingService";
import { BookingController } from "../controllers/bookingController";
import { protectedRoute } from "../middlewares/protectedRoute";

const router = Router();

const bookingRepo = new BookingRepository();
const eventRepo = new EventRepository();
const paymentRepo = new PaymentRepository();
const walletRepo = new WalletRepository();
const bookingService = new BookingService(bookingRepo, eventRepo, paymentRepo, walletRepo);
const bookingController = new BookingController(bookingService);

router.post("/booking", bookingController.create);
router.get("/booking/:id", bookingController.getBooking);
router.patch("/booking/:id", bookingController.cancelBooking);
router.put("/booking/:id", protectedRoute, bookingController.cancelAllBookings);
router.get("/bookings/:id", bookingController.getBookings);
router.post("/failed/booking", bookingController.failedBooking);
router.get("/organizer/booking", protectedRoute, bookingController.getOrganizerBookings);
router.get("/ticket/download/:id", bookingController.downloadTicket);
router.get("/coupon/check", bookingController.checkCoupon);
router.get("/verify/booking/:id", bookingController.verifyBooking);

export default router;
