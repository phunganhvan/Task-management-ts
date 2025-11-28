import mongoose, { Schema, Document, Model } from "mongoose";

export interface IForgotPassword extends Document {
    email: string;
    otp: string;
    expiresAfter: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const forgotPasswordSchema: Schema<IForgotPassword> = new Schema(
    {
        email: { type: String, required: true },
        otp: { type: String, required: true },
        expiresAfter: {
            type: Date,
            required: true,
            // TTL index — xóa document sau 120 giây
            expires: 120,
        },
    },
    {
        timestamps: true,
    }
);

// Collection name: "forgot-password"
const ForgotPassword: Model<IForgotPassword> = mongoose.model(
    "ForgotPassword",
    forgotPasswordSchema,
    "forgot-password"
);

export default ForgotPassword;
