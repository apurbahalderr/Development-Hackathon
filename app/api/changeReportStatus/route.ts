import ApiResponse from "@/utils/ApiResopnse";
import { dbConnect } from "@/utils/dbConnect";
import { type NextRequest, NextResponse } from "next/server";
import { Report } from "@/models/report.model";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { reportId, status, severity } = body;

        if (!reportId || (!status && !severity)) {
            return NextResponse.json(new ApiResponse(false, "Report ID and at least one field to update are required", null), { status: 400 });
        }

        if (status) {
            const validStatuses = ["resolved", "verified", "unverified", "assigning", "assigned"];
            if (!validStatuses.includes(status)) {
                return NextResponse.json(new ApiResponse(false, "Invalid status value", null), { status: 400 });
            }
        }

        if (severity) {
            const validSeverities = ["high", "medium", "low"];
            if (!validSeverities.includes(severity)) {
                return NextResponse.json(new ApiResponse(false, "Invalid severity value", null), { status: 400 });
            }
        }

        const report = await Report.findById(reportId);
        if (!report) {
            return NextResponse.json(new ApiResponse(false, "Report not found", null), { status: 404 });
        }

        if (status) report.status = status;
        if (severity) report.severity = severity;

        await report.save();

        return NextResponse.json(new ApiResponse(true, "Report status updated successfully", report), { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(new ApiResponse(false, "Internal Server Error", null), { status: 500 });
    }
}