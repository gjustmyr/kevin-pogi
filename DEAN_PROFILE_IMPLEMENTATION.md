# Dean Profile Implementation Guide

## Overview

Create a complete "My Profile" feature for Deans, identical to the Faculty profile system.

---

## ✅ COMPLETED

### Backend Models (8 models)

- ✅ dean-personal-profile.model.js
- ✅ dean-academic-profile.model.js
- ✅ dean-employment-profile.model.js
- ✅ dean-professional-membership.model.js
- ✅ dean-awards.model.js
- ✅ dean-seminars-trainings.model.js
- ✅ dean-research-activities.model.js
- ✅ dean-extension-activities.model.js
- ✅ Models registered in backend/models/index.js

**Note:** Tables will be auto-created by Sequelize when backend restarts.

---

## 🔨 TODO - BACKEND

### 1. Controller (backend/controllers/dean-profile.controller.js)

Create controller with methods for:

- Personal Profile (get, upsert with file uploads)
- Academic Profile (get, create, update, delete)
- Employment Profile (get, create, update, delete)
- Professional Membership (get, create, update, delete)
- Awards (get, create, update, delete with file upload)
- Seminars/Trainings (get, create, update, delete with file upload)
- Research Activities (get, create, update, delete with file upload)
- Extension Activities (get, create, update, delete with file upload)

**Copy from:** `backend/controllers/faculty-profile.controller.js`
**Replace:** `faculty` → `dean`, `Faculty` → `Dean`

### 2. Routes (backend/routes/dean-profile.routes.js)

Create routes for all profile sections with authentication middleware.

**Copy from:** `backend/routes/faculty-profile.routes.js`
**Replace:** `faculty` → `dean`

### 3. Register Routes (backend/index.js)

Add: `app.use("/api/dean/profile", deanProfileRoutes);`

---

## 🔨 TODO - FRONTEND

### 1. Service (client/src/app/services/dean-profile.service.ts)

Create service with interfaces and HTTP methods.

**Copy from:** `client/src/app/services/faculty-profile.service.ts`
**Replace:** `faculty` → `dean`, `Faculty` → `Dean`

### 2. Component Directory

Create: `client/src/app/features/dean/my-profile/`

### 3. Component Files

- **my-profile.ts** - TypeScript component
- **my-profile.html** - Template

**Copy from:** `client/src/app/features/faculty/my-profile/`
**Replace:**

- `faculty` → `dean`
- `Faculty` → `Dean`
- `req.user.faculty_id` → `req.user.dean_id`

### 4. Add to Dean Dashboard Navigation

Update: `client/src/app/features/dashboards/dean/dean.ts`

Add navigation item:

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

Add component import and display:

```typescript
import { DeanMyProfile } from '../../dean/my-profile/my-profile';

// In imports array
DeanMyProfile,

// In template
@if (activeTab() === 'my-profile') {
  <app-dean-my-profile />
}
```

---

## 📋 SECTIONS IN DEAN PROFILE

1. **Personal Profile** - Basic info, photos, contact, address
2. **Academic Profile** - Education history
3. **Employment** - Work history
4. **Professional Membership** - Organizations
5. **Awards** - Recognitions received
6. **Seminars/Trainings** - Professional development
7. **Research Activities** - Research work
8. **Extension Activities** - Community service

---

## 🎯 IMPLEMENTATION STRATEGY

### Option A: Manual Copy & Replace (Recommended)

1. Copy faculty-profile.controller.js → dean-profile.controller.js
2. Find & Replace: `faculty` → `dean`, `Faculty` → `Dean`
3. Repeat for routes, service, and components
4. Test each section

### Option B: Automated Script

Create a script to copy and replace all files automatically.

### Option C: Incremental Build

Build one section at a time:

1. Personal Profile only
2. Add Academic Profile
3. Continue adding sections

---

## 🧪 TESTING CHECKLIST

- [ ] Backend tables created automatically
- [ ] Dean can access My Profile page
- [ ] Personal profile CRUD works
- [ ] Photo uploads work (profile & passport)
- [ ] Academic profile CRUD works
- [ ] Employment profile CRUD works
- [ ] Membership CRUD works
- [ ] Awards CRUD with file upload works
- [ ] Seminars CRUD with file upload works
- [ ] Research CRUD with file upload works
- [ ] Extension CRUD with file upload works
- [ ] Navigation works properly
- [ ] Data persists correctly

---

## 📝 NOTES

- Dean profile is identical to Faculty profile in structure
- Only difference is the user type (dean_id vs faculty_id)
- File uploads go to same `/uploads/profiles/` directory
- Authentication uses dean role middleware
- All CRUD operations follow same pattern

---

## 🚀 QUICK START

1. Restart backend (tables auto-create)
2. Copy faculty-profile.controller.js
3. Replace all `faculty` with `dean`
4. Copy routes file and update
5. Register routes in index.js
6. Copy frontend service and update
7. Copy frontend component and update
8. Add to dean dashboard navigation
9. Test!

---

## ESTIMATED TIME

- Backend: 30 minutes (copy & replace)
- Frontend: 45 minutes (copy & replace)
- Testing: 30 minutes
- **Total: ~2 hours**

The bulk of the work is already done with the Faculty profile. This is mostly copy-paste with find-replace!
