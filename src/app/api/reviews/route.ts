import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews, users } from "@/lib/db/schema";
import { eq ,desc} from "drizzle-orm";
import { error } from "node:console";



// get reviews byy id
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const movieId = searchParams.get('movieId');
        const userId = searchParams.get('userId');

        if (movieId) {

            const movieReviews = await db.select({
                id: reviews.id,
                userId: reviews.userId,
                movieId: reviews.movieId,
                content: reviews.content,
                rating: reviews.rating,
                createdAt: reviews.createdAt,
                username: users.username,
                avatarUrl: users.avatarUrl
            })
            .from(reviews)
            .leftJoin(users, eq(reviews.userId, users.id))
            .where(eq(reviews.movieId, parseInt(movieId)))
            .orderBy(desc(reviews.createdAt))

            return NextResponse.json(movieReviews)
        }

        if (userId) {
            const userReviews = await db 
                .select()
                .from(reviews)
                .where(eq(reviews.userId, parseInt(userId)))
                .orderBy(desc(reviews.createdAt))
                return NextResponse.json(userReviews)
        }

        return NextResponse.json({
            error: "Movie ID or User Id required"
        }, {
            status: 400
        });

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to fetch reviews'
        }, {
            status: 500,
        })
    }
}






// post-> create revieww

export async function POST(request:NextRequest) {
    try {
        const { userId , movieId, content , rating } = await request.json();

        if (!userId || !movieId || !content || !rating) {
            return NextResponse.json({
                error: "Missing required faileds"
            }, {
                status: 400
            })
        }

        if (rating < 1 || rating > 10) {
            return NextResponse.json({
                error: 'Rating must between 1 and 10'
            })
        }
        
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