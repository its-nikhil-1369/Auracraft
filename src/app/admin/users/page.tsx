"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Mail, Shield, ShieldAlert, Search, MoreVertical, ExternalLink, User as UserIcon, Ban, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBanUser = async (userId: string, currentStatus: any) => {
        // Force boolean
        const isCurrentlyBanned = !!currentStatus;

        try {
            console.log('🔘 User Action: Change ban status');
            console.log('User ID:', userId);
            console.log('Current Status:', isCurrentlyBanned);

            const newStatus = !isCurrentlyBanned;

            const confirmMsg = isCurrentlyBanned
                ? "Are you sure you want to UNBAN this user?"
                : "Are you sure you want to BAN this user?";

            if (!window.confirm(confirmMsg)) {
                console.log('Action cancelled by user');
                return;
            }

            console.log('🚀 Sending request:', { isBanned: newStatus });
            const res = await axios.patch(`/api/admin/users/${userId}/ban`, { isBanned: newStatus });
            console.log('✅ Response:', res.data);

            // Optimistic update
            setUsers(currentUsers =>
                currentUsers.map(u =>
                    u._id === userId ? { ...u, isBanned: newStatus } : u
                )
            );

            setActiveMenu(null);
        } catch (err: any) {
            console.error('❌ Ban error:', err);
            alert(err.response?.data?.error || 'Operation failed');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === 'active') return matchesSearch && !user.isBanned;
        if (statusFilter === 'suspended') return matchesSearch && user.isBanned;
        return matchesSearch;
    });

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Identity Directory</p>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">Member <span className="text-red-500">Base</span></h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
                        {(['all', 'active', 'suspended'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === s
                                    ? 'bg-white dark:bg-black text-black dark:text-white shadow-lg'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 md:flex-none group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-red-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Identify Member..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 pl-16 pr-8 py-5 rounded-2xl outline-none focus:border-red-500 w-full md:w-80 text-xs font-bold tracking-widest uppercase transition-all shadow-xl"
                        />
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="h-24 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#0A0A0A] rounded-[48px] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-black/20">
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Full Profile</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Credentials</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Access Level</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Registry Date</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">State</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">CMD</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-500 ${user.isBanned ? 'opacity-50' : ''}`}>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xs font-black uppercase text-gray-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-500">
                                                    {user.name?.[0] || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`font-bold text-sm tracking-tight ${user.isBanned ? 'line-through' : ''}`}>{user.name || 'Anonymous User'}</span>
                                                    <span className="text-[10px] font-medium text-gray-400 italic">ID: {user._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                                                <Mail size={14} className="text-red-500" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-2">
                                                {user.role === 'admin' ? <ShieldAlert size={14} className="text-red-500" /> : <Shield size={14} className="text-gray-400" />}
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-gray-300">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${user.isBanned ? 'text-red-500' : 'text-green-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.isBanned ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
                                                {user.isBanned ? 'Suspended' : 'Active'}
                                            </div>
                                        </td>
                                        <td className="px-12 py-8 relative">
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === user._id ? null : user._id)}
                                                className="text-gray-300 hover:text-black dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            <AnimatePresence>
                                                {activeMenu === user._id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        className="absolute right-12 top-16 z-50 w-48 bg-white dark:bg-black border border-gray-100 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden p-2"
                                                    >
                                                        <button
                                                            disabled={user.role === 'admin'}
                                                            onClick={() => handleBanUser(user._id, user.isBanned)}
                                                            className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${user.role === 'admin'
                                                                ? 'opacity-20 cursor-not-allowed'
                                                                : user.isBanned
                                                                    ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10'
                                                                    : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                                                                }`}
                                                        >
                                                            {user.isBanned ? <Unlock size={14} /> : <Ban size={14} />}
                                                            {user.isBanned ? 'Unban Member' : 'Ban Member'}
                                                        </button>
                                                        <div className="h-[1px] bg-gray-50 dark:bg-white/5 my-1" />
                                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all rounded-xl">
                                                            <ExternalLink size={14} /> View History
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-12 py-32 text-center">
                                            <div className="space-y-4 opacity-20">
                                                <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                    <Users size={40} />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Entities Found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="flex justify-center pt-8">
                <button
                    onClick={() => fetchUsers()}
                    className="flex items-center gap-3 px-8 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black dark:hover:text-white transition-all shadow-xl"
                >
                    Refresh Directory <ExternalLink size={14} />
                </button>
            </div>

            {/* Click outside to close menu */}
            {activeMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveMenu(null)}
                />
            )}
        </div>
    );
}
