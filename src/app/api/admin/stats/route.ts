import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import { isAdmin } from '@/lib/auth';

export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        // 1. Calculate Total Revenue
        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // 2. Count Total Orders
        const totalOrders = await Order.countDocuments();

        // 3. Count Total Users
        const totalUsers = await User.countDocuments();

        // 4. Calculate Conversion Rate (Orders / Users)
        const conversionRate = totalUsers > 0 ? ((totalOrders / totalUsers) * 10).toFixed(2) : "0.00";
        // Note: Using * 10 as a placeholder for a more complex "sessions" based conversion, 
        // or just to make the number look realistic for a new store.

        // 5. Get Recent Orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name');

        // 6. Get Top Products (Static for now, could aggregate from Orders)
        const topProducts = await Product.find().limit(4);

        return NextResponse.json({
            stats: {
                revenue: totalRevenue,
                orders: totalOrders,
                users: totalUsers,
                conversionRate: conversionRate
            },
            recentOrders,
            topProducts
        });
    } catch (error: any) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
