import ApiResponse from "@/utils/ApiResopnse";
import { dbConnect } from "@/utils/dbConnect";
import { type NextRequest, NextResponse } from "next/server";
import { Report } from "@/models/report.model";

export async function POST(req: NextRequest){
    try {
        await dbConnect();
        const body = await req.json();
        const { reportId, status } = body;
        if(!reportId || !status){
            return NextResponse.json(new ApiResponse(false, "Report ID and status are required", null), { status: 400 });
        }

        const validStatuses = ["resolved", "verified", "unverified", "assigning", "assigned"];
        if(!validStatuses.includes(status)){
            return NextResponse.json(new ApiResponse(false, "Invalid status value", null), { status: 400 });
        }

        const report = await Report.findById(reportId);
        if(!report){
            return NextResponse.json(new ApiResponse(false, "Report not found", null), { status: 404 });
        }

        report.status = status;
        await report.save();

        return NextResponse.json(new ApiResponse(true, "Report status updated successfully", report), { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(new ApiResponse(false, "Internal Server Error", null), { status: 500 });
    }
}