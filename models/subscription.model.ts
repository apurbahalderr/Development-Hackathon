import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
    userId?: string; 
    role?: string;  
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

const SubscriptionSchema = new Schema<ISubscription>({
    userId: { type: String },
    role: { type: String },
    endpoint: { type: String, required: true, unique: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true }
    }
}, {
    timestamps: true
});

export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
