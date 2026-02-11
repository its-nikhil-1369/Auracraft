"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, category }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const isWishlisted = isInWishlist(id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            id,
            name,
            price,
            image,
            quantity: 1,
            category
        });
        // Optional: show a toast or feedback
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group relative bg-[#f9f9f9] dark:bg-primary rounded-none overflow-hidden"
        >
            {/* Image Container */}
            <div className="relative aspect-3/4 overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist({ id, name, price, image, category });
                    }}
                    className={`absolute top-4 right-4 z-20 p-2 rounded-full glass transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-red-500'}`}
                >
                    <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Hover Actions */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-white text-black py-3 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-tighter hover:bg-black hover:text-white transition-colors"
                    >
                        <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <Link href={`/product/${id}`} className="w-12 bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                        <Eye size={18} />
                    </Link>
                </div>

                {/* Badge */}
                <span className="absolute top-4 left-4 bg-black text-white text-[10px] px-2 py-1 font-bold uppercase tracking-widest">
                    {category}
                </span>
                {/* Rating Badge */}
                {/* Rating Badge */}
                <div className="absolute bottom-16 left-2 bg-white/90 backdrop-blur-sm text-black px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <span>
                        {/* Generate stable rating based on ID */}
                        {(() => {
                            const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            return ((seed % 15) / 10 + 3.5).toFixed(1);
                        })()}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3 h-3 text-yellow-500"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-gray-400 pl-1 border-l border-gray-300 ml-1">
                        {/* Generate stable review count based on ID */}
                        {(() => {
                            const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            return (seed % 400) + 25;
                        })()}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-sm font-semibold uppercase tracking-tight truncate">{name}</h3>
                <p className="text-lg font-bold mt-1">₹{price.toLocaleString('en-IN')}</p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
