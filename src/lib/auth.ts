import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


const JWT_SECRET = process.env.JWT_SECRET || 'ilovejwt'

export interface JWTPayLoad {
    userId: number;
    username: string;
    email: string;
}

// hashh password
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

// verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password,hash);
}



// generate token
export function generateToken(payload: JWTPayLoad): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d'
    })
}

// verify token
export function verifyToken(token: string): JWTPayLoad | null {
    try {
        return jwt.verify(token,JWT_SECRET) as JWTPayLoad;
    } catch (error) {
        return null
    }
}