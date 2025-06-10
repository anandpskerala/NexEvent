import { Model } from "mongoose";
import { IWalletRepository } from "./interfaces/IWalletRepository";
import { IWallet } from "../shared/types/IWallet";
import walletModel from "../models/walletModel";

export class WalletRepository implements IWalletRepository {
    private model: Model<IWallet>;

    constructor() {
        this.model = walletModel;
    }

    public async findByUserID(userId: string): Promise<IWallet | undefined> {
        const doc = await this.model.findOne({ userId });
        return doc?.toJSON();
    }

    public async checkBalance(userId: string, amount: number): Promise<boolean> {
        const exists = await this.findByUserID(userId);
        if (!exists) return false;

        if (exists.balance < amount) return false;
        return true;
    }

    public async debit(id: string, amount: number): Promise<string | undefined> {
        const res = await this.model.findByIdAndUpdate(id,
            {
                $inc: { balance: -amount },
                $push: {
                    transactions: {
                        type: "DEBIT",
                        amount: amount,
                        description: "Order payment"
                    }
                }
            },
            { new: true }
        );

        return res?.transactions[res.transactions.length - 1].id
    }

    public async credit(userId: string, amount: number): Promise<string | undefined> {
        const res = await this.model.findOneAndUpdate(
            {
                userId
            },
            {
                $inc: { balance: amount },
                $push: {
                    transactions: {
                        type: "CREDIT",
                        amount: amount,
                        description: "Refund"
                    }
                }
            },
            { new: true }
        );

        return res?.transactions[res.transactions.length - 1].id
    }

    async create(item: Partial<IWallet>): Promise<IWallet> {
        const doc = await this.model.create(item);
        return doc.toJSON();
    }

    async update(id: string, item: Partial<IWallet>): Promise<void> {
        await this.model.updateOne({_id: id}, {$set: item});
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({_id: id});
    }

    async findByID(id: string): Promise<IWallet | undefined> {
        const doc = await this.model.findOne({_id: id});
        return doc?.toJSON();
    }
}