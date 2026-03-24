import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBanned: { type: Boolean, default: false },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default models.User || model('User', UserSchema);
