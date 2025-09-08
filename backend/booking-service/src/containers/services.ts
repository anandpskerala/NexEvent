import { container } from "tsyringe";
import { IBookingService } from "../services/interfaces/IBookingService";
import { BookingService } from "../services/implementation/bookingService";
import { IPaymentService } from "../services/interfaces/IPaymentService";
import { PaymentService } from "../services/implementation/paymentService";
import { IKafkaProducer } from "../kafka/producer/IKafkaProducer";
import { KafkaProducer } from "../kafka/producer/kafkaProducer";
import kafka from "../kafka";
import { Kafka } from "kafkajs";


export function registerServices() {
    container.register<IBookingService>("IBookingService", {useClass: BookingService});
    container.register<IPaymentService>("IPaymentService", {useClass: PaymentService});
    container.register<IKafkaProducer>("IKafkaProducer", {useClass: KafkaProducer});
    container.registerInstance(Kafka, kafka);
}