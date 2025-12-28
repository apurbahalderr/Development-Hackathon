import { Subscription } from "@/models/subscription.model";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import ApiResponse from "@/utils/ApiResopnse";
import webPush from "web-push";

// Configure Web Push with your keys
// In production, use process.env.VAPID_PUBLIC_KEY and process.env.VAPID_PRIVATE_KEY
const vapidKeys = {
    publicKey: 'BA8JjGcf9qRxBDRt-bhYXLICDRj28tL3izZC-7ZN8vNXh2tkAJfou6a0qwWUHpGbDMOJhSr_NsAjGyybhIITRJo',
    privateKey: 'KUSJbKJSvUn97pRUgI42NwKZ2PRT-4h-GBj2qmLJ01o'
};

webPush.setVapidDetails(
    'mailto:anshukr95086@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, message, url, userId, role } = body;

        await dbConnect();

        // Find subscriptions based on criteria
        // If userId is provided, send to that user
        // If role is provided, send to all users with that role
        // If neither, maybe send to all (be careful!)
        
        let query = {};
        if (userId) query = { userId };
        else if (role) query = { role };
        
        const subscriptions = await Subscription.find(query);

        if (subscriptions.length === 0) {
             return NextResponse.json(
                new ApiResponse(true, "No subscriptions found to send to", null)
            );
        }

        const payload = JSON.stringify({
            title: title || "New Notification",
            body: message || "You have a new update!",
            url: url || "/"
        });


        const promises = subscriptions.map(sub => {
            return webPush.sendNotification(
                {
                    endpoint: sub.endpoint,
                    keys: sub.keys
                },
                payload
            ).catch(err => {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    console.log("Subscription expired, deleting:", sub._id);
                    return Subscription.findByIdAndDelete(sub._id);
                }
                console.error("Error sending notification:", err);
            });
        });

        await Promise.all(promises);

        return NextResponse.json(
            new ApiResponse(true, `Sent notifications to ${subscriptions.length} devices`, null)
        );

    } catch (error: any) {
        console.error("Error sending notifications:", error);
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, error.message), { status: 500 }
        );
    }
}