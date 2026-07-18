import { follows, reviews, users, watched, watchlist } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq, count } from "drizzle-orm";


export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const UserID = parseInt(id)
        const user = await db.select().from(users).where(eq(users.id, UserID));

        if (user.length === 0 ) {
            return NextResponse.json({ error: 'User nout found'}, {
                status: 404,
            })
        } 

        const [watchlistCount] = await db.select({count: count()}).from(watchlist).where(eq(watchlist.userId, UserID))

        const [watchedCount] = await db.select({ count: count()}).from(watched).where(eq(watched.userId, UserID))

        const [reviewCount] = await db.select({ count: count() }).from(reviews).where(eq(reviews.userId, UserID))

        const [followersCount] = await db.select({ count: count()}).from(follows).where(eq(follows.followerId, UserID))

        const [followingCount] = await db.select({ count: count()}).from(follows).where(eq(follows.followerId, UserID))

        return NextResponse.json({
            ...user[0],
            watchlistCount: watchlistCount.count,
            watchedCount: watchedCount.count,
            reviewCount: reviewCount.count,
            followersCount: followersCount.count,
            followingCount: followingCount.count
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to fetch user'
        }, {
            status: 500
        })
    }
}


export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const userId = parseInt(id)
        const updates = await request.json();

        const updatedUser = await db.update(users).set(updates).where(
           eq(users.id, userId) 
        ).returning()

        return NextResponse.json(updatedUser[0]);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to update user'
        }, {
            status: 500
        })
    }
}