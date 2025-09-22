# OOTD Ghana Backend API

🇬🇭 **Easy brunch outfits for the modern Ghanaian woman**

A complete Node.js/Express backend API for OOTD Ghana's e-commerce platform, featuring Paystack payment integration, MongoDB database, and comprehensive admin management.

## 🚀 Features

### Core E-commerce
- **Product Management** - Full CRUD operations with categories, stock tracking, and image management
- **Order Processing** - Complete order lifecycle from creation to delivery
- **User Authentication** - JWT-based auth with customer and admin roles
- **Payment Integration** - Paystack for card payments and mobile money (MTN, Vodafone, AirtelTigo)
- **Image Upload** - Cloudinary integration for product and user images

### Ghana-Specific Features
- **Mobile Money Support** - MTN Mobile Money, Vodafone Cash, AirtelTigo Money
- **Ghana Phone Validation** - Proper validation for Ghana phone numbers (+233/0 format)
- **Regional Shipping** - Different shipping costs for Greater Accra vs other regions
- **GHS Currency** - Ghana Cedis as primary currency with USD support

### Admin Dashboard
- **Analytics & Reports** - Sales analytics, inventory reports, user management
- **Order Management** - Track orders, update statuses, manage fulfillment
- **Inventory Control** - Stock management, low stock alerts, bulk updates
- **User Management** - Customer accounts, admin controls, user analytics

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Paystack API
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Validation**: express-validator

## 📦 Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Environment Variables section)

5. **Start MongoDB** (local or use MongoDB Atlas)

6. **Seed the database**
   ```bash
   npm run seed
   ```

7. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ootd-ghana

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=5000
NODE_ENV=development

# Paystack (Get from https://dashboard.paystack.com)
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key

# Cloudinary (Get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin Account
ADMIN_EMAIL=admin@theootd.brand
ADMIN_PASSWORD=secure-admin-password-123

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 🏗️ API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new customer
- `POST /login` - Customer login
- `POST /admin-login` - Admin login
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password

### Products (`/api/products`)
- `GET /` - Get products with filtering, sorting, pagination
- `GET /categories` - Get product categories
- `GET /featured` - Get featured products
- `GET /:id` - Get single product
- `GET /slug/:slug` - Get product by slug
- `POST /` - Create product (Admin)
- `PUT /:id` - Update product (Admin)
- `DELETE /:id` - Delete product (Admin)
- `POST /:id/reviews` - Add product review
- `PUT /:id/stock` - Update stock (Admin)

### Orders (`/api/orders`)
- `POST /` - Create new order
- `GET /` - Get user orders
- `GET /:id` - Get single order
- `PUT /:id/cancel` - Cancel order
- `GET /admin/all` - Get all orders (Admin)
- `PUT /:id/status` - Update order status (Admin)

### Payments (`/api/payments`)
- `POST /initialize` - Initialize Paystack payment
- `POST /verify` - Verify payment
- `POST /webhook` - Paystack webhook
- `GET /banks` - Get Ghana banks list
- `POST /mobile-money` - Initialize mobile money payment

### File Upload (`/api/upload`)
- `POST /image` - Upload single image (Admin)
- `POST /images` - Upload multiple images (Admin)
- `DELETE /image/:publicId` - Delete image (Admin)
- `POST /avatar` - Upload user avatar

### Admin (`/api/admin`)
- `GET /dashboard` - Dashboard statistics
- `GET /users` - Get all users with pagination
- `PUT /users/:id/status` - Update user status
- `GET /analytics/sales` - Sales analytics
- `GET /reports/inventory` - Inventory report
- `POST /bulk-update-stock` - Bulk stock update

## 💳 Paystack Integration

### Setup Paystack Account
1. Visit [Paystack Dashboard](https://dashboard.paystack.com)
2. Create account and verify business
3. Get API keys from Settings > API Keys & Webhooks
4. Add webhook URL: `https://your-domain.com/api/payments/webhook`

### Supported Payment Methods
- **Cards**: Visa, Mastercard, Verve
- **Bank Transfer**: All major Ghana banks
- **Mobile Money**: MTN, Vodafone, AirtelTigo
- **USSD**: Bank USSD codes
- **QR Code**: Scan to pay

### Mobile Money Integration
```javascript
// Example mobile money payment
const paymentData = {
  orderId: "order_id",
  phone: "+233244123456",
  provider: "mtn" // or "vodafone", "airteltigo"
};

fetch('/api/payments/mobile-money', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(paymentData)
});
```

## 📊 Database Schema

### User Model
- Personal info (name, email, phone)
- Ghana address structure
- Role-based access (customer/admin)
- Preferences and settings

### Product Model
- Brunch outfit categories
- Multiple images and colors
- Stock management
- SEO optimization
- Reviews and ratings

### Order Model
- Complete order lifecycle
- Ghana shipping addresses
- Payment tracking
- Status history
- Automatic order numbering

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - express-validator for all inputs
- **CORS Protection** - Configured for frontend domain
- **Helmet Security** - Security headers
- **Admin Protection** - Role-based access control

## 📈 Admin Dashboard Features

### Analytics
- Revenue tracking and trends
- Order statistics by status
- Top-selling products
- Category performance
- Monthly/weekly/daily reports

### Inventory Management
- Stock level monitoring
- Low stock alerts
- Bulk stock updates
- Product performance metrics
- Category-wise inventory value

### Order Management
- Order status tracking
- Customer communication
- Shipping management
- Payment status monitoring
- Refund processing

## 🚀 Deployment

### Railway (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build settings
3. Add environment variables
4. Deploy

### Heroku
1. Create Heroku app
2. Add MongoDB Atlas add-on
3. Configure environment variables
4. Deploy via Git

## 🧪 Testing

### Seed Database
```bash
npm run seed
```

### Test Accounts
- **Admin**: admin@theootd.brand / ootd-admin-2024
- **Customer**: customer@example.com / customer123

### Test Payment
Use Paystack test cards:
- **Success**: 4084084084084081
- **Insufficient Funds**: 4094094094094090

## 📝 API Documentation

### Authentication Headers
```javascript
{
  "Authorization": "Bearer your-jwt-token"
}
```

### Response Format
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Format
```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors */ ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, email admin@theootd.brand or create an issue on GitHub.

---

**OOTD Ghana** - Easy brunch outfits for the modern Ghanaian woman 🇬🇭✨
