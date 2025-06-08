import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user";

const schema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: null
    },
    googleId: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ["google", "email"],
        required: true
    },
    roles: {
        type: [String],
        enum: ['user', 'organizer', 'admin'],
        default: ['user']
    },
    phoneNumber: {
        type: Number,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: "OrganizerRequest",
        required: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
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


const userModel = mongoose.model<IUser>("User", schema);

export default userModel;