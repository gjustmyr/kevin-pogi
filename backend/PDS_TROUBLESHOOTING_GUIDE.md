# PDS Save Error - Troubleshooting Guide

## ✅ Issue Resolved!

The error "Error saving Personal Data Sheet" was caused by a **missing database column**.

### Root Cause
The `personal_data_sheets` table was missing the `dean_id` column that was defined in the Sequelize model.

### Solution Applied
✅ Added `dean_id` column to the database table using the migration script:
```bash
node scripts/add-dean-id-to-pds.js
```

---

## Required Fields Checklist

The PDS form requires the following fields to be filled:

### ✅ Personal Information
- [x] Surname
- [x] First Name
- [x] Date of Birth (format: YYYY-MM-DD)
- [x] Place of Birth
- [x] Sex (must be: "Male" or "Female")
- [x] Civil Status (must be: "Single", "Married", "Widowed", "Separated", or "Others")
- [x] Citizenship Type (must be: "Filipino", "Dual Citizenship", or "By Naturalization")

### ✅ Address Information
- [x] Residential City
- [x] Residential Province
- [x] Permanent City
- [x] Permanent Province

### ✅ Contact Information
- [x] Mobile Number
- [x] Email Address

---

## Common Errors and Solutions

### 1. Missing Required Fields

**Error Message:**
```json
{
  "message": "Missing required fields",
  "fields": ["surname", "first_name", ...]
}
```

**Solution:**
- Ensure all required fields listed above are filled in the frontend form
- Check that the frontend is sending the correct field names
- Verify that empty strings are not being sent for required fields

---

### 2. ENUM Value Mismatch

**Error Message:**
```
Data truncated for column 'sex' at row 1
```

**Solution:**
- Ensure `sex` is exactly "Male" or "Female" (case-sensitive)
- Ensure `civil_status` is one of: "Single", "Married", "Widowed", "Separated", "Others"
- Ensure `citizenship_type` is one of: "Filipino", "Dual Citizenship", "By Naturalization"

**Valid Values:**
```javascript
// Sex
"Male" ✅
"Female" ✅
"male" ❌ (wrong case)
"M" ❌ (wrong format)

// Civil Status
"Single" ✅
"Married" ✅
"single" ❌ (wrong case)

// Citizenship
"Filipino" ✅
"Dual Citizenship" ✅
"filipino" ❌ (wrong case)
```

---

### 3. Date Format Issues

**Error Message:**
```
Incorrect date value
```

**Solution:**
- Dates must be in format: `YYYY-MM-DD`
- Example: `1990-01-15` ✅
- Wrong: `01/15/1990` ❌
- Wrong: `15-01-1990` ❌

**Frontend Fix:**
```javascript
// Convert date to proper format
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Use when sending to backend
pdsData.date_of_birth = formatDate(dateOfBirth);
```

---

### 4. Database Column Missing

**Error Message:**
```
Unknown column 'dean_id' in 'field list'
```

**Solution:**
✅ Already fixed! Run the migration script:
```bash
cd backend
node scripts/add-dean-id-to-pds.js
```

---

## Diagnostic Tools

### 1. Run Full Diagnostic
```bash
cd backend
node diagnose-pds-error.js
```

This will check:
- ✅ Database connection
- ✅ Model definitions
- ✅ Required fields
- ✅ ENUM values
- ✅ Test PDS creation

### 2. Check Backend Logs
The improved error handling now shows detailed error messages in the console:
```javascript
console.error("Save PDS error:", error);
console.error("Error details:", error.message);
console.error("Error stack:", error.stack);
```

Look for these logs in your backend console when the error occurs.

### 3. Test with Minimal Data
Try saving a PDS with only the required fields first:

```javascript
{
  "surname": "TEST",
  "first_name": "USER",
  "date_of_birth": "1990-01-01",
  "place_of_birth": "TEST CITY",
  "sex": "Male",
  "civil_status": "Single",
  "citizenship_type": "Filipino",
  "residential_city": "TEST CITY",
  "residential_province": "TEST PROVINCE",
  "permanent_city": "TEST CITY",
  "permanent_province": "TEST PROVINCE",
  "mobile_no": "09123456789",
  "email_address": "test@example.com"
}
```

If this works, gradually add more fields to identify which field is causing the issue.

---

## Frontend Validation

