import dbConnect from './src/lib/db';
import User from './src/models/User';

async function checkUsers() {
    try {
        const MONGODB_URI = "mongodb+srv://itsnikhilpawark_db_user:fmULuf369sx66OLV@cluster0.xdb7w22.mongodb.net/clothing-store?retryWrites=true&w=majority&appName=Cluster0";
        const mongoose = await import('mongoose');
        await mongoose.default.connect(MONGODB_URI);
        console.log('Connected to Atlas.');
        const users = await User.find({}, { password: 0 }); // Don't show passwords
        console.log('Registered Users:', JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error checking users:', error);
        process.exit(1);
    }
}

checkUsers();
