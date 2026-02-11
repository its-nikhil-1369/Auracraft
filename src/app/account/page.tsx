"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Settings, LogOut, ArrowRight, ShoppingBag, Heart, Shield, Bell, CreditCard, Paintbrush, Moon, Sun, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type Tab = 'profile' | 'orders' | 'settings';

export default function AccountPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    // Settings States
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    // Orders State - MUST be declared before any conditional returns
    const [orders, setOrders] = useState<any[]>([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        // Sync with system theme or local storage if needed
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) setDarkMode(savedTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    const handleCalibrate = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
    };

    useEffect(() => {
        if (isHydrated && (user === null) && !isLoading) {
            router.push('/login');
        }
    }, [user, isLoading, isHydrated, router]);

    useEffect(() => {
        if (activeTab === 'orders' || activeTab === 'profile') {
            const fetchOrders = async () => {
                setIsOrdersLoading(true);
                try {
                    const res = await fetch('/api/orders');
                    if (res.ok) {
                        const data = await res.json();
                        setOrders(data);
                    }
                } catch (err) {
                    console.error('Failed to fetch orders:', err);
                } finally {
                    setIsOrdersLoading(false);
                }
            };
            fetchOrders();
        }
    }, [activeTab]);

    if (isLoading || !isHydrated) {
        return (
            <div className="pt-40 pb-20 px-4 md:px-12 flex items-center justify-center h-[60vh]">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Profile...</div>
            </div>
        );
    }

    if (!user) return null;

    const stats = [
        { label: 'Total Orders', value: orders.length.toString(), icon: Package },
        { label: 'Wishlist', value: '0', icon: Heart },
        { label: 'Loyalty Tier', value: 'Vanguard', icon: Shield },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        {/* Brief Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white dark:bg-[#0A0A0A] p-8 border border-gray-100 dark:border-white/5 shadow-xl rounded-3xl group hover:border-red-500 transition-all"
                                >
                                    <stat.icon size={20} className="text-red-500 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black tracking-tighter italic">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-gray-50 dark:bg-[#0A0A0A] p-10 md:p-16 rounded-[48px] border border-gray-100 dark:border-white/5 shadow-inner">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-2">Live <span className="text-red-500">Activity</span></h2>
                                    <p className="text-xs text-gray-500 font-medium max-w-sm">Recent events and synchronized updates from your global profile node.</p>
                                </div>
                                {user.role === 'admin' && (
                                    <span className="px-4 py-2 bg-red-500 text-white text-[9px] font-black outline-red-500/20 uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                        Admin Protocol Active
                                    </span>
                                )}
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 border border-white dark:border-white/5 bg-white/50 dark:bg-black/40 backdrop-blur-xl rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
                                    <div>
                                        <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-2">Incoming Module</p>
                                        <h3 className="text-lg font-black uppercase tracking-tight italic">Personalized Aesthetic Engine</h3>
                                    </div>
                                    <button
                                        onClick={handleCalibrate}
                                        disabled={isSaving}
                                        className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : showSaveSuccess ? <Check size={16} /> : null}
                                        {showSaveSuccess ? 'Calibrated' : 'Calibrate Preferences'}
                                    </button>
                                </div>

                                {orders.length > 0 ? (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Latest Acquisition</p>
                                        <div className="p-8 bg-white dark:bg-black/40 rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
                                                    <Package size={24} className="text-red-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-tight italic">Order #{orders[0]._id.slice(-8).toUpperCase()}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{orders[0].orderStatus} • {new Date(orders[0].createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/account/orders/tracking/${orders[0]._id}`}
                                                className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all shadow-lg flex items-center gap-2"
                                            >
                                                Track Acquisition <ArrowRight size={12} />
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-white/10 dark:bg-black/10 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-white/5 group">
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 4 }}
                                        >
                                            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-6 group-hover:text-red-500 transition-colors" />
                                        </motion.div>
                                        <p className="text-gray-400 text-sm font-medium tracking-wide">The archive is currently empty. No acquisitions detected.</p>
                                        <Link href="/" className="bg-black text-white dark:bg-white dark:text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] mt-10 inline-block hover:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all shadow-2xl">
                                            Explore Collection
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            case 'orders':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#0A0A0A] p-10 md:p-16 rounded-[48px] border border-gray-100 dark:border-white/5"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Order <span className="text-red-500">Archive</span></h2>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{orders.length} Records</span>
                        </div>

                        {isOrdersLoading ? (
                            <div className="py-24 text-center">
                                <Loader2 size={32} className="animate-spin mx-auto text-red-500 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Retrieving Transaction History...</p>
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="space-y-6">
                                {orders.map((order, idx) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-8 bg-gray-50 dark:bg-white/5 rounded-[40px] border border-transparent hover:border-red-500/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group"
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform">
                                                <span className="text-[8px] font-black opacity-40 uppercase mb-1">Items</span>
                                                <span className="text-2xl font-black italic leading-none">{order.items.length}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-xl font-black tracking-tight uppercase italic">#{order._id.slice(-8).toUpperCase()}</p>
                                                    <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                    <span className="w-1 h-1 bg-gray-300 dark:bg-white/20 rounded-full" />
                                                    <span className="text-black dark:text-white">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <Link
                                                href={`/account/orders/tracking/${order._id}`}
                                                className="flex-1 md:flex-none px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all shadow-xl flex items-center justify-center gap-2"
                                            >
                                                Track Acquisition <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[32px] text-center space-y-4">
                                <Package size={40} className="mx-auto text-gray-200" />
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">No transaction history found</p>
                                <p className="text-xs text-gray-400 max-w-xs mx-auto">Your sequence of acquisitions will materialize here once processed.</p>
                                <Link href="/" className="inline-block mt-4 text-[10px] font-black text-red-500 uppercase tracking-widest border-b-2 border-red-500 pb-1">Begin Acquisition Sequence</Link>
                            </div>
                        )}
                    </motion.div>
                );
            case 'settings':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#0A0A0A] p-10 md:p-16 rounded-[48px] border border-gray-100 dark:border-white/5"
                    >
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-12">Interface <span className="text-red-500">Settings</span></h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-3xl space-y-6 border border-transparent hover:border-red-500/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-500/10 rounded-2xl">
                                        <User size={20} className="text-red-500" />
                                    </div>
                                    <h3 className="font-black uppercase text-[10px] tracking-widest">Account Blueprint</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Public Identifier</p>
                                        <p className="text-sm font-bold">{user.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Communication Node</p>
                                        <p className="text-sm font-bold">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => alert('Profile editing module loading...')}
                                    className="w-full py-4 text-[9px] font-black uppercase tracking-widest bg-black dark:bg-white dark:text-black text-white rounded-xl hover:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all shadow-lg active:scale-95"
                                >
                                    Edit Core Data
                                </button>
                            </div>

                            <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-3xl space-y-6 border border-transparent hover:border-red-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-500/10 rounded-2xl">
                                        <Paintbrush size={20} className="text-red-500" />
                                    </div>
                                    <h3 className="font-black uppercase text-[10px] tracking-widest">Visual Calibration</h3>
                                </div>
                                <div className="space-y-4">
                                    <div
                                        onClick={toggleTheme}
                                        className="flex items-center justify-between p-4 bg-white dark:bg-black/40 rounded-2xl border border-gray-100 dark:border-white/5 cursor-pointer hover:border-red-500/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            {darkMode ? <Moon size={14} /> : <Sun size={14} />}
                                            <span className="text-[10px] font-bold uppercase">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-all ${darkMode ? 'bg-red-500 justify-end' : 'bg-gray-200 dark:bg-zinc-800 justify-start'}`}>
                                            <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setNotifications(!notifications)}
                                        className="flex items-center justify-between p-4 bg-white dark:bg-black/40 rounded-2xl border border-gray-100 dark:border-white/5 cursor-pointer hover:border-red-500/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Bell size={14} />
                                            <span className="text-[10px] font-bold uppercase">Pulse Alerts</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-all ${notifications ? 'bg-red-500 justify-end' : 'bg-gray-200 dark:bg-zinc-800 justify-start'}`}>
                                            <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="pt-40 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-20">
                {/* Sidebar */}
                <div className="w-full lg:w-80 space-y-12">
                    <div className="space-y-4">
                        <div className="w-20 h-20 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-3xl font-black italic shadow-2xl overflow-hidden border-4 border-red-500/20">
                            {user.name[0]}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">{user.name}</h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-2 italic">{user.email}</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-3">
                        <AccountLink
                            icon={User}
                            label="Profile Blueprint"
                            active={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        />
                        <AccountLink
                            icon={Package}
                            label="Order Archive"
                            active={activeTab === 'orders'}
                            onClick={() => setActiveTab('orders')}
                        />
                        <AccountLink
                            icon={Settings}
                            label="Interface Settings"
                            active={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                        />
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-4 p-5 text-gray-400 hover:text-red-500 transition-all uppercase text-[10px] font-black tracking-[0.2em] bg-gray-50 dark:bg-white/5 rounded-2xl hover:shadow-xl group"
                        >
                            <LogOut size={18} className="group-hover:rotate-12 transition-transform" /> Sign Out from Node
                        </button>
                    </nav>

                    {user.role === 'admin' && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-4 p-5 bg-red-500 text-white rounded-2xl uppercase text-[10px] font-black tracking-[0.2em] shadow-xl hover:bg-black transition-all"
                        >
                            <Shield size={18} /> Access Terminal
                        </Link>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {renderTabContent()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function AccountLink({
    icon: Icon,
    label,
    active = false,
    onClick
}: {
    icon: any,
    label: string,
    active?: boolean,
    onClick?: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-5 p-5 transition-all uppercase text-[10px] font-black tracking-[0.2em] rounded-2xl ${active ? 'bg-black text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)]' : 'text-gray-500 hover:text-black dark:hover:text-white bg-white/50 dark:bg-transparent border border-transparent hover:border-gray-100 dark:hover:border-white/5'}`}
        >
            <Icon size={20} className={active ? 'text-red-500' : ''} /> {label}
        </button>
    );
}
