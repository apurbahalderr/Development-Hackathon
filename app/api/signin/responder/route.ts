import ApiResponse from "@/utils/ApiResopnse";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod"

import { dbConnect } from "@/utils/dbConnect";
import {Responder} from "@/models/responder.model";
import jwt from "jsonwebtoken";

const loginSchema = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.coerce.number().refine(val => val.toString().length === 10, { message: "Phone number must be 10 digits" }),
    sessionId: z.string(),
    accessCode: z.string(),
    department: z.string()
})

//resonder ka sign in ke liye ye page h
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log(body)
        const parsedBody = loginSchema.safeParse(body);
        if (!parsedBody.success) {
            console.log("Invalid inputs")
            return NextResponse.json(
                new ApiResponse(false, "Invalid input", null, parsedBody.error.message), { status: 400 }
            )
        }

        const { email, name, accessCode, phone, department } = parsedBody.data;
        await dbConnect();
        let responder = await Responder.findOne({ email });


        if (accessCode !== process.env.ACCESS_CODE) {
            return NextResponse.json(
                new ApiResponse(false, "Invalid access code for responder role"), { status: 401 }
            )
        }


        if (!responder) {
            console.log("responder not exist, creating new responder")
            responder = await Responder.create({
                name,
                email,
                phone,
                role: "responder",
                department
            })
        }

       
        const payload = {
            _id: responder._id,
            role: responder.role,
            email: responder.email
        } as jwt.JwtPayload

        const secret = process.env.JWT_SECRET as string;
        const expiresIn = { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] };

        const token = jwt.sign(payload, secret, expiresIn)

        const response = NextResponse.json(
            new ApiResponse(true, "Sign in successful", responder), { status: 200 }
        )
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: true,
        })

        return response;


    } catch (error) {
        return NextResponse.json(
            new ApiResponse(false, "Internal Server Error", null, (error as Error).message), { status: 500 }
        )
    }
}