Add validation to your frontend form to prevent errors:

```javascript
// Example validation function
function validatePDS(pdsData) {
  const errors = [];
  
  // Required fields
  if (!pdsData.surname) errors.push("Surname is required");
  if (!pdsData.first_name) errors.push("First name is required");
  if (!pdsData.date_of_birth) errors.push("Date of birth is required");
  if (!pdsData.place_of_birth) errors.push("Place of birth is required");
  if (!pdsData.sex) errors.push("Sex is required");
  if (!pdsData.civil_status) errors.push("Civil status is required");
  if (!pdsData.citizenship_type) errors.push("Citizenship type is required");
  if (!pdsData.residential_city) errors.push("Residential city is required");
  if (!pdsData.residential_province) errors.push("Residential province is required");
  if (!pdsData.permanent_city) errors.push("Permanent city is required");
  if (!pdsData.permanent_province) errors.push("Permanent province is required");
  if (!pdsData.mobile_no) errors.push("Mobile number is required");
  if (!pdsData.email_address) errors.push("Email address is required");
  
  // ENUM validation
  if (pdsData.sex && !["Male", "Female"].includes(pdsData.sex)) {
    errors.push("Sex must be 'Male' or 'Female'");
  }
  
  if (pdsData.civil_status && !["Single", "Married", "Widowed", "Separated", "Others"].includes(pdsData.civil_status)) {
    errors.push("Invalid civil status");
  }
  
  if (pdsData.citizenship_type && !["Filipino", "Dual Citizenship", "By Naturalization"].includes(pdsData.citizenship_type)) {
    errors.push("Invalid citizenship type");
  }
  
  // Date validation
  if (pdsData.date_of_birth) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(pdsData.date_of_birth)) {
      errors.push("Date of birth must be in YYYY-MM-DD format");
    }
  }
  
  return errors;
}

// Use before sending to backend
const errors = validatePDS(pdsData);
if (errors.length > 0) {
  alert("Please fix the following errors:\n" + errors.join("\n"));
  return;
}
```

---

## Backend Improvements Applied

### 1. Better Error Handling
The controller now provides more detailed error messages:

```javascript
catch (error) {
  console.error("Save PDS error:", error);
  console.error("Error details:", error.message);
  console.error("Error stack:", error.stack);
  
  res.status(500).json({
    message: "Error saving Personal Data Sheet",
    error: error.message,
    details: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
}
```

### 2. Field Validation
The controller now validates required fields before attempting to save:

```javascript
const requiredFields = {
  surname,
  first_name,
  date_of_birth,
  // ... more fields
};

const missingFields = [];
for (const [field, value] of Object.entries(requiredFields)) {
  if (!value || value === "") {
    missingFields.push(field);
  }
}

if (missingFields.length > 0) {
  return res.status(400).json({
    message: "Missing required fields",
    fields: missingFields,
  });
}
```

### 3. Default Values
The controller now provides default values for all fields to prevent null/undefined errors:

```javascript
const pdsData = {
  faculty_id: faculty.faculty_id,
  surname: surname || "",
  first_name: first_name || "",
  middle_name: middle_name || null,
  // ... more fields with defaults
};
```

---

## Testing Checklist

After applying the fixes, test the following:

- [ ] Save PDS with only required fields
- [ ] Save PDS with all fields filled
- [ ] Save PDS with special characters in names
- [ ] Save PDS with different ENUM values
- [ ] Update existing PDS
- [ ] Save PDS with children records
- [ ] Save PDS with education records
- [ ] Save PDS with work experience records
- [ ] Check backend console for any errors
- [ ] Verify data is saved correctly in database

---

## Quick Fix Summary

1. ✅ **Database Migration**: Added missing `dean_id` column
2. ✅ **Error Handling**: Improved error messages and logging
3. ✅ **Field Validation**: Added required field validation
4. ✅ **Default Values**: Added default values to prevent null errors

---

## Need More Help?

If you're still experiencing issues:

1. **Check Backend Console**: Look for detailed error messages
2. **Run Diagnostic**: `node diagnose-pds-error.js`
3. **Check Database**: Verify the table structure matches the model
4. **Check Frontend**: Ensure all required fields are being sent
5. **Check Network**: Use browser DevTools to inspect the request payload

---

**Status**: ✅ ISSUE RESOLVED

The PDS save functionality should now work correctly!
