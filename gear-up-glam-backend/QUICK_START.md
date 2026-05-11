# Quick Start Checklist

Complete this checklist to get the backend up and running in 10 minutes.

## ✅ Backend Setup (5 minutes)

- [ ] **MySQL ready**
  ```sql
  CREATE DATABASE moto_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

- [ ] **Install dependencies**
  ```bash
  cd gear-up-glam-backend
  npm install
  ```

- [ ] **Create `.env` file**
  ```bash
  cp .env.example .env
  ```
  
  Verify contents:
  ```env
  DATABASE_URL="mysql://root@localhost:3307/moto_shop"
  JWT_SECRET="your-secret-key-here"
  PORT=3000
  FRONTEND_URL="http://localhost:5173"
  ```

- [ ] **Generate Prisma Client**
  ```bash
  npm run prisma:generate
  ```

- [ ] **Create database schema**
  ```bash
  npm run prisma:push
  ```

- [ ] **Seed initial data**
  ```bash
  npm run prisma:seed
  ```

- [ ] **Start development server**
  ```bash
  npm run dev
  ```
  
  Should see:
  ```
  ✅ Server running on http://localhost:3000
  📝 Frontend URL: http://localhost:5173
  ```

## ✅ Quick API Test (2 minutes)

- [ ] **Test health check**
  ```bash
  curl http://localhost:3000/health
  ```
  
  Expected response:
  ```json
  {"status":"ok","timestamp":"2026-04-26T..."}
  ```

- [ ] **Register test user**
  ```bash
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "test123",
      "displayName": "Test User"
    }'
  ```
  
  Save the `token` from response

- [ ] **Test authenticated endpoint**
  ```bash
  curl -H "Authorization: Bearer YOUR_TOKEN" \
    http://localhost:3000/api/profile
  ```

- [ ] **Get products**
  ```bash
  curl http://localhost:3000/api/products
  ```

## ✅ Frontend Migration (3 minutes)

- [ ] **Copy API client code** from `FRONTEND_MIGRATION.md` → `src/integrations/api/client.ts`

- [ ] **Update AuthContext** - Follow migration guide section 3

- [ ] **Update ShopContext** - Follow migration guide section 4

- [ ] **Test registration & login** in frontend

- [ ] **Test product listing** - Should show 6 seeded products

- [ ] **Test checkout flow** - Add to cart → Checkout (must be logged in)

## 🚀 You're Ready!

Backend is running, API is tested, frontend is migrated. Now:

1. **Continue development** - Build more features
2. **Add payment** - Integrate Stripe/PayPal
3. **Deploy** - Move to production

## 📚 Documentation Files

- `SETUP.md` - Detailed setup guide
- `API_REFERENCE.md` - All API endpoints with examples
- `FRONTEND_MIGRATION.md` - Complete frontend migration guide
- `README.md` - Project overview

## ⚠️ Troubleshooting

**MySQL Connection Refused?**
- Verify MySQL is running
- Check port 3307 is correct
- Check DATABASE_URL in .env

**Prisma Generation Error?**
- Delete `node_modules/.prisma`
- Run `npm run prisma:generate` again

**Frontend CORS Error?**
- Backend and frontend are on different ports ✓
- Check FRONTEND_URL in backend .env
- Should include protocol: `http://localhost:5173`

## 📞 Need Help?

Check the relevant documentation:
- **API usage?** → `API_REFERENCE.md`
- **Setup issues?** → `SETUP.md`
- **Frontend integration?** → `FRONTEND_MIGRATION.md`
