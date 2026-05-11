# API Reference - Gear-Up-Glam Backend

Complete API documentation with request/response examples.

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <JWT_TOKEN>
```

Token obtained from `/auth/register` or `/auth/login` response.

---

## Auth Endpoints

### Register User

**POST** `/auth/register`

```javascript
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "displayName": "John Doe"
}

// Response (201 Created)
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cm1234567890",
    "email": "john@example.com",
    "role": "user",
    "profile": {
      "id": "cm9876543210",
      "displayName": "John Doe",
      "avatarUrl": null,
      "shippingAddress": null
    }
  }
}
```

### Login

**POST** `/auth/login`

```javascript
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

// Response (200 OK)
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cm1234567890",
    "email": "john@example.com",
    "role": "user",
    "profile": { ... }
  }
}

// Error Response (401)
{
  "error": "Invalid email or password"
}
```

### Logout

**POST** `/auth/logout`

No request body. Token removed from frontend localStorage.

```javascript
// Response (200 OK)
{
  "message": "Logout successful"
}
```

---

## Product Endpoints

### Get All Products

**GET** `/products?category=Exhaust&brand=Akrapović&search=Racing`

**Query Parameters:**
- `category` (optional) - Filter by category: Exhaust, Brakes, Suspension, Bodywork, Engine, Lighting
- `brand` (optional) - Filter by brand name
- `search` (optional) - Search in name, description, brand
- `limit` (optional, default: 50) - Number of results
- `offset` (optional, default: 0) - Pagination offset

```javascript
// Response (200 OK)
{
  "data": [
    {
      "id": "seed-1",
      "name": "Titanium Racing Exhaust System",
      "brand": "Akrapovič",
      "model": "ZX-10R",
      "type": "Exhaust",
      "category": "Exhaust",
      "price": 1299.99,
      "originalPrice": 1599.99,
      "image": "https://...",
      "stock": 7,
      "fitment": ["Kawasaki ZX-10R", "BMW S1000RR"],
      "description": "Lightweight titanium race exhaust...",
      "createdAt": "2026-04-26T10:30:00Z",
      "updatedAt": "2026-04-26T10:30:00Z"
    }
    // ... more products
  ],
  "pagination": {
    "total": 42,
    "limit": 50,
    "offset": 0
  }
}
```

### Get Single Product

**GET** `/products/:id`

```javascript
// Response (200 OK)
{
  "id": "seed-1",
  "name": "Titanium Racing Exhaust System",
  // ... full product object
}

// Error Response (404)
{
  "error": "Product not found"
}
```

### Create Product (Admin Only)

**POST** `/products` *(Requires auth + admin role)*

```javascript
// Request
{
  "name": "New Exhaust Pipe",
  "brand": "Akrapovič",
  "model": "S1000RR",
  "type": "Exhaust",
  "category": "Exhaust",
  "description": "Premium titanium exhaust system",
  "price": 1499.99,
  "originalPrice": 1799.99,
  "image": "https://example.com/exhaust.jpg",
  "stock": 12,
  "fitment": ["BMW S1000RR", "Kawasaki ZX-10R"]
}

// Response (201 Created)
{
  "id": "new-product-id",
  "name": "New Exhaust Pipe",
  // ... full product object
}

// Error Response (403)
{
  "error": "Admin access required"
}
```

### Update Product (Admin Only)

**PUT** `/products/:id` *(Requires auth + admin role)*

```javascript
// Request (all fields optional)
{
  "stock": 25,
  "price": 1349.99
}

// Response (200 OK)
{
  "id": "product-id",
  // ... updated product object
}
```

### Delete Product (Admin Only)

**DELETE** `/products/:id` *(Requires auth + admin role)*

```javascript
// Response (200 OK)
{
  "message": "Product deleted successfully"
}

// Error Response (404)
{
  "error": "Product not found"
}
```

---

## Order Endpoints

### Get User's Orders

**GET** `/orders` *(Requires auth)*

```javascript
// Response (200 OK)
[
  {
    "id": "order-001",
    "userId": "cm1234567890",
    "status": "completed",
    "total": 2149.98,
    "createdAt": "2026-04-26T14:20:00Z",
    "updatedAt": "2026-04-26T14:20:00Z",
    "items": [
      {
        "id": "item-001",
        "orderId": "order-001",
        "productId": "seed-1",
        "quantity": 1,
        "price": 1299.99,
        "product": {
          "id": "seed-1",
          "name": "Titanium Racing Exhaust System",
          // ... full product object
          "fitment": ["Kawasaki ZX-10R", "BMW S1000RR"]
        }
      }
      // ... more items
    ]
  }
  // ... more orders
]
```

### Create Order (Checkout)

**POST** `/orders` *(Requires auth)*

```javascript
// Request
{
  "items": [
    {
      "productId": "seed-1",
      "quantity": 1
    },
    {
      "productId": "seed-3",
      "quantity": 2
    }
  ]
}

