import ApiResponse from "@/utils/ApiResopnse";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod"

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long")
})

export async function POST(req: NextRequest){
    const body = await req.json()
    const parsedBody = loginSchema.safeParse(body);
    if(!parsedBody.success){
        return NextResponse.json(
            new ApiResponse(false, "Invalid input", null, parsedBody.error.format), {status: 400}
        )
    }

    const {email, password} = parsedBody.data;

    //TODO: Further code will write when hack begins
    
}