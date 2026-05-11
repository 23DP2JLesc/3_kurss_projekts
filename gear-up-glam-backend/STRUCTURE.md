# Complete Backend Folder Structure

```
gear-up-glam-backend/
│
├── src/
│   ├── controllers/
│   │   ├── authController.ts        # User registration, login, logout
│   │   ├── productController.ts     # CRUD operations for products
│   │   ├── orderController.ts       # Order creation and retrieval
│   │   ├── profileController.ts     # User profile management
│   │   └── userController.ts        # Admin user management
│   │
│   ├── middleware/
│   │   ├── auth.ts                  # JWT verification, admin check
│   │   ├── errorHandler.ts          # Global error handling
│   │   └── asyncHandler.ts          # Async/await error wrapper
│   │
│   ├── routes/
│   │   ├── auth.ts                  # POST /api/auth/* routes
│   │   ├── products.ts              # /api/products routes
│   │   ├── orders.ts                # /api/orders routes
│   │   ├── profile.ts               # /api/profile routes
│   │   └── users.ts                 # /api/users routes (admin)
│   │
│   ├── utils/
│   │   ├── jwt.ts                   # Token generation & verification
│   │   ├── password.ts              # Password hashing & comparison
│   │   ├── validation.ts            # Zod schemas for input validation
│   │   └── errors.ts                # Custom error class
│   │
│   ├── types/
│   │   └── (TypeScript ambient types if needed)
│   │
│   └── index.ts                     # Express server setup & routes
│
├── prisma/
│   ├── schema.prisma                # Database schema (7 models)
│   └── seed.ts                      # Seed 6 initial products
│
├── node_modules/                    # (created by npm install)
│
├── dist/                            # (created by npm run build)
│
├── SETUP.md                         # Detailed setup instructions
├── QUICK_START.md                   # 10-minute quick start guide
├── API_REFERENCE.md                 # Complete API documentation
├── FRONTEND_MIGRATION.md            # Step-by-step frontend integration
├── README.md                        # Project overview
│
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
├── eslint.config.js                 # ESLint rules
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
│
└── .git/                            # (if initialized with git)
```

## Key Files Explained

### Core Application
- **src/index.ts** - Express server, middleware setup, route registration
- **prisma/schema.prisma** - Database models: User, Profile, Product, Order, OrderItem
- **prisma/seed.ts** - Initial data with 6 motorcycle gear products

### Authentication & Security
- **src/utils/jwt.ts** - JWT token creation/verification
- **src/utils/password.ts** - bcryptjs password hashing
- **src/middleware/auth.ts** - JWT validation & admin role checking

### Data Validation
- **src/utils/validation.ts** - Zod schemas for all API inputs

### API Structure
```
controllers/     → Business logic
  ↓
routes/         → Connect logic to HTTP methods
  ↓
middleware/     → Validate auth, handle errors
  ↓
index.ts        → Register routes with Express
```

---

## Database Schema (7 Models)

```prisma
User
├── id (UUID)
├── email (unique)
├── password (bcrypt hash)
├── role (user | admin)
├── banned (boolean)
├── relations: Profile, Order

Profile
├── userId (FK → User)
├── displayName
├── avatarUrl
├── shippingAddress

Product
├── id (UUID)
├── name, brand, model, type
├── category (Enum: Exhaust, Brakes, etc.)
├── price, originalPrice
├── stock
├── image, description
├── fitment (JSON array)
├── relations: OrderItem

Order
├── userId (FK → User)
├── items (OrderItem[])
├── status (pending | completed)
├── total

OrderItem
├── orderId (FK → Order)
├── productId (FK → Product)
├── quantity, price
```

---

## NPM Scripts

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (tsx watch)
npm run build            # Compile TypeScript
npm start                # Run compiled JavaScript
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Create & apply database migration
npm run prisma:push      # Push schema to database (no migrations)
npm run prisma:studio    # GUI database browser
npm run prisma:seed      # Insert initial data
npm run lint             # Check code style
npm run type-check       # TypeScript type checking
```

---

## Environment Variables

```env
# Database
DATABASE_URL="mysql://root@localhost:3307/moto_shop"

# Security
JWT_SECRET="change-this-to-random-string"
JWT_EXPIRY="7d"

# Server
PORT=3000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"
```

---

## API Routes Overview

```
POST   /api/auth/register       → Create account
POST   /api/auth/login          → Get JWT token
POST   /api/auth/logout         → (Frontend removes token)

GET    /api/products            → List all (with filters)
GET    /api/products/:id        → Single product
POST   /api/products            → Create (admin)
PUT    /api/products/:id        → Update (admin)
DELETE /api/products/:id        → Delete (admin)

GET    /api/orders              → User's shopping history
POST   /api/orders              → Create order (checkout)

GET    /api/profile             → User profile
PUT    /api/profile             → Update profile

GET    /api/users               → All users (admin)
PUT    /api/users/:id/role      → Change role (admin)
PUT    /api/users/:id/status    → Ban/unban (admin)
```

---

## Frontend Changes Needed

Replace Supabase with API client:

1. **Delete** → `src/integrations/supabase/`
2. **Create** → `src/integrations/api/client.ts` (code in FRONTEND_MIGRATION.md)
3. **Update** → `src/contexts/AuthContext.tsx`
4. **Update** → `src/contexts/ShopContext.tsx`
5. **Update** → Login/Signup pages
6. **Add** → `VITE_API_URL=http://localhost:3000` to .env

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 20+ |
| **Framework** | Express.js 4.18 |
| **Language** | TypeScript 5.3 |
| **ORM** | Prisma 5.11 |
| **Database** | MySQL 8.0 |
| **Auth** | JWT + bcryptjs |
| **Validation** | Zod 3.22 |
| **Dev Tools** | tsx, ESLint |
| **Package Manager** | npm |

---

## Deployment Checklist

- [ ] Change `JWT_SECRET` to random string (32+ chars)
- [ ] Set `NODE_ENV=production`
- [ ] Use production MySQL database
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Enable HTTPS (CORS with https://)
- [ ] Set proper database backups
- [ ] Configure logging
- [ ] Use process manager (PM2, systemd)
- [ ] Set up CI/CD pipeline

---

## Development Workflow

```bash
# 1. Start MySQL
# (ensure it's running on port 3307)

# 2. Set up backend
cd gear-up-glam-backend
npm install
cp .env.example .env
npm run prisma:push
npm run prisma:seed

# 3. Start backend
npm run dev

# 4. In another terminal, start frontend
cd ../gear-up-glam-main
npm run dev

# 5. Open browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# Prisma Studio: npm run prisma:studio
```

---

Ready to build! 🚀
