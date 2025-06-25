import mongoose, { Schema } from "mongoose";
import { IWallet, IWalletTransaction } from "../shared/types/IWallet";

const transactionSchema = new Schema<IWalletTransaction>({
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT', 'REFUND'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});
transactionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const schema = new Schema<IWallet>({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: {
        type: [transactionSchema],
        default: []
    }
}, {
    timestamps: true
    
})

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const walletModel = mongoose.model<IWallet>("Wallet", schema);
export default walletModel;