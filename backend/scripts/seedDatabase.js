import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Load environment variables
dotenv.config();

// Sample data for OOTD Ghana brunch outfits
const sampleProducts = [
  {
    name: 'Floral Brunch Midi Dress',
    description: 'Perfect flowy midi dress for your weekend brunch dates. Features a beautiful floral print and comfortable fit that\'s ideal for Ghana\'s warm weather.',
    category: 'Brunch',
    price: 120.00,
    currency: 'GHS',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Coral Pink', hexCode: '#FF7F7F' },
      { name: 'Sage Green', hexCode: '#9CAF88' }
    ],
    stock: 25,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
        alt: 'Floral Brunch Midi Dress - Coral Pink',
        isPrimary: true
      }
    ],
    tags: ['brunch', 'midi', 'floral', 'comfortable', 'ghana'],
    isFeatured: true,
    material: '100% Cotton',
    careInstructions: ['Machine wash cold', 'Hang dry', 'Iron on low heat'],
    seo: {
      metaTitle: 'Floral Brunch Midi Dress - Perfect for Ghana Brunch Dates',
      metaDescription: 'Comfortable and stylish floral midi dress perfect for brunch outings in Ghana. Available in coral pink and sage green.'
    }
  },
  {
    name: 'Casual Linen Brunch Set',
    description: 'Two-piece linen set perfect for effortless brunch style. Includes matching top and wide-leg pants that keep you cool and comfortable.',
    category: 'Brunch',
    price: 95.00,
    currency: 'GHS',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Natural Beige', hexCode: '#F5F5DC' },
      { name: 'Soft White', hexCode: '#FFFEF7' }
    ],
    stock: 18,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
        alt: 'Casual Linen Brunch Set - Natural Beige',
        isPrimary: true
      }
    ],
    tags: ['linen', 'two-piece', 'comfortable', 'breathable', 'casual'],
    isFeatured: true,
    material: '100% Linen',
    careInstructions: ['Hand wash recommended', 'Air dry', 'Steam to remove wrinkles']
  },
  {
    name: 'Elegant Wrap Blouse',
    description: 'Sophisticated wrap-style blouse that pairs perfectly with jeans or skirts for a chic brunch look. Features adjustable tie waist.',
    category: 'Tops',
    price: 65.00,
    currency: 'GHS',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Dusty Rose', hexCode: '#DCAE96' },
      { name: 'Navy Blue', hexCode: '#2C3E50' }
    ],
    stock: 30,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1564257577-0a9c8e0e8e8e?q=80&w=800&auto=format&fit=crop',
        alt: 'Elegant Wrap Blouse - Dusty Rose',
        isPrimary: true
      }
    ],
    tags: ['wrap', 'elegant', 'versatile', 'adjustable'],
    material: 'Polyester Blend',
    careInstructions: ['Machine wash gentle', 'Hang dry', 'Iron on medium heat']
  },
  {
    name: 'High-Waisted Brunch Shorts',
    description: 'Comfortable high-waisted shorts perfect for casual brunch outings. Features a relaxed fit and stylish belt loops.',
    category: 'Casual',
    price: 45.00,
    currency: 'GHS',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Khaki', hexCode: '#C3B091' },
      { name: 'Black', hexCode: '#000000' }
    ],
    stock: 40,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
        alt: 'High-Waisted Brunch Shorts - Khaki',
        isPrimary: true
      }
    ],
    tags: ['shorts', 'high-waisted', 'casual', 'comfortable'],
    material: 'Cotton Twill',
    careInstructions: ['Machine wash cold', 'Tumble dry low']
  },
  {
    name: 'Woven Crossbody Bag',
    description: 'Stylish woven crossbody bag perfect for hands-free brunch outings. Features adjustable strap and secure zip closure.',
    category: 'Accessories',
    price: 35.00,
    currency: 'GHS',
    sizes: ['One Size'],
    colors: [
      { name: 'Natural Tan', hexCode: '#D2B48C' },
      { name: 'Chocolate Brown', hexCode: '#8B4513' }
    ],
    stock: 22,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
        alt: 'Woven Crossbody Bag - Natural Tan',
        isPrimary: true
      }
    ],
    tags: ['bag', 'crossbody', 'woven', 'hands-free', 'versatile'],
    material: 'Woven Straw with Leather Trim',
    careInstructions: ['Spot clean only', 'Store in dust bag']
  },
  {
    name: 'Brunch Date Romper',
    description: 'Effortless one-piece romper perfect for weekend brunch with friends. Features a flattering cinched waist and comfortable fit.',
    category: 'Brunch',
    price: 85.00,
    originalPrice: 110.00,
    currency: 'GHS',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Terracotta', hexCode: '#E2725B' },
      { name: 'Olive Green', hexCode: '#808000' }
    ],
    stock: 15,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
        alt: 'Brunch Date Romper - Terracotta',
        isPrimary: true
      }
    ],
    tags: ['romper', 'one-piece', 'cinched-waist', 'effortless'],
    isOnSale: true,
    salePercentage: 23,
    material: 'Rayon Blend',
    careInstructions: ['Machine wash gentle', 'Hang dry', 'Steam if needed']
  },
  {
    name: 'Comfortable Slip-On Sandals',
    description: 'Easy slip-on sandals perfect for brunch outings. Features cushioned sole and adjustable straps for all-day comfort.',
    category: 'Accessories',
    price: 55.00,
    currency: 'GHS',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Nude', hexCode: '#F5DEB3' },
      { name: 'Black', hexCode: '#000000' }
    ],
    stock: 28,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
        alt: 'Comfortable Slip-On Sandals - Nude',
        isPrimary: true
      }
    ],
    tags: ['sandals', 'slip-on', 'comfortable', 'cushioned', 'adjustable'],
    material: 'Leather Upper with Rubber Sole',
    careInstructions: ['Wipe clean with damp cloth', 'Air dry away from direct sunlight']
  },
  {
    name: 'Lightweight Kimono Cardigan',
    description: 'Flowy kimono-style cardigan perfect for layering over brunch outfits. Features beautiful print and three-quarter sleeves.',
    category: 'Tops',
    price: 70.00,
    currency: 'GHS',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Floral Print', hexCode: '#FFB6C1' },
      { name: 'Geometric Print', hexCode: '#DDA0DD' }
    ],
    stock: 20,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
        alt: 'Lightweight Kimono Cardigan - Floral Print',
        isPrimary: true
      }
    ],
    tags: ['kimono', 'cardigan', 'layering', 'flowy', 'three-quarter-sleeves'],
    material: 'Chiffon',
    careInstructions: ['Hand wash cold', 'Hang dry', 'Do not wring']
  }
];

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ootd-ghana');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Create admin user
async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@theootd.brand' 
    });

    if (existingAdmin) {
      console.log('👑 Admin user already exists');
      return existingAdmin;
    }

    // Create admin user
    const adminUser = new User({
      firstName: 'OOTD',
      lastName: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@theootd.brand',
      phone: '+233200000000',
      password: process.env.ADMIN_PASSWORD || 'ootd-admin-2024',
      role: 'admin',
      address: {
        street: 'Admin Office',
        city: 'Accra',
        region: 'Greater Accra',
        country: 'Ghana'
      }
    });

    await adminUser.save();
    console.log('👑 Admin user created successfully');
    return adminUser;

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

