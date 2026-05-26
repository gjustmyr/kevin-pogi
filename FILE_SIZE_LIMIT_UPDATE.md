# File Size Limit Update: 10MB → 200MB

## Summary
Updated file upload size limits for faculty requirements and organization documents from 10MB to 200MB per file.

## Files Modified

### Frontend (Client-side Validation)

#### 1. Faculty Requirements
**File:** `client/src/app/features/faculty/requirements/requirements.ts`
- Updated `onFileSelected()` method: 10MB → 200MB
- Updated `onAddFilesSelected()` method: 10MB → 200MB
- Updated error messages to reflect 200MB limit

**File:** `client/src/app/features/faculty/requirements/requirements.html`
- Updated file selection help text (2 occurrences): "max 10 files, 10MB each" → "max 10 files, 200MB each"

#### 2. Organization Documents
**File:** `client/src/app/features/organization/documents/organization-documents.ts`
- Updated `onFileSelected()` method: 10MB → 200MB
- Updated error message to reflect 200MB limit

**File:** `client/src/app/features/organization/documents/organization-documents.html`
- Updated file input help text: "Max 10MB" → "Max 200MB"

### Backend (Server-side Validation)

#### 3. Faculty Requirements Controller
**File:** `backend/controllers/faculty-requirement.controller.js`
- Updated file size check: 10MB → 200MB
- Updated error messages to reflect 200MB limit (2 occurrences)

#### 4. Faculty Credentials Routes
**File:** `backend/routes/faculty-credentials.routes.js`
- Updated multer file size limit: 10MB → 200MB

#### 5. Organization Routes
**File:** `backend/routes/organization.routes.js`
- Updated multer file size limit: 10MB → 200MB

#### 6. Upload Utility
**File:** `backend/utils/upload.js`
- Updated default multer file size limit: 10MB → 200MB

## Technical Details

### Changes Applied
- **Frontend validation**: `10 * 1024 * 1024` → `200 * 1024 * 1024` (bytes)
- **Backend multer limits**: `fileSize: 10 * 1024 * 1024` → `fileSize: 200 * 1024 * 1024`
- **Error messages**: Updated to display "200MB" instead of "10MB"
- **Help text**: Updated to inform users of the new 200MB limit

### Affected Features
✅ Faculty portfolio/requirements submissions
✅ Faculty credentials uploads
✅ Organization document submissions
✅ Organization report uploads

### Not Changed
❌ Organization member photos (still 5MB - appropriate for images)
❌ Organization event documents (still 10MB - can be updated separately if needed)
❌ Other file uploads not related to faculty/organization submissions

## Server Configuration Note
⚠️ **Important**: Ensure your web server (nginx/Apache) and Node.js are configured to handle 200MB uploads:

### Nginx Configuration
```nginx
client_max_body_size 200M;
```

### Node.js/Express
The application already uses body-parser with appropriate limits, but verify:
```javascript
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
```

## Testing Checklist
- ✅ Faculty can upload files up to 200MB in requirements submission
- ✅ Faculty can upload files up to 200MB when adding files to existing submissions
- ✅ Organization can upload documents up to 200MB
- ✅ Files larger than 200MB are rejected with appropriate error message
- ✅ Error messages display "200MB" instead of "10MB"
- ✅ Help text shows correct file size limits
- ✅ Backend properly validates and rejects oversized files
