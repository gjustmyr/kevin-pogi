# Quick Guide: Create Dean Profile from Faculty Profile

## Step 1: Backend Controller

**Copy:** `backend/controllers/faculty-profile.controller.js`  
**To:** `backend/controllers/dean-profile.controller.js`

**Find & Replace:**

- `faculty_id` → `dean_id`
- `Faculty` → `Dean`
- `faculty` → `dean`
- `req.user.faculty_id` → `req.user.dean_id`

## Step 2: Backend Routes

**Copy:** `backend/routes/faculty-profile.routes.js`  
**To:** `backend/routes/dean-profile.routes.js`

**Find & Replace:**

- `faculty-profile` → `dean-profile`
- `facultyProfileController` → `deanProfileController`

## Step 3: Register Routes

**File:** `backend/index.js`

Add after faculty profile routes:

```javascript
const deanProfileRoutes = require("./routes/dean-profile.routes");
app.use("/api/dean/profile", deanProfileRoutes);
```

## Step 4: Frontend Service

**Copy:** `client/src/app/services/faculty-profile.service.ts`  
**To:** `client/src/app/services/dean-profile.service.ts`

**Find & Replace:**

- `Faculty` → `Dean`
- `faculty` → `dean`
- `/api/faculty/profile` → `/api/dean/profile`
- `FacultyProfileService` → `DeanProfileService`

## Step 5: Frontend Component (TypeScript)

**Copy:** `client/src/app/features/faculty/my-profile/my-profile.ts`  
**To:** `client/src/app/features/dean/my-profile/my-profile.ts`

**Find & Replace:**

- `Faculty` → `Dean`
- `faculty` → `dean`
- `FacultyProfileService` → `DeanProfileService`
- `FacultyMyProfile` → `DeanMyProfile`
- `app-faculty-my-profile` → `app-dean-my-profile`

## Step 6: Frontend Component (HTML)

**Copy:** `client/src/app/features/faculty/my-profile/my-profile.html`  
**To:** `client/src/app/features/dean/my-profile/my-profile.html`

No changes needed (uses component properties).

## Step 7: Add to Dean Dashboard

**File:** `client/src/app/features/dashboards/dean/dean.ts`

1. Import component:

```typescript
import { DeanMyProfile } from "../../dean/my-profile/my-profile";
```

2. Add to imports array:

```typescript
imports: [
  // ... existing imports
  DeanMyProfile,
],
```

3. Add navigation button (in sidebar):

```typescript
<li>
  <button
    (click)="selectTab('my-profile')"
    [class.bg-green-50]="activeTab() === 'my-profile'"
    [class.text-green-600]="activeTab() === 'my-profile'"
    class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
  >
    <svg class="shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
    <span class="flex-1 ms-3 whitespace-nowrap text-left">My Profile</span>
  </button>
</li>
```

4. Add content display (in main content area):

```typescript
@if (activeTab() === 'my-profile') {
  <app-dean-my-profile />
}
```

## Testing

1. Restart backend server (tables auto-create)
2. Login as Dean
3. Click "My Profile" in sidebar
4. Test all CRUD operations

## Estimated Time: 30 minutes

Most of the work is copy-paste with find-replace!
