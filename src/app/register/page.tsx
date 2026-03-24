"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const user: any = await register(formData);
            if (user?.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Visual side panel */}
            <div className="hidden lg:block flex-1 relative bg-gray-100">
                <Image
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
                    alt="Register Visual"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-20 left-20 right-20 text-white">
                    <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">AURACRAFT PRIVILEGE</h2>
                    <p className="max-w-sm opacity-80 leading-relaxed font-medium text-lg">Experience the next generation of luxury fashion with personalized recommendations and priority shipping.</p>
                </div>
            </div>

            {/* Form side */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-24 bg-white dark:bg-[#0a0a0a]">
                <Link href="/login" className="mb-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors">
                    <ArrowLeft size={16} /> Back to Sign In
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <h1 className="text-5xl font-bold tracking-tighter mb-4 uppercase">Join Us</h1>
                    <p className="text-gray-500 mb-10">Create your account to start your journey.</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-900 border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                />
                            </div>
                        </div>

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

                        <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-widest">
                            By creating an account, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                        </p>

                        <button
                            disabled={isSubmitting}
                            className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest hover:bg-red-500 transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-sm text-gray-500">
                        Already have an account? <Link href="/login" className="font-bold text-black dark:text-white hover:text-red-500">Sign In</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

import Image from 'next/image';
