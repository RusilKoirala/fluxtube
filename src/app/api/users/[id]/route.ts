import { reviews, users, watched, watchlist } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq, count } from "drizzle-orm";

export async function GET(request:NextRequest, {params } : { params : { id: string}}) {
    try {
        const UserID = parseInt(params.id)
        const user = await db.select().from(users).where(eq(users.id, UserID));

        if (user.length === 0 ) {
            return NextResponse.json({ error: 'User nout found'}, {
                status: 404,
            })
        } 
        const watchlistCount = await db.select({count: count()}).from(watchlist).where(eq(watchlist.userId, UserID))

        const watchedCount = await db.select({ count: count()}).from(watched).where(eq(watched.userId, UserID))

        const reviewCount = await db.select({ count: count() }).from(reviews).where(eq(reviews.userId, UserID))

        return NextResponse.json({
            ...user[0],
            watchlistCount: watchlistCount[0].count,
            watchedCount: watchedCount[0].count,
            reviewCount: reviewCount[0].count,
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to fetch user'
        }, {
            status: 500
        })
    }
}