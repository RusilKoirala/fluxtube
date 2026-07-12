import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { follows } from "@/lib/db/schema";
import { eq, and} from 'drizzle-orm'
import { error } from "node:console";


// check if user follows another users

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const followerId = searchParams.get('followerId');
        const followingId = searchParams.get('followingId');

        if (!followerId || !followingId) 
        {
            return NextResponse.json({
                error: 'Missing required fields'
            }, {
                status: 400
            })
        }

        const result = await db.select().from(follows).where(
            and(
                eq(follows.followerId, parseInt(followerId)),
                eq(follows.followerId, parseInt(followingId))
            )
        )


        return NextResponse.json({
            isFollowing: result.length > 0 // if yes it will return truee 
        })
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to check follow status',
        }, {
            status: 500,
        })
    }
}