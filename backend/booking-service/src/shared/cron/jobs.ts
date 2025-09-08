import cron from "node-cron";
import logger from "../utils/logger";
import { BookingRepository } from "../../repositories/implementation/BookingRepository";
import mongoose from "mongoose";

const bookingRepo = new BookingRepository();

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

cron.schedule('*/15 * * * *', async () => {
	try {
		const now = new Date();
		const bookings = await bookingRepo.getExpiredBookings(now);
		if (bookings.length === 0) return;
		for (const booking of bookings) {
			for (const ticket of booking.tickets) {
				let eventId: string | null = null;

				if (typeof booking.eventId === 'string') {
					eventId = booking.eventId;
				} else if (booking.eventId && typeof booking.eventId === 'object' && booking.eventId.id) {
					eventId = booking.eventId.id.toString();
				}

				if (!eventId || !isValidObjectId(eventId)) {
					logger.warn(`Invalid eventId in booking ${booking.id}: ${eventId}`);
					continue;
				}
				await bookingRepo.updateTickets(eventId.toString(), ticket.ticketId.toString(), ticket.quantity);
			}

			await bookingRepo.delete(booking.id as string);
		}

		logger.info(`Reclaimed ${bookings.length} pending bookings`);
	} catch (err) {
		console.log(err);
		logger.error('Error in cron: Reclaim expired bookings', err);
	}
});