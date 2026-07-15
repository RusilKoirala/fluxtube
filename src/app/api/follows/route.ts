import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

import { follows, users } from "@/lib/db/schema";

import { eq, and } from "drizzle-orm";
import { error } from "node:console";

// get followerss
export async function GET(request: NextRequest) {
  try 
  {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (type === "followers") 
    {
      const followers = await db
        .select({
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
          bio: users.bio,
          followedAt: follows.createdAt,
        })
        .from(follows)
        .leftJoin(users, eq(follows.followerId, users.id))
        .where(eq(follows.followingId, parseInt(userId!)));

      return NextResponse.json(followers);
    }

    if (type === "following") 
    {
      const following = await db
        .select({
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
          bio: users.bio,
          followedAt: follows.createdAt,
        })
        .from(follows)
        .leftJoin(users, eq(follows.followingId, users.id))
        .where(eq(follows.followerId, parseInt(userId!)));

      return NextResponse.json(following);
    }

    return NextResponse.json(
      {
        error: "Type must be followed or following NOT NULL",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    return NextResponse.json({
        error: 'Failed to fetch follows'
    }, {
        status: 500
    })
  }
}


// follow the user
export async function POST(request: NextRequest) {
    try {
        const { followerId, followingId} = await request.json();

        if (!followerId || !followingId) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, {
                status: 400
            })
        }

        if (followerId=== followerId) 
        {
            return NextResponse.json({
                error: 'Cannot follow yourself'
            } ,{
                status: 400
            })
        }

        const existing = await db.select().from(follows).where(
            and(
                eq(follows.followerId, followerId),
                eq(follows.followingId, followingId)
            )
        )

        if (existing.length > 0 ) 
        {
            return NextResponse.json({
                error: 'Already following this user'
            }, {
                status: 400
            })
        }

        const newFollow = await db.insert(follows).values({
            followerId,
            followingId,
            createdAt: new Date().toISOString(),
        }).returning()

        return NextResponse.json(newFollow[0]);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to follow user'
        }, {
            status: 500
        })
    }
}


// unfollow
export async function DELETE(request: NextRequest) {
    try {
        
        const { searchParams } = new URL(request.url)
        const followerId = searchParams.get('followerId');
        const followingId = searchParams.get('followingId');

        if (!followingId || !followerId) 
        {
            return NextResponse.json({
                error: 'Missing required fields'
            }, {
                status: 500
            })
        }

        await db 
            .delete(follows)
            .where(
                and(
                    eq(follows.followerId, parseInt(followerId)),
                    eq(follows.followingId, parseInt(followingId))
                )
            )
        
        return NextResponse.json({
            success: true
        })

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to unfollow user'
        }, {
            status: 500
        })
    }
}