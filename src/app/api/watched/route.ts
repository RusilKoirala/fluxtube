import { db } from "@/lib/db";
import { watched } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { error } from "node:console";



// get all watched itemss
export async function GET() {
    try {
        const items = await db.select().from(watched)
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
        const { movieId, rating } = await request.json();
        
        const newItem = await db.insert(watched).values({
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

        if (!movieId)  {
            return NextResponse.json({
                error: 'Movie ID required'
            }, {
                status: 400
            })
        }
    } catch (error) {
        
    }
}