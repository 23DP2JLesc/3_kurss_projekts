# Backend Setup Guide

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- MySQL 8.0+ running on port 3307
- npm or yarn package manager

## Step-by-Step Setup

### 1. **Create MySQL Database**

Open MySQL CLI or MySQL Workbench and create the database and user:

```sql
CREATE DATABASE moto_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'root'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON moto_shop.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

Or if you prefer with a password:
```sql
CREATE USER 'root'@'localhost' IDENTIFIED BY 'your_password';
```

**Note:** Default MySQL users typically have no password. Adjust as needed for your setup.

### 2. **Project Setup**

```bash
# Navigate to backend folder
cd gear-up-glam-backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Create .env file from example
cp .env.example .env

# Edit .env and verify DATABASE_URL
# Should be: mysql://root@localhost:3307/moto_shop
```

### 3. **Database Migration & Seeding**

```bash
# Create database schema and apply migrations
npm run prisma:push

# (OR) Use migrate for version control:
npm run prisma:migrate -- --name initial

# Seed initial data (6 products)
npm run prisma:seed

# (Optional) View database in Prisma Studio
npm run prisma:studio
```

### 4. **Start Development Server**

```bash
npm run dev
```

You should see:
```
✅ Server running on http://localhost:3000
📝 Frontend URL: http://localhost:5173
🗄️ Database: moto_shop@localhost:3307
```

### 5. **Test API Endpoints**

Using curl or Postman:

```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "displayName": "John Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get products
curl http://localhost:3000/api/products

# Get products by category
curl "http://localhost:3000/api/products?category=Exhaust"
```

## Environment Variables

Create a `.env` file in the backend root:

```env
# Database (MySQL)
DATABASE_URL="mysql://root@localhost:3307/moto_shop"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-12345"
JWT_EXPIRY="7d"

# Server
PORT=3000
NODE_ENV="development"

# CORS - Frontend URL
FRONTEND_URL="http://localhost:5173"
```

### JWT_SECRET Guidelines
- **Development:** Use any string (minimum 32 characters recommended)
- **Production:** Generate strong secret:
  ```bash
  openssl rand -base64 32
  ```

## Database Schema

**User**
- id (UUID)
- email (unique)
- password (hashed with bcryptjs)
- role (user | admin)
- banned (boolean)
- createdAt, updatedAt

**Profile**
- userId (linked to User)
- displayName
- avatarUrl
- shippingAddress
- createdAt, updatedAt

**Product**
- id (UUID)
- name, brand, model, type, category
- price, originalPrice, stock
- description, image
- fitment (JSON array of compatible bikes)
- createdAt, updatedAt

**Order**
- id (UUID)
- userId
- items (OrderItem[])
- status (pending | completed | cancelled)
- total
- createdAt, updatedAt

**OrderItem**
- orderId
- productId
- quantity, price (at time of purchase)

## Build & Production

```bash
# Build TypeScript to JavaScript
npm run build

# Run production server
npm start

# Or use process manager like PM2:
pm2 start dist/index.js --name "gear-up-glam-backend"
```

## Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3307
```
- Ensure MySQL is running on port 3307
- Check DATABASE_URL in .env file
- Verify database exists

### Prisma Client Not Found
```
npm run prisma:generate
```

### Port 3000 Already in Use
```bash
# Change PORT in .env or kill the process
PORT=3001 npm run dev
```

## Next Steps

1. **Start Frontend Migration** → See [FRONTEND_MIGRATION.md](../FRONTEND_MIGRATION.md)
2. **Add Payment Processing** → Integrate Stripe/PayPal in order creation
3. **Add Email Service** → Send order confirmation emails
4. **Deploy** → Use Railway, Render, DigitalOcean, etc.
