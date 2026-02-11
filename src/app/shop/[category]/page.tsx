"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';

import axios from 'axios';

export default function CategoryPage() {
    const { category } = useParams();
    const catName = (category as string).toLowerCase();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all products
                const res = await axios.get('/api/products');
                const all: any[] = res.data;

                // Filter by category
                const filtered = all.filter(p =>
                    catName === 'all' ||
                    p.category.toLowerCase() === catName
                );

                setProducts(filtered);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [catName]);

    if (isLoading) {
        return (
            <div className="pt-40 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-48 bg-gray-200 dark:bg-zinc-800 rounded mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded mb-12"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 dark:bg-zinc-900 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase">{catName}</h1>
                    <p className="text-gray-500 uppercase tracking-widest font-bold text-xs mt-4">Discover the {catName} collection</p>
                </motion.div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 border border-gray-100 dark:border-white/10 text-xs font-bold uppercase tracking-widest hover:border-black transition-all">
                        <Filter size={14} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 border border-gray-100 dark:border-white/10 text-xs font-bold uppercase tracking-widest hover:border-black transition-all">
                        Sort By <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-12">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ProductCard
                            id={product._id || product.id}
                            name={product.name}
                            price={product.price}
                            image={product.images && product.images.length > 0 ? product.images[0] : product.image}
                            category={product.category}
                        />
                    </motion.div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="py-40 text-center">
                    <h3 className="text-2xl font-bold uppercase tracking-tighter">No products found in this category.</h3>
                    <p className="text-gray-500 mt-4">Try checking another collection or stay tuned for our upcoming drops.</p>
                </div>
            )}
        </div>
    );
}
