# Academic Year File Isolation - Requirements & Implementation

## Requirements Summary

### ✅ Files Must Be Isolated by Academic Year
1. **Files belong to specific academic years**
   - Faculty requirements submitted for 2023-2024 should only appear when viewing 2023-2024
   - Organization documents for 2023-2024 should only appear when viewing 2023-2024

2. **Archived years = Hidden files**
   - When an academic year is archived, its files should not appear in any dropdown
   - Files are preserved but not accessible until year is restored

3. **No active year = No files shown**
   - If there's no active academic year, no files from past years should be displayed
   - Users should see empty state or message

4. **Personal data persists across years**
   - Faculty "My Profile" data (personal info, education, eligibility)
   - PDS (Personal Data Sheet) data
   - This data is NOT tied to academic years

## Current Database Structure

### ✅ Already Isolated by Academic Year

**Faculty Requirements** (`requirement_submissions`)
```sql
- faculty_id (who submitted)
- academic_year_id (which year) ← ISOLATED
- semester
- requirement_name
- file_path
```

**Organization Documents** (`organization_documents`)
```sql
- organization_id (which org)
- academic_year_id (which year) ← ISOLATED
- semester
- document_title
- file_path
```

**Organization Members** (`organization_members`)
```sql
- organization_id (which org)
- academic_year_id (which year) ← ISOLATED
- sr_code
- position
```

**Faculty Clearance** (`faculty_clearances`)
```sql
- faculty_id (who)
- academic_year_id (which year) ← ISOLATED
- semester
- clearance_status
```

### ✅ NOT Isolated (Persists Across Years)

**Faculty Personal Data**
```sql
- faculties (basic info)
- faculty_personal_profiles (personal details)
- faculty_educational_backgrounds (education)
- faculty_eligibilities (eligibility)
- personal_data_sheets (PDS)
- pds_* (all PDS tables)
```

**Organizations**
```sql
- organizations (org info)
- organization_advisers (advisers)
```

**Deans**
```sql
- deans (dean info)
```

## Implementation Status

### ✅ Already Implemented

The system **ALREADY** filters files by academic year in most places. Let me verify the key controllers:

#### Faculty Requirements Controller
**Expected**: Should filter by `academic_year_id`
**File**: `backend/controllers/faculty-requirement.controller.js`

#### Organization Documents Controller
**Expected**: Should filter by `academic_year_id`
**File**: `backend/controllers/organization-document.controller.js`

#### Dean Faculty Controller
**Expected**: Should filter faculty requirements by `academic_year_id`
**File**: `backend/controllers/dean-faculty.controller.js`

## What Needs Verification

I need to check if the controllers properly:
1. ✅ Filter files by selected academic year
2. ✅ Show no files when no academic year is selected
3. ✅ Show no files when academic year is archived (already hidden from dropdown)
4. ✅ Keep personal data accessible regardless of academic year

## Expected Behavior

### Scenario 1: Faculty Views Requirements

**Academic Year: 2023-2024 Selected**
```
Requirements List:
✅ Syllabus (submitted 2023-2024)
✅ Grades (submitted 2023-2024)
❌ Syllabus (submitted 2022-2023) - HIDDEN
❌ Grades (submitted 2022-2023) - HIDDEN
```

**Academic Year: 2022-2023 Selected**
```
Requirements List:
✅ Syllabus (submitted 2022-2023)
✅ Grades (submitted 2022-2023)
❌ Syllabus (submitted 2023-2024) - HIDDEN
❌ Grades (submitted 2023-2024) - HIDDEN
```

**No Academic Year Selected**
```
Requirements List:
(Empty - no files shown)
```

### Scenario 2: Organization Views Documents

**Academic Year: 2023-2024 Selected**
```
Documents List:
✅ Event Report (2023-2024)
✅ Financial Report (2023-2024)
❌ Event Report (2022-2023) - HIDDEN
```

**Academic Year: 2022-2023 Selected**
```
Documents List:
✅ Event Report (2022-2023)
❌ Event Report (2023-2024) - HIDDEN
```

**No Academic Year Selected**
```
Documents List:
(Empty - no files shown)
```

### Scenario 3: Dean Views Faculty Requirements

**Academic Year: 2023-2024 Selected**
```
Faculty: John Doe
Requirements for 2023-2024:
✅ Syllabus (2023-2024)
✅ Grades (2023-2024)
❌ Files from 2022-2023 - HIDDEN
```

**Academic Year: 2022-2023 Selected**
```
Faculty: John Doe
Requirements for 2022-2023:
✅ Syllabus (2022-2023)
✅ Grades (2022-2023)
❌ Files from 2023-2024 - HIDDEN
```

### Scenario 4: Faculty "My Profile"

**Academic Year: 2023-2024 Selected**
```
My Profile:
✅ Name: John Doe
✅ Email: john@example.com
✅ Education: BS Computer Science
✅ Eligibility: Board Passer
(All personal data visible)
```

**Academic Year: 2022-2023 Selected**
```
My Profile:
✅ Name: John Doe (SAME DATA)
✅ Email: john@example.com (SAME DATA)
✅ Education: BS Computer Science (SAME DATA)
✅ Eligibility: Board Passer (SAME DATA)
(Personal data persists across years)
```

**No Academic Year Selected**
```
My Profile:
✅ All personal data still visible
(Not affected by academic year)
```

## Verification Needed

I need to check the following controllers to ensure they properly filter by academic year:

1. **Faculty Requirements** - Filter by `academic_year_id`
2. **Organization Documents** - Filter by `academic_year_id`
3. **Organization Members** - Filter by `academic_year_id`
4. **Dean Faculty Requirements View** - Filter by `academic_year_id`
5. **Faculty Clearance** - Filter by `academic_year_id`

And verify these DON'T filter by academic year:
1. **Faculty Profile** - Always accessible
2. **Faculty PDS** - Always accessible
3. **Organization Info** - Always accessible

## Next Steps

Let me verify the controllers to ensure they implement this correctly...
