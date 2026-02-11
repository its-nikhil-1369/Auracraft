"use client";

import React from 'react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import axios from 'axios';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await axios.get('/api/products');
        // Shuffle and pick 8
        const shuffled = res.data.sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 8));
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatures();
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />

      {/* Featured Section */}
      <section className="py-24 px-4 md:px-12 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-red-500 font-bold uppercase tracking-widest text-xs"
              >
                Curated Selection
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold mt-2 tracking-tighter"
              >
                FEATURED COLLECTIONS
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="hidden md:block"
            >
              <Link href="/shop/all" className="px-8 py-3 border border-black dark:border-white text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                Shop All Products
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-12">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
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
      </section>

      {/* Categories Grid */}
      <section className="py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1400px] mx-auto w-full">
        <CategoryBox title="Men" image="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop" span="md:col-span-2" />
        <CategoryBox title="Women" image="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" />
        <CategoryBox title="Kids" image="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop" />
        <CategoryBox title="Accessories" image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop" span="md:col-span-2" />
      </section>

      {/* Footer Placeholder */}
      <footer className="bg-primary text-white py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold tracking-tighter mb-6">AURACRAFT.</h2>
            <p className="text-gray-400 max-w-sm">Redefining modern fashion with a focus on quality, sustainability, and timeless design.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h4>
            <div className="flex">
              <input type="email" placeholder="Email Address" className="bg-transparent border border-white/20 p-3 flex-1 text-sm outline-none focus:border-white transition-colors" />
              <button className="bg-white text-black px-6 font-bold text-xs uppercase hover:bg-red-500 hover:text-white transition-all">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CategoryBox({ title, image, span = "" }: { title: string, image: string, span?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      className={`relative h-[400px] overflow-hidden group ${span}`}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h3 className="text-white text-4xl font-bold tracking-tighter mb-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">{title}</h3>
        <Link href={`/shop/${title.toLowerCase()}`} className="px-6 py-2 border border-white text-white text-xs font-bold uppercase tracking-[.2em] hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 delay-100">
          Discover
        </Link>
      </div>
    </motion.div>
  );
}

