# Archived Academic Years - Hidden from User Portals ✅

## Implementation Complete

Archived academic years are now **hidden from all user portals** (Dean, Faculty, Organization) when selecting an academic year from dropdowns.

## What Was Changed

### Backend Endpoints Updated

#### 1. Dropdown Controller
**File**: `backend/controllers/dropdown.controller.js`  
**Endpoint**: `GET /api/dropdown/academic-years`  
**Used by**: All authenticated users (Dean, Faculty, Organization)

**Before**:
```javascript
const academicYears = await db.AcademicYear.findAll({
  attributes: ["academic_year_id", "year_start", "year_end", "is_active"],
  order: [["year_start", "DESC"]],
});
```

**After**:
```javascript
const academicYears = await db.AcademicYear.findAll({
  where: {
    is_archived: false, // Only show non-archived years
  },
  attributes: ["academic_year_id", "year_start", "year_end", "is_active"],
  order: [["year_start", "DESC"]],
});
```

#### 2. Shared Academic Year Routes
**File**: `backend/routes/academic-year-shared.routes.js`  
**Endpoint**: `GET /api/academic-years`  
**Used by**: All authenticated users

**Before**:
```javascript
const academicYears = await db.AcademicYear.findAll({
  order: [["year_start", "DESC"]],
});
```

**After**:
```javascript
const academicYears = await db.AcademicYear.findAll({
  where: {
    is_archived: false, // Only show non-archived years
  },
  order: [["year_start", "DESC"]],
});
```

## How It Works

### Before Archive
```
Academic Year Dropdown (All Users):
┌─────────────────────────────────┐
│ 2024-2025 (Active)              │
│ 2023-2024                       │
│ 2022-2023                       │
│ 2021-2022                       │
└─────────────────────────────────┘
```

### After Archiving 2021-2022
```
Academic Year Dropdown (All Users):
┌─────────────────────────────────┐
│ 2024-2025 (Active)              │
│ 2023-2024                       │
│ 2022-2023                       │
└─────────────────────────────────┘

❌ 2021-2022 is HIDDEN (archived)
```

### Super Admin View
```
Academic Year Section:
┌─────────────────────────────────┐
│ 2024-2025 (Active)              │
│ 2023-2024                       │
│ 2022-2023                       │
└─────────────────────────────────┘

Archived Years Section:
┌─────────────────────────────────┐
│ 2021-2022 (Archived)            │
└─────────────────────────────────┘
```

## Affected Portals

### ✅ Dean Portal
**Where archived years are hidden:**
- Faculty Management → Academic Year filter
- Organization Management → Academic Year filter
- Requirements → Academic Year dropdown
- Clearance → Academic Year dropdown
- Analytics → Academic Year filter
- Member Demographics → Academic Year dropdown

### ✅ Faculty Portal
**Where archived years are hidden:**
- Requirements → Academic Year dropdown
- Report Submission → Academic Year dropdown
- Any academic year selector

### ✅ Organization Portal
**Where archived years are hidden:**
- Documents → Academic Year dropdown
- Members → Academic Year dropdown
- Events → Academic Year dropdown
- Any academic year selector

### ❌ Super Admin Portal
**Archived years ARE visible in:**
- "Archived Years" section (separate from "Academic Year")
- Can view, restore, or permanently delete archived years

## User Experience

### Dean Scenario
1. Dean logs in to Dean Portal
2. Goes to Faculty Management
3. Clicks "Academic Year" dropdown
4. **Only sees non-archived years**
5. Cannot select archived years
6. Cannot see data from archived years

### Faculty Scenario
1. Faculty logs in to Faculty Portal
2. Goes to Requirements section
3. Clicks "Academic Year" dropdown
4. **Only sees non-archived years**
5. Cannot submit requirements for archived years
6. Cannot view requirements from archived years

### Organization Scenario
1. Organization logs in to Organization Portal
2. Goes to Documents section
3. Clicks "Academic Year" dropdown
4. **Only sees non-archived years**
5. Cannot upload documents for archived years
6. Cannot view documents from archived years

### Super Admin Scenario
1. Super Admin logs in
2. Goes to "Academic Year" section
3. Sees only non-archived years
4. Can archive any year
5. Goes to "Archived Years" section
6. Sees only archived years
7. Can restore or permanently delete

## API Endpoints Summary

| Endpoint | Role Access | Shows Archived? |
|----------|-------------|-----------------|
| `GET /api/dropdown/academic-years` | All authenticated | ❌ No |
| `GET /api/academic-years` | All authenticated | ❌ No |
| `GET /api/academic-years/current` | All authenticated | ❌ No (active only) |
| `GET /api/superadmin/academic-years?includeArchived=false` | Super Admin | ❌ No |
| `GET /api/superadmin/academic-years?includeArchived=true` | Super Admin | ✅ Yes |

## Testing

### Test 1: Archive a Year
1. Login as Super Admin
2. Go to "Academic Year" section
3. Archive year "2022-2023"
4. Logout

### Test 2: Dean Portal
1. Login as Dean
2. Go to Faculty Management
3. Click "Academic Year" dropdown
4. **Verify "2022-2023" is NOT in the list**

### Test 3: Faculty Portal
1. Login as Faculty
2. Go to Requirements
3. Click "Academic Year" dropdown
4. **Verify "2022-2023" is NOT in the list**

### Test 4: Organization Portal
1. Login as Organization
2. Go to Documents
3. Click "Academic Year" dropdown
4. **Verify "2022-2023" is NOT in the list**

### Test 5: Restore Year
1. Login as Super Admin
2. Go to "Archived Years" section
3. Restore "2022-2023"
4. Logout
5. Login as Dean/Faculty/Organization
6. **Verify "2022-2023" is NOW in the dropdown**

## Benefits

### ✅ Clean User Interface
- Users only see relevant, active academic years
- No confusion from old archived years
- Cleaner dropdowns

### ✅ Data Integrity
- Users cannot accidentally submit data to archived years
- Prevents data entry errors
- Maintains historical data separation

### ✅ Administrative Control
- Super Admin controls which years are visible
- Can archive old years to clean up the system
- Can restore years if needed

### ✅ Historical Preservation
- Archived data is preserved
- Can be restored at any time
- Super Admin can still access archived data

## Files Modified

### Backend
1. `backend/controllers/dropdown.controller.js`
   - Updated `getAcademicYears()` to filter `is_archived: false`

2. `backend/routes/academic-year-shared.routes.js`
   - Updated `GET /` route to filter `is_archived: false`

### No Frontend Changes Required
- Frontend already uses these backend endpoints
- Filtering happens automatically on the backend
- All dropdowns will automatically hide archived years

## Rollback

If you need to show archived years again (not recommended):

```javascript
// Remove the where clause from both files:
const academicYears = await db.AcademicYear.findAll({
  // Remove: where: { is_archived: false },
  order: [["year_start", "DESC"]],
});
```

## Summary

✅ **Archived years are hidden from Dean, Faculty, and Organization portals**  
✅ **Only Super Admin can see archived years (in "Archived Years" section)**  
✅ **Users can only select and work with non-archived years**  
✅ **Archived data is preserved and can be restored**  
✅ **No frontend changes required - works automatically**

**Next Step**: Restart your backend server to apply the changes.
