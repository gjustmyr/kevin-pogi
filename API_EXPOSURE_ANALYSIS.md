# API Exposure Analysis - Public vs Protected Endpoints

## 🌐 **Current API Exposure Status**

---

## ✅ **GOOD NEWS: Most APIs are Protected!**

Ang majority ng API endpoints mo ay **PROTECTED** at hindi accessible sa public without authentication.

---

## 🔓 **PUBLIC ENDPOINTS (Accessible Without Login)**

### 1. **Authentication Endpoints**
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/create-admin
POST /api/auth/create-superadmin
```

**Risk Level:** 🔴 **HIGH**

**Issues:**
- ❌ `/api/auth/create-admin` - **ANYONE can create admin accounts!**
- ❌ `/api/auth/create-superadmin` - **ANYONE can create superadmin accounts!**
- ❌ `/api/auth/register` - **ANYONE can register**
- ✅ `/api/auth/login` - This is okay (needed for login)

**What can attackers do:**
```bash
# Anyone can create a superadmin account!
curl -X POST http://localhost:3000/api/auth/create-superadmin \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@evil.com","password":"hacked123"}'

# Anyone can create an admin account!
curl -X POST http://localhost:3000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"hacker@evil.com","first_name":"Hacker","last_name":"Evil"}'
```

---

### 2. **Password Reset Endpoints**
```
POST /api/password-reset/request
GET  /api/password-reset/verify/:token
POST /api/password-reset/reset
```

**Risk Level:** 🟡 **MEDIUM**

**Issues:**
- ⚠️ No rate limiting - Can spam reset requests
- ⚠️ Token might be guessable if not random enough

---

### 3. **Test Endpoint**
```
GET /api/hello
```

**Risk Level:** 🟢 **LOW**

**What it exposes:**
```json
{"message": "Hello from the backend!"}
```

This is harmless but reveals that the API is running.

---

### 4. **Static Files (Uploads)**
```
GET /uploads/*
```

**Risk Level:** 🔴 **HIGH**

**Issues:**
- ❌ **ALL uploaded files are publicly accessible!**
- ❌ Anyone can access documents, photos, PDFs if they know the filename
- ❌ No authentication required

**Example:**
```
http://localhost:3000/uploads/documents/sensitive-document.pdf
http://localhost:3000/uploads/photos/faculty-photo.jpg
```

If someone knows or guesses the filename, they can download it!

---

## 🔒 **PROTECTED ENDPOINTS (Require Authentication)**

### All Other Endpoints Require JWT Token:
```
✅ /api/superadmin/*
✅ /api/dean/*
✅ /api/faculty/*
✅ /api/organization/*
✅ /api/admin/*
✅ /api/dropdown/*
✅ /api/announcements/*
✅ /api/academic-years/*
✅ /api/pds/*
```

**Good!** These are properly protected with `verifyToken` middleware.

---

## 🚨 **CRITICAL VULNERABILITIES**

### 1. **🔴 CRITICAL: Public Admin/Superadmin Creation**

**Current Code:**
```javascript
// auth.routes.js
router.post("/create-admin", authController.createAdmin);
router.post("/create-superadmin", authController.createSuperadmin);
```

**Problem:** ANYONE can create admin/superadmin accounts!

**Attack Scenario:**
1. Attacker discovers your API endpoint
2. Creates superadmin account
3. Logs in with full system access
4. Can view/modify/delete ALL data

**Impact:** 🔴 **COMPLETE SYSTEM COMPROMISE**

---

### 2. **🔴 CRITICAL: Public File Access**

**Current Code:**
```javascript
// index.js
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
```

**Problem:** ALL uploaded files are publicly accessible!

**What's exposed:**
- Faculty documents
- Student records
- Organization documents
- Personal Data Sheets (PDS)
- Photos
- Sensitive PDFs

**Attack Scenario:**
1. Attacker guesses or discovers filename
2. Downloads sensitive documents
3. Accesses private information

**Impact:** 🔴 **DATA BREACH / PRIVACY VIOLATION**

---

### 3. **🟡 MEDIUM: Public Registration**

**Current Code:**
```javascript
router.post("/register", authController.register);
```

**Problem:** Anyone can register accounts

**Impact:** 🟡 **Unauthorized account creation**

---

## 🛡️ **HOW TO FIX (Priority Order)**

### **FIX #1: Protect Admin/Superadmin Creation (CRITICAL)**

**Current (WRONG):**
```javascript
// auth.routes.js
router.post("/create-admin", authController.createAdmin);
router.post("/create-superadmin", authController.createSuperadmin);
```

**Fixed (CORRECT):**
```javascript
// auth.routes.js
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// Only superadmin can create admin
router.post("/create-admin", 
  verifyToken, 
  checkRole("superadmin"), 
  authController.createAdmin
);

// Only existing superadmin can create new superadmin
router.post("/create-superadmin", 
  verifyToken, 
  checkRole("superadmin"), 
  authController.createSuperadmin
);
```

---

### **FIX #2: Protect Uploaded Files (CRITICAL)**

**Option A: Add Authentication Middleware**
```javascript
// index.js
const verifyToken = require("./middleware/auth.middleware");

// Protect uploads directory
app.use("/uploads", verifyToken, express.static(path.join(__dirname, "uploads")));
```

**Option B: Create Download Endpoint (BETTER)**
```javascript
// Remove public access
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create protected download endpoint
router.get("/download/:type/:filename", 
  verifyToken, 
  async (req, res) => {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, "uploads", type, filename);
    
    // Check if user has permission to access this file
    // (implement your own logic here)
    
    res.download(filePath);
  }
);
```

---

### **FIX #3: Disable or Protect Registration**

**Option A: Disable Public Registration**
```javascript
// Remove or comment out
// router.post("/register", authController.register);
```

**Option B: Add Invitation System**
```javascript
// Only allow registration with valid invitation token
router.post("/register", 
  validateInvitationToken, 
  authController.register
);
```

---

## 📊 **API Exposure Summary**

| Endpoint Type | Count | Status | Risk |
|--------------|-------|--------|------|
| Public (No Auth) | 8 | 🔴 Dangerous | HIGH |
| Protected (Auth Required) | 50+ | ✅ Good | LOW |
| Static Files | ALL | 🔴 Exposed | HIGH |

---

## 🎯 **What Can Attackers See/Do Right Now?**

### **Without Authentication:**
1. ✅ Can create superadmin account
2. ✅ Can create admin account
3. ✅ Can register any user
4. ✅ Can access ALL uploaded files
5. ✅ Can request password resets
6. ✅ Can see API is running

### **With Authentication (After Login):**
1. ❌ Cannot access other roles' data (Good!)
2. ❌ Cannot bypass role checks (Good!)
3. ✅ Can only access their own data (Good!)

---

## 🔍 **How to Test (Try This Yourself)**

### **Test 1: Create Superadmin (Should FAIL but currently WORKS)**
```bash
curl -X POST http://localhost:3000/api/auth/create-superadmin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123456"}'
```

**Expected:** ❌ 401 Unauthorized
**Actual:** ✅ 201 Created (BAD!)

---

### **Test 2: Access Uploaded File (Should FAIL but currently WORKS)**
```bash
# Try to access any uploaded file
curl http://localhost:3000/uploads/documents/some-file.pdf
```

**Expected:** ❌ 401 Unauthorized
**Actual:** ✅ 200 OK (BAD!)

---

### **Test 3: Access Protected Endpoint Without Token (Should FAIL)**
```bash
curl http://localhost:3000/api/dean/faculty
```

**Expected:** ❌ 403 No token provided
**Actual:** ✅ 403 No token provided (GOOD!)

---

## 📋 **IMMEDIATE ACTION CHECKLIST**

### **Do This NOW (Before Anyone Finds Out):**

- [ ] **Add authentication to `/api/auth/create-admin`**
- [ ] **Add authentication to `/api/auth/create-superadmin`**
- [ ] **Protect `/uploads` directory**
- [ ] **Disable or protect `/api/auth/register`**
- [ ] **Add rate limiting to password reset**
- [ ] **Change all existing admin passwords**
- [ ] **Check database for unauthorized accounts**

---

## 💡 **Additional Recommendations**

### **1. API Documentation**
- Don't expose API documentation publicly
- Use Swagger with authentication
- Keep internal documentation only

### **2. Error Messages**
- Don't reveal system information in errors
- Use generic error messages
- Log detailed errors server-side only

### **3. Monitoring**
- Log all admin/superadmin creation attempts
- Alert on suspicious activity
- Monitor file access patterns

### **4. Network Security**
- Use firewall to restrict API access
- Whitelist allowed IP addresses
- Use VPN for admin access

---

## ✅ **CONCLUSION**

### **Current State:**
- 🔴 **CRITICAL:** Admin/Superadmin creation is PUBLIC
- 🔴 **CRITICAL:** All uploaded files are PUBLIC
- 🟡 **MEDIUM:** Registration is PUBLIC
- ✅ **GOOD:** Most endpoints are protected

### **Risk Level:** 🔴 **HIGH**

**If deployed to production RIGHT NOW:**
- Anyone can become superadmin
- Anyone can access all uploaded files
- Complete system compromise possible

### **Time to Fix:** 30-60 minutes

### **Priority:**
1. 🔴 Fix admin/superadmin creation (5 min)
2. 🔴 Protect uploaded files (15 min)
3. 🟡 Disable/protect registration (5 min)
4. 🟡 Add rate limiting (10 min)

---

## 📞 **Need Help?**

Kung may tanong ka about security or kung paano i-implement ang fixes, just ask! 😊

**Remember:** Better to fix now than to deal with a data breach later!
