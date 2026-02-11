"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Save, Search, Filter, Image as ImageIcon, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    colors: string[];
    sizes: string[];
    stock: number;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Male',
        images: '',
        colors: '',
        sizes: '',
        stock: '10'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            if (Array.isArray(res.data)) {
                setProducts(res.data);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                description: product.description,
                category: product.category,
                images: product.images.join(','),
                colors: product.colors.join(','),
                sizes: product.sizes.join(','),
                stock: product.stock.toString()
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                description: '',
                category: 'Male',
                images: '',
                colors: '',
                sizes: '',
                stock: '10'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            images: formData.images.split(',').map(s => s.trim()).filter(s => s),
            colors: formData.colors.split(',').map(s => s.trim()).filter(s => s),
            sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s)
        };

        try {
            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct._id}`, formattedData);
            } else {
                await axios.post('/api/products', formattedData);
            }
            fetchProducts();
            handleCloseModal();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Something went wrong');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        try {
            await axios.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Inventory Module</p>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">Vault <span className="text-red-500">Inventory</span></h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-red-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Identify product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 pl-16 pr-8 py-5 rounded-2xl outline-none focus:border-red-500 w-full sm:w-80 text-xs font-bold tracking-widest uppercase transition-all shadow-xl"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/10 dark:shadow-white/5"
                    >
                        <Plus size={18} /> New Product
                    </button>
                </div>
            </header>

            {/* Content Area */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="h-64 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#0A0A0A] rounded-[48px] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-black/20">
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Visual Identification</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Classification</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Valuation</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Units</th>
                                    <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {filteredProducts.map((product) => (
                                    <motion.tr
                                        layout
                                        key={product._id}
                                        className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-500"
                                    >
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-20 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                    {product.images[0] ? (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-base tracking-tight">{product.name}</span>
                                                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase opacity-50 italic">UID: {product._id.slice(-6)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-12 py-8">
                                            <span className="text-xl font-black tracking-tighter italic">${product.price.toLocaleString()}</span>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-3">
                                                <Package size={14} className={product.stock < 10 ? 'text-red-500' : 'text-green-500'} />
                                                <span className={`text-sm font-bold tracking-tight ${product.stock < 10 ? 'text-red-500 underline decoration-2 underline-offset-4' : ''}`}>
                                                    {product.stock}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-white/10 shadow-lg hover:shadow-xl transition-all"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shadow-lg hover:shadow-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-12 py-32 text-center">
                                            <div className="space-y-4 opacity-20">
                                                <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                    <Search size={40} />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Assets Identified</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal - Ultra-Premium Version */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                            onClick={handleCloseModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-4xl bg-[#FDFDFD] dark:bg-[#0A0A0A] rounded-[48px] shadow-2xl p-12 max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-white/5"
                        >
                            <div className="flex justify-between items-start mb-16">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Resource Modification</p>
                                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                                        {editingProduct ? 'Update Asset' : 'Inject Resource'}
                                    </h2>
                                </div>
                                <button onClick={handleCloseModal} className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2 block">Canonical Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl text-base font-bold tracking-tight focus:border-red-500 outline-none transition-all shadow-inner"
                                        placeholder="e.g. Minimalist Tech Bomber"
                                    />
                                </div>

                                <div className="space-y-8">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2 block">Market Valuation ($)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl text-base font-bold tracking-tight focus:border-red-500 outline-none transition-all shadow-inner"
                                    />
                                </div>

                                <div className="space-y-8">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2 block">Inventory Quota</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl text-base font-bold tracking-tight focus:border-red-500 outline-none transition-all shadow-inner"
                                    />
                                </div>

                                <div className="space-y-8 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2 block">Narrative Specification</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl text-base font-bold tracking-tight focus:border-red-500 outline-none transition-all shadow-inner resize-none"
                                        placeholder="Describe the aesthetic and material composition..."
                                    />
                                </div>

                                <div className="space-y-8">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2 block">Taxonomy (Category)</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl text-xs font-black uppercase tracking-[0.2em] outline-none transition-all"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>

                                <div className="space-y-8">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2 block">Dimensional Toggles (Sizes)</label>
                                    <input
                                        type="text"
                                        placeholder="S, M, L, XL"
                                        value={formData.sizes}
                                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                        className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl text-base font-bold tracking-tight focus:border-red-500 outline-none transition-all shadow-inner"
                                    />
                                </div>

                                <div className="space-y-8 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2 block">Visual Assets (CSV URLs)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.images}
                                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                                        className="w-full bg-[#FAFAFA] dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-2xl text-sm font-medium focus:border-red-500 outline-none transition-all shadow-inner"
                                        placeholder="https://image1.jpg, https://image2.jpg"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 pt-12">
                                    <button
                                        type="submit"
                                        className="w-full bg-black dark:bg-white text-white dark:text-black py-8 rounded-[24px] text-[12px] font-black uppercase tracking-[0.4em] hover:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 group"
                                    >
                                        <Save size={20} className="group-hover:scale-125 transition-transform" />
                                        {editingProduct ? 'Commit Changes' : 'Execute Initial Injection'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
