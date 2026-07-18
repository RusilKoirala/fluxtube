import { NextRequest , NextResponse } from "next/server";

import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";


export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const reviewId = parseInt(id);
        const { content, rating } = await request.json();


        const updates: any = {
            updatedAt: new Date().toISOString(),
        }

        if (content) updates.content = content;
        if (rating) updates.rating = rating;

        const updateReview = await db.update(reviews).set(updates).where(
            eq(reviews.id, reviewId)
        ).returning();


        return NextResponse.json(updateReview[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update review'},
            {
                status: 500
            }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const reviewId = parseInt(id);

        await db.delete(reviews).where(eq(reviews.id, reviewId))

        return NextResponse.json({
            success: true,
        })
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to delete review'
        }, {
            status: 500
        })
    }
}