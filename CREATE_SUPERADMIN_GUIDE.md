# How to Create a Superadmin Account

## Quick Method (Recommended)

This creates a superadmin with default credentials that you can change later.

### Step 1: Navigate to backend folder
```bash
cd backend
```

### Step 2: Run the quick creation script
```bash
npm run create-superadmin-quick
```

### Step 3: Login with these credentials
- **Email:** admin@example.com
- **Password:** Admin123!
- **URL:** http://localhost:3000

⚠️ **IMPORTANT:** Change the password after first login!

---

## Interactive Method

If you want to set custom credentials during creation:

### Step 1: Navigate to backend folder
```bash
cd backend
```

### Step 2: Run the interactive script
```bash
npm run create-superadmin
```

### Step 3: Enter your details when prompted
- First Name
- Middle Name (optional)
- Last Name
- Email
- Contact Number (optional)
- Password

---

## Troubleshooting

### Error: "Cannot connect to database"
1. Make sure MySQL is running
2. Check your `.env` file in the backend folder
3. Verify database credentials are correct

### Error: "Database does not exist"
Run this command first:
```bash
npm run init-db
```

### Error: "Email already exists"
The superadmin account already exists. Try logging in with the existing credentials, or delete the user from the database first.

### Backend Server Not Running
If you get a 500 error when trying to login:
1. Make sure the backend server is running:
   ```bash
   cd backend
   npm start
   ```
2. Check the terminal for any error messages
3. Make sure MySQL is running

---

## Default Credentials (Quick Method)

When using `npm run create-superadmin-quick`, these are the default credentials:

- **Email:** admin@example.com
- **Password:** Admin123!

You can edit the `create-superadmin-quick.js` file to change these defaults before running the script.

---

## Security Notes

1. Always change the default password after first login
2. Use a strong password with:
   - At least 8 characters
   - Mix of uppercase and lowercase letters
   - Numbers
   - Special characters
3. Don't share your superadmin credentials
4. Consider using a password manager
