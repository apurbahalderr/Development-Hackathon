import { Subscription } from "@/models/subscription.model";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import ApiResponse from "@/utils/ApiResopnse";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // body is the PushSubscription object from the browser
        // { endpoint: '...', keys: { p256dh: '...', auth: '...' } }
        
        // Optional: Get userId/role from cookies/session if you want to target specific users
        // const userId = ...
        
        await dbConnect();

        // Upsert: Update if exists, Insert if new
        await Subscription.findOneAndUpdate(
            { endpoint: body.endpoint },
            { 
                endpoint: body.endpoint,
                keys: body.keys,
                // userId: userId 
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(
            new ApiResponse(true, "Subscription saved successfully", null), { status: 201 }
        );

    } catch (error: any) {
        console.error("Error saving subscription:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, error.message), { status: 500 }
        );
    }
}
