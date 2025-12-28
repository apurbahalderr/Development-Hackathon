import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
    sessionId: string;
    userId?: string;
    type: string;
    location: { lat: number, lng: number };
    employeeLocation?: { lat: number, lng: number };
    employeeId?: string[];
    responderId?: string[];
    responderNotes?: string;
    description: string;
    phone: number;
    image?: string;
    upvotes: number;
    downvotes: number;
    duplicates: number;
    severity: "high" | "medium" | "low";
    status: "resolved" | "verified" | "unverified" | "assigning" | "assigned";
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
    sessionId: { type: String, required: true },
    userId: { type: String },
    type: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    employeeLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    employeeId: [{ type: String }],
    responderId: [{ type: String }],
    responderNotes: { type: String },
    description: { type: String, required: true },
    phone: { type: Number, required: true },
    image: { type: String },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    duplicates: { type: Number, default: 0 },
    severity: { type: String, enum: ["high", "medium", "low"], default: "low" },
    status: { type: String, enum: ["resolved", "verified", "unverified", "assigning", "assigned"], default: "unverified" },
}, {
    timestamps: true
})

export const Report = mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema)