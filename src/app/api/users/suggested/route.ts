import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { users, follows } from "@/lib/db/schema";
import { eq,and, notInArray, count, desc } from "drizzle-orm";


export async function GET(request: NextRequest) {
    try {
        const  { searchParams } = new URL(request.url)
        const currentUserId = parseInt(searchParams.get('userId') || '0');
        const limit = parseInt(searchParams.get('limit') || '10') 

        if (!currentUserId) {
            return NextResponse.json({
                error: 'User ID required'
            })
        }

        const following = await db.select({
            id: follows.followerId,
        }).from(follows)
        .where(eq(follows.followerId, currentUserId))

        const followingIds = following.map((f) => f.id);

        const suggested = await db.select({
            id: users.id,
            username: users.username,
            avatarUrl: users.avatarUrl,
            bio: users.bio,
            followersCount: count(follows.id),
        })
        .from(users)
        .leftJoin(follows, eq(follows.followingId, users.id))
        .where(
            followingIds.length> 0
            ? and (
                notInArray(users.id, [...followingIds, currentUserId]),
            ):
            undefined
        ).groupBy(users.id)
        .orderBy(desc(count(follows.id)))
        .limit(limit)


        return NextResponse.json(suggested)

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to fetch suggested users'
        }, {
            status: 400
        })
    }
}