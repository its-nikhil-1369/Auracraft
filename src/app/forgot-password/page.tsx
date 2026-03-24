"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsSubmitting(true);
        

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset instructions have been sent to your email.');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.error || 'Failed to send reset instructions.');
            }
        } catch (err: any) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side: Form */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-24 bg-white dark:bg-[#0a0a0a]">
                <Link href="/login" className="mb-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <h1 className="text-5xl font-bold tracking-tighter mb-4 uppercase">Reset Password</h1>
                    <p className="text-gray-500 mb-10">Enter your email address and we'll send you instructions to reset your password.</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}
                        
                        {message && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-500 text-xs font-bold uppercase tracking-widest border border-green-100 dark:border-green-900/30">
                                {message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-900 border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                />
                            </div>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest hover:bg-red-500 transition-all mt-8 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-sm text-gray-500 uppercase tracking-widest text-[10px]">
                        Remember your password? <Link href="/login" className="font-bold text-black dark:text-white hover:text-red-500 transition-colors">Back to Sign In</Link>
                    </div>
                </motion.div>
            </div>

            {/* Right side: Image Decor */}
            <div className="hidden lg:block flex-1 relative bg-gray-100">
                <Image
                    src="https://images.unsplash.com/photo-1549037173-e3b717902c57?q=80&w=1200&auto=format&fit=crop"
                    alt="Reset Password Visual"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-20 left-20 right-20 text-white">
                    <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Password Recovery</h2>
                    <p className="max-w-sm opacity-80 leading-relaxed font-medium">We'll help you regain access to your account securely and quickly.</p>
                </div>
            </div>
        </div>
    );
}
