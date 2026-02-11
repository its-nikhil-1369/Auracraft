"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import Product3DViewer from '@/components/Product3DViewer';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

// In a real app, this would come from the database
const productData: any = {
    '65b8c9d1a2b3c4d5e6f7a8b1': {
        id: '65b8c9d1a2b3c4d5e6f7a8b1',
        name: 'Classic Oversized Hoodie',
        price: 2499,
        description: 'A premium heavyweight hoodie featuring an oversized fit, dropped shoulders, and a kangaroo pocket. Crafted from high-quality 450gsm organic cotton for ultimate comfort and durability.',
        category: 'Men',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Jet Black', 'Heather Grey', 'Navy Blue'],
        images: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1556821921-25531dd41f92?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1574015974293-817f0efebb1b?q=80&w=800&auto=format&fit=crop'
        ]
    },
    '65b8c9d1a2b3c4d5e6f7a8b2': {
        id: '65b8c9d1a2b3c4d5e6f7a8b2',
        name: 'Silk Evening Dress',
        price: 4599,
        description: 'Elegant floor-length evening dress made from 100% pure Mulberry silk. Features a sophisticated cowl neck and an adjustable open back for a perfect silhouette.',
        category: 'Women',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Emerald Green', 'Champagne', 'Midnight Black'],
        images: ['https://images.unsplash.com/photo-1539109132314-34a936699561?q=80&w=600&auto=format&fit=crop']
    },
    '65b8c9d1a2b3c4d5e6f7a8b3': {
        id: '65b8c9d1a2b3c4d5e6f7a8b3',
        name: 'Minimalist Tote Bag',
        price: 1499,
        description: 'A clean, architectural tote bag crafted from premium sustainable leather. Perfect for daily essentials with a spacious interior and minimal hardware.',
        category: 'Accessories',
        sizes: ['One Size'],
        colors: ['Tan', 'Black', 'Cloud'],
        images: ['https://images.unsplash.com/photo-1584917469897-5a94e5e3a44b?q=80&w=600&auto=format&fit=crop']
    }
};

export default function ProductPage() {
    const { id } = useParams();
    const product = productData[id as string] || productData['65b8c9d1a2b3c4d5e6f7a8b1'];

    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const isWishlisted = isInWishlist(product.id || (id as string));

    const handleAddToCart = () => {
        addToCart({
            id: product.id || (id as string),
            name: product.name,
            price: product.price,
            image: product.images[activeImageIndex],
            quantity: 1,
            size: selectedSize,
            color: selectedColor,
            category: product.category
        });
    };

    return (
        <div className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Left Side: Images & 3D Viewer */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-3/4 bg-gray-100 overflow-hidden"
                    >
                        <Image
                            src={product.images[activeImageIndex]}
                            alt={product.name}
                            fill
                            className="object-cover transition-all duration-500"
                            priority
                        />
                    </motion.div>

                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img: string, index: number) => (
                            <div
                                key={index}
                                onClick={() => setActiveImageIndex(index)}
                                className={`relative aspect-square border-2 cursor-pointer overflow-hidden group transition-all ${activeImageIndex === index ? 'border-red-500 scale-[0.98]' : 'border-transparent hover:border-black/10'}`}
                            >
                                <Image src={img} alt={`View ${index + 1}`} fill className="object-cover group-hover:scale-110 transition-all duration-300" />
                            </div>
                        ))}
                        <div className="col-span-4 mt-2">
                            <Product3DViewer />
                        </div>
                    </div>
                </div>

                {/* Right Side: Details */}
                <div className="flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="text-red-500 font-bold text-xs uppercase tracking-widest">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-bold mt-2 tracking-tighter uppercase">{product.name}</h1>
                        <p className="text-3xl font-bold mt-6 tracking-tighter">₹{product.price.toLocaleString('en-IN')}</p>

                        <p className="mt-8 text-gray-500 leading-relaxed max-w-md">
                            {product.description}
                        </p>

                        {/* Color Selection */}
                        <div className="mt-10">
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Color: {selectedColor}</h4>
                            <div className="flex gap-2">
                                {product.colors.map((color: string) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 text-xs font-bold uppercase tracking-tighter border-2 transition-all ${selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mt-8">
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Size: {selectedSize}</h4>
                            <div className="flex gap-2">
                                {product.sizes.map((size: string) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 flex items-center justify-center text-sm font-bold border-2 transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-12 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-black text-white py-5 font-bold uppercase tracking-widest hover:bg-red-500 transition-all flex items-center justify-center gap-3"
                            >
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                            <button
                                onClick={() => toggleWishlist({ ...product, image: product.images[0] })}
                                className={`w-16 border-2 flex items-center justify-center transition-colors ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50/50' : 'border-gray-200 hover:border-red-500 hover:text-red-500'}`}
                            >
                                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>
                            <button className="w-16 border-2 border-gray-200 flex items-center justify-center hover:border-black transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Perks */}
                        <div className="mt-12 grid grid-cols-2 gap-6 pt-12 border-t border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-zinc-100 dark:bg-white/5 flex items-center justify-center rounded-full border border-gray-200/50 dark:border-white/10">
                                    <Truck size={20} className="text-black dark:text-white" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest">Free Shipping Over ₹1,500</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-zinc-100 dark:bg-white/5 flex items-center justify-center rounded-full border border-gray-200/50 dark:border-white/10">
                                    <RefreshCcw size={20} className="text-black dark:text-white" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest">14-Day Easy Returns</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-zinc-100 dark:bg-white/5 flex items-center justify-center rounded-full border border-gray-200/50 dark:border-white/10">
                                    <ShieldCheck size={20} className="text-black dark:text-white" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest">Sustainable Fabric</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
