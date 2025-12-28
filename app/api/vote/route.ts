import { Report } from "@/models/report.model";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import ApiResponse from "@/utils/ApiResopnse";
import z from "zod";

const voteSchema = z.object({
    reportId: z.string(),
    action: z.enum(["upvote", "downvote"])
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsedBody = voteSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                new ApiResponse(false, "Invalid input", null, parsedBody.error.message), { status: 400 }
            );
        }

        const { reportId, action } = parsedBody.data;
        await dbConnect();

        const updateQuery = action === "upvote" 
            ? { $inc: { upvotes: 1 } } 
            : { $inc: { downvotes: 1 } };

        const report = await Report.findByIdAndUpdate(
            reportId,
            updateQuery,
            { new: true }
        );

        if (!report) {
            return NextResponse.json(
                new ApiResponse(false, "Report not found", null), { status: 404 }
            );
        }

        const voteDifference = report.upvotes - report.downvotes;
        
        if (voteDifference >= 20 && report.status === "unverified") {
            report.status = "verified";
            await report.save();
        }

        return NextResponse.json(
            new ApiResponse(true, "Vote recorded successfully", report)
        );

    } catch (error) {
        console.error("Error voting:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, (error as Error).message), { status: 500 }
        );
    }
}
