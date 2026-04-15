# Create Superadmin Account

This guide explains how to create a superadmin account for the Commission System.

## Prerequisites

1. Database must be running and configured in `.env` file
2. All migrations must be completed
3. Node.js and npm installed

## Method 1: Interactive Script (Recommended)

This method will prompt you for email and password interactively.

### Steps:

1. Navigate to backend directory:

```bash
cd backend
```

2. Run the interactive script:

```bash
npm run create-superadmin
```

Or directly:

```bash
node create-superadmin.js
```

3. Follow the prompts:

```
===========================================
   Create Superadmin Account
===========================================

✓ Database connection established

Enter superadmin email: admin@example.com
Enter password (min 8 characters): MySecurePassword123
Confirm password: MySecurePassword123

Creating superadmin account...

✓ Superadmin account created successfully!

===========================================
   Login Credentials
===========================================
Email:    admin@example.com
Password: MySecurePassword123
Role:     superadmin
User ID:  1
===========================================

You can now login with these credentials.
```

### Features:

- ✅ Interactive prompts
- ✅ Email validation
- ✅ Password confirmation
- ✅ Minimum password length check (8 characters)
- ✅ Duplicate email check
- ✅ Database connection test

---

## Method 2: Quick Script (Command Line)

This method allows you to create a superadmin with a single command.

### Steps:

1. Navigate to backend directory:

```bash
cd backend
```

2. Run with email and password as arguments:

```bash
npm run create-superadmin-quick admin@example.com MySecurePassword123
```

Or directly:

```bash
node create-superadmin-quick.js admin@example.com MySecurePassword123
```

### Syntax:

```bash
node create-superadmin-quick.js <email> <password>
```

### Example:

```bash
node create-superadmin-quick.js superadmin@batstate-u.edu.ph Admin@2026
```

### Output:

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
Email:    superadmin@batstate-u.edu.ph
Password: Admin@2026
Role:     superadmin
User ID:  1
===========================================

You can now login with these credentials.
```

### Features:

- ✅ Single command execution
- ✅ No interactive prompts
- ✅ Perfect for automation/scripts
- ✅ Email validation
- ✅ Password length check
- ✅ Duplicate email check

---

## Method 3: Using API Endpoint

You can also create a superadmin using the API endpoint (useful for testing).

### Endpoint:

```
POST /api/auth/create-superadmin
```

### Request Body:

```json
{
  "email": "admin@example.com",
  "password": "MySecurePassword123"
}
```

### Example using cURL:

```bash
curl -X POST http://localhost:3000/api/auth/create-superadmin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "MySecurePassword123"
  }'
```

### Response:

```json
{
  "message": "Superadmin created successfully",
  "user": {
    "user_id": 1,
    "email": "admin@example.com",
    "role": "superadmin"
  }
}
```

---

## Validation Rules

### Email:

- ✅ Must be a valid email format (contains @)
- ✅ Must be unique (not already in database)

### Password:

- ✅ Minimum 8 characters
- ✅ Recommended: Mix of uppercase, lowercase, numbers, and special characters

---

## Troubleshooting

### Error: "Database connection failed"

**Solution:** Check your `.env` file and ensure database credentials are correct:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=capstone_db
DB_DIALECT=mysql
```

### Error: "Email already exists"

**Solution:** The email is already registered. Either:

1. Use a different email
2. Delete the existing user from database
3. Login with existing credentials

### Error: "Password must be at least 8 characters"

**Solution:** Use a longer password (minimum 8 characters)

### Error: "Cannot find module './models'"

**Solution:** Make sure you're running the script from the backend directory:

```bash
cd backend
node create-superadmin.js
```

---

## Security Best Practices

1. **Strong Password**: Use a strong password with:
   - At least 8 characters (12+ recommended)
   - Mix of uppercase and lowercase letters
   - Numbers
   - Special characters (!@#$%^&\*)

2. **Secure Email**: Use an official organization email address

3. **Change Password**: After first login, change the password immediately

4. **Don't Share**: Never share superadmin credentials

5. **Secure Storage**: Store credentials securely (password manager)

---

## What Happens After Creation?

1. A new user record is created in the `users` table
2. Password is hashed using bcrypt (10 rounds)
3. Role is set to "superadmin"
4. User can immediately login with the credentials

---

## Superadmin Capabilities

Once logged in, superadmin can:

- ✅ Create and manage deans
- ✅ View all faculty (read-only)
- ✅ View all organizations (read-only)
- ✅ Access superadmin dashboard
- ✅ View system-wide analytics
- ✅ Manage academic years
- ✅ System configuration

---

## Example Workflow

### First Time Setup:

1. **Setup Database**

```bash
cd backend
node run-migration.js
node run-profile-migration.js
```

2. **Create Superadmin**

```bash
npm run create-superadmin
# Enter: admin@batstate-u.edu.ph
# Enter password: Admin@2026
# Confirm password: Admin@2026
```

3. **Start Server**

```bash
npm start
```

4. **Login**

- Navigate to login page
- Email: admin@batstate-u.edu.ph
- Password: Admin@2026
- You'll be redirected to superadmin dashboard

5. **Create Deans**

- From superadmin dashboard, create deans for each department
- Deans will receive email with credentials

6. **Deans Create Faculty**

- Deans login and create faculty accounts
- Faculty receive email with credentials

---

## Multiple Superadmins

You can create multiple superadmin accounts by running the script multiple times with different emails:

```bash
# First superadmin
node create-superadmin-quick.js admin1@example.com Password123

# Second superadmin
node create-superadmin-quick.js admin2@example.com Password456

# Third superadmin
node create-superadmin-quick.js admin3@example.com Password789
```

---

## Deleting Superadmin

To delete a superadmin account, you can:

### Option 1: Using MySQL

```sql
DELETE FROM users WHERE email = 'admin@example.com' AND role = 'superadmin';
```

### Option 2: Using Script (create if needed)

```javascript
// delete-superadmin.js
const db = require("./models");

async function deleteSuperadmin(email) {
  await db.User.destroy({
    where: { email, role: "superadmin" },
  });
  console.log("Superadmin deleted");
}
```

---

## Notes

- Superadmin accounts don't have a profile table (unlike deans, faculty, organizations)
- Superadmin role is the highest privilege level
- Only superadmins can create deans
- There's no limit to the number of superadmin accounts
- Superadmin accounts cannot be created through the regular registration flow

---

## Quick Reference

| Method      | Command                                              | Interactive | Best For         |
| ----------- | ---------------------------------------------------- | ----------- | ---------------- |
| Interactive | `npm run create-superadmin`                          | Yes         | First time setup |
| Quick       | `npm run create-superadmin-quick <email> <password>` | No          | Automation       |
| API         | `POST /api/auth/create-superadmin`                   | No          | Testing          |

---

## Support

If you encounter any issues:

1. Check database connection
2. Verify migrations are complete
3. Check console for error messages
4. Ensure email is unique
5. Verify password meets requirements
