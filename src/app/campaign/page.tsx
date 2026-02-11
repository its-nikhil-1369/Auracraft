"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Camera, Layers } from 'lucide-react';

const lookbookItems = [
    {
        id: 1,
        title: "Vanguard Minimal",
        desc: "Precision tailoring meets monolithic silhouettes in our new SS26 collection.",
        image: "https://images.unsplash.com/photo-1539109132314-34a936699561?q=80&w=1200&auto=format&fit=crop",
        pos: "left"
    },
    {
        id: 2,
        title: "Ethereal Silk",
        desc: "Fluid motion captured in sustainable silk blends designed for the modern nomad.",
        image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1200&auto=format&fit=crop",
        pos: "right"
    },
    {
        id: 3,
        title: "Urban Utility",
        desc: "High-performance tech fabrics integrated into essential everyday silhouettes.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
        pos: "left"
    }
];

export default function LookbookPage() {
    return (
        <div className="bg-black text-white min-h-screen">
            {/* Immersive Header */}
            <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=2000&auto=format&fit=crop"
                        alt="Lookbook Hero"
                        fill
                        className="object-cover opacity-40 grayscale"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black" />
                </div>

                <div className="relative z-10 text-center space-y-8 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <p className="text-red-500 text-xs font-black uppercase tracking-[0.5em]">Editorial Campaign</p>
                        <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.8]">SS<span className="text-outline">26</span></h1>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-gray-500 italic">Volume Protocol</h2>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-10 flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                    <div className="flex items-center gap-3"><Camera size={14} /> Shot by Lumina Studios</div>
                    <div className="flex items-center gap-3"><Layers size={14} /> Modular Assembly</div>
                </div>
            </header>

            {/* Lookbook Grid */}
            <main className="max-w-7xl mx-auto px-4 md:px-12 py-32 space-y-64">
                {lookbookItems.map((item, idx) => (
                    <LookbookSection key={item.id} {...item} index={idx} />
                ))}
            </main>

            {/* CTA */}
            <section className="py-40 text-center bg-[#0A0A0A] border-t border-white/5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto space-y-12"
                >
                    <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">Ready to <span className="text-red-500">Flux?</span></h3>
                    <p className="text-gray-400 font-medium tracking-wide">Enter the collection and synchronize with the new modern standard in luxury.</p>
                    <Link href="/shop" className="inline-flex items-center gap-6 px-16 py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-red-500 hover:text-white transition-all shadow-2xl">
                        Shop All <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}

function LookbookSection({ title, desc, image, pos, index }: any) {
    const isRight = pos === "right";

    return (
        <div className={`flex flex-col ${isRight ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-20`}>
            <motion.div
                initial={{ opacity: 0, x: isRight ? 100 : -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="flex-1 relative aspect-3/4 w-full"
            >
                <div className="absolute -inset-10 border border-white/10 -z-10 translate-x-4 translate-y-4" />
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex-1 space-y-10"
            >
                <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em]">Look 0{index + 1}</span>
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">{title}</h2>
                <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">{desc}</p>
                <div className="flex gap-8 items-center pt-8">
                    <Link href="/shop" className="text-xs font-black uppercase tracking-widest border-b-2 border-red-500 pb-2 hover:text-red-500 transition-colors">
                        Acquire Piece
                    </Link>
                    <button className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors">
                        <Play size={16} className="text-red-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Process BTS</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
