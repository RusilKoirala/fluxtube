import { db } from "@/lib/db";
import { watched } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";




// get all watched itemss
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({
                error:'User ID required'
            })
        }
        const items = await db.select().from(watched).where(eq(watched.userId, parseInt(userId)));

        
        return NextResponse.json(items);

    } catch (error) {
        return NextResponse.json({
            error : 'Failed to fetch watched'
        }, {
            status: 500
        })
    }
}




// post add to watchedd
export async function POST(request: NextRequest) {
    try {
        const { movieId, rating, userId } = await request.json();
        
        const newItem = await db.insert(watched).values({
            userId,
            movieId,
            watchedAt: new Date().toISOString(),
            rating: rating || null, 
        }).returning();

        return NextResponse.json(newItem[0])
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add to watched'}, 
            {
                status: 500,
            }
        )
    }
}




// Delete from watched 
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const movieId = searchParams.get('movieId')
        const userId = searchParams.get('userId');

        if (!movieId || !userId)  {
            return NextResponse.json({
                error: 'Movie and User ID required'
            }, {
                status: 400
            })
        }
        await db.delete(watched).where(
            and(
            eq(watched.userId, parseInt(userId)),
            eq(watched.movieId, parseInt(movieId))
        ))

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to remove from watched'
        }, {
            status: 500
        })
    }
}