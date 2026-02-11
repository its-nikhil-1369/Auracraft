import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const decoded: any = await getAuthUser();
        if (!decoded) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(decoded.id);

        if (!user || user.isBanned) {
            const cookieStore = await cookies();
            cookieStore.delete('lumina_auth_token');
            return NextResponse.json({ user: null, error: user?.isBanned ? 'Banned' : 'Not found' }, { status: 403 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Auth Check Error:', error);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
