# Photo URL Display Fix

## Issue
Officer photos were not displaying correctly. The image showed broken image icon or alt text ("HAHA HA kn") instead of the actual photo.

## Root Cause
The photo URLs stored in the database are relative paths (e.g., `/uploads/member-photos/member-123.jpg`), but the frontend was trying to load them without the backend server URL. This caused the browser to look for the images on the Angular dev server (port 4200) instead of the backend server (port 3000).

## Solution

### 1. Added Helper Method
**File**: `client/src/app/features/organization/members/organization-members.ts`

Added `getPhotoUrl()` method to construct full URLs:

```typescript
getPhotoUrl(photoUrl: string | undefined): string | null {
  if (!photoUrl) return null;
  // If it's already a full URL, return as-is
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  // Otherwise, prepend the backend base URL
  return `http://localhost:3000${photoUrl}`;
}
```

### 2. Updated HTML Template
**File**: `client/src/app/features/organization/members/organization-members.html`

**President Card**:
```html
@if (getPhotoUrl(president.photo_url); as photoUrl) {
  <img
    [src]="photoUrl"
    [alt]="getMemberFullName(president)"
    class="w-48 h-48 rounded-lg object-cover"
    (error)="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='flex'"
  />
  <div class="..." style="display: none;">
    {{ getInitials(president) }}
  </div>
} @else {
  <div class="...">
    {{ getInitials(president) }}
  </div>
}
```

**Officer Cards**:
```html
@if (getPhotoUrl(officer.photo_url); as photoUrl) {
  <img
    [src]="photoUrl"
    [alt]="getMemberFullName(officer)"
    class="w-32 h-32 rounded-full object-cover mb-4"
    (error)="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='flex'"
  />
  <div class="..." style="display: none;">
    {{ getInitials(officer) }}
  </div>
} @else {
  <div class="...">
    {{ getInitials(officer) }}
  </div>
}
```

## Key Features

### 1. Full URL Construction
- Converts relative paths to full URLs
- Example: `/uploads/member-photos/member-123.jpg` → `http://localhost:3000/uploads/member-photos/member-123.jpg`
- Handles already-full URLs gracefully

### 2. Error Handling
- Added `(error)` event handler on `<img>` tags
- If image fails to load, automatically hides the image and shows initials fallback
- Provides seamless user experience even if photo is missing or corrupted

### 3. Fallback Display
- If no photo URL exists, shows colored initials badge
- If photo URL exists but image fails to load, shows colored initials badge
- Consistent fallback behavior across all scenarios

## How It Works

1. **Photo URL Check**: `getPhotoUrl()` is called with the member's photo_url
2. **URL Construction**: If photo_url exists, prepends backend server URL
3. **Image Display**: Angular template uses the full URL to load the image
4. **Error Handling**: If image fails to load, `(error)` event triggers
5. **Fallback Display**: Hidden initials div becomes visible on error

## Testing

### Test Cases
1. ✅ Member with valid photo → Shows photo
2. ✅ Member without photo → Shows initials
3. ✅ Member with invalid photo URL → Shows initials (fallback)
4. ✅ Member with deleted photo file → Shows initials (fallback)
5. ✅ Backend server down → Shows initials (fallback)

### Manual Testing Steps
1. Refresh the Angular application
2. Navigate to Organization Members → Officers Profile
3. Verify photos display correctly for officers with uploaded photos
4. Verify initials display for officers without photos
5. Check browser console for any 404 errors on image requests

## Production Considerations

### Environment-Based URL
For production, the hardcoded `http://localhost:3000` should be replaced with an environment variable:

```typescript
import { environment } from '../environments/environment';

getPhotoUrl(photoUrl: string | undefined): string | null {
  if (!photoUrl) return null;
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  // Use environment-based backend URL
  const backendUrl = environment.apiUrl.replace('/api', '');
  return `${backendUrl}${photoUrl}`;
}
```

### CORS Configuration
Ensure backend CORS is configured to allow image requests from the frontend domain.

### CDN Integration
For better performance in production:
1. Upload photos to CDN (e.g., AWS S3, Cloudinary)
2. Store full CDN URLs in database
3. `getPhotoUrl()` will return them as-is (already full URLs)

## Files Modified
- `client/src/app/features/organization/members/organization-members.ts`
- `client/src/app/features/organization/members/organization-members.html`

## Related Issues
- Photo upload functionality (already implemented)
- Photo deletion on member update (already implemented)
- Static file serving in backend (already configured)
