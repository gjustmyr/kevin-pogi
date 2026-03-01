# Commission System - Authentication Setup

## Overview

This application implements a **role-based authentication system** with **JWT tokens** that prevents users from accessing dashboards they don't have privileges for.

## Authentication Features

### ✅ Single Login Page

- One unified login endpoint for all user roles
- Users are automatically redirected to their role-specific dashboard

### ✅ Role-Based Access Control (RBAC)

The system supports 5 user roles:

1. **Superadmin** - Full system access
2. **Admin** - System management
3. **Dean** - Department-level access
4. **Faculty** - Faculty-level access
5. **Organization** - Organization-level access

### ✅ Protected Routes

- Users can **only** access their own dashboard
- Attempting to access another role's dashboard will redirect them to their own
- Example: An organization user with a valid token **cannot** access `/faculty/dashboard`

## Backend API Endpoints

### Authentication

```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/profile (Protected - requires token)
```

### Protected Dashboards

```
GET /api/superadmin/dashboard (Only superadmin role)
GET /api/admin/dashboard     (Only admin role)
GET /api/dean/dashboard      (Only dean role)
GET /api/faculty/dashboard   (Only faculty role)
GET /api/organization/dashboard (Only organization role)
```

## Frontend Routes

All dashboard routes are protected with **authGuard** and **roleGuard**:

```typescript
/login                     - Public
/superadmin/dashboard      - Superadmin only
/admin/dashboard          - Admin only
/dean/dashboard           - Dean only
/faculty/dashboard        - Faculty only
/organization/dashboard   - Organization only
```

## How It Works

### Login Flow

1. User enters credentials on `/login`
2. Backend validates credentials and generates JWT token
3. Token contains: `user_id`, `email`, `role`
4. User is redirected to their role-specific dashboard: `/{role}/dashboard`

### Route Protection

1. **authGuard**: Checks if user has a valid token
2. **roleGuard**: Checks if user's role matches the route's required role
3. If role doesn't match → redirects to user's own dashboard

### Token Management

- Stored in `localStorage` as `auth_token`
- Automatically attached to all HTTP requests via **authInterceptor**
- Format: `Authorization: Bearer {token}`

## Test Accounts

Run the seed script to create test users:

```bash
cd backend
node seed.js
```

### Available Test Accounts

All passwords: `password123`

| Role         | Email               | Dashboard Path          |
| ------------ | ------------------- | ----------------------- |
| Superadmin   | superadmin@test.com | /superadmin/dashboard   |
| Admin        | admin@test.com      | /admin/dashboard        |
| Dean         | dean@test.com       | /dean/dashboard         |
| Faculty      | faculty@test.com    | /faculty/dashboard      |
| Organization | org@test.com        | /organization/dashboard |

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies (if not already done)
npm install

# Configure environment
# Edit .env file and set JWT_SECRET

# Sync database and seed test data
node seed.js

# Start the server
npm start
```

The backend will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd client

# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:4200`

## Security Features

### ✅ Password Hashing

- Uses **bcrypt** with salt rounds of 10
- Passwords are never stored in plain text

### ✅ JWT Token Expiration

- Tokens expire after **24 hours**
- Expired tokens are rejected by the backend

### ✅ Role Verification

- Both frontend (route guards) and backend (middleware) verify roles
- Double-layer protection prevents unauthorized access

### ✅ HTTP-Only Best Practices

- Frontend stores token in localStorage
- Backend validates token on every protected route
- Invalid/expired tokens result in 401 Unauthorized

## Example Usage

### Testing Role Protection

1. Login as **organization** user (org@test.com / password123)
2. You'll be redirected to `/organization/dashboard`
3. Try to manually navigate to `/faculty/dashboard`
4. **Result**: You'll be redirected back to `/organization/dashboard`

This proves that:

- ✅ Users cannot access other roles' dashboards
- ✅ Route guards work correctly
- ✅ Backend middleware validates roles

## API Request Examples

### Login Request

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "dean@test.com",
  "password": "password123"
}
```

### Login Response

```json
{
	"message": "Login successful",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"user": {
		"user_id": 3,
		"email": "dean@test.com",
		"role": "dean",
		"profile": {
			"dean_id": 1,
			"first_name": "Jane",
			"last_name": "Dean",
			"department_name": "Computer Science"
		}
	},
	"redirectPath": "/dean/dashboard"
}
```

### Protected Request

```bash
GET http://localhost:3000/api/dean/dashboard
Authorization: Bearer {your-token-here}
```

## Troubleshooting

### Issue: "No token provided"

**Solution**: Make sure you're logged in and the token is stored in localStorage

### Issue: "Forbidden - You do not have permission"

**Solution**: You're trying to access a route your role doesn't have access to

### Issue: "Unauthorized - Invalid token"

**Solution**: Your token has expired or is invalid. Please login again.

## Environment Variables

Make sure your `.env` file contains:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=capstone_db
DB_DIALECT=mysql
```

## Next Steps

- [ ] Implement password reset functionality
- [ ] Add refresh tokens for better security
- [ ] Implement account lockout after failed login attempts
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Create user management CRUD operations
- [ ] Add activity logging

## Technologies Used

### Backend

- Node.js + Express
- Sequelize ORM
- MySQL
- bcrypt (password hashing)
- jsonwebtoken (JWT)

### Frontend

- Angular 19
- Tailwind CSS
- Reactive Forms
- HTTP Client
- Route Guards
