import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://itsnikhilpawark_db_user:fmULuf369sx66OLV@cluster0.xdb7w22.mongodb.net/clothing-store?retryWrites=true&w=majority&appName=Cluster0";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBanned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

async function checkUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB Atlas\n');

        const User = mongoose.models.User || mongoose.model('User', UserSchema);
        const users = await User.find({}, { password: 0 });

        console.log('📊 REGISTERED USERS:');
        console.log('='.repeat(60));
        users.forEach((user) => {
            console.log(`\nName: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role.toUpperCase()}`);
            console.log(`Banned: ${user.isBanned ? 'YES' : 'NO'}`);
            console.log(`Created: ${new Date(user.createdAt).toLocaleString()}`);
            console.log('-'.repeat(60));
        });

        const adminCount = users.filter((u) => u.role === 'admin').length;
        console.log(`\n✓ Total Users: ${users.length}`);
        console.log(`✓ Admin Users: ${adminCount}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkUsers();
