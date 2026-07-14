import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword, generateToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const existingUsername = await db.select().from(users).where(eq(users.username, username));
    if (existingUsername.length > 0) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // create user
    const newUser = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      avatarUrl: null,
      bio: null,
      createdAt: new Date().toISOString(),
    }).returning();

    // ggenerate token
    const token = generateToken({
      userId: newUser[0].id,
      username: newUser[0].username,
      email: newUser[0].email,
    });

    return NextResponse.json({
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email,
        avatarUrl: newUser[0].avatarUrl,
        bio: newUser[0].bio,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
