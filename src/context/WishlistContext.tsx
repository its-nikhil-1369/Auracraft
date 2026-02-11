"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    toggleWishlist: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Initial hydration from localStorage
    useEffect(() => {
        const savedWishlist = localStorage.getItem('lumina_wishlist');
        if (savedWishlist) {
            try {
                setWishlist(JSON.parse(savedWishlist));
            } catch (e) {
                console.error("Failed to parse wishlist", e);
            }
        }
        setIsHydrated(true);
    }, []);

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('lumina_wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isHydrated]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlist((prev) => {
            if (prev.find((i) => i.id === item.id)) return prev;
            console.log("Adding to wishlist:", item.name);
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlist((prev) => {
            console.log("Removing from wishlist:", id);
            return prev.filter((item) => item.id !== id);
        });
    };

    const isInWishlist = (id: string) => wishlist.some((item) => item.id === id);

    const toggleWishlist = (item: WishlistItem) => {
        setWishlist((prev) => {
            const exists = prev.some((i) => i.id === item.id);
            if (exists) {
                console.log("Removing from wishlist:", item.name);
                return prev.filter((i) => i.id !== item.id);
            }
            console.log("Adding to wishlist:", item.name);
            return [...prev, item];
        });
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
    return context;
};
