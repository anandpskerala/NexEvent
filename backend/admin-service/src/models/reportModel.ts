import mongoose, { Schema } from "mongoose";
import { IReport } from "../shared/types/IReport";

const schema = new Schema<IReport>({
    userId: {
        type: String,
        required: true
    },
    reportType: {
        type: String,
        required: true
    },
    reportedBy: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Action Taken', 'Dismissed'],
        default: "Pending"
    },
    evidence: {
        type: String,
    }
}, {timestamps: true});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});


const reportModel = mongoose.model<IReport>("Report", schema);

export default reportModel;