"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
    const [isLoaded, setIsLoaded] = useState(false);

    React.useEffect(() => {
        setIsLoaded(true);
    }, []);

    const subtotal = totalPrice;
    const shipping = subtotal > 1500 ? 0 : 149.00;
    const total = subtotal + shipping;

    if (!isLoaded) return <div className="min-h-screen bg-white" />;

    if (cart.length === 0) {
        return (
            <div className="pt-40 pb-20 px-8 text-center min-h-[70vh] flex flex-col items-center justify-center">
                <ShoppingBag size={64} className="text-gray-200 mb-6" />
                <h2 className="text-3xl font-bold tracking-tighter uppercase mb-4">Your bag is empty</h2>
                <p className="text-gray-500 mb-10 max-w-xs">Looks like you haven't added anything to your bag yet.</p>
                <Link href="/shop/all" className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-red-500 transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-40 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold tracking-tighter uppercase mb-2">Your Bag</h1>
            <p className="text-gray-500 mb-12 uppercase text-xs tracking-widest font-bold">Items: {cart.length}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence>
                        {cart.map((item) => (
                            <motion.div
                                key={`${item.id}-${item.size}-${item.color}`}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex gap-6 pb-8 border-b border-gray-100"
                            >
                                <div className="relative w-32 aspect-3/4 bg-gray-50">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold uppercase tracking-tight">{item.name}</h3>
                                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{item.color} / Size {item.size}</p>
                                        </div>
                                        <p className="font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                                    </div>

                                    <div className="flex justify-between items-center mt-6">
                                        <div className="flex items-center border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                                                className="p-2 hover:bg-gray-100 disabled:opacity-30"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                                                className="p-2 hover:bg-gray-100"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 dark:bg-zinc-900 p-8">
                        {/* Steps Indicator */}
                        <div className="flex justify-between items-center mb-8 text-[10px] uppercase font-bold tracking-widest">
                            <div className="flex items-center gap-2 text-black dark:text-white">
                                <span className="bg-black dark:bg-white text-white dark:text-black w-5 h-5 rounded-full flex items-center justify-center text-[9px]">1</span>
                                Bag
                            </div>
                            <div className="h-px bg-gray-200 w-8" />
                            <div className="flex items-center gap-2 text-gray-400">
                                <span className="border border-gray-300 w-5 h-5 rounded-full flex items-center justify-center text-[9px]">2</span>
                                Delivery
                            </div>
                            <div className="h-px bg-gray-200 w-8" />
                            <div className="flex items-center gap-2 text-gray-400">
                                <span className="border border-gray-300 w-5 h-5 rounded-full flex items-center justify-center text-[9px]">3</span>
                                Payment
                            </div>
                        </div>

                        <h2 className="text-xl font-bold uppercase tracking-tighter mb-8 pb-4 border-b border-gray-200 dark:border-white/10">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-bold">{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax</span>
                                <span className="font-bold">GST Included</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-white/10 mb-8">
                            <span className="font-bold uppercase tracking-widest text-sm">Total</span>
                            <span className="text-2xl font-bold tracking-tighter">₹{total.toLocaleString('en-IN')}</span>
                        </div>

                        <Link href="/checkout" className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest hover:bg-red-500 transition-all flex items-center justify-center gap-3">
                            Checkout Now <ArrowRight size={20} />
                        </Link>

                        <div className="mt-6 flex flex-col gap-3">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">We accept:</p>
                            <div className="flex justify-center gap-4 opacity-50 grayscale">
                                <div className="w-8 h-5 bg-black" />
                                <div className="w-8 h-5 bg-black" />
                                <div className="w-8 h-5 bg-black" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
