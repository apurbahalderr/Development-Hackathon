import mongoose, { Document, Schema } from "mongoose";

export interface IResponder extends Document {
    name: string;
    email: string;
    phone: number;
    role: "responder";
    department: string;
    employees?: string[] //sare employees ka id hoga jo is responder se juda hua h
}

const ResponderSchema = new Schema<IResponder>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: Number, required: true},
    role: {type: String, enum: ["responder"], default: "responder"},
    department: {type: String, required: true},
    employees: [{type: String}],
}, {
    timestamps: true
})

export const Responder = mongoose.models.Responder || mongoose.model<IResponder>("Responder", ResponderSchema)