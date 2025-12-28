import { Employee } from "@/models/employee.model";
import { Report } from "@/models/report.model";
import ApiResponse from "@/utils/ApiResopnse";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest){
    console.log("Assign accepted/rejected");
    const body = await req.json();
    const {action, employeeId, reportId} = body;

    try {
        await dbConnect()
        const report = await Report.findById(reportId);
        
        if(!report){
            return NextResponse.json(
                new ApiResponse(false, "Report not found"), { status: 404 }
            )
        }
        
        if(action === "accepted"){
            report.status = "assigned";
            await report.save();
            return NextResponse.json(
                new ApiResponse(true, "Report assignment accepted"), { status: 200 }
            )
        } else if(action === "rejected"){
            const employees = await Employee.find({department: report.type, responder: report.responderId, status: "idle", _id: { $ne: employeeId } });
            if(employees.length === 0){
                return NextResponse.json(
                    new ApiResponse(false, "No idle employees available for reassignment"), { status: 404 }
                )
            }
    
            const newEmployee = employees[0];
            report.employeeId.push(newEmployee._id);
            report.status = "assigning";
            await report.save();
    
            newEmployee.reportIdAssigned = reportId;
            await newEmployee.save();
    
            return NextResponse.json(
                new ApiResponse(true, "Report reassigned to another employee"), { status: 200 }
            )
        }
    } catch (error) {
        console.error("Something went wrong");
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error"), { status: 500 }
        )
    }

}