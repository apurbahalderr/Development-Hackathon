import { Report } from "@/models/report.model";
import { OverAllReport } from "@/models/overAllReport.model";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import ApiResponse from "@/utils/ApiResopnse";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const overallReport = await OverAllReport.findOne().sort({ updatedAt: -1 });

        if (!overallReport) {
            return NextResponse.json(
                new ApiResponse(false, "No analytics data found", null), { status: 404 }
            );
        }

        return NextResponse.json(
            new ApiResponse(true, "Analytics data fetched successfully", overallReport)
        );

    } catch (error: any) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, error.message), { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    console.log("Running Analytics Aggregation Job");
    try {
        await dbConnect();
        
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentReports = await Report.find({
            createdAt: { $gte: oneHourAgo }
        });

        if (recentReports.length === 0) {
            return NextResponse.json(
                new ApiResponse(true, "No new reports to aggregate", null)
            );
        }

        const categories: Record<string, string[]> = {
            medical: [],
            roadAccident: [],
            fire: [],
            infrastructureCollapse: [],
            crime: [],
            disaster: [],
            other: []
        };

        recentReports.forEach(report => {
            if (categories[report.type]) {
                categories[report.type].push(report._id.toString());
            } else {
                categories["other"].push(report._id.toString());
            }
        });

        const updatedAnalytics = await OverAllReport.findOneAndUpdate(
            {},
            {
                $push: {
                    medical: { $each: categories.medical },
                    roadAccident: { $each: categories.roadAccident },
                    fire: { $each: categories.fire },
                    infrastructureCollapse: { $each: categories.infrastructureCollapse },
                    crime: { $each: categories.crime },
                    disaster: { $each: categories.disaster },
                    other: { $each: categories.other }
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json(
            new ApiResponse(true, "Analytics updated successfully", {
                processed: recentReports.length,
                data: updatedAnalytics
            })
        );

    } catch (error) {
        console.error("Error aggregating analytics:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, (error as Error).message), { status: 500 }
        );
    }
}
