import { Schema, model, Types, InferSchemaType } from "mongoose";
import { IWalletTransaction, TransactionType } from "../shared/types/IWallet";

const transactionSchema = new Schema<IWalletTransaction>(
    {
        walletId: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: Object.values(TransactionType),
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
);

transactionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Partial<IWalletTransaction> & { _id?: Types.ObjectId }) => {
        ret.id = ret._id?.toString();
        delete ret._id;
    }
});

export type TransactionSchemaType = InferSchemaType<typeof transactionSchema>;

export const TransactionModel = model<TransactionSchemaType>(
    "Transaction",
    transactionSchema
);
