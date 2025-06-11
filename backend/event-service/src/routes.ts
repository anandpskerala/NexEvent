import { Router } from "express";
import { EventController } from "./controllers/eventController";
import { EventService } from "./services/eventService";
import { EventRepository } from "./repositories/EventRepository";
import { protectedRoute } from "./middlewares/protectedRoute";
import { BookingController } from "./controllers/bookingController";
import { BookingService } from "./services/bookingService";
import { BookingRepository } from "./repositories/BookingRepository";
import { PaymentRepository } from "./repositories/PaymentRepository";
import { WalletRepository } from "./repositories/WalletRepository";
import { PaymentService } from "./services/paymentService";
import { PaymentController } from "./controllers/paymentController";


const routes = Router();
const eventRepo = new EventRepository();
const bookingRepo = new BookingRepository();
const paymentRepo = new PaymentRepository();
const walletRepo = new WalletRepository();

const eventService = new EventService(eventRepo);
const bookingService = new BookingService(bookingRepo, eventRepo, paymentRepo, walletRepo);
const paymentService = new PaymentService(paymentRepo, walletRepo, bookingRepo, eventRepo);

const eventController =  new EventController(eventService);
const bookingController = new BookingController(bookingService)
const paymentController = new PaymentController(paymentService);

routes.get("/all", eventController.getAllEvents);
routes.post("/event", protectedRoute, eventController.createEvent);
routes.get("/events", eventController.getEvents);
routes.post("/ticket", protectedRoute, eventController.createTicket);
routes.get("/event/:id", eventController.getEvent);
routes.patch("/event/:id", protectedRoute, eventController.editEvent);
routes.patch("/ticket/:id", protectedRoute, eventController.editTicket);
routes.get("/all-saved", eventController.getAllSaved);
routes.get("/saved/:id", eventController.checkSaved); // :id - eventId
routes.post("/saved/:id", eventController.saveEvent); // :id - userId
routes.delete("/saved/:id", eventController.removeSaved); // :id - eventId


routes.post("/booking", bookingController.create);
routes.get("/booking/:id", bookingController.getBooking);
routes.patch("/booking/:id", bookingController.cancelBooking);
routes.get("/bookings/:id", bookingController.getBookings);
routes.post("/failed/booking", bookingController.failedBooking);
routes.get("/organizer/booking", protectedRoute, bookingController.getOrganizerBookings);
routes.get("/ticket/download/:id", bookingController.downloadTicket);
routes.get("/coupon/check", bookingController.checkCoupon);

routes.post('/payment/razorpay/order', paymentController.creatOrderRPay);
routes.post('/payment/razorpay/verify', paymentController.verifyRPayOrder);
routes.post('/payment/stripe/order', paymentController.creatOrderStripe);
routes.post('/payment/stripe/verify', paymentController.verifyStripeOrder);
routes.post('/payment/wallet/pay', paymentController.walletPay);
routes.get('/payment/wallet/:id', paymentController.walletDetails);

export default routes;