import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from './db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-for-dev-only';

export async function createToken(payload: any) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export async function getAuthUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('lumina_auth_token')?.value;

    if (!token) return null;

    const decoded: any = await verifyToken(token);
    if (!decoded) return null;

    // Real-time DB check for ban status
    try {
        await dbConnect();
        const user = await User.findById(decoded.id);
        if (!user || user.isBanned) return null;

        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name
        };
    } catch (err) {
        return null;
    }
}

export async function isAdmin() {
    const user = await getAuthUser();
    return user?.role === 'admin';
}
