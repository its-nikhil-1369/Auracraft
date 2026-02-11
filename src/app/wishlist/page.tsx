"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
    const { wishlist } = useWishlist();
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
        setIsLoaded(true);
    }, []);

    if (!isLoaded) return <div className="min-h-screen bg-white" />;

    if (wishlist.length === 0) {
        return (
            <div className="pt-40 pb-20 px-8 text-center min-h-[70vh] flex flex-col items-center justify-center">
                <Heart size={64} className="text-gray-200 mb-6" />
                <h2 className="text-3xl font-bold tracking-tighter uppercase mb-4">Your Wishlist is empty</h2>
                <p className="text-gray-500 mb-10 max-w-xs">Save items you love here to find them easily later.</p>
                <Link href="/shop/all" className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-red-500 transition-all">
                    Explore Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-40 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase">Wishlist</h1>
                    <p className="text-gray-500 uppercase tracking-widest font-bold text-xs mt-4">Items you've curated: {wishlist.length}</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                <AnimatePresence>
                    {wishlist.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        >
                            <ProductCard {...product} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
