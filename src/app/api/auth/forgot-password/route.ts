import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ email });

        // Always return success to prevent email enumeration attacks
        if (!user) {
            return NextResponse.json({
                message: 'If an account with that email exists, password reset instructions have been sent.'
            });
        }

        // Generate a reset token (in a real app, you'd use a more secure method)
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save reset token to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // In a real application, you would send an email here
        // For demo purposes, we'll just log the reset token
        console.log(`Password reset token for ${email}: ${resetToken}`);
        console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);

        return NextResponse.json({
            message: 'Password reset instructions have been sent to your email.'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
