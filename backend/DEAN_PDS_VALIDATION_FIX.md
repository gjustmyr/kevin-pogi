# Dean PDS Validation Fix Summary

## Issue
Dean users were unable to save their Personal Data Sheet (PDS) due to validation errors:
- `date_of_birth cannot be null`
- Missing required fields: `residential_city`, `residential_province`, `permanent_city`, `permanent_province`

## Root Causes

### 1. Missing Validation in savePDS
The `dean-pds.controller.js` savePDS function had minimal validation compared to the faculty version. It wasn't checking for required fields or validating date formats before attempting to save to the database.

### 2. Incorrect Field Mapping in importFromProfile
The `importFromProfile` function was trying to map non-existent fields from the dean personal profile:
- Used `home_barangay` (doesn't exist) instead of `barangay`
- Used `home_province` (doesn't exist) instead of `province`
- Used `mobile_number_primary` (doesn't exist) instead of `mobile_primary`
- Didn't map `city` field (dean profile doesn't have a separate city field)

### 3. No Profile Completeness Check
The import function didn't validate that the dean's profile had all required data before attempting to create a PDS record.

## Solutions Implemented

### 1. Added Comprehensive Validation to savePDS
```javascript
// Validate required fields
const requiredFields = {
  surname,
  first_name,
  date_of_birth,
  place_of_birth,
  sex,
  civil_status,
  citizenship_type,
  residential_city,
  residential_province,
  permanent_city,
  permanent_province,
  mobile_no,
  email_address,
};

// Check for missing fields
const missingFields = [];
const invalidFields = [];

for (const [field, value] of Object.entries(requiredFields)) {
  if (!value || value === "" || value === null) {
    missingFields.push(field);
  }
  
  // Special validation for date_of_birth
  if (field === "date_of_birth" && value) {
    if (value === "Invalid date" || isNaN(new Date(value).getTime())) {
      invalidFields.push({
        field: "date_of_birth",
        value: value,
        message: "Date of birth must be a valid date in YYYY-MM-DD format"
      });
    }
  }
}
```

### 2. Fixed Field Mapping in importFromProfile
**Correct Dean Profile Field Mapping:**
```javascript
pdsData.surname = personalProfile.last_name || "";
pdsData.first_name = personalProfile.first_name || "";
pdsData.middle_name = personalProfile.middle_name || "";
pdsData.name_extension = personalProfile.extension || null;
pdsData.date_of_birth = personalProfile.date_of_birth || null;
pdsData.place_of_birth = personalProfile.place_of_birth || "";
pdsData.sex = personalProfile.sex || "Male";
pdsData.civil_status = personalProfile.civil_status || "Single";
pdsData.mobile_no = personalProfile.mobile_primary || "";
pdsData.email_address = personalProfile.email_primary || "";
pdsData.citizenship_type = personalProfile.citizenship || "Filipino";
pdsData.residential_barangay = personalProfile.barangay || "";
pdsData.residential_city = personalProfile.barangay || ""; // Use barangay as city
pdsData.residential_province = personalProfile.province || "";
pdsData.residential_zip_code = personalProfile.zip_code || null;
pdsData.residential_street = personalProfile.street_subdivision || null;
pdsData.permanent_barangay = personalProfile.barangay || "";
pdsData.permanent_city = personalProfile.barangay || ""; // Use barangay as city
pdsData.permanent_province = personalProfile.province || "";
pdsData.permanent_zip_code = personalProfile.zip_code || null;
pdsData.permanent_street = personalProfile.street_subdivision || null;
pdsData.telephone_no = personalProfile.mobile_secondary || null;
```

### 3. Added Profile Completeness Validation
```javascript
// Validate that we have minimum required data before creating/updating PDS
const hasRequiredData = 
  pdsData.surname && 
  pdsData.first_name && 
  pdsData.date_of_birth &&
  pdsData.place_of_birth &&
  pdsData.residential_city &&
  pdsData.residential_province &&
  pdsData.permanent_city &&
  pdsData.permanent_province &&
  pdsData.mobile_no &&
  pdsData.email_address;

if (!hasRequiredData) {
  return res.status(400).json({
    message: "Your profile is incomplete. Please complete your My Profile first before importing to PDS.",
    missingInProfile: {
      surname: !pdsData.surname,
      first_name: !pdsData.first_name,
      date_of_birth: !pdsData.date_of_birth,
      place_of_birth: !pdsData.place_of_birth,
      residential_city: !pdsData.residential_city,
      residential_province: !pdsData.residential_province,
      permanent_city: !pdsData.permanent_city,
      permanent_province: !pdsData.permanent_province,
      mobile_no: !pdsData.mobile_no,
      email_address: !pdsData.email_address,
    }
  });
}
```

### 4. Added Complete Field Handling
The savePDS function now properly handles all PDS fields including:
- Personal information (name, date of birth, place of birth, etc.)
- Physical attributes (height, weight, blood type)
- Government IDs (GSIS, Pag-IBIG, PhilHealth, SSS, TIN, etc.)
- Addresses (residential and permanent)
- Contact information
- Family background (spouse, father, mother)
- Questionnaire answers (Q34-Q44)
- Related data (children, education, eligibilities, work experiences, etc.)

## Error Messages

### Before Fix
```json
{
  "message": "Error saving Personal Data Sheet"
}
```

### After Fix - Missing Fields
```json
{
  "message": "Validation failed",
  "missingFields": ["date_of_birth", "residential_city", "residential_province"],
  "invalidFields": []
}
```

### After Fix - Invalid Date
```json
{
  "message": "Validation failed",
  "missingFields": [],
  "invalidFields": [{
    "field": "date_of_birth",
    "value": "Invalid date",
    "message": "Date of birth must be a valid date in YYYY-MM-DD format"
  }]
}
```

### After Fix - Incomplete Profile
```json
{
  "message": "Your profile is incomplete. Please complete your My Profile first before importing to PDS.",
  "missingInProfile": {
    "date_of_birth": true,
    "place_of_birth": true,
    "residential_city": true
  }
}
```

## Dean Profile vs Faculty Profile Field Differences

| PDS Field | Faculty Profile Field | Dean Profile Field |
|-----------|----------------------|-------------------|
| surname | last_name | last_name |
| first_name | first_name | first_name |
| middle_name | middle_name | middle_name |
| name_extension | - | extension |
| date_of_birth | date_of_birth | date_of_birth |
| place_of_birth | place_of_birth | place_of_birth |
| sex | gender | sex |
| civil_status | civil_status | civil_status |
| mobile_no | contact_number | mobile_primary |
| email_address | email | email_primary |
| citizenship_type | citizenship | citizenship |
| residential_city | city | barangay (no city field) |
| residential_province | province | province |
| residential_barangay | - | barangay |
| residential_street | - | street_subdivision |
| residential_zip_code | - | zip_code |
| telephone_no | - | mobile_secondary |

## Testing Steps

1. **Test with Complete Profile:**
   - Ensure dean has all required fields in My Profile
   - Click "Import from My Profile" in PDS
   - Verify all fields are populated correctly
   - Save PDS - should succeed

2. **Test with Incomplete Profile:**
   - Remove required fields from My Profile (e.g., date_of_birth)
   - Try to import from profile
   - Should receive clear error message about missing fields

3. **Test Direct Save:**
   - Fill in PDS form manually
   - Leave required fields empty
   - Try to save
   - Should receive validation error with list of missing fields

4. **Test Invalid Date:**
   - Enter invalid date format
   - Try to save
   - Should receive specific error about date format

## Files Modified

1. `backend/controllers/dean-pds.controller.js`
   - Added comprehensive validation to `savePDS` function
   - Fixed field mapping in `importFromProfile` function
   - Added profile completeness check
   - Added detailed error logging

## Next Steps for User

If you're still seeing validation errors:

1. **Complete Your My Profile First:**
   - Go to My Profile section
   - Fill in all required fields:
     - Last Name
     - First Name
     - Date of Birth (valid date)
     - Place of Birth
     - Province
     - Barangay (will be used as city)
     - Mobile Number
     - Email Address

2. **Then Import to PDS:**
   - Go to Personal Data Sheet
   - Click "Import from My Profile"
   - All required fields should now be populated

3. **Fill Any Remaining Fields:**
   - Review the imported data
   - Fill in any additional required fields
   - Save the PDS

## Date Format Requirements

The `date_of_birth` field must be:
- A valid date
- In YYYY-MM-DD format (e.g., "1990-05-15")
- Not "Invalid date" string
- Not null or empty

Frontend date pickers should ensure they're sending dates in this format.
