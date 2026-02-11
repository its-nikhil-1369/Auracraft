import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const body = await req.json();
        const { items, totalAmount, shippingAddress } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Order must contain items' }, { status: 400 });
        }

        await dbConnect();

        const newOrder = new Order({
            user: user.id,
            items,
            totalAmount,
            shippingAddress,
            paymentStatus: 'paid', // Assuming payment is successful for this demo flow
            orderStatus: 'Confirmed',
            trackingHistory: [{
                status: 'Confirmed',
                message: 'Your order has been placed successfully.',
                location: 'Mumbai Hub',
                timestamp: new Date()
            }]
        });

        const savedOrder = await newOrder.save();

        return NextResponse.json(savedOrder, { status: 201 });
    } catch (error: any) {
        console.error('Order Creation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        await dbConnect();
        const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
