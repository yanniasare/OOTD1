#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 OOTD Ghana Backend Setup Script');
console.log('===================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
    console.log('⚠️  Please update the .env file with your actual values\n');
  } else {
    console.log('❌ .env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Display setup checklist
console.log('📋 Setup Checklist:');
console.log('==================\n');

console.log('1. 🗄️  Database Setup:');
console.log('   • Install MongoDB locally OR');
console.log('   • Create MongoDB Atlas account (https://mongodb.com/atlas)');
console.log('   • Update MONGODB_URI in .env file\n');

console.log('2. 💳 Paystack Setup (Ghana Payments):');
console.log('   • Create Paystack account (https://paystack.com)');
console.log('   • Get API keys from dashboard');
console.log('   • Update PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY in .env\n');

console.log('3. 📸 Cloudinary Setup (Image Upload):');
console.log('   • Create Cloudinary account (https://cloudinary.com)');
console.log('   • Get cloud name, API key, and API secret');
console.log('   • Update CLOUDINARY_* variables in .env\n');

console.log('4. 📧 Email Setup:');
console.log('   • Use Gmail with App Password OR');
console.log('   • Use SendGrid, Mailgun, or other SMTP service');
console.log('   • Update EMAIL_* variables in .env\n');

console.log('5. 🔐 Security:');
console.log('   • Generate strong JWT_SECRET (recommended: 64+ characters)');
console.log('   • Set secure ADMIN_PASSWORD');
console.log('   • Update FRONTEND_URL to your domain\n');

console.log('🚀 Quick Start Commands:');
console.log('=======================\n');
console.log('# Install dependencies');
console.log('npm install\n');
console.log('# Seed database with sample data');
console.log('npm run seed\n');
console.log('# Start development server');
console.log('npm run dev\n');
console.log('# Start production server');
console.log('npm start\n');

console.log('🌍 Deployment Options:');
console.log('======================\n');
console.log('• Railway (Recommended): https://railway.app');
console.log('• Render: https://render.com');
console.log('• DigitalOcean: https://digitalocean.com');
console.log('• Heroku: https://heroku.com\n');

console.log('📚 Documentation:');
console.log('=================\n');
console.log('• API Docs: See README.md');
console.log('• Paystack Docs: https://paystack.com/docs');
console.log('• MongoDB Docs: https://docs.mongodb.com\n');

console.log('🆘 Need Help?');
console.log('=============\n');
console.log('• Email: admin@theootd.brand');
console.log('• GitHub Issues: Create an issue on the repository');
console.log('• Documentation: Check README.md for detailed setup\n');

console.log('🇬🇭 Ready to serve Ghana\'s brunch fashion needs!');
console.log('================================================\n');