// Response (201 Created)
{
  "message": "Order created successfully",
  "order": {
    "id": "order-new",
    "userId": "cm1234567890",
    "status": "completed",
    "total": 4699.97,
    "createdAt": "2026-04-26T15:45:00Z",
    "updatedAt": "2026-04-26T15:45:00Z",
    "items": [
      {
        "id": "item-new-1",
        "orderId": "order-new",
        "productId": "seed-1",
        "quantity": 1,
        "price": 1299.99,
        "product": { ... }
      }
      // ... more items
    ]
  }
}

// Error Response (400 - Insufficient Stock)
{
  "error": "Insufficient stock for Titanium Racing Exhaust System. Available: 3"
}

// Error Response (404 - Product Not Found)
{
  "error": "Product seed-999 not found"
}
```

---

## Profile Endpoints

### Get User Profile

**GET** `/profile` *(Requires auth)*

```javascript
// Response (200 OK)
{
  "id": "profile-001",
  "userId": "cm1234567890",
  "displayName": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "shippingAddress": "123 Main St, Springfield, IL 62701",
  "createdAt": "2026-04-26T10:30:00Z",
  "updatedAt": "2026-04-26T10:30:00Z"
}
```

### Update User Profile

**PUT** `/profile` *(Requires auth)*

```javascript
// Request (all fields optional)
{
  "displayName": "John Smith",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "shippingAddress": "456 Oak Ave, Springfield, IL 62702"
}

// Response (200 OK)
{
  "id": "profile-001",
  "userId": "cm1234567890",
  "displayName": "John Smith",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "shippingAddress": "456 Oak Ave, Springfield, IL 62702",
  // ... timestamps
}
```

---

## User Management Endpoints (Admin Only)

### Get All Users

**GET** `/users` *(Requires auth + admin role)*

```javascript
// Response (200 OK)
[
  {
    "id": "cm1234567890",
    "email": "john@example.com",
    "role": "user",
    "banned": false,
    "createdAt": "2026-04-26T10:30:00Z",
    "profile": {
      "displayName": "John Doe",
      "avatarUrl": null
    }
  },
  {
    "id": "cm0987654321",
    "email": "admin@example.com",
    "role": "admin",
    "banned": false,
    "createdAt": "2026-04-25T08:00:00Z",
    "profile": {
      "displayName": "Admin User",
      "avatarUrl": null
    }
  }
  // ... more users
]
```

### Update User Role

**PUT** `/users/:id/role` *(Requires auth + admin role)*

```javascript
// Request
{
  "role": "admin"  // or "user"
}

// Response (200 OK)
{
  "id": "cm1234567890",
  "email": "john@example.com",
  "role": "admin",
  "banned": false
}

// Error Response (400)
{
  "error": "Invalid role. Must be 'user' or 'admin'"
}
```

### Ban/Unban User

**PUT** `/users/:id/status` *(Requires auth + admin role)*

```javascript
// Request
{
  "banned": true  // or false to unban
}

// Response (200 OK)
{
  "id": "cm1234567890",
  "email": "john@example.com",
  "role": "user",
  "banned": true
}

// Error Response (400)
{
  "error": "Banned status must be a boolean"
}
```

---

## Error Responses

All errors follow this format:

```javascript
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions (admin required) |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Request Headers

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  (required for protected endpoints)
```

---

## Token Format

JWT tokens have 3 parts separated by dots: `header.payload.signature`

**Payload Example:**
```json
{
  "userId": "cm1234567890",
  "email": "john@example.com",
  "role": "user",
  "iat": 1714122600,
  "exp": 1714727400
}
```

Tokens expire after 7 days by default.

---

## Frontend Integration Examples

### Using Fetch API

```typescript
// Register
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    displayName: 'John Doe'
  })
});

const data = await response.json();
localStorage.setItem('auth_token', data.token);
```

### Using API Client (Recommended)

See `FRONTEND_MIGRATION.md` for the provided API client implementation.

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "displayName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# Get products
curl http://localhost:3000/api/products

# Get products by category
curl "http://localhost:3000/api/products?category=Exhaust"

# Get user's orders (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/orders
```

---

Thank you for using Gear-Up-Glam! 🏍️
