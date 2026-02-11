"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/admin/stats');
            setData(res.data);
        } catch (err) {
            console.error('Dash error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const stats = [
        {
            label: 'Total Revenue',
            value: `₹${data?.stats?.revenue?.toLocaleString('en-IN') || '0'}`,
            icon: DollarSign,
            trend: '+12.5%',
            up: true,
            subtitle: 'Net sales'
        },
        {
            label: 'Total Orders',
            value: data?.stats?.orders?.toString() || '0',
            icon: ShoppingBag,
            trend: '+8.4%',
            up: true,
            subtitle: 'Successful checkouts'
        },
        {
            label: 'Registered Users',
            value: data?.stats?.users?.toString() || '0',
            icon: Users,
            trend: '+14.2%',
            up: true,
            subtitle: 'All accounts'
        },
        {
            label: 'Conversion Rate',
            value: `${data?.stats?.conversionRate || '0.00'}%`,
            icon: TrendingUp,
            trend: '+0.5%',
            up: true,
            subtitle: 'Orders per user'
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Synchronizing Global Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16">
            {/* Header section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse transition-all shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Nodes Active</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
                        Pulse <span className="text-red-500">Analytics</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium tracking-wide max-w-md">
                        Real-time financial aggregation and member orchestration for the <span className="text-black dark:text-white font-bold">Lumina</span> ecosystem.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-[#0A0A0A] p-2 rounded-2xl border border-gray-100 dark:border-white/5 shadow-xl">
                    <div className="px-6 py-4 flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Reference Period</span>
                        <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            Current Cycle <Calendar size={12} className="text-red-500" />
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            setIsLoading(true);
                            fetchStats();
                        }}
                        className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all">
                        Refresh Node
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                    const isUsersCard = stat.label === 'Registered Users';
                    const CardWrapper = isUsersCard ? 'a' : 'div';

                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                            onClick={() => isUsersCard && router.push('/admin/users')}
                            className={`group relative bg-white dark:bg-[#0A0A0A] p-10 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden ${isUsersCard ? 'cursor-pointer' : ''}`}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 group-hover:-rotate-12 transition-all duration-1000">
                                <stat.icon size={140} />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                                <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-2xl group-hover:bg-red-500 transition-colors duration-500">
                                        <stat.icon size={24} />
                                    </div>
                                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black tracking-tight ${stat.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {stat.trend}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</h3>
                                    <p className="text-4xl font-black tracking-tighter leading-none mb-4 italic uppercase">{stat.value}</p>
                                    <p className="text-[9px] font-bold text-gray-500 h-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isUsersCard ? 'Click to view all →' : stat.subtitle}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Live Activity Feed */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black uppercase tracking-tighter italic">Transaction <span className="text-red-500">Stream</span></h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors">Clear Stream</button>
                    </div>

                    <div className="bg-white dark:bg-[#0A0A0A] rounded-[48px] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-gray-50 dark:border-white/5">
                                    <tr className="bg-gray-50/50 dark:bg-black/20">
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Entity</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Ops</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Allocation</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                    {(data?.recentOrders || []).map((order: any, i: number) => (
                                        <tr key={order._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-500">
                                            <td className="px-12 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xs font-black uppercase text-gray-400 group-hover:bg-red-500 group-hover:text-white transition-all duration-700">
                                                        {order.user?.name?.[0] || 'U'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm tracking-tight">{order.user?.name || 'Authorized Guest'}</span>
                                                        <span className="text-[10px] font-medium text-gray-400">UID: {order._id.slice(-6).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8">
                                                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black group-hover:bg-red-500 group-hover:text-white transition-colors`}>
                                                    SECURED
                                                </span>
                                            </td>
                                            <td className="px-12 py-8">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm tracking-tight capitalize">{order.items?.[0]?.name || 'Luxury Selection'}{order.items?.length > 1 ? ` & ${order.items.length - 1} more` : ''}</span>
                                                    <span className="text-[10px] font-black text-red-500 mt-1 italic">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data?.recentOrders || data?.recentOrders.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-12 py-32 text-center">
                                                <div className="space-y-4 opacity-20">
                                                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                        <Activity size={40} />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">Zero Feed Activity</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Performance Chart */}
                <div className="space-y-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic text-right">Node <span className="text-red-500">Distribution</span></h3>
                    <div className="bg-white dark:bg-[#0A0A0A] p-12 rounded-[48px] border border-gray-100 dark:border-white/5 shadow-xl h-[640px] flex flex-col relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <div className="flex-1 flex items-end justify-between gap-3 py-10 relative">
                            {[40, 70, 45, 90, 65, 80, 55, 75].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.5 + (i * 0.05), duration: 2, ease: [0.23, 1, 0.32, 1] }}
                                    className="w-full bg-gradient-to-t from-red-500/10 via-red-500 to-black dark:to-white rounded-full opacity-60 hover:opacity-100 transition-all duration-500 relative group/bar"
                                >
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-3 py-2 rounded-[8px] opacity-0 group-hover/bar:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl">
                                        REF {h}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="pt-10 border-t border-gray-50 dark:border-white/5 space-y-8 relative">
                            <div className="flex justify-between items-center bg-gray-50/50 dark:bg-white/5 p-5 rounded-2xl">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                                    <Activity size={14} className="text-green-500 animate-pulse" /> Network Latency
                                </span>
                                <span className="text-sm font-black tracking-tighter italic">12.4ms</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50/50 dark:bg-white/5 p-5 rounded-2xl">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                                    <Users size={14} className="text-red-500 shadow-red-500" /> Global Nodes
                                    {data?.stats?.users || 0}
                                </span>
                                <span className="text-sm font-black tracking-tighter italic">LIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
