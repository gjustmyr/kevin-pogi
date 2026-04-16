# Organization Profile Implementation Plan

## Overview

Create simplified "My Profile" for:

1. **Organization President** (student organization leader)
2. **Organization Adviser** (faculty assigned as adviser)

## Profile Sections (Simplified)

### Personal Profile Only

- Profile Picture
- Passport Photo
- Title (Mr., Ms., Mrs., etc.)
- Full Name (First, Middle, Last, Extension)
- Date of Birth
- Contact Information (Mobile, Email)
- Address (Basic)

**Note:** No academic, employment, awards, seminars, research, or extension sections needed.

---

## Database Tables Needed

### 1. Organization Personal Profile

```sql
CREATE TABLE organization_personal_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT NOT NULL UNIQUE,
  profile_picture VARCHAR(500),
  passport_photo VARCHAR(500),
  title VARCHAR(50),
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  extension_name VARCHAR(20),
  date_of_birth DATE,
  mobile_primary VARCHAR(20) NOT NULL,
  mobile_secondary VARCHAR(20),
  email_primary VARCHAR(100) NOT NULL,
  email_secondary VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE
);
```

### 2. Adviser Personal Profile

**Note:** Advisers are Faculty members, so they already have full profiles via `faculty_personal_profiles` table.
**No new table needed** - just link to existing faculty profile.

---

## Implementation Tasks

### Backend

#### Organization Profile

- [ ] Create model: `backend/models/organization-personal-profile.model.js`
- [ ] Register in `backend/models/index.js`
- [ ] Create controller: `backend/controllers/organization-profile.controller.js`
  - getPersonalProfile()
  - upsertPersonalProfile() (with photo uploads)
- [ ] Create routes: `backend/routes/organization-profile.routes.js`
- [ ] Register routes in `backend/index.js`

#### Adviser Profile

- [ ] Create controller: `backend/controllers/adviser-profile.controller.js`
  - getPersonalProfile() - reads from faculty_personal_profiles
  - upsertPersonalProfile() - updates faculty_personal_profiles
- [ ] Create routes: `backend/routes/adviser-profile.routes.js`
- [ ] Register routes in `backend/index.js`

### Frontend

#### Organization Profile

- [ ] Create service: `client/src/app/services/organization-profile.service.ts`
- [ ] Create component: `client/src/app/features/organization/my-profile/`
  - my-profile.ts
  - my-profile.html (simplified - personal info only)
- [ ] Add to Organization dashboard navigation

#### Adviser Profile

- [ ] Advisers use existing Faculty profile (already implemented)
- [ ] Just add navigation link in Adviser dashboard (if exists)

---

## Key Differences from Faculty/Dean Profile

| Feature          | Faculty/Dean | Organization | Adviser           |
| ---------------- | ------------ | ------------ | ----------------- |
| Personal Profile | ✅           | ✅           | ✅ (uses Faculty) |
| Academic Profile | ✅           | ❌           | ✅ (uses Faculty) |
| Employment       | ✅           | ❌           | ✅ (uses Faculty) |
| Memberships      | ✅           | ❌           | ✅ (uses Faculty) |
| Awards           | ✅           | ❌           | ✅ (uses Faculty) |
| Seminars         | ✅           | ❌           | ✅ (uses Faculty) |
| Research         | ✅           | ❌           | ✅ (uses Faculty) |
| Extension        | ✅           | ❌           | ✅ (uses Faculty) |

---

## Simplified UI for Organization

### Personal Profile Form Fields

1. **Photos**
   - Profile Picture (2x2)
   - Passport Photo (2x2)

2. **Basic Info**
   - Title (dropdown: Mr., Ms., Mrs., etc.)
   - First Name
   - Middle Name
   - Last Name
   - Extension (Jr., Sr., III, etc.)
   - Date of Birth

3. **Contact**
   - Primary Mobile (required)
   - Secondary Mobile (optional)
   - Primary Email (required)
   - Secondary Email (optional)

4. **Address**
   - Complete Address (single text area)

**Total: ~15 fields** (vs 50+ fields in Faculty/Dean profile)

---

## Implementation Strategy

### Option A: Quick Implementation (Recommended)

1. Create Organization profile (1 hour)
2. Adviser reuses Faculty profile (5 minutes - just add navigation)

### Option B: Full Custom

1. Create Organization profile (1 hour)
2. Create separate Adviser profile (1 hour)

**Recommendation:** Option A - Advisers are Faculty, so they should use Faculty profile.

---

## Next Steps

1. Confirm requirements:
   - Is simplified profile for Organization correct?
   - Should Advisers use Faculty profile or have separate profile?
2. Create Organization profile:
   - Backend model, controller, routes
   - Frontend service, component
   - Add to Organization dashboard

3. Handle Adviser profile:
   - If using Faculty profile: just add navigation
   - If separate: create new simplified profile

---

## Estimated Time

- Organization Profile: **1-2 hours**
- Adviser Profile (reuse Faculty): **5 minutes**
- Adviser Profile (new): **1 hour**

**Total: 1-3 hours** depending on approach
