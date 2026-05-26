# 🚀 Sunod na Hakbang Pagkatapos ng Git Clone

Kumusta! Natapos mo na ang `npm install` para sa backend at client. Ito na ang sunod mong gagawin:

---

## ✅ Tapos Na Natin:
1. ✅ Git clone ng repository
2. ✅ `npm install` sa backend folder (640 packages)
3. ✅ `npm install` sa client folder (252 packages)

---

## 📋 Sunod na Gagawin:

### **STEP 1: I-check kung May MySQL Ka Na**

Tingnan kung naka-install na ang MySQL sa computer mo:

```bash
mysql --version
```

**Kung may error:**
- Download at install ang MySQL: https://dev.mysql.com/downloads/mysql/
- O kaya install via XAMPP: https://www.apachefriends.org/

**Kung may XAMPP ka:**
1. Buksan ang XAMPP Control Panel
2. I-start ang MySQL service
3. Click "Admin" para buksan ang phpMyAdmin

---

### **STEP 2: Gumawa ng Database**

**Option A: Gamit ang phpMyAdmin (kung may XAMPP)**
1. Buksan ang browser: `http://localhost/phpmyadmin`
2. Click "New" sa left sidebar
3. Database name: `database_cs`
4. Collation: `utf8mb4_general_ci`
5. Click "Create"

**Option B: Gamit ang MySQL Command Line**
```bash
# Login sa MySQL
mysql -u root -p

# Gumawa ng database
CREATE DATABASE database_cs;

# Tingnan kung nagawa na
SHOW DATABASES;

# Exit
exit;
```

---

### **STEP 3: I-configure ang .env File**

Ang `.env` file mo sa `backend` folder ay nandito na. Tingnan mo lang kung tama:

**Current Configuration:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=                    ← PALITAN MO ITO!
DB_NAME=database_cs
DB_DIALECT=mysql

JWT_SECRET=your_jwt_secret_here  ← PALITAN MO ITO!
PORT=3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=23-30046@g.batstate-u.edu.ph
SMTP_PASS=veqx bhyl tcyt yrcf
```

**Kailangan Mong Palitan:**

1. **DB_PASSWORD** - Lagay ang MySQL password mo
   - Kung walang password, leave it blank
   - Kung may password: `DB_PASSWORD=yourpassword`

2. **JWT_SECRET** - Random secret key para sa security
   - Example: `JWT_SECRET=mySecretKey123!@#`
   - O kaya gumawa ng random: `JWT_SECRET=bsu_lipa_2024_secret_key`

---

### **STEP 4: Test Database Connection**

Tingnan kung connected na sa database:

```bash
cd backend
npm run test-db
```

**Expected Output:**
```
🔄 Testing database connection...
📊 Database: database_cs
🖥️  Host: localhost
👤 User: root

✅ Database connection successful!
⚠️  Database is empty. No tables found.
💡 Run: node init-database.js to create tables
```

**Kung may error:**
- Check kung running ang MySQL
- Verify ang password sa .env
- Make sure na-create mo na ang database

---

### **STEP 5: Create Database Tables**

I-create ang lahat ng tables gamit ang Sequelize:

```bash
npm run init-db
```

**Expected Output:**
```
🚀 DATABASE INITIALIZATION SCRIPT
============================================================
📊 Database: database_cs
🖥️  Host: localhost
👤 User: root
============================================================

🔄 Connecting to database...
✅ Database connection established successfully.

🔄 Creating/Updating database tables...
✅ All tables have been created/updated successfully!

📋 Database Tables:
   1. users
   2. admins
   3. deans
   4. faculties
   5. organizations
   6. academic_years
   7. requirement_submissions
   8. requirement_files
   9. faculty_credentials
   10. credential_certificates
   ... (at marami pang iba!)

✅ Database initialization completed successfully!
```

Ang script na ito ay:
- ✅ Mag-create ng lahat ng tables
- ✅ Mag-setup ng relationships
- ✅ Mag-configure ng indexes
- ✅ Safe to run multiple times (hindi mag-delete ng data)

---

### **STEP 6: Create Superadmin Account (Optional)**

Kung gusto mo ng admin account para sa testing:

```bash
npm run create-superadmin-quick
```

O kaya manually sa MySQL:

```sql
USE database_cs;

-- Insert user
INSERT INTO users (email, password, role, created_at, updated_at) 
VALUES ('admin@bsu.edu.ph', '$2a$10$YourHashedPasswordHere', 'superadmin', NOW(), NOW());

-- Get the user_id
SELECT * FROM users WHERE email = 'admin@bsu.edu.ph';

-- Insert admin record
INSERT INTO admins (user_id, first_name, last_name, created_at, updated_at)
VALUES (1, 'Super', 'Admin', NOW(), NOW());
```

