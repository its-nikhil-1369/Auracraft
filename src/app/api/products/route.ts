import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

import { isAdmin } from '@/lib/auth';

// Mock data for when database is not available
const mockProducts = [
    {
        _id: '1',
        name: 'Classic Oversized Hoodie',
        description: 'A premium heavyweight hoodie featuring an oversized fit, dropped shoulders, and a kangaroo pocket.',
        price: 89.00,
        category: 'Men',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'],
        colors: ['Jet Black', 'Heather Grey', 'Navy Blue'],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: true,
        createdAt: new Date()
    },
    {
        _id: '2',
        name: 'Silk Evening Dress',
        description: 'Elegant floor-length evening dress made from 100% pure Mulberry silk.',
        price: 320.00,
        category: 'Women',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1539109132314-34a936699561?q=80&w=800&auto=format&fit=crop'],
        colors: ['Emerald Green', 'Champagne', 'Midnight Black'],
        sizes: ['XS', 'S', 'M', 'L'],
        featured: true,
        createdAt: new Date()
    },
    {
        _id: '3',
        name: 'Structured Wool Blazer',
        description: 'A modern take on a classic wardrobe essential. This blazer is meticulously tailored from a premium wool blend.',
        price: 245.00,
        category: 'Men',
        stock: 35,
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'],
        colors: ['Charcoal Gray', 'Desert Sand'],
        sizes: ['48', '50', '52', '54'],
        featured: false,
        createdAt: new Date()
    },
    {
        _id: '4',
        name: 'Kids Organic Cotton Set',
        description: 'Ultra-soft two-piece set for kids, made from GOTS certified organic cotton.',
        price: 45.00,
        category: 'Kids',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop'],
        colors: ['Sage Green', 'Dusty Rose', 'Sky Blue'],
        sizes: ['2T', '3T', '4T', '5T'],
        featured: false,
        createdAt: new Date()
    }
];

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const query = category && category !== 'all' ? { category: new RegExp(category, 'i') } : {};
        const products = await Product.find(query).sort({ createdAt: -1 });

        return NextResponse.json(products);
    } catch (error: any) {
        console.error('Database connection failed, returning mock data:', error.message);
        
        // Return mock data when database is not available
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        
        if (category && category !== 'all') {
            const filteredProducts = mockProducts.filter(product => 
                product.category.toLowerCase() === category.toLowerCase()
            );
            return NextResponse.json(filteredProducts);
        }
        
        return NextResponse.json(mockProducts);
    }
}

export async function POST(request: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
        }

        await dbConnect();
        const body = await request.json();
        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
