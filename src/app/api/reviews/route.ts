import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";


// get reviews byy id
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const movieId = searchParams.get('movieId');

        if 
    } catch (error) {
        
    }
}


// post-> create revieww

export async function POSt(request:NextRequest) {
    try {
        const { userId , movieId, content , rating } = await request.json();

        const newReview = await db.insert(reviews).values({
            userId,
            movieId,
            content,
            rating,
            createdAt: new Date().toISOString(),
        }).returning();

        return NextResponse.json(newReview[0])
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to create review'
        }, {
            status: 500
        })
    }
}