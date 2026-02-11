import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://itsnikhilpawark_db_user:fmULuf369sx66OLV@cluster0.xdb7w22.mongodb.net/clothing-store?retryWrites=true&w=majority&appName=Cluster0";

const OrderSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    items: [{
        product: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    totalAmount: Number,
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String
    },
    paymentStatus: String,
    orderStatus: String,
    trackingHistory: [{
        status: String,
        message: String,
        location: String,
        timestamp: Date
    }],
    createdAt: Date
});

async function checkOrders() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB Atlas\n');

        const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
        const orders = await Order.find({});

        console.log('📦 ALL ORDERS IN DATABASE:');
        console.log('='.repeat(80));

        if (orders.length === 0) {
            console.log('\n⚠️  NO ORDERS FOUND IN DATABASE');
            console.log('\n💡 TO CREATE A TEST ORDER:');
            console.log('   1. Go to http://localhost:3000');
            console.log('   2. Log in with your account');
            console.log('   3. Add items to your cart');
            console.log('   4. Go to checkout and complete the purchase');
            console.log('   5. Then you can track your order!\n');
        } else {
            orders.forEach((order) => {
                console.log(`\n📋 Order ID: ${order._id}`);
                console.log(`   User ID: ${order.user}`);
                console.log(`   Status: ${order.orderStatus}`);
                console.log(`   Total: ₹${order.totalAmount.toLocaleString('en-IN')}`);
                console.log(`   Items: ${order.items.length}`);
                console.log(`   Created: ${new Date(order.createdAt).toLocaleString()}`);
                console.log(`   🔗 Tracking URL: http://localhost:3000/account/orders/tracking/${order._id}`);
                console.log('-'.repeat(80));
            });

            console.log(`\n✓ Total Orders: ${orders.length}\n`);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkOrders();
