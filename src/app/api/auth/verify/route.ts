import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { error } from "node:console";

export async function POST(request: NextRequest) {
    try {
        const { token }= await request.json();
        
        if (!token) {
            return NextResponse.json({
                error: 'Token required'
            })
        }

        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Invalid token'}, {
                status: 400
            })
        }

        return NextResponse.json({
            valid: true,
            user: payload
        })

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to verify token'
        }, {
            status: 500
        })
    }
}