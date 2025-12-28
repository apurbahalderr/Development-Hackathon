import { IReport, Report } from "@/models/report.model";
import { Responder } from "@/models/responder.model";
import { dbConnect } from "@/utils/dbConnect";
import ApiResponse from "@/utils/ApiResopnse";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod";
import jwtDecode from "@/utils/jwtDecode";
import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";

const sosSchema = z.object({
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }),
    sessionId: z.string(),
    userId: z.string().optional()
});

export async function POST(req: NextRequest) {
    console.log("SOS Alert Received");
    try {
        const body = await req.json();
        const parsedBody = sosSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                new ApiResponse(false, "Invalid SOS data", null, parsedBody.error.message), { status: 400 }
            );
        }

        const { location, sessionId, userId } = parsedBody.data;
        await dbConnect();

        let phone;
        const res = await jwtDecode() as jwt.JwtPayload
        if(res.success){
            const {_id} = res.data;
            console.log("Responder ID from token:", _id);
            const user = await User.findById(_id);
            if(user){
                phone = user.phone;
            }
        }

        const nearestResponder = await Responder.findOne({
            department: "Police Department",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [location.lng, location.lat]
                    }
                }
            }
        });

        const reportData: any = {
            sessionId,
            userId,
            phone,
            type: "other",
            description: "SOS: IMMEDIATE HELP REQUIRED",
            location,
            severity: "high",
            status: "assigning",
            upvotes: 100 
        };

        if (nearestResponder) {
            reportData.responderId = [nearestResponder._id];
        }

        const newReport = await Report.create(reportData);

        return NextResponse.json(
            new ApiResponse(true, "SOS Alert Sent Successfully", {
                report: newReport,
                assignedResponder: nearestResponder ? nearestResponder.name : "Searching..."
            }), { status: 201 }
        );

    } catch (error) {
        console.error("SOS Error:", error);
        return NextResponse.json(
            new ApiResponse(false, "Failed to send SOS", null, (error as Error).message), { status: 500 }
        );
    }
}