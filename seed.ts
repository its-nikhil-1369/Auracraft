import dbConnect from './src/lib/db';
import Product from './src/models/Product';

const sampleProducts = [
    {
        name: 'Classic Oversized Hoodie',
        description: 'A premium heavyweight hoodie featuring an oversized fit, dropped shoulders, and a kangaroo pocket. Crafted from high-quality 450gsm organic cotton for ultimate comfort and durability.',
        price: 89.00,
        category: 'Men',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'],
        colors: ['Jet Black', 'Heather Grey', 'Navy Blue'],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: true
    },
    {
        name: 'Silk Evening Dress',
        description: 'Elegant floor-length evening dress made from 100% pure Mulberry silk. Features a sophisticated cowl neck and an adjustable open back for a perfect silhouette.',
        price: 320.00,
        category: 'Women',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1539109132314-34a936699561?q=80&w=800&auto=format&fit=crop'],
        colors: ['Emerald Green', 'Champagne', 'Midnight Black'],
        sizes: ['XS', 'S', 'M', 'L'],
        featured: true
    },
    {
        name: 'Structured Wool Blazer',
        description: 'A modern take on a classic wardrobe essential. This blazer is meticulously tailored from a premium wool blend with structured shoulders and a slim profile.',
        price: 245.00,
        category: 'Men',
        stock: 35,
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'],
        colors: ['Charcoal Gray', 'Desert Sand'],
        sizes: ['48', '50', '52', '54'],
        featured: false
    },
    {
        name: 'Kids Organic Cotton Set',
        description: 'Ultra-soft two-piece set for kids, made from GOTS certified organic cotton. Designed with play and comfort in mind.',
        price: 45.00,
        category: 'Kids',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop'],
        colors: ['Sage Green', 'Dusty Rose', 'Sky Blue'],
        sizes: ['2T', '3T', '4T', '5T'],
        featured: false
    }
];

async function seed() {
    await dbConnect();
    console.log('Connected to database...');

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    await Product.insertMany(sampleProducts);
    console.log('Sample products seeded successfully!');

    process.exit(0);
}

// Check if running directly
if (require.main === module) {
    seed();
}

export default seed;
