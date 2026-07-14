import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword, generateToken } from "@/lib/auth";
import {eq} from 'drizzle-orm'


export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();


        if (!email || !password) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, {
                status:400
            })
        }

        const user = await db.select().from(users).where(eq(
            users.email,
            email
        ))

        const isValid = await verifyPassword(password, user[0].password);


        if (!isValid) {
            return NextResponse.json({
                error: 'Invalid email or password'
            }, { status: 401 })
        }

        const token = generateToken({
            userId: user[0].id,
            username: user[0].username,
            email: user[0].email,
        })

        return NextResponse.json({
            user: {
                id: user[0].id,
                username: user[0].username,
                email: user[0].email,
                avatarUrl: user[0].avatarUrl,
                bio: user[0].bio,
            },
            token,
        })
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to login'+ error
        })
    }
}