import { db } from "@/lib/db";
import { watchlist } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

/// get watchlist by userId
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const items = await db.select().from(watchlist).where(eq(watchlist.userId, parseInt(userId)));
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({
            error: "Failed to fetch watchlist"
        }, { status: 500 })
    }
}



// post to add to watchlist 
export async function POST(request: NextRequest) {
    try {
        const { userId, movieId } = await request.json();

        if (!userId || !movieId) {
            return NextResponse.json({ error: 'User ID and Movie ID required' }, { status: 400 });
        }
        
        const newItem = await db.insert(watchlist).values({
            userId,
            movieId,
            addedAt: new Date().toISOString(),
        }).returning();

        return NextResponse.json(newItem[0])
    } catch (error) {
        return NextResponse.json({
            error: "Failed to add to watchlist"
        }, {status: 500})
    }
}





// delete from watchlist
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const movieId = searchParams.get('movieId');

        if (!userId || !movieId) {
            return NextResponse.json({
                error: 'User ID and Movie ID required'
            }, { status: 400 })
        }

        await db.delete(watchlist).where(
            and(
                eq(watchlist.userId, parseInt(userId)),
                eq(watchlist.movieId, parseInt(movieId))
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({
            error: "Failed to remove from watchlist"
        }, {
            status: 500
        })
    }
}