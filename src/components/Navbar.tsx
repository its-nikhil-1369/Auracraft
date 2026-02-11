"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

import { useAuth } from '@/context/AuthContext';

import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { wishlist } = useWishlist();
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide navbar on auth pages
    if (pathname === '/login' || pathname === '/register') return null;

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:scale-105 transition-transform">
                    AURACRAFT<span className="text-red-500">.</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-8 items-center font-medium">
                    {[
                        { name: 'Men', path: '/shop/men' },
                        { name: 'Women', path: '/shop/women' },
                        { name: 'Kids', path: '/shop/kids' },
                        { name: 'New Arrivals', path: '/new-arrivals' }
                    ].map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`transition-colors uppercase text-sm tracking-widest relative group ${pathname === link.path ? 'text-red-500 font-bold' : 'hover:text-red-500'
                                }`}
                        >
                            {link.name}
                            {pathname === link.path && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500"
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-5">
                    <button className="hover:text-red-500 transition-colors">
                        <Search size={20} />
                    </button>
                    <Link href="/wishlist" className="hover:text-red-500 transition-colors relative">
                        <Heart size={20} />
                        {(isHydrated && wishlist.length > 0) && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>

                    {isHydrated && user ? (
                        <div className="flex items-center gap-6">
                            {user.role === 'admin' && (
                                <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.4em] bg-red-500 text-white px-4 py-1.5 hover:bg-black transition-all shadow-lg hover:shadow-red-500/20">
                                    Terminal
                                </Link>
                            )}
                            <Link href="/account" className="hover:text-red-500 transition-all flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
                                    <User size={16} />
                                </div>
                                <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors">
                                Sign In
                            </Link>
                            <Link href="/register" className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all shadow-xl">
                                Join
                            </Link>
                        </div>
                    )}
                    <Link href="/cart" className="hover:text-red-500 transition-colors relative">
                        <ShoppingCart size={20} />
                        {(isHydrated && totalItems > 0) && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-black border-t dark:border-white/10"
                    >
                        <div className="flex flex-col p-6 space-y-4 font-medium uppercase text-sm tracking-widest">
                            {[
                                { name: 'Men', path: '/shop/men' },
                                { name: 'Women', path: '/shop/women' },
                                { name: 'Kids', path: '/shop/kids' },
                                { name: 'New Arrivals', path: '/new-arrivals' }
                            ].map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`${pathname === link.path ? 'text-red-500 font-bold pl-2 border-l-2 border-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
