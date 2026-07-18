import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { eq,and, count } from 'drizzle-orm'
import { error } from "node:console";


// get likess

export async function GET(request: NextRequest) {
    try {
        const { searchParams} = new URL(request.url);
        const reviewId = searchParams.get('reviewId');

        if (!reviewId) 
        {
            return NextResponse.json({
                error:'Review ID required'
            }, {
                status: 400
            })
        }

        const result = await db.select({
            count: count()
        }).from(likes).where(eq(likes.reviewId, parseInt(reviewId)))

        return NextResponse.json(
            {
                count: result[0].count
            }
        )
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to fetch likes'
        }, {
            status: 500
        })
    }
}


// give likee
export async function POST(request: NextRequest) {
 try {
    const { userId, reviewId } = await request.json();

    if (!userId || !reviewId)
    {
        return NextResponse.json({
            error: 'Missing required fields'
        }, {
            status: 400
        })
    }

    const existing = await db.select().from(likes).where(
        and(
            eq(likes.userId, userId),
            eq(likes.reviewId, reviewId)
        )
    );

    if (existing.length > 0) 
    {
        return NextResponse.json({
            error: 'Already liked this review'
        }, {
            status: 400
        })
    }

    const newLike = await db.insert(likes).values({
        userId,
        reviewId,
        createdAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json(newLike[0]);
 } catch (error) {
    return NextResponse.json({
        error: 'Failed to like review'
    }, {
        status: 500
    })
 }
}

// remove like
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const userId = searchParams.get('userId');
        const reviewId = searchParams.get('reviewId');

        if (!userId || !reviewId) 
        {
            return NextResponse.json({
                error: 'Missing required fields'
            }, {
                status: 400
            })
        }

        await db.delete(likes).where(
            and( 
                eq(likes.userId, parseInt(userId)),
                eq(likes.reviewId, parseInt(reviewId))
            )
        );

        return NextResponse.json({
            success:true,
        })
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to unlike review'
        }, {
            status: 500
        })
    }
}
