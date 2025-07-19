import { container } from "tsyringe";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { BookingRepository } from "../repositories/implementation/BookingRepository";
import { IPaymentRepository } from "../repositories/interfaces/IPaymentRepository";
import { PaymentRepository } from "../repositories/implementation/PaymentRepository";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";
import { WalletRepository } from "../repositories/implementation/WalletRepository";


export function registerRepositories() {
  container.register<IBookingRepository>("IBookingRepository", {useClass: BookingRepository});
  container.register<IPaymentRepository>("IPaymentRepository", {useClass: PaymentRepository});
  container.register<IWalletRepository>("IWalletRepository", {useClass: WalletRepository});
}