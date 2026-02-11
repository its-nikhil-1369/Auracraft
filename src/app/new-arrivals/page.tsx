"use client";

import React from 'react';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';

import axios from 'axios';
import { useState, useEffect } from 'react';

export default function NewArrivalsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                // Sort by createdAt desc is ideal, but here we just take the last 20 added or similar
                // Assuming API returns them, let's reverse to see newest seeds
                setProducts(res.data.reverse().slice(0, 40));
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (isLoading) {
        return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-pulse">Loading...</div></div>;
    }

    return (
        <div className="pt-32 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs">Fresh from the studio</span>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mt-4">NEW ARRIVALS</h1>
                    <p className="text-gray-500 uppercase tracking-widest font-bold text-xs mt-6 max-w-lg leading-relaxed">
                        Explore our latest drop. A collection defined by seasonal palettes, sustainable craftsmanship, and modern silhouettes.
                    </p>
                </motion.div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-12">
                {products.map((product, index) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ProductCard
                            id={product._id}
                            name={product.name}
                            price={product.price}
                            image={product.images && product.images.length > 0 ? product.images[0] : ''}
                            category={product.category}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
