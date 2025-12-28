import ApiResponse from "@/utils/ApiResopnse";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import { Employee } from "@/models/employee.model";
import { Report } from "@/models/report.model";
import jwtDecode from "@/utils/jwtDecode";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        const res = await jwtDecode();
        if (!res.success) {
            return NextResponse.json(
                new ApiResponse(false, res.message), { status: 401 }
            );
        }

        const { _id } = res.data as jwt.JwtPayload;
        await dbConnect();

        // Get employee
        const employee = await Employee.findById(_id);
        if (!employee) {
            return NextResponse.json(
                new ApiResponse(false, "Employee not found"), { status: 404 }
            );
        }

        // Get assigned report if any
        if (!employee.reportIdAssigned) {
            return NextResponse.json(
                new ApiResponse(true, "No tasks assigned", []), { status: 200 }
            );
        }

        // Get the report
        const report = await Report.findById(employee.reportIdAssigned);
        if (!report) {
            // Clean up invalid assignment
            await Employee.findByIdAndUpdate(_id, { reportIdAssigned: undefined });
            return NextResponse.json(
                new ApiResponse(true, "No tasks assigned", []), { status: 200 }
            );
        }

        return NextResponse.json(
            new ApiResponse(true, "Task fetched successfully", [report]), { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching employee tasks:", error);
        return NextResponse.json(
            new ApiResponse(false, "Server error while fetching tasks", null, (error as Error).message), { status: 500 }
        );
    }
}

