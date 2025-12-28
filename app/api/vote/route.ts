import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/dbConnect';
import { Report } from '@/models/report.model';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { reportId, action } = await req.json();

        if (!reportId || !['upvote', 'downvote'].includes(action)) {
            return NextResponse.json(
                { success: false, error: "Invalid request" },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return NextResponse.json(
                { success: false, error: "Invalid report ID" },
                { status: 400 }
            );
        }

        const update = action === 'upvote'
            ? { $inc: { upvotes: 1 } }
            : { $inc: { downvotes: 1 } };

        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            update,
            { new: true } // Return the updated document
        );

        if (!updatedReport) {
            return NextResponse.json(
                { success: false, error: "Report not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedReport
        });

    } catch (error) {
        console.error("Error processing vote:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process vote" },
            { status: 500 }
        );
    }
}
