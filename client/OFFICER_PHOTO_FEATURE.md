# Officer Photo Upload and Display Feature

## Overview
Implemented full photo upload and display functionality for organization members (officers and regular members). Photos are now properly displayed in the Officers Profile view, and the "Photo placeholder" text has been removed.

## Changes Made

### 1. Database Changes
**File**: `backend/models/organization-member.model.js`
- Added `photo_url` field (VARCHAR 500) to store the path to member photos
- Migration script created: `backend/scripts/add-member-photo-column.js`

### 2. Backend Changes

#### Routes (`backend/routes/organization.routes.js`)
- Added `photoUpload` multer configuration for image uploads
- Configured to accept JPEG, JPG, and PNG files (max 5MB)
- Photos stored in `uploads/member-photos/` directory
- Updated POST `/members` route to use `photoUpload.single('photo')`
- Updated PUT `/members/:id` route to use `photoUpload.single('photo')`

#### Controller (`backend/controllers/organization-member.controller.js`)
- **createMember**: Now handles photo upload via `req.file`
  - Saves photo path as `/uploads/member-photos/filename.jpg`
  - Stores path in `photo_url` field
- **updateMember**: Now handles photo replacement
  - Uploads new photo if provided
  - Deletes old photo file when replacing
  - Keeps existing photo if no new photo uploaded

### 3. Frontend Changes

#### Service (`client/src/app/services/organization.service.ts`)
- Added `photo_url?: string` to `OrganizationMember` interface
- Added `createMemberWithPhoto(formData: FormData)` method
- Added `updateMemberWithPhoto(memberId, formData: FormData)` method
- Original methods kept for backward compatibility

#### Component (`client/src/app/features/organization/members/organization-members.ts`)
- **saveMember()**: Now creates FormData and appends photo file
- **updateMember()**: Now creates FormData and appends photo file
- Photo upload UI already existed, now fully functional

#### Template (`client/src/app/features/organization/members/organization-members.html`)

**President Card**:
```html
@if (president.photo_url) {
  <img [src]="president.photo_url" [alt]="getMemberFullName(president)" 
       class="w-48 h-48 rounded-lg object-cover" />
} @else {
  <div class="w-48 h-48 rounded-lg flex items-center justify-center text-white text-6xl font-bold ...">
    {{ getInitials(president) }}
  </div>
}
```

**Other Officers Cards**:
```html
@if (officer.photo_url) {
  <img [src]="officer.photo_url" [alt]="getMemberFullName(officer)" 
       class="w-32 h-32 rounded-full object-cover mb-4" />
} @else {
  <div class="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 ...">
    {{ getInitials(officer) }}
  </div>
}
```

**Removed**:
- All `<p class="text-xs text-gray-500 mt-2 text-center">Photo placeholder</p>` elements

## User Flow

### Uploading a Photo
1. Navigate to Organization Members
2. Click "Add Officer" or "Add Member"
3. Fill in member details
4. Click the photo upload area (dashed border box)
5. Select an image file (JPEG, JPG, or PNG, max 5MB)
6. Preview appears in the upload area
7. Click "Add Officer" to save
8. Photo is uploaded and displayed

### Updating a Photo
1. Navigate to Officers Profile
2. Click "Edit" on an officer card
3. Click the photo upload area
4. Select a new image file
5. Preview appears
6. Click "Update Officer"
7. Old photo is deleted, new photo is saved and displayed

### Display Behavior
- **If photo exists**: Real photo is displayed
  - President: 48x48 rounded square
  - Officers: 32x32 rounded circle
- **If no photo**: Colored initials badge is displayed (fallback)
- **Photo placeholder text**: Removed entirely

## Technical Details

### File Storage
- **Location**: `backend/uploads/member-photos/`
- **Naming**: `member-{timestamp}-{random}.{ext}`
- **URL Format**: `/uploads/member-photos/member-1234567890-123456789.jpg`
- **Access**: Served statically by Express

### Photo Specifications
- **Formats**: JPEG, JPG, PNG
- **Max Size**: 5MB
- **Validation**: Server-side via multer fileFilter
- **Storage**: Disk storage (not memory)

### Database Schema
```sql
ALTER TABLE organization_members 
ADD COLUMN photo_url VARCHAR(500) NULL 
COMMENT 'Path to member photo';
```

### API Endpoints

**Create Member with Photo**
```
POST /api/organization/dashboard/members
Content-Type: multipart/form-data

FormData:
- sr_code: string
- first_name: string
- last_name: string
- ... (other fields)
- photo: File (optional)
```

**Update Member with Photo**
```
PUT /api/organization/dashboard/members/:id
Content-Type: multipart/form-data

FormData:
- first_name: string
- last_name: string
- ... (other fields)
- photo: File (optional)
```

## Migration

To add the photo_url column to an existing database:
```bash
cd backend
node scripts/add-member-photo-column.js
```

## Testing Checklist

- [x] Database column added successfully
- [x] Backend server starts without errors
- [x] Photo upload in Add Officer modal works
- [x] Photo upload in Edit Officer modal works
- [x] Photo displays in President card
- [x] Photo displays in Other Officers cards
- [x] Initials fallback displays when no photo
- [x] Photo placeholder text removed
- [x] Old photo deleted when uploading new one
- [x] File size validation works (5MB limit)
- [x] File type validation works (JPEG, JPG, PNG only)
- [ ] Photos display correctly after page refresh
- [ ] Photos display in list view (if applicable)
- [ ] Photo URLs are correct and accessible

## Known Limitations

1. **No Image Cropping**: Photos are displayed as-is with `object-cover`
2. **No Compression**: Large images are stored at full size
3. **No CDN**: Photos served directly from backend
4. **No Lazy Loading**: All photos load immediately
5. **No Thumbnail Generation**: Same image used for all sizes

## Future Enhancements

1. **Image Cropping**: Allow users to crop photos before upload
2. **Image Compression**: Automatically compress large images
3. **Thumbnail Generation**: Create multiple sizes for performance
4. **CDN Integration**: Serve photos from CDN for better performance
5. **Lazy Loading**: Load photos as they come into view
6. **Drag & Drop**: Allow dragging photos directly onto upload area
7. **Webcam Capture**: Allow taking photos with webcam
8. **Photo Gallery**: View all member photos in a gallery view
9. **Bulk Photo Upload**: Upload multiple photos at once
10. **Photo Validation**: Check for appropriate content (faces, etc.)
