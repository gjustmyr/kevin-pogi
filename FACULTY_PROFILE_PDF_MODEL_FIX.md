# Faculty Profile PDF Export - Model Name Fix

## Issue
Backend was throwing error: `Cannot read properties of undefined (reading 'findOne')`

## Root Cause
The `getFacultyFullProfile` method in `dean-faculty.controller.js` was using incorrect model names that don't exist in the database:
- ❌ `db.PersonalProfile` → ✅ `db.FacultyPersonalProfile`
- ❌ `db.AcademicProfile` → ✅ `db.FacultyAcademicProfile`
- ❌ `db.EmploymentProfile` → ✅ `db.FacultyEmploymentProfile`
- ❌ `db.ProfessionalMembership` → ✅ `db.FacultyProfessionalMembership`
- ❌ `db.Award` → ✅ `db.FacultyAwards`
- ❌ `db.Eligibility` (with faculty_id) → ✅ `db.PDSEligibility` (via PersonalDataSheet)

## Fix Applied

### File: `backend/controllers/dean-faculty.controller.js`

#### Before:
```javascript
const [
  personalProfile,
  academicProfiles,
  employmentProfiles,
  memberships,
  awards,
  eligibilities,
] = await Promise.all([
  db.PersonalProfile.findOne({ where: { faculty_id: facultyId } }),
  db.AcademicProfile.findAll({ where: { faculty_id: facultyId } }),
  db.EmploymentProfile.findAll({ where: { faculty_id: facultyId } }),
  db.ProfessionalMembership.findAll({ where: { faculty_id: facultyId } }),
  db.Award.findAll({ where: { faculty_id: facultyId } }),
  db.Eligibility.findAll({ where: { faculty_id: facultyId } }),
]);
```

#### After:
```javascript
const [
  personalProfile,
  academicProfiles,
  employmentProfiles,
  memberships,
  awards,
] = await Promise.all([
  db.FacultyPersonalProfile.findOne({ where: { faculty_id: facultyId } }),
  db.FacultyAcademicProfile.findAll({ where: { faculty_id: facultyId } }),
  db.FacultyEmploymentProfile.findAll({ where: { faculty_id: facultyId } }),
  db.FacultyProfessionalMembership.findAll({ where: { faculty_id: facultyId } }),
  db.FacultyAwards.findAll({ where: { faculty_id: facultyId } }),
]);

// Get eligibilities from PDS if exists
let eligibilities = [];
const pds = await db.PersonalDataSheet.findOne({
  where: { faculty_id: facultyId },
  include: [
    {
      model: db.PDSEligibility,
      as: "eligibilities",
    },
  ],
});
if (pds && pds.eligibilities) {
  eligibilities = pds.eligibilities;
}
```

## Correct Model Names (from models/index.js)

### Faculty Profile Models:
- `db.FacultyPersonalProfile`
- `db.FacultyAcademicProfile`
- `db.FacultyEmploymentProfile`
- `db.FacultyProfessionalMembership`
- `db.FacultyAwards`
- `db.FacultySeminarsTrainings`
- `db.FacultyResearchActivities`
- `db.FacultyExtensionActivities`

### PDS Models:
- `db.PersonalDataSheet`
- `db.PDSChild`
- `db.PDSEducation`
- `db.PDSEligibility` (linked via `pds_id`, not `faculty_id`)
- `db.PDSWorkExperience`
- `db.PDSVoluntaryWork`
- `db.PDSTraining`
- `db.PDSOtherInfo`
- `db.PDSReference`

## Special Note: Eligibilities
Eligibilities are stored in `pds_eligibilities` table and linked to `PersonalDataSheet` via `pds_id`, not directly to faculty via `faculty_id`. Therefore, we need to:
1. First find the PersonalDataSheet for the faculty
2. Include the eligibilities relationship
3. Extract eligibilities from the PDS record

## Testing
After this fix, the PDF export should:
1. ✅ Successfully fetch faculty profile data
2. ✅ Display personal information
3. ✅ Display education history
4. ✅ Display employment history
5. ✅ Display professional memberships
6. ✅ Display awards
7. ✅ Display eligibilities (from PDS)
8. ✅ Generate PDF without errors

## Files Modified
- `backend/controllers/dean-faculty.controller.js` (line ~445-475)
