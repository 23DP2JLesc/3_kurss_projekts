# Gear-Up-Glam Backend

Node.js + Express + Prisma + MySQL backend for the Gear-Up-Glam motorcycle e-commerce shop.

## Project Structure

```
gear-up-glam-backend/
├── src/
│   ├── controllers/        # Business logic for routes
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   ├── profileController.ts
│   │   └── userController.ts
│   ├── middleware/         # Express middleware
│   │   ├── auth.ts        # JWT auth & admin check
│   │   ├── errorHandler.ts
│   │   └── asyncHandler.ts
│   ├── routes/            # API routes
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── profile.ts
│   │   └── users.ts
│   ├── utils/             # Utilities
│   │   ├── jwt.ts         # JWT token generation/verification
│   │   ├── password.ts    # Password hashing/verification
│   │   ├── validation.ts  # Zod schemas for input validation
│   │   └── errors.ts      # Custom error class
│   ├── types/             # TypeScript types
│   └── index.ts           # Express server setup
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (frontend removes token)

### Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get user's orders (auth required)
- `POST /api/orders` - Create order (auth required)

### Profile
- `GET /api/profile` - Get user profile (auth required)
- `PUT /api/profile` - Update profile (auth required)

### Users (Admin)
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)
- `PUT /api/users/:id/status` - Ban/unban user (admin only)
