import { NextRequest,NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, follows } from '@/lib/db/schema'
import { like, desc, count, eq} from "drizzle-orm";



export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q');

        const limit = parseInt(searchParams.get('limit')|| '20');
        const currentUserId = searchParams.get('currentUserId');


        if (!query) 
        {
            return NextResponse.json({
                error:'Search query required'
            }, {
                status: 400
            })
        }


        const searchResults = await db.select({
            id: users.id,
            username: users.username,
            email: users.email,
            avatarUrl: users.avatarUrl,
            bio: users.bio,
            createdAt: users.createdAt
        })
        .from(users)
        .where(like(users.username, `%${query}%`))
        .limit(limit)



        const usersWithStats = await Promise.all(
            searchResults.map(async (user)=> {
                const [followersCount] = await db.select({
                    count:count()
                })
                .from(follows)
                .where(eq(follows.followingId, user.id))

            return {
                ...user,
                followersCount: followersCount.count,
            }
            })
        );

        return NextResponse.json(usersWithStats);
    } catch (error) {
        return NextResponse.json({
            error:'Failed to search users'
        }, {
            status: 500
        })
    }
}