import { Model } from "mongoose";
import { IPaymentRepository } from "./interfaces/IPaymentRepository";
import { IPayment } from "../shared/types/IPayment";
import paymentModel from "../models/paymentModel";

export class PaymentRepository implements IPaymentRepository {
    private model: Model<IPayment>;

    constructor() {
        this.model = paymentModel;
    }

    async create(item: Partial<IPayment>): Promise<IPayment> {
        const doc = await this.model.create(item);
        return doc.toJSON();
    }

    async update(id: string, item: Partial<IPayment>): Promise<void> {
        await this.model.updateOne({ _id: id }, { $set: item });
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({ _id: id });
    }

    async findByID(id: string): Promise<IPayment | undefined> {
        const doc = await this.model.findOne({ _id: id });
        return doc?.toJSON();
    }

    public async changeStatus(bookingId: string, status: string): Promise<IPayment | null> {
        const doc = await this.model.findOneAndUpdate({bookingId}, {$set: {status}}, {new: true});
        return doc;
    }
}