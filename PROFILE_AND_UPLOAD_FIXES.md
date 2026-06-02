# Profile & Upload Fixes

## Issues Fixed

### 1. ✅ **File Upload Error - Better Error Messages**

**Problem:** When uploading files larger than 10MB, the error message was generic "Failed to submit requirement" instead of showing file size error.

**Solution:** Added file size validation in both frontend and backend.

#### Frontend Changes (`requirements.ts`):
- Added file size check before upload (10MB limit)
- Shows specific error message with filename
- Prevents upload attempt if file is too large

```typescript
const maxSize = 10 * 1024 * 1024; // 10MB
const oversizedFiles = files.filter(f => f.size > maxSize);

if (oversizedFiles.length > 0) {
  Swal.fire({
    icon: 'error',
    title: 'File Too Large',
    text: `Some files exceed the 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`,
  });
}
```

#### Backend Changes (`faculty-requirement.controller.js`):
- Added file size validation
- Better error handling for multer LIMIT_FILE_SIZE error
- Returns specific error message

```javascript
// Check file sizes
const maxSize = 10 * 1024 * 1024; // 10MB
const oversizedFiles = req.files.filter(f => f.size > maxSize);
if (oversizedFiles.length > 0) {
  return res.status(400).json({ 
    message: `File size exceeds 10MB limit: ${oversizedFiles.map(f => f.originalname).join(', ')}` 
  });
}

// Handle multer error
if (error.code === 'LIMIT_FILE_SIZE') {
  return res.status(400).json({ 
    message: "File size exceeds the 10MB limit. Please upload smaller files." 
  });
}
```

---

### 2. ✅ **Home Address Not Saving - FIXED**

**Problem:** Home address fields (Country, Region, Province, Barangay, Street/Subdivision, Zip Code) showed "N/A" and didn't save when updating Personal Profile.

**Root Cause:** Field name mismatch between frontend and backend.
- **Frontend** was using: `country`, `region`, `province`, `barangay`, `street_subdivision`, `zip_code`
- **Backend** expects: `home_country`, `home_region`, `home_province`, `home_barangay`, `home_street_subdivision`, `home_zip_code`

**Solution:** Added `home_` prefix to all address fields in:

#### Files Fixed:
1. **Interface** (`faculty-profile.service.ts`):
```typescript
export interface PersonalProfile {
  // ... other fields
  home_country?: string;
  home_region?: string;
  home_province?: string;
  home_barangay?: string;
  home_street_subdivision?: string;
  home_zip_code?: string;
}
```

2. **HTML Template - View Mode** (`my-profile.html`):
```html
<p class="mt-1 text-gray-900">{{ personalProfile().home_country || 'N/A' }}</p>
<p class="mt-1 text-gray-900">{{ personalProfile().home_region || 'N/A' }}</p>
<!-- etc. -->
```

3. **HTML Template - Edit Mode** (`my-profile.html`):
```html
<input type="text" [(ngModel)]="personalForm().home_country" name="home_country" />
<input type="text" [(ngModel)]="personalForm().home_region" name="home_region" />
<!-- etc. -->
```

**Result:** Home address fields now properly save and display values.

---

## Testing

### Test File Upload Error:
1. Go to Faculty → Accomplishments
2. Click "Submit Requirement"
3. Try to upload a file larger than 10MB
4. Should see error: "File Too Large - Some files exceed the 10MB limit: [filename]"

### Test Home Address:
1. Go to Faculty → My Profile → Personal Profile
2. Click "Edit Profile"
3. Fill in home address fields:
   - Country
   - Region
   - Province
   - Barangay
   - Street/Subdivision
   - Zip Code
4. Click "Save Profile"
5. Refresh page or navigate away and back
6. ✅ Values should now be saved and displayed correctly

---

## File Size Limits Summary

| Upload Type | Max Size | Location |
|------------|----------|----------|
| Requirements | 10MB | `utils/upload.js` |
| Credentials | 10MB | `routes/faculty-credentials.routes.js` |
| Profile Pictures | 5MB | `routes/faculty-profile.routes.js` |
| Organization Docs | 10MB | `routes/organization.routes.js` |
| CSV Uploads | 5MB | `routes/organization.routes.js` |

---

## Next Steps for Home Address Issue

If the issue persists:

1. **Share the personal profile component code:**
   - `client/src/app/features/faculty/personal-profile/*.ts`
   - Or wherever the personal profile form is located

2. **Check browser console:**
   - Any JavaScript errors?
   - Network request payload?

3. **Check backend logs:**
   - Is the request reaching the backend?
   - What data is being received?

4. **Test with Postman/curl:**
```bash
curl -X POST http://localhost:3000/api/faculty/profile/personal \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "home_country": "Philippines",
    "home_region": "Region IV-A",
    "home_province": "Batangas",
    "home_barangay": "Alangilan",
    "home_street_subdivision": "Main Street",
    "home_zip_code": "4200"
  }'
```

---

## Summary

✅ **Fixed:** File upload error messages now show specific file size errors
✅ **Fixed:** Home address not saving - field name mismatch resolved

**Files Modified:**
1. ✅ `client/src/app/features/faculty/requirements/requirements.ts` (file upload validation)
2. ✅ `backend/controllers/faculty-requirement.controller.js` (file upload error handling)
3. ✅ `client/src/app/services/faculty-profile.service.ts` (PersonalProfile interface - added `home_` prefix)
4. ✅ `client/src/app/features/faculty/my-profile/my-profile.html` (form fields - added `home_` prefix)

**Root Cause - Home Address Issue:**
The frontend was using field names without the `home_` prefix (`country`, `region`, etc.) while the backend expected fields with the prefix (`home_country`, `home_region`, etc.). This caused the data to be ignored during save operations.

