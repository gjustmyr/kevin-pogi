# PDS User Role Guide

## 🔍 Issue Identified

The error occurs when a **Dean user** tries to access the **Faculty PDS endpoint**, or vice versa.

### Error Details
```
Cannot add or update a child row: a foreign key constraint fails
(`database_cs`.`personal_data_sheets`, CONSTRAINT `personal_data_sheets_ibfk_1` 
FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`)
```

**Root Cause:** The system tried to insert a PDS record with `dean_id = 6` but no `faculty_id`, because the user is a Dean, not a Faculty member.

---

## 📋 User Roles and Endpoints

### Faculty Users
- **Role:** `faculty`
- **PDS Endpoint:** `/api/pds/*`
- **Profile Table:** `faculties`
- **PDS Link:** `faculty_id`

**Example:**
- User ID: 11
- Email: garciamaryrose82@gmail.com
- Role: faculty
- Faculty ID: 5
- ✅ Should use: `/api/pds/` endpoints

### Dean Users
- **Role:** `dean`
- **PDS Endpoint:** `/api/dean-pds/*`
- **Profile Table:** `deans`
- **PDS Link:** `dean_id`

**Example:**
- User ID: 18
- Email: historybytes56@gmail.com
- Role: dean
- Dean ID: 6
- ✅ Should use: `/api/dean-pds/` endpoints

---

## 🔧 Solution

### For Frontend Developers

Check the user's role and use the appropriate endpoint:

```javascript
// Get user role from auth service
const userRole = authService.getUserRole(); // 'faculty', 'dean', etc.

// Use appropriate endpoint based on role
let pdsEndpoint;
if (userRole === 'faculty') {
  pdsEndpoint = '/api/pds';
} else if (userRole === 'dean') {
  pdsEndpoint = '/api/dean-pds';
} else {
  console.error('Invalid role for PDS access');
  return;
}

// Save PDS
fetch(`${pdsEndpoint}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(pdsData)
});

// Export PDS to Excel
fetch(`${pdsEndpoint}/export/excel`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Angular Example

```typescript
export class PDSService {
  private pdsEndpoint: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Set endpoint based on user role
    const userRole = this.authService.getUserRole();
    this.pdsEndpoint = userRole === 'dean' ? '/api/dean-pds' : '/api/pds';
  }

  savePDS(pdsData: any) {
    return this.http.post(this.pdsEndpoint, pdsData);
  }

  exportPDSToExcel() {
    return this.http.get(`${this.pdsEndpoint}/export/excel`, {
      responseType: 'blob'
    });
  }
}
```

---

## 🚨 Common Mistakes

### ❌ Wrong: Using Faculty endpoint for Dean
```javascript
// Dean user (user_id: 18, dean_id: 6)
fetch('/api/pds', { ... })  // ❌ WRONG! Will fail with foreign key error
```

### ✅ Correct: Using Dean endpoint for Dean
```javascript
// Dean user (user_id: 18, dean_id: 6)
fetch('/api/dean-pds', { ... })  // ✅ CORRECT!
```

### ❌ Wrong: Using Dean endpoint for Faculty
```javascript
// Faculty user (user_id: 11, faculty_id: 5)
fetch('/api/dean-pds', { ... })  // ❌ WRONG! Will return 404
```

### ✅ Correct: Using Faculty endpoint for Faculty
```javascript
// Faculty user (user_id: 11, faculty_id: 5)
fetch('/api/pds', { ... })  // ✅ CORRECT!
```

---

## 📊 Current User-Profile Mapping

Based on the database check:

| User ID | Email | Role | Faculty ID | Dean ID | Correct Endpoint |
|---------|-------|------|------------|---------|------------------|
| 1 | 23-30046@g.batstate-u.edu.ph | superadmin | ❌ | ❌ | N/A (no PDS access) |
| 11 | garciamaryrose82@gmail.com | faculty | ✅ 5 | ❌ | `/api/pds` |
| 16 | 23-37666@g.batstate-u.edu.ph | faculty | ✅ 7 | ❌ | `/api/pds` |
| 18 | historybytes56@gmail.com | dean | ❌ | ✅ 6 | `/api/dean-pds` |
| 19 | jheadizon36@gmail.com | organization | ❌ | ❌ | N/A (no PDS access) |

---

## 🔍 How to Check User Role

### Method 1: From JWT Token
```javascript
// Decode JWT token
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('User Role:', payload.role);
```

### Method 2: From API Response
```javascript
// Get current user info
fetch('/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(user => {
  console.log('User Role:', user.role);
});
```

### Method 3: Check Backend Logs
When you try to save PDS, check the backend console:
```
============================================================
PDS SAVE REQUEST
User ID from token: 18
Faculty lookup result: NOT FOUND
ERROR: No faculty record found for user_id: 18
============================================================
```

This tells you the user is NOT a faculty member.

---

## 🛠️ Diagnostic Script

Run this script to check user-profile links:

```bash
cd backend
node scripts/check-user-faculty-link.js
```

This will show:
- All users in the system
- Which users have faculty profiles
- Which users have dean profiles
- Which users have no profiles

---

## ✅ Quick Fix Checklist

1. **Identify User Role**
   - Check JWT token payload
   - Check user table in database
   - Check backend logs

2. **Use Correct Endpoint**
   - Faculty → `/api/pds`
   - Dean → `/api/dean-pds`

3. **Update Frontend Code**
   - Add role-based endpoint selection
   - Test with both faculty and dean users

4. **Verify**
   - Faculty users can save PDS successfully
   - Dean users can save PDS successfully
   - No foreign key errors

---

## 📝 API Endpoints Summary

### Faculty PDS Endpoints
```
GET    /api/pds                    - Get faculty PDS
POST   /api/pds                    - Save faculty PDS
POST   /api/pds/upload-photo       - Upload photo
POST   /api/pds/upload-signature   - Upload signature
POST   /api/pds/submit             - Submit for approval
POST   /api/pds/import-from-profile - Import from profile
GET    /api/pds/export/excel       - Export to Excel
```

### Dean PDS Endpoints
```
GET    /api/dean-pds                    - Get dean PDS
POST   /api/dean-pds                    - Save dean PDS
POST   /api/dean-pds/upload-photo       - Upload photo
POST   /api/dean-pds/upload-signature   - Upload signature
POST   /api/dean-pds/submit             - Submit for approval
POST   /api/dean-pds/import-from-profile - Import from profile
GET    /api/dean-pds/export/excel       - Export to Excel
```

---

## 🎯 Solution for Your Current Error

Based on the error log, **user_id 18** (historybytes56@gmail.com) is a **Dean** trying to use the **Faculty endpoint**.

**Fix:**
Change the frontend to use `/api/dean-pds` instead of `/api/pds` for this user.

```javascript
// Before (causing error)
fetch('/api/pds', { ... })

// After (correct)
fetch('/api/dean-pds', { ... })
```

---

## 🚀 Recommended Frontend Implementation

```typescript
// auth.service.ts
export class AuthService {
  getUserRole(): string {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }
  
  getPDSEndpoint(): string {
    const role = this.getUserRole();
    return role === 'dean' ? '/api/dean-pds' : '/api/pds';
  }
}

// pds.component.ts
export class PDSComponent {
  constructor(private authService: AuthService) {}
  
  savePDS() {
    const endpoint = this.authService.getPDSEndpoint();
    
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.pdsData)
    })
    .then(response => {
      if (!response.ok) throw new Error('Save failed');
      return response.json();
    })
    .then(data => {
      console.log('PDS saved successfully:', data);
    })
    .catch(error => {
      console.error('Error saving PDS:', error);
    });
  }
  
  exportToExcel() {
    const endpoint = this.authService.getPDSEndpoint();
    
    fetch(`${endpoint}/export/excel`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PDS.xlsx';
      a.click();
    });
  }
}
```

---

**Status:** ✅ ISSUE IDENTIFIED

The error occurs because a Dean user is trying to use the Faculty PDS endpoint. Update your frontend to use the correct endpoint based on the user's role.
