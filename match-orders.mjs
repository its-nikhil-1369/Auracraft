import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://itsnikhilpawark_db_user:fmULuf369sx66OLV@cluster0.xdb7w22.mongodb.net/clothing-store?retryWrites=true&w=majority&appName=Cluster0";

async function matchOrdersToUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB Atlas\n');

        // Get all users
        const User = mongoose.model('User', new mongoose.Schema({
            name: String,
            email: String,
            role: String
        }));

        const users = await User.find({});

        // Get all orders
        const Order = mongoose.model('Order', new mongoose.Schema({
            user: mongoose.Schema.Types.ObjectId,
            items: Array,
            totalAmount: Number,
            orderStatus: String,
            createdAt: Date
        }));

        const orders = await Order.find({});

        console.log('👥 USER → ORDER MAPPING:');
        console.log('='.repeat(100));

        users.forEach(user => {
            const userOrders = orders.filter(order => order.user.toString() === user._id.toString());

            console.log(`\n📧 ${user.name} (${user.email})`);
            console.log(`   User ID: ${user._id}`);
            console.log(`   Role: ${user.role.toUpperCase()}`);

            if (userOrders.length === 0) {
                console.log(`   📦 Orders: None`);
            } else {
                console.log(`   📦 Orders: ${userOrders.length}`);
                userOrders.forEach((order, idx) => {
                    console.log(`\n   ${idx + 1}. Order ID: ${order._id}`);
                    console.log(`      Status: ${order.orderStatus}`);
                    console.log(`      Total: ₹${order.totalAmount.toLocaleString('en-IN')}`);
                    console.log(`      Items: ${order.items.length}`);
                    console.log(`      Created: ${new Date(order.createdAt).toLocaleString()}`);
                    console.log(`      🔗 Track: http://localhost:3000/account/orders/tracking/${order._id}`);
                });
            }
            console.log('-'.repeat(100));
        });

        console.log(`\n✓ Total Users: ${users.length}`);
        console.log(`✓ Total Orders: ${orders.length}\n`);

        console.log('💡 TO TRACK AN ORDER:');
        console.log('   1. Log in with the email shown above');
        console.log('   2. Use the tracking URL for that user\'s orders\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

matchOrdersToUsers();