// No customer accounts needed for OOTD Ghana - guest checkout only

// Seed products
async function seedProducts(adminUser) {
  try {
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log('📦 Products already exist in database');
      return;
    }

    // Add createdBy field to all products
    const productsWithCreator = sampleProducts.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    await Product.insertMany(productsWithCreator);
    console.log(`📦 Successfully seeded ${sampleProducts.length} products`);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

// Create sample order with guest customer
async function createSampleOrder() {
  try {
    const existingOrders = await Order.countDocuments();
    if (existingOrders > 0) {
      console.log('🛍️ Sample orders already exist');
      return;
    }

    // Get some products for the order
    const products = await Product.find().limit(2);
    
    if (products.length === 0) {
      console.log('⚠️ No products found, skipping order creation');
      return;
    }

    const orderItems = products.map(product => ({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0]?.name || ''
    }));

    const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
    const shippingCost = 10;
    const total = subtotal + shippingCost;

    const sampleOrder = new Order({
      customer: {
        firstName: 'Akosua',
        lastName: 'Mensah',
        email: 'customer@example.com',
        phone: '+233244123456'
      },
      items: orderItems,
      subtotal,
      shipping: {
        cost: shippingCost,
        method: 'standard',
        address: {
          firstName: 'Akosua',
          lastName: 'Mensah',
          phone: '+233244123456',
          street: '123 Oxford Street',
          city: 'Accra',
          region: 'Greater Accra',
          country: 'Ghana'
        }
      },
      tax: 0,
      total,
      paymentMethod: 'paystack',
      status: 'confirmed',
      paymentStatus: 'paid',
      notes: 'Sample guest order for testing'
    });

    await sampleOrder.save();
    console.log('🛍️ Sample guest order created successfully');

  } catch (error) {
    console.error('❌ Error creating sample order:', error);
    throw error;
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding for OOTD Ghana...');
    
    await connectDB();
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Product.deleteMany({});
    // await Order.deleteMany({});
    // console.log('🗑️ Cleared existing data');

    const adminUser = await createAdminUser();
    await seedProducts(adminUser);
    await createSampleOrder();

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Seeded Data Summary:');
    console.log(`👑 Admin Email: ${adminUser.email}`);
    console.log(`📦 Products: ${sampleProducts.length} brunch outfit items`);
    console.log('🛍️ Sample Order: 1 guest checkout order created');
    console.log('\n🚀 Your OOTD Ghana backend is ready!');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
