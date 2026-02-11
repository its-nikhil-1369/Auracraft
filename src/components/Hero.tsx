"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BlotterText from './BlotterText';

const Hero = () => {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#121212]">
            {/* Background and Overlays */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover opacity-60"
                    style={{ filter: 'grayscale(100%)' }}
                >
                    {/* I'll use a placeholder video link or image if video fails */}
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-on-a-yellow-background-34614-large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/50" />
            </div>

            {/* Blotter.js Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 opacity-30 mix-blend-screen hidden md:block">
                <BlotterText text="AURACRAFT" />
            </div>

            {/* Content */}
            <div className="relative z-30 text-center px-4">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-red-500 font-medium tracking-[0.3em] uppercase text-sm mb-4"
                >
                    Spring Summer 2026
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-5xl md:text-9xl font-bold text-white tracking-tighter mb-8"
                >
                    ELEVATE<br /><span className="text-outline">YOUR STYLE</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4"
                >
                    <Link href="/shop" className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300">
                        Shop Collection
                    </Link>
                    <Link href="/campaign" className="px-10 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                        View Lookbook
                    </Link>
                </motion.div>
            </div>

            {/* Blotter.js Placeholder Container */}
            <div id="blotter-container" className="absolute bottom-10 left-10 pointer-events-none opacity-40">
                {/* Blotter text will be rendered here if active */}
            </div>
        </section>
    );
};

export default Hero;
