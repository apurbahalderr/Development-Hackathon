import mongoose, { Document, Schema } from "mongoose";

//ye user nahi h lekin responder bhi nahi h, to iska model me responder juda hoga
export interface IEmployee extends Document {
    name: string;
    email: string;
    phone: number;
    role: "employee";
    responder?: string; //ye responder ka id hoga jisse ye juda hoga aur ye tabhi aayega jab responder is employee ka email dalega
    department: string;
    status: "idle" | "on-duty";
}

const EmployeeSchema = new Schema<IEmployee>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: Number, required: true},
    role: {type: String, enum: ["employee"], default: "employee"},
    responder: {type: String},
    department: {type: String, required: true},
    status: {type: String, enum: ["idle", "on-duty"], default: "idle"},
}, {
    timestamps: true
})

export const Employee = mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema)