import { db } from "@/lib/db";
import { watchlist } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

/// gett all watchlist itemss
export async function GET() {
    try {
        const items = await db.select().from(watchlist)
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({
            error: "Failed to fetch watchlist"
        }, { status: 500 })
    }
}



// post too add to watchlist 
export async function POST(request: NextRequest) {
    try {
        const {movieId} = await request.json();
        
        const newItem = await db.insert(watchlist).values({
            movieId,
            addedAt: new Date().toISOString,
        }).returning();

        return NextResponse.json(newItem[0])
    } catch (error) {
        return NextResponse.json({
            error: "Failed to add to watchlist"
        }, {status: 500})
    }
}





// deletee from watch listt
export async function DELETE(request:NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const movieId = searchParams.get('movieId')

        if (!movieId) {
            return NextResponse.json({
                error: 'Movie ID required'
            })
        }

        await db.delete(watchlist).where(
            eq(watchlist.movieId, parseInt(movieId))
        )
    } catch (error) {
        return NextResponse.json({
            error: "Failed to remove from watchlist"
        }, {
            status: 500
        })
    }
}