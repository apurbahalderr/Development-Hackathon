import ApiResponse from "@/utils/ApiResopnse";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod"
import { dbConnect } from "@/utils/dbConnect";
import { Employee } from "@/models/employee.model";
import jwt from "jsonwebtoken";

const loginSchema = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.coerce.number().refine(val => val.toString().length === 10, { message: "Phone number must be 10 digits" }),
    department: z.string()
})

//normal employee ka sign in yaha par hoga
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

        const { email, phone, name, department } = parsedBody.data;
        await dbConnect();
        let employee = await Employee.findOne({ email });

        if (!employee) {
            console.log("Employee not exist, creating new employee")
            employee = await Employee.create({
                name, 
                email,
                phone,
                department,
                role: "employee"
            })
        }
       

        const payload = {
            _id: employee._id,
            role: employee.role,
            email: employee.email
        } as jwt.JwtPayload

        const secret = process.env.JWT_SECRET as string;
        const expiresIn = { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]}  ;

        const token = jwt.sign(payload, secret, expiresIn)

        const response = NextResponse.json(
            new ApiResponse(true, "Sign in successful", employee), {status: 200}
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