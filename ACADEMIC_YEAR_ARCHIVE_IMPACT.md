# Academic Year Archive - Impact on Deans and Faculty

## Quick Answer

**YES, you will still be able to see all deans and faculty you created!** ✅

Archiving an academic year **DOES NOT** affect deans and faculty visibility or access.

## Why?

### Deans and Faculty are NOT Tied to Academic Years

Looking at the database structure:

**Dean Table (`deans`)**
- ❌ No `academic_year_id` column
- ✅ Independent of academic years
- ✅ Always visible regardless of academic year status

**Faculty Table (`faculties`)**
- ❌ No `academic_year_id` column
- ✅ Independent of academic years
- ✅ Always visible regardless of academic year status

### What IS Tied to Academic Years?

These items ARE linked to academic years and will be affected:

1. **Faculty Requirements/Documents** (`requirement_submissions`)
   - Has `academic_year_id` foreign key
   - Filtered by academic year

2. **Faculty Clearance Records** (`faculty_clearances`)
   - Has `academic_year_id` foreign key
   - Tracks clearance per academic year

3. **Organization Documents** (`organization_documents`)
   - Has `academic_year_id` foreign key
   - Documents are per academic year

4. **Organization Members** (`organization_members`)
   - Has `academic_year_id` foreign key
   - Membership is per academic year

5. **Organization Bulk Uploads** (`organization_bulk_uploads`)
   - Has `academic_year_id` foreign key
   - Upload records per academic year

## What Happens When You Archive?

### ✅ Still Visible (NOT Affected)
- **Deans** - All deans remain visible
- **Faculty** - All faculty remain visible
- **Organizations** - All organizations remain visible
- **User Accounts** - All accounts remain active
- **Personal Profiles** - All profile data remains accessible
- **PDS (Personal Data Sheet)** - All PDS data remains accessible

### 📦 Archived (Affected)
- **Faculty Requirements** for that academic year
- **Faculty Clearance Records** for that academic year
- **Organization Documents** for that academic year
- **Organization Members** for that academic year

## Example Scenario

### Before Archive
```
Academic Year: 2023-2024 (Active)
├── Dean: John Doe (College of Engineering)
├── Faculty: Jane Smith (Engineering Department)
│   ├── Requirement: Syllabus (2023-2024)
│   ├── Requirement: Grades (2023-2024)
│   └── Clearance: Cleared (2023-2024)
└── Organization: Engineering Society
    ├── Members: 50 students (2023-2024)
    └── Documents: 10 files (2023-2024)
```

### After Archiving 2023-2024
```
✅ STILL VISIBLE:
- Dean: John Doe (College of Engineering)
- Faculty: Jane Smith (Engineering Department)
- Organization: Engineering Society

📦 ARCHIVED (Hidden unless viewing archived year):
- Faculty Requirements for 2023-2024
- Faculty Clearance for 2023-2024
- Organization Members for 2023-2024
- Organization Documents for 2023-2024
```

## Practical Impact

### Super Admin Portal
**Dean Management**
- ✅ All deans visible
- ✅ Can create new deans
- ✅ Can edit existing deans
- ✅ Can delete deans
- ❌ NOT affected by academic year archive

**Faculty View**
- ✅ All faculty visible
- ✅ Can view faculty profiles
- ✅ Can view faculty PDS
- ❌ NOT affected by academic year archive

**Organization View**
- ✅ All organizations visible
- ✅ Can view organization details
- ❌ NOT affected by academic year archive

### Dean Portal
**Faculty Management**
- ✅ All faculty in their department visible
- ✅ Can view faculty profiles
- ✅ Can download faculty PDFs
- ⚠️ Faculty requirements filtered by selected academic year
- ⚠️ Faculty clearance filtered by selected academic year

**Organization Management**
- ✅ All organizations in their department visible
- ⚠️ Organization documents filtered by selected academic year
- ⚠️ Organization members filtered by selected academic year

### Faculty Portal
**My Profile**
- ✅ Always visible
- ✅ Can edit profile
- ✅ Can update PDS
- ❌ NOT affected by academic year archive

**Requirements**
- ⚠️ Filtered by selected academic year
- ⚠️ Archived year requirements not shown in active view

### Organization Portal
**Members**
- ⚠️ Filtered by selected academic year
- ⚠️ Archived year members not shown in active view

**Documents**
- ⚠️ Filtered by selected academic year
- ⚠️ Archived year documents not shown in active view

## Database Relationships

### Independent (No academic_year_id)
```
users (user accounts)
├── deans
├── faculties
└── organizations

faculty_personal_profiles
faculty_educational_backgrounds
faculty_eligibilities
personal_data_sheets
pds_* (all PDS tables)
```

### Dependent (Has academic_year_id)
```
academic_years
├── requirement_submissions
├── faculty_clearances
├── organization_documents
├── organization_members
└── organization_bulk_uploads
```

## Restore Behavior

When you **restore** an archived academic year:

### ✅ Becomes Accessible Again
- Faculty requirements for that year
- Faculty clearance records for that year
- Organization documents for that year
- Organization members for that year

### ✅ Still Visible (Never Hidden)
- All deans
- All faculty
- All organizations
- All user accounts
- All personal profiles

## Permanent Delete Behavior

When you **permanently delete** an archived academic year:

### ❌ PERMANENTLY DELETED
- Faculty requirements for that year
- Faculty clearance records for that year
- Organization documents for that year
- Organization members for that year
- **Cannot be recovered**

### ✅ PRESERVED
- All deans (not deleted)
- All faculty (not deleted)
- All organizations (not deleted)
- All user accounts (not deleted)
- All personal profiles (not deleted)
- All PDS data (not deleted)

## Summary

| Item | Affected by Archive? | Visible After Archive? |
|------|---------------------|------------------------|
| Deans | ❌ No | ✅ Yes - Always visible |
| Faculty | ❌ No | ✅ Yes - Always visible |
| Organizations | ❌ No | ✅ Yes - Always visible |
| User Accounts | ❌ No | ✅ Yes - Always active |
| Personal Profiles | ❌ No | ✅ Yes - Always accessible |
| PDS Data | ❌ No | ✅ Yes - Always accessible |
| Faculty Requirements | ✅ Yes | ⚠️ Filtered by academic year |
| Faculty Clearance | ✅ Yes | ⚠️ Filtered by academic year |
| Organization Documents | ✅ Yes | ⚠️ Filtered by academic year |
| Organization Members | ✅ Yes | ⚠️ Filtered by academic year |

## Recommendation

**Safe to Archive**: Archiving an academic year is safe and will not affect your ability to see or manage deans and faculty. It only affects year-specific data like requirements, clearances, and organization activities for that particular year.

**Use Case**: Archive old academic years to keep your active data clean while preserving historical records. You can always restore them if needed.

**Best Practice**: 
1. Archive academic years at the end of each school year
2. Keep current and upcoming years active
3. Permanently delete only very old years you're certain you'll never need
