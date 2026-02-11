"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListOrdered, Package, Search, Filter, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/admin/orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (orderId: string) => {
        setIsDeleting(true);
        try {
            console.log('Attempting to delete order:', orderId);
            const response = await axios.delete(`/api/admin/orders/${orderId}`);
            console.log('Delete response:', response.data);

            // Remove from local state
            setOrders(orders.filter(order => order._id !== orderId));
            setDeleteConfirm(null);

            // Show success message
            alert('✓ Order deleted successfully!');
        } catch (err: any) {
            console.error('Failed to delete order:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to delete order';
            alert(`❌ Error: ${errorMessage}`);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Transaction Logs</p>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">Order <span className="text-red-500">Flux</span></h1>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-red-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find Order Node..."
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
                <div className="bg-white dark:bg-[#0A0A0A] rounded-[48px] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-black/20">
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Order Ref</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Customer</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Date</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Shipping</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Items</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Total</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</th>
                                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-500">
                                        <td className="px-6 py-5">
                                            <span className="font-black text-xs tracking-tight text-red-500">#{order._id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs tracking-tight truncate max-w-[120px]">{order.user?.name || 'Guest'}</span>
                                                <span className="text-[9px] text-gray-400 font-medium truncate max-w-[120px]">{order.user?.email || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[10px] tracking-tight truncate max-w-[100px]">{order.shippingAddress?.city || 'N/A'}</span>
                                                <span className="text-[8px] text-red-500/70 font-black tracking-widest truncate max-w-[100px]">{order.shippingAddress?.phone || 'NO PHONE'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-[10px] font-black">
                                                {order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-black text-sm tracking-tighter italic">₹{(order.totalAmount / 1000).toFixed(1)}k</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1">
                                                {order.orderStatus === 'Processing' && <Clock size={10} className="text-amber-500" />}
                                                {order.orderStatus === 'Shipped' && <Package size={10} className="text-blue-500" />}
                                                {order.orderStatus === 'Delivered' && <CheckCircle2 size={10} className="text-green-500" />}
                                                {order.orderStatus === 'Cancelled' && <AlertCircle size={10} className="text-red-500" />}
                                                <span className={`text-[8px] font-black uppercase tracking-widest ${order.orderStatus === 'Processing' ? 'text-amber-500' :
                                                    order.orderStatus === 'Shipped' ? 'text-blue-500' :
                                                        order.orderStatus === 'Delivered' ? 'text-green-500' : 'text-red-500'
                                                    }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => setDeleteConfirm(order._id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all duration-300 group"
                                                title="Delete Order"
                                            >
                                                <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-12 py-32 text-center">
                                            <div className="space-y-4 opacity-20">
                                                <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                    <ListOrdered size={40} />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Transactions Detected</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="text-center opacity-30 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Global Transaction End</p>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => !isDeleting && setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <Trash2 size={20} className="text-red-500" />
                                </div>
                                <button
                                    onClick={() => !isDeleting && setDeleteConfirm(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                                    disabled={isDeleting}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <h3 className="text-xl font-black tracking-tighter uppercase mb-3">
                                Terminate <span className="text-red-500">Order</span>?
                            </h3>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                Permanently remove order <span className="font-black text-red-500">#{deleteConfirm.slice(-8).toUpperCase()}</span> from the system. Cannot be reversed.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
