"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zip: '',
        country: 'India',
        phone: ''
    });

    const shippingCost = shippingMethod === 'express' ? 15 : 0;
    const finalTotal = totalPrice + shippingCost;

    const [orderId, setOrderId] = useState<string | null>(null);

    const handleCompletePurchase = async () => {
        if (cart.length === 0) return;
        if (!formData.address || !formData.city || !formData.zip) {
            alert('Please fill in shipping details');
            return;
        }

        setIsProcessing(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        product: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    })),
                    totalAmount: finalTotal,
                    shippingAddress: {
                        street: formData.address,
                        city: formData.city,
                        zip: formData.zip,
                        state: formData.lastName, // Just reuse or add more fields
                        country: formData.country,
                        phone: formData.phone
                    }
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to place order');
            }

            const data = await res.json();
            setOrderId(data._id);
            setIsSuccess(true);
            clearCart();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-8 max-w-lg"
                >
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={48} className="text-green-500" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tighter uppercase">Order Confirmed!</h1>
                        <p className="text-gray-500 uppercase text-xs tracking-widest leading-relaxed">
                            Thank you for your purchase. We've sent a confirmation email to your registered address.
                            Your order will arrive in {shippingMethod === 'express' ? '1-2' : '3-5'} business days.
                        </p>
                    </div>
                    <div className="pt-4 grid grid-cols-1 gap-4">
                        {orderId && (
                            <Link
                                href={`/account/orders/tracking/${orderId}`}
                                className="inline-block w-full px-12 py-5 bg-red-500 text-white font-bold uppercase tracking-widest hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all"
                            >
                                Track Your Order
                            </Link>
                        )}
                        <Link
                            href="/"
                            className="inline-block w-full px-12 py-5 border-2 border-black dark:border-white text-black dark:text-white font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <header className="bg-white dark:bg-black border-b dark:border-white/10 py-6 px-8 flex justify-between items-center sticky top-0 z-50">
                <Link href="/cart" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-red-500 transition-colors">
                    <ArrowLeft size={14} /> Back to Bag
                </Link>
                <h1 className="text-xl font-bold tracking-tighter uppercase">AURACRAFT<span className="text-red-500">.</span> CHECKOUT</h1>
                <div className="flex items-center gap-2 text-gray-400">
                    <Lock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Information Form */}
                <div className="space-y-12">
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tighter uppercase">1. Shipping Information</h2>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step 1 of 3</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">First Name</label>
                                <input
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 outline-none focus:border-black dark:focus:border-white transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 outline-none focus:border-black dark:focus:border-white transition-all text-sm"
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Address line 1</label>
                                <input
                                    type="text"
                                    placeholder="Fashion Street, Bandra West"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 outline-none focus:border-black dark:focus:border-white transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City</label>
                                <input
                                    type="text"
                                    placeholder="Mumbai"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 outline-none focus:border-black dark:focus:border-white transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Postal Code</label>
                                <input
                                    type="text"
                                    placeholder="400001"
                                    value={formData.zip}
                                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                    className="w-full p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 outline-none focus:border-black dark:focus:border-white transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 outline-none focus:border-black dark:focus:border-white transition-all text-sm"
                                />
                            </div>
                        </div>
                    </section>


                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tighter uppercase">2. Shipping Method</h2>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step 2 of 3</span>
                        </div>
                        <div className="space-y-4">
                            <div
                                onClick={() => setShippingMethod('express')}
                                className={`flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-black dark:border-white' : 'border-transparent hover:border-gray-200 dark:hover:border-white/10'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${shippingMethod === 'express' ? 'border-black dark:border-white' : 'border-gray-300'}`}>
                                        {shippingMethod === 'express' && <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-tight">Express Delivery</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">1-2 Business Days</p>
                                    </div>
                                </div>
                                <span className="font-bold text-sm">₹499.00</span>
                            </div>

                            <div
                                onClick={() => setShippingMethod('standard')}
                                className={`flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border-2 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-black dark:border-white' : 'border-transparent hover:border-gray-200 dark:hover:border-white/10'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${shippingMethod === 'standard' ? 'border-black dark:border-white' : 'border-gray-300'}`}>
                                        {shippingMethod === 'standard' && <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-tight">Standard Shipping</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">3-5 Business Days</p>
                                    </div>
                                </div>
                                <span className="font-bold text-sm uppercase tracking-widest text-green-600">Free</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tighter uppercase">3. Payment</h2>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step 3 of 3</span>
                        </div>
                        <button
                            onClick={handleCompletePurchase}
                            disabled={isProcessing || cart.length === 0}
                            className="group relative w-full bg-black dark:bg-white dark:text-black text-white py-6 font-bold uppercase tracking-[0.2em] hover:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Processing Order...
                                    </>
                                ) : (
                                    'Complete Purchase'
                                )}
                            </span>
                        </button>
                        <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted Secure Payment</span>
                        </div>
                    </section>
                </div>

                {/* Cart Sidebar */}
                <div className="lg:sticky lg:top-32 h-fit space-y-8">
                    <div className="bg-white dark:bg-zinc-900 p-8 border border-gray-100 dark:border-white/5">
                        {/* Steps Indicator */}
                        <div className="flex justify-between items-center mb-8 text-[10px] uppercase font-bold tracking-widest">
                            <div className="flex items-center gap-2 text-gray-400">
                                <span className="border border-gray-300 w-5 h-5 rounded-full flex items-center justify-center text-[9px]">1</span>
                                Bag
                            </div>
                            <div className="h-px bg-gray-200 w-8" />
                            <div className="flex items-center gap-2 text-black dark:text-white">
                                <span className="bg-black dark:bg-white text-white dark:text-black w-5 h-5 rounded-full flex items-center justify-center text-[9px]">2</span>
                                Delivery
                            </div>
                            <div className="h-px bg-gray-200 w-8" />
                            <div className="flex items-center gap-2 text-gray-400">
                                <span className="border border-gray-300 w-5 h-5 rounded-full flex items-center justify-center text-[9px]">3</span>
                                Payment
                            </div>
                        </div>

                        <h3 className="font-bold uppercase tracking-widest text-xs mb-8 pb-4 border-b dark:border-white/5">Order Summary</h3>

                        <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar mb-8">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                                        <div className="w-20 aspect-3/4 bg-gray-50 dark:bg-black relative overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-tight truncate max-w-[150px]">{item.name}</h4>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                                                    {item.color} / {item.size}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                                                <span className="text-sm font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 text-center py-8">Your bag is empty</p>
                            )}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                                <span>Subtotal</span>
                                <span className="text-black dark:text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                                <span>Shipping ({shippingMethod})</span>
                                <span className="text-black dark:text-white">
                                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-8 mt-4 border-t-2 border-black dark:border-white">
                                <span className="font-bold uppercase tracking-widest text-xs">Total Amount</span>
                                <span className="text-3xl font-bold tracking-tighter">₹{finalTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Free Returns</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2 leading-relaxed">
                            Not happy with your purchase? Send it back within 24 hours for a full refund.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