---

### **STEP 7: Start Backend Server**

```bash
npm start
```

**Expected Output:**
```
Server running on port 3000
Database connected successfully
```

**Kung may error:**
- Port 3000 is already in use → May running process na, i-stop mo muna
- Database connection error → Check .env configuration
- Module not found → Run `npm install` ulit

---

### **STEP 8: Start Frontend Server**

Buksan ang **BAGONG TERMINAL** (huwag i-close ang backend terminal!)

```bash
cd client
npx http-server -p 7283
```

**O kaya:**
- Right-click sa `client/index.html` sa VS Code
- Select "Open with Live Server"

**Expected Output:**
```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:7283
  http://192.168.1.x:7283
Hit CTRL-C to stop the server
```

---

### **STEP 9: Access the System**

Buksan ang browser:
```
http://localhost:7283
```

**Test Login Accounts:**

**Dean Account:**
- Email: `cit.lipa@g.batstate-u.edu.ph`
- Password: `#B$E4dih^Bj5`

**Faculty Account:**
- Email: `shielamariep.calvelo@g.batstate-u.edu.ph`
- Password: `NXpTNV02pIRR`

**Organization Account:**
- Email: `acets.lipa@g.batstate-u.edu.ph`
- Password: `sXMDJbJbTgIK`

---

## 🎯 Quick Command Summary

```bash
# 1. Test database connection
cd backend
npm run test-db

# 2. Create database tables
npm run init-db

# 3. Start backend (Terminal 1)
npm start

# 4. Start frontend (Terminal 2)
cd ../client
npx http-server -p 7283

# 5. Open browser
# http://localhost:7283
```

---

## ⚠️ Common Issues

### Issue 1: "Cannot connect to database"
```bash
# Solution 1: Check if MySQL is running
# - Open XAMPP and start MySQL
# - Or check Windows Services for MySQL

# Solution 2: Verify .env password
# - Open backend/.env
# - Check DB_PASSWORD value
```

### Issue 2: "Port 3000 already in use"
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID 12345 /F
```

### Issue 3: "Database does not exist"
```bash
# Create the database
mysql -u root -p
CREATE DATABASE database_cs;
exit;
```

### Issue 4: "npm run init-db" may error
```bash
# Clear node_modules and reinstall
cd backend
rmdir /s /q node_modules
npm install
npm run init-db
```

---

## 📝 Development Workflow

**Araw-araw na workflow:**

1. **Start MySQL** (kung naka-XAMPP)
   - Open XAMPP Control Panel
   - Start MySQL

2. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```

3. **Start Frontend** (Terminal 2)
   ```bash
   cd client
   npx http-server -p 7283
   ```

4. **Open Browser**
   ```
   http://localhost:7283
   ```

5. **Pag tapos na:**
   - Press `Ctrl+C` sa both terminals
   - Stop MySQL sa XAMPP (optional)

---

## 🔧 Helpful Commands

```bash
# Check database tables
npm run test-db

# Reset database (CAUTION: Deletes all data!)
npm run reset-db

# Insert academic years
npm run insert-academic-years

# Create superadmin
npm run create-superadmin

# Run with auto-restart (for development)
npm run dev
```

---

## 📚 Additional Resources

- **Installation Guide**: `INSTALLATION_GUIDE.md`
- **Project Overview**: `PROJECT_OVERVIEW.md`
- **Project Description**: `PROJECT_DESCRIPTION.md`
- **Monkey Test Results**: 
  - `DEAN_PORTAL_STRUCTURED_MONKEY_TEST_RESULTS.md`
  - `FACULTY_PORTAL_STRUCTURED_MONKEY_TEST_RESULTS.md`
  - `ORGANIZATION_PORTAL_STRUCTURED_MONKEY_TEST_RESULTS.md`

---

## ✅ Checklist

Gawin mo ito step by step:

- [ ] MySQL installed and running
- [ ] Database `database_cs` created
- [ ] `.env` file configured (password, JWT secret)
- [ ] `npm run test-db` - successful
- [ ] `npm run init-db` - tables created
- [ ] Backend running on port 3000
- [ ] Frontend running on port 7283
- [ ] Can access http://localhost:7283
- [ ] Can login with test accounts

---

## 🎉 Tapos Na!

Kung natapos mo na lahat ng steps, ready na ang system mo!

**Next Steps:**
- Test all features
- Run monkey tests
- Check all portals (Dean, Faculty, Organization)
- Review documentation

**Need Help?**
- Check error logs sa terminal
- Review `.env` configuration
- Verify MySQL is running
- Check browser console (F12) for frontend errors

---

**Good luck sa thesis mo!** 🚀📚
