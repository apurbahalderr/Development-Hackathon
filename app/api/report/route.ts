import ApiResponse from "@/utils/ApiResopnse";
import verifyByMLModel from "@/utils/verifyByMLModel";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod"
const { dbConnect } = await import("@/utils/dbConnect");
const { Report } = await import("@/models/report.model");

const reportSchema = z.object({
    sessionId: z.string(),
    userId: z.string().optional(),
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }),
    type: z.string(),
    description: z.string(),
    phone: z.coerce.number().refine(val => val.toString().length === 10, { message: "Phone number must be 10 digits" }).optional(),
    image: z.string().optional(),
    severity: z.enum(["high", "medium", "low"]).default("low")
})

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log("Report received:", body);
    const parsedBody = reportSchema.safeParse(body)

    if (!parsedBody.success) {
        console.log("Invalid report data")
        return NextResponse.json(
            new ApiResponse(false, "Invalid report data", null, parsedBody.error.message), { status: 400 }
        )
    }

    const { sessionId, userId, location, type, description, phone, image, severity } = parsedBody.data;

    try {
       

        await dbConnect();

        const newReport = await Report.create({
            sessionId,
            userId,
            location,
            type,
            description,
            phone,
            image,
            severity
        })

        if(!newReport){
            throw new Error("Report creation failed")
        }

        verifyByMLModel(newReport._id, image, severity, type, location, description).catch(err => {
            console.error("Background verification failed:", err);
        });

        return NextResponse.json(
            new ApiResponse(true, "Report created successfully", newReport), { status: 201 }
        )
    } catch (error) {
        console.error("Error creating report:", error);
        return NextResponse.json(
            new ApiResponse(false, "Server error while creating report", null, (error as Error).message), { status: 500 }
        )
    }
}