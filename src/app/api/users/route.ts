import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";



// get all userss 
export async function GET() {
    try {
        const allUsers = await db.select().from(users);
        return NextResponse.json(allUsers);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to fetch users'
        })       
    }
}



// post -> create userr
export async function POST(request:NextRequest) {
    try {
        const { username, email, password, avatarUrl, bio } = await request.json()

        const newUser = await db.insert(users).values({
            username,
            email,
            password,
            avatarUrl: avatarUrl || null,
            bio: bio || null,
            createdAt: new Date().toISOString(),
        }).returning();

        return NextResponse.json(newUser[0])
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to created user'
        })
    }
}