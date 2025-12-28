import mongoose, { Document, Schema } from "mongoose";

export interface IOverAllReport extends Document {
    medical: string[]; //ids of reports
    roadAccident: string[];
    fire: string[];
    infrastructureCollapse: string[];
    crime: string[];
    disaster: string[];
    other: string[];
}

const OverAllReportSchema = new Schema<IOverAllReport>({
    medical: [{ type: String, default: [] }],
    roadAccident: [{ type: String, default: [] }],
    fire: [{ type: String, default: [] }],
    infrastructureCollapse: [{ type: String, default: [] }],
    crime: [{ type: String, default: [] }],
    disaster: [{ type: String, default: [] }],
    other: [{ type: String, default: [] }],
}, {
    timestamps: true
})

export const OverAllReport = mongoose.models.OverAllReport || mongoose.model<IOverAllReport>("OverAllReport", OverAllReportSchema)