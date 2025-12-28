import jwtDecode from "@/utils/jwtDecode";
import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Employee } from "@/models/employee.model";
import ApiResponse from "@/utils/ApiResopnse";

export async function GET(req: NextRequest) {
    try {
        let responderId = "";

        // Try getting from token
        const res = await jwtDecode();
        if (res.success) {
            const { _id } = res.data as jwt.JwtPayload;
            responderId = _id;
        } else {
            // Fallback to query param for demo/testing
            const url = new URL(req.url);
            const queryId = url.searchParams.get("responderId");
            if (queryId) {
                responderId = queryId;
            } else {
                return NextResponse.json(
                    { success: false, message: "Unauthorized and no responderId provided" }, { status: 401 }
                )
            }
        }

        console.log("Fetching employees for:", responderId);

        const employees = await Employee.find({ responder: responderId, status: "idle" });

        return NextResponse.json(
            new ApiResponse(true, "Idle employees fetched successfully", employees), { status: 200 }
        )

    } catch (error) {
        console.error("Error while fetching idle employees")
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error"), { status: 500 }
        )
    }
}