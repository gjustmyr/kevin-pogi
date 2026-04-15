# Superadmin Setup Guide - Quick Start

## 🚀 Quick Setup (3 Steps)

### Step 1: Ensure Database is Running

Make sure MySQL is running and the database exists.

### Step 2: Run Migrations

```bash
cd backend
node run-migration.js
node run-profile-migration.js
```

### Step 3: Create Superadmin

Choose one of these methods:

#### Method A: Interactive (Recommended for first time)

```bash
npm run create-superadmin
```

Then follow the prompts to enter email and password.

#### Method B: Quick Command

```bash
npm run create-superadmin-quick admin@example.com YourPassword123
```

#### Method C: Direct Node Command

```bash
node create-superadmin-quick.js admin@example.com YourPassword123
```

---

## ✅ What You'll See

### Successful Creation:

```
===========================================
   Create Superadmin Account
===========================================

✓ Database connection established
✓ Email is available
✓ Creating superadmin account...

✓ Superadmin account created successfully!

===========================================
   Login Credentials
===========================================
Email:    admin@example.com
Password: YourPassword123
Role:     superadmin
User ID:  1
===========================================

You can now login with these credentials.
```

---

## 📋 Requirements

- ✅ Email must contain @ symbol
- ✅ Password must be at least 8 characters
- ✅ Email must be unique (not already in database)
- ✅ Database must be running and accessible

---

## 🔧 Troubleshooting

### "Database connection failed"

- Check if MySQL is running
- Verify `.env` file has correct database credentials

### "Email already exists"

- Use a different email address
- Or delete the existing user from database

### "Password must be at least 8 characters"

- Use a longer password

---

## 🎯 Next Steps After Creating Superadmin

1. **Start the server:**

   ```bash
   npm start
   ```

2. **Login to the system:**
   - Use the email and password you just created
   - You'll be redirected to superadmin dashboard

3. **Create Deans:**
   - From superadmin dashboard, create dean accounts
   - Deans will receive credentials via email

4. **Deans Create Faculty:**
   - Deans login and create faculty accounts
   - Faculty receive credentials via email

---

## 📝 Example Commands

### Create with common email patterns:

```bash
# University email
node create-superadmin-quick.js admin@batstate-u.edu.ph Admin@2026

# Gmail
node create-superadmin-quick.js superadmin@gmail.com SecurePass123

# Custom domain
node create-superadmin-quick.js admin@university.edu StrongPassword2026
```

---

## 🔐 Security Tips

1. Use a strong password (12+ characters recommended)
2. Include uppercase, lowercase, numbers, and special characters
3. Don't share superadmin credentials
4. Change password after first login
5. Use official organization email

---

## 📚 Full Documentation

For detailed information, see:

- `backend/CREATE_SUPERADMIN.md` - Complete guide with all methods
- `backend/create-superadmin.js` - Interactive script
- `backend/create-superadmin-quick.js` - Quick command script

---

## ⚡ TL;DR (Too Long; Didn't Read)

```bash
cd backend
npm run create-superadmin-quick admin@example.com Password123
npm start
```

Then login with:

- Email: admin@example.com
- Password: Password123

Done! 🎉
