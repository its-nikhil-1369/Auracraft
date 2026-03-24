"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);
        try {
            const user: any = await login(formData);
            if (user?.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side: Form */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-24 bg-white dark:bg-[#0a0a0a]">
                <Link href="/" className="mb-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <h1 className="text-5xl font-bold tracking-tighter mb-4 uppercase">Sign In</h1>
                    <p className="text-gray-500 mb-10">Access your exclusive AURACRAFT account.</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-900 border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-zinc-900 border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs cursor-pointer text-gray-400">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black" />
                                <span>Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-xs font-bold hover:text-red-500 transition-colors">Forgot Password?</Link>
                        </div>

                        <button
                            disabled={isLoggingIn}
                            className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest hover:bg-red-500 transition-all mt-8 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoggingIn ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-sm text-gray-500 uppercase tracking-widest text-[10px]">
                        Don't have an account? <Link href="/register" className="font-bold text-black dark:text-white hover:text-red-500 transition-colors">Join the Collective</Link>
                    </div>
                </motion.div>
            </div>

            {/* Right side: Image Decor */}
            <div className="hidden lg:block flex-1 relative bg-gray-100">
                <Image
                    src="https://images.unsplash.com/photo-1549037173-e3b717902c57?q=80&w=1200&auto=format&fit=crop"
                    alt="Login Visual"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-20 left-20 right-20 text-white">
                    <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Uncompromising Quality</h2>
                    <p className="max-w-sm opacity-80 leading-relaxed font-medium">Join our community and get early access to our limited drops and seasonal campaigns.</p>
                </div>
            </div>
        </div>
    );
}

import Image from 'next/image';
