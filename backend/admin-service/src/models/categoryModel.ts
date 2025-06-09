import mongoose, { Schema } from "mongoose";
import { ICategory } from "../shared/types/ICategory";


const schema = new Schema<ICategory>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});


const categoryModel = mongoose.model<ICategory>("Category", schema);

export default categoryModel;
