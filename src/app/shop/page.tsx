"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Newest');

    const categories = ['All', 'Male', 'Female', 'Kids'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (sortBy === 'Price: Low to High') return a.price - b.price;
        if (sortBy === 'Price: High to Low') return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="pt-32 pb-20 bg-white dark:bg-[#0A0A0A] min-h-screen">
            {/* Header */}
            <header className="max-w-7xl mx-auto px-4 md:px-12 mb-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                    <div className="space-y-4">
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em]">Seasonal Catalog</p>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">The <span className="text-red-500">Flux</span> Collection</h1>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center py-8 border-y border-gray-100 dark:border-white/5">
                    <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-xl scale-105'
                                        : 'bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-red-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Locate Archive..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 pl-14 pr-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-[10px] font-bold uppercase tracking-widest"
                            />
                        </div>

                        <div className="relative group">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-black text-white dark:bg-white dark:text-black pl-8 pr-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:bg-red-500 transition-all shadow-xl"
                            >
                                <option>Newest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white dark:text-black group-hover:text-white" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Product Grid */}
            <main className="max-w-7xl mx-auto px-4 md:px-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="space-y-4">
                                <div className="aspect-[3/4] bg-gray-100 dark:bg-white/5 rounded-[32px] animate-pulse" />
                                <div className="h-4 w-3/4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                                <div className="h-4 w-1/4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <ProductCard
                                    id={product._id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.images[0]}
                                    category={product.category}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[40vh] flex flex-col items-center justify-center space-y-6 opacity-20">
                        <SlidersHorizontal size={64} />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">No synchronization with current filters</p>
                    </div>
                )}
            </main>
        </div>
    );
}
