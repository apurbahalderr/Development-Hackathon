import ApiResponse from "@/utils/ApiResopnse";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import { Report } from "@/models/report.model";
import jwtDecode from "@/utils/jwtDecode";
import jwt from "jsonwebtoken";
import { Responder } from "@/models/responder.model";

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

        // Get responder's department
        const responder = await Responder.findById(_id);
        if (!responder) {
            return NextResponse.json(
                new ApiResponse(false, "Responder not found"), { status: 404 }
            );
        }

        // Get query parameters for filtering
        const { searchParams } = new URL(req.url);
        const typeFilter = searchParams.get('type');
        const departmentFilter = searchParams.get('department');

        // Map report types to departments
        const departmentMapping: Record<string, string> = {
            "Fire": "Fire Department",
            "Accident": "Traffic Police",
            "Medical": "Health Department",
            "Crime": "Police Department",
            "Disaster": "Disaster Management",
            "Infrastructure Collapse": "Public Works Department",
            "Other": "General",
            "Emergency": "Police Department"
        };

        // Build query
        let query: any = {};

        // Determine target department (use filter if specified, otherwise responder's department)
        const targetDepartment = (departmentFilter && departmentFilter !== 'all') 
            ? departmentFilter 
            : responder.department;

        // Get report types that match the target department
        const matchingTypes = Object.entries(departmentMapping)
            .filter(([_, dept]) => dept === targetDepartment)
            .map(([type, _]) => type);
        
        // If we have matching types, filter by them
        if (matchingTypes.length > 0) {
            query.type = { $in: matchingTypes };
        }

        // Further filter by specific type if specified (must also match department)
        if (typeFilter && typeFilter !== 'all') {
            // Check if the type filter matches the department
            if (matchingTypes.includes(typeFilter)) {
                query.type = typeFilter;
            } else {
                // Type doesn't match department, return empty results
                query.type = { $in: [] };
            }
        }

        const reports = await Report.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json(
            new ApiResponse(true, "Reports fetched successfully", reports), { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching reports:", error);
        return NextResponse.json(
            new ApiResponse(false, "Server error while fetching reports", null, (error as Error).message), { status: 500 }
        );
    }
}

