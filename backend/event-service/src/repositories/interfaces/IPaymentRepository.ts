import { IPayment } from "../../shared/types/IPayment";

export interface IPaymentRepository {
    findByID(id: string): Promise<IPayment | undefined>;
    create(item: Partial<IPayment>): Promise<IPayment>;
    update(id: string, item: Partial<IPayment>): Promise<void>;
    delete(id: string): Promise<void>;
    changeStatus(bookingId: string, status: string): Promise<IPayment | undefined>;
    upsert(bookingId: string, data: Partial<IPayment>): Promise<IPayment | undefined>;
}