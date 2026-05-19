# Email Usage Limit Feature

## ✅ Feature Implemented

**Rule:** Each email address can be used to create a maximum of **3 accounts**:
- 1 Organization account
- 1 Faculty account  
- 1 Dean account

---

## 🎯 Purpose

This feature prevents:
- ❌ Email abuse (creating multiple accounts with same email)
- ❌ Duplicate accounts for the same role
- ❌ Unlimited account creation with one email

This allows:
- ✅ One person to have different roles (e.g., someone can be both a faculty and a dean)
- ✅ Proper account management
- ✅ Clear role separation

---

## 📁 Files Created/Modified

### New File
**`backend/utils/email-validator.js`**
- `checkEmailUsageLimit(email, role)` - Validates if email can be used
- `getEmailUsageStats(email)` - Gets usage statistics for an email

### Modified Controllers
1. **`backend/controllers/superadmin-dean.controller.js`**
   - Added email limit check in `createDean()`

2. **`backend/controllers/dean-faculty.controller.js`**
   - Added email limit check in `createFaculty()`

3. **`backend/controllers/dean-organization.controller.js`**
   - Added email limit check in `createOrganization()`

---

## 🔍 How It Works

### Validation Logic

```javascript
const { checkEmailUsageLimit } = require('../utils/email-validator');

// Check if email can be used for this role
const emailCheck = await checkEmailUsageLimit(email, 'dean');

if (!emailCheck.allowed) {
  return res.status(400).json({
    message: emailCheck.message,
    usage: emailCheck.usage
  });
}
```

### Response Structure

**Success (Email can be used):**
```json
{
  "allowed": true,
  "message": "Email can be used for dean account. Current usage: 1/3 accounts.",
  "usage": {
    "organization": 1,
    "faculty": 0,
    "dean": 0,
    "total": 1
  }
}
```

**Error (Role already exists):**
```json
{
  "allowed": false,
  "message": "This email is already used for a dean account. Each email can only be used once per role.",
  "usage": {
    "organization": 0,
    "faculty": 0,
    "dean": 1,
    "total": 1
  }
}
```

**Error (Limit reached):**
```json
{
  "allowed": false,
  "message": "This email has reached the maximum limit of 3 accounts (1 organization, 1 faculty, 1 dean).",
  "usage": {
    "organization": 1,
    "faculty": 1,
    "dean": 1,
    "total": 3
  }
}
```

---

## 📊 Usage Scenarios

### Scenario 1: First Account
```
Email: john@example.com
Action: Create Dean account
Result: ✅ Allowed (0/3 accounts)
```

### Scenario 2: Second Account (Different Role)
```
Email: john@example.com (already has Dean)
Action: Create Faculty account
Result: ✅ Allowed (1/3 accounts)
```

### Scenario 3: Duplicate Role
```
Email: john@example.com (already has Dean)
Action: Create another Dean account
Result: ❌ Denied - "Email already used for dean account"
```

### Scenario 4: Third Account
```
Email: john@example.com (has Dean + Faculty)
Action: Create Organization account
Result: ✅ Allowed (2/3 accounts)
```

### Scenario 5: Limit Reached
```
Email: john@example.com (has Dean + Faculty + Organization)
Action: Create any account
Result: ❌ Denied - "Maximum limit of 3 accounts reached"
```

---

## 🧪 Testing

### Test Case 1: Create Dean Account
```bash
POST /api/superadmin/deans
{
  "email": "test@example.com",
  "employee_id": "12345",
  "first_name": "John",
  "last_name": "Doe",
  "department": "College of Engineering"
}
```
**Expected:** ✅ Success (1/3 accounts)

### Test Case 2: Create Faculty with Same Email
```bash
POST /api/dean/faculty
{
  "email": "test@example.com",
  "employee_id": "54321",
  "first_name": "John",
  "last_name": "Doe"
}
```
**Expected:** ✅ Success (2/3 accounts)

### Test Case 3: Create Organization with Same Email
```bash
POST /api/dean/organizations
{
  "email": "test@example.com",
  "organization_name": "Tech Club",
  "adviser_id_1": 1,
  "adviser_id_2": 2
}
```
**Expected:** ✅ Success (3/3 accounts)

### Test Case 4: Try to Create 4th Account
```bash
POST /api/dean/faculty
{
  "email": "test@example.com",
  "employee_id": "99999",
  "first_name": "Jane",
  "last_name": "Smith"
}
```
**Expected:** ❌ Error - "Maximum limit of 3 accounts reached"

### Test Case 5: Try Duplicate Role
```bash
POST /api/superadmin/deans
{
  "email": "test@example.com",
  "employee_id": "11111",
  "first_name": "Jane",
  "last_name": "Smith",
  "department": "College of Science"
}
```
**Expected:** ❌ Error - "Email already used for dean account"

---

## 🔧 API Endpoints Affected

### Superadmin - Create Dean
```
POST /api/superadmin/deans
```
Now checks email limit before creating dean account.

### Dean - Create Faculty
```
POST /api/dean/faculty
```
Now checks email limit before creating faculty account.

### Dean - Create Organization
```
POST /api/dean/organizations
```
Now checks email limit before creating organization account.

---

## 📝 Error Messages

| Scenario | Error Message |
|----------|---------------|
| Role already exists | "This email is already used for a {role} account. Each email can only be used once per role." |
| Limit reached | "This email has reached the maximum limit of 3 accounts (1 organization, 1 faculty, 1 dean)." |
| Validation failed | "Failed to validate email usage" |

---

## 🎨 Frontend Integration

The frontend should display these error messages to users when they try to create accounts.

**Example Error Display:**
```typescript
if (error.status === 400 && error.error.usage) {
  const usage = error.error.usage;
  console.log(`Email usage: ${usage.total}/3 accounts`);
  console.log(`Organization: ${usage.organization ? '✓' : '✗'}`);
  console.log(`Faculty: ${usage.faculty ? '✓' : '✗'}`);
  console.log(`Dean: ${usage.dean ? '✓' : '✗'}`);
}
```

---

## 🔍 Checking Email Usage

To check current usage of an email:

```javascript
const { getEmailUsageStats } = require('./utils/email-validator');

const stats = await getEmailUsageStats('john@example.com');
console.log(stats);
// Output:
// {
//   organization: 1,
//   faculty: 1,
//   dean: 1,
//   total: 3,
//   accounts: [
//     { role: 'dean', createdAt: '2024-01-01' },
//     { role: 'faculty', createdAt: '2024-01-02' },
//     { role: 'organization', createdAt: '2024-01-03' }
//   ]
// }
```

---

## ✅ Benefits

1. **Prevents Abuse** - Limits account creation per email
2. **Role Flexibility** - Allows one person to have multiple roles
3. **Clear Limits** - Maximum 3 accounts per email
4. **Better Management** - Easy to track email usage
5. **Security** - Prevents unlimited account creation

---

## 🚀 Status

- ✅ Email validator utility created
- ✅ Dean creation updated
- ✅ Faculty creation updated
- ✅ Organization creation updated
- ✅ Error messages implemented
- ✅ Usage tracking implemented

**Ready to use!** Restart the backend server to apply changes.

---

## 📞 Support

If you encounter issues:

1. Check backend logs for validation errors
2. Verify email format is correct
3. Check database for existing accounts with that email
4. Review error message and usage statistics

---

**Implementation Date:** May 18, 2026
**Status:** ✅ Complete and Ready
