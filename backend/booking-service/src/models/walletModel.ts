import mongoose, { Schema, Types } from "mongoose";
import { IWallet } from "../shared/types/IWallet";


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
}, {
    timestamps: true
    
})

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Partial<IWallet> & { _id?: Types.ObjectId }) => {
        ret.id = ret._id?.toString();
        delete ret._id;
    }
});

const walletModel = mongoose.model<IWallet>("Wallet", schema);
export default walletModel;