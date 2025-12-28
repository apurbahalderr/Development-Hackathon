import { Employee } from "@/models/employee.model";
import { Report } from "@/models/report.model";
import ApiResponse from "@/utils/ApiResopnse";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod"

const assignSchema = z.object({
    responderId: z.string(),
    employeeId: z.string(),
    reportId: z.string(),
})

export async function POST(req: NextRequest) {
    console.log("Assigned");
    const body = await req.json();
    //pehle se hi assign ho chuka h kya check karna h
    //agar nahi h to responder ke employees me add karna h jo responder hi assign krega
    //fir wo employee accept krega ya reject
    //agar accept kiya to employee ka status update karna h aur report ka bhi status update karna h
    //agar reject kiya to dusre idle employee ko kaam assign hoga jo us responder ke under aata h aur report me bhi update hoga ki kisko kaam assign hua h
    //fir wahi process repeat hoga
    const parsedBody = assignSchema.safeParse(body);
    if (!parsedBody.success) {
        console.log("Invalid inputs for assignment")
        return NextResponse.json(
            new ApiResponse(false, "Invalid input", null, parsedBody.error.message), { status: 400 }
        )
    }

    const { responderId, employeeId, reportId } = parsedBody.data;
    try {
        await dbConnect();
        const employeeAssigned = await Employee.findByIdAndUpdate(employeeId, {
            reportIdAssigned: reportId
        })

        if (employeeAssigned) {
            const report = await Report.findByIdAndUpdate(reportId, {
                $push: { employeeId: employeeId },
                $set: { 
                    status: "assigning",
                    responderId: [responderId]
                }
            })

            if (!report) {
                return NextResponse.json(
                    new ApiResponse(false, "Report not found"), { status: 404 }
                )
            }

            return NextResponse.json(
                new ApiResponse(true, "Employee assigned successfully"), { status: 200 }
            )

        }
        return NextResponse.json(
            new ApiResponse(false, "Employee not found"), { status: 404 }
        )


    } catch (error) {
        console.error("Error during assignment:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error"), { status: 500 }
        )
    }

}


//report object for severity level
// type report = {
//     "description": "string",
//     "image": "string",
//     "type": "fire" | "roadAccident" | "medical" | "crime" | "disaster" | "infrastructureCollapse" | "other",
// } iska return format me type hoga aur severity level hoga "low" | "medium" | "high"