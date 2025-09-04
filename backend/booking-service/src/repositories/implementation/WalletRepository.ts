import { injectable } from "tsyringe";
import mongoose, { Model, Types } from "mongoose";
import walletModel from "../../models/walletModel";
import { TransactionModel } from "../../models/transactionModel";
import { IWalletRepository } from "../interfaces/IWalletRepository";
import { IWallet, IWalletTransaction, TransactionType } from "../../shared/types/IWallet";

@injectable()
export class WalletRepository implements IWalletRepository {
    private walletModel: Model<IWallet>;
    private transactionModel: Model<IWalletTransaction>;

    constructor() {
        this.walletModel = walletModel;
        this.transactionModel = TransactionModel;
    }

    public async findByUserID(userId: string): Promise<IWallet | undefined> {
        const doc = await this.walletModel.findOne({ userId });
        return doc?.toJSON();
    }

    public async checkBalance(userId: string, amount: number): Promise<boolean> {
        const wallet = await this.findByUserID(userId);
        return wallet ? wallet.balance >= amount : false;
    }

    public async debit(userId: string, amount: number, description = "Order payment"): Promise<string | undefined> {
        const wallet = await this.walletModel.findOneAndUpdate(
            { userId, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { new: true }
        );

        if (!wallet) return undefined;

        const tx = await this.transactionModel.create({
            walletId: wallet._id,
            type: TransactionType.DEBIT,
            amount,
            description,
        });

        return tx.id;
    }

    public async credit(userId: string, amount: number, description = "Refund", session?: mongoose.ClientSession): Promise<string | undefined> {
        const wallet = (await this.walletModel.findOneAndUpdate(
            { userId },
            { $inc: { balance: amount } },
            { new: true, session }
        ))?.toJSON();

        if (!wallet) return undefined;

        const txDocs = await this.transactionModel.create([{
            walletId: wallet.id,
            type: TransactionType.CREDIT,
            amount,
            description
        }], { session });

        const tx = txDocs[0].toJSON();
        return tx.id;
    }

    async create(item: Partial<IWallet>): Promise<IWallet> {
        const doc = await this.walletModel.create(item);
        return doc.toJSON();
    }

    async update(id: string, item: Partial<IWallet>): Promise<void> {
        await this.walletModel.updateOne({ _id: id }, { $set: item });
    }

    async delete(id: string): Promise<void> {
        await this.walletModel.deleteOne({ _id: id });
        await this.transactionModel.deleteMany({ walletId: id });
    }

    async findByID(id: string): Promise<IWallet | undefined> {
        const doc = await this.walletModel.findById(id);
        return doc?.toJSON();
    }

    async getTransactions(walletId: string, limit = 50, skip = 0): Promise<IWalletTransaction[]> {
        return this.transactionModel
            .find({ walletId: new Types.ObjectId(walletId) })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }
}
