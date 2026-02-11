"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Truck, Home, CheckCircle2, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function OrderTrackingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`/api/orders/${id}`);
                setOrder(res.data);
            } catch (err) {
                console.error('Failed to fetch order:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (isLoading) {
        return (
            <div className="pt-40 pb-20 px-4 flex items-center justify-center">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Establishing Satellite Uplink...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="pt-40 pb-20 px-4 text-center">
                <h1 className="text-4xl font-bold uppercase tracking-tighter">Order Signal Lost</h1>
                <p className="mt-4 text-gray-500 uppercase text-xs tracking-widest">We couldn't locate the requested acquisition.</p>
                <Link href="/account" className="mt-8 inline-block bg-black text-white px-8 py-4 font-bold uppercase text-[10px] tracking-widest">Return to Dashboard</Link>
            </div>
        );
    }

    const statuses = [
        { id: 'Confirmed', icon: Clock, label: 'Confirmed' },
        { id: 'Processing', icon: Package, label: 'Processing' },
        { id: 'Packaging', icon: Package, label: 'Packaging' },
        { id: 'Shipped', icon: Truck, label: 'Shipped' },
        { id: 'On the Road', icon: Truck, label: 'On the Road' },
        { id: 'Delivered', icon: Home, label: 'Delivered' },
    ];

    const currentStatusIndex = statuses.findIndex(s => s.id === order.orderStatus);

    return (
        <div className="pt-40 pb-20 px-4 md:px-12 max-w-5xl mx-auto">
            <Link href="/account" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors mb-12">
                <ArrowLeft size={14} /> Back to Archive
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                <div className="space-y-4">
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em]">Tracking Protocol</p>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                        Acquisition <span className="text-red-500">#{order._id.slice(-8).toUpperCase()}</span>
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Expected Delivery</p>
                    <p className="text-2xl font-black tracking-tighter italic uppercase text-green-500">Scheduled</p>
                </div>
            </div>

            {/* Live Map Visualization */}
            <div className="mb-12">
                <div className="bg-gray-100 dark:bg-white/5 rounded-[48px] overflow-hidden relative border border-gray-200 dark:border-white/10 aspect-21/9 md:aspect-3/1">
                    {/* Stylized Grid Background */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                    <div className="absolute inset-0 flex items-center justify-between px-12 md:px-32">
                        {/* Source Hub */}
                        <div className="relative flex flex-col items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-black dark:bg-white" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Dispatch Hub</span>
                        </div>

                        {/* Connection Line */}
                        <div className="flex-1 h-[2px] bg-gray-200 dark:bg-white/10 mx-4 relative overflow-hidden">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 w-1/3 bg-linear-to-r from-transparent via-red-500 to-transparent"
                            />
                        </div>

                        {/* Destination */}
                        <div className="relative flex flex-col items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-black dark:border-white" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Your Location</span>
                        </div>

                        {/* Current Position Marker (Animated) */}
                        <motion.div
                            className="absolute top-1/2 left-0 -translate-y-1/2 -ml-3"
                            animate={{
                                left: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`
                            }}
                            transition={{ duration: 1.5, type: "spring" }}
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 w-6 h-6 bg-red-500 rounded-full opacity-20 -translate-x-1.5 -translate-y-1.5"
                                />
                                <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] z-10" />
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                                    {order.orderStatus}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="absolute bottom-6 left-8 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Live Satellite Feed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stepper */}
            <div className="bg-white dark:bg-[#0A0A0A] p-12 rounded-[48px] border border-gray-100 dark:border-white/5 shadow-2xl mb-12">
                <div className="relative flex justify-between items-center w-full overflow-x-auto no-scrollbar pb-4">
                    {/* Progress Bar */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-white/5" />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-red-500"
                    />

                    {statuses.map((s, idx) => {
                        const Icon = s.icon;
                        const isCompleted = idx < currentStatusIndex;
                        const isActive = idx === currentStatusIndex;

                        return (
                            <div key={s.id} className="relative z-10 flex flex-col items-center gap-4 min-w-[100px]">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-black dark:bg-white text-white dark:text-black' :
                                    isActive ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' :
                                        'bg-gray-100 dark:bg-white/5 text-gray-300'
                                    }`}>
                                    {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${isActive ? 'text-black dark:text-white' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Tracking Logs */}
                <div className="lg:col-span-2 space-y-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Movement <span className="text-red-500">History</span></h3>
                    <div className="space-y-6">
                        {order.trackingHistory?.slice().reverse().map((log: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-8 relative pl-8 border-l-2 border-dashed border-gray-100 dark:border-white/5 last:border-0"
                            >
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 border-4 border-white dark:border-[#0A0A0A]" />
                                <div className="flex-1 pb-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-black uppercase tracking-tight">{log.status}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium mb-3">{log.message}</p>
                                    <div className="flex items-center gap-2 text-[9px] font-black text-red-500 uppercase tracking-widest">
                                        <MapPin size={12} /> {log.location}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Shipping Details */}
                <div className="space-y-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Shipping <span className="text-red-500">Destiny</span></h3>
                    <div className="bg-gray-50 dark:bg-white/5 p-10 rounded-[40px] border border-gray-100 dark:border-white/5">
                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Receiver</p>
                                <p className="text-lg font-black tracking-tighter uppercase italic">{order.user?.name || 'Authorized Client'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Coordinates</p>
                                <div className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-widest wrap-break-word">
                                    {order.shippingAddress.street}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.zip}<br />
                                    {order.shippingAddress.country}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Contact Terminal</p>
                                <p className="text-sm font-bold text-red-500">{order.shippingAddress.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black dark:bg-white p-8 rounded-[40px] text-white dark:text-black">
                        <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60 mb-4">Support Protocol</p>
                        <p className="text-xs font-bold leading-relaxed mb-6 uppercase tracking-widest">Need operational assistance with this acquisition?</p>
                        <button className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all">
                            Initiate Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
