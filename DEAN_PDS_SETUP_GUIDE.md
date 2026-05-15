# Dean PDS Setup Guide

## Current Issue

You're seeing this error when trying to use your Personal Data Sheet (PDS):

```json
{
  "message": "Your profile is incomplete. Please complete your My Profile first before importing to PDS.",
  "missingInProfile": {
    "date_of_birth": true
  }
}
```

This means your **Dean Profile is missing required information** that the PDS needs.

## Why This Happens

The PDS (Personal Data Sheet) imports data from your "My Profile" section. If your profile is incomplete, the PDS cannot be created because it requires certain mandatory fields like:

- ✅ Surname (you have this)
- ✅ First Name (you have this)
- ❌ **Date of Birth (MISSING - this is your issue)**
- ✅ Place of Birth (you have this)
- Province
- Barangay (used as city)
- Mobile Number
- Email Address

## Solution: Complete Your Dean Profile First

### Step 1: Go to My Profile
1. From your Dean dashboard, click on **"My Profile"** in the navigation menu
2. You should see your Personal Information section

### Step 2: Edit Personal Information
1. Click the **"Edit"** button on your Personal Information card
2. You'll see a form with various fields

### Step 3: Fill in Required Fields

**CRITICAL - You MUST fill in these fields:**

| Field | Status | Action Required |
|-------|--------|-----------------|
| Last Name | ✅ Complete | - |
| First Name | ✅ Complete | - |
| **Date of Birth** | ❌ **MISSING** | **SELECT A DATE** |
| Place of Birth | ✅ Complete | - |
| Province | ⚠️ Check | Make sure it's filled |
| Barangay | ⚠️ Check | Make sure it's filled (will be used as city) |
| Mobile Number | ✅ Complete | - |
| Email Address | ✅ Complete | - |

**The Date of Birth field looks like this:**
```html
<input type="date" name="date_of_birth" />
```

It's a date picker - click on it and select your birth date.

### Step 4: Save Your Profile
1. After filling in the **Date of Birth** and checking other required fields
2. Click the **"Save"** button
3. Wait for the success message: "Personal profile saved successfully"

### Step 5: Go Back to PDS
1. Navigate to **"Personal Data Sheet"** from the menu
2. The page will automatically try to import from your profile
3. If it still shows empty, click **"Import from My Profile"** button
4. Your PDS should now be populated with your profile data!

## Understanding the Error Messages

### Error 1: Profile Incomplete (from importFromProfile)
```json
{
  "message": "Your profile is incomplete...",
  "missingInProfile": {
    "date_of_birth": true
  }
}
```
**Meaning:** Your My Profile is missing the date_of_birth field. Go fill it in!

### Error 2: Validation Failed (from savePDS)
```json
{
  "message": "Validation failed",
  "missingFields": ["date_of_birth", "residential_city", "residential_province", ...]
}
```
**Meaning:** You tried to save the PDS directly without importing from profile, and these fields are empty.

## Why Can't I Just Fill the PDS Directly?

You can! But you still need to fill in all required fields. The PDS requires:

**Personal Information:**
- Surname ✓
- First Name ✓
- Date of Birth ✓ (must be valid date, not "Invalid date")
- Place of Birth ✓
- Sex ✓
- Civil Status ✓
- Citizenship Type ✓

**Address Information:**
- Residential City ✓
- Residential Province ✓
- Permanent City ✓
- Permanent Province ✓

**Contact Information:**
- Mobile Number ✓
- Email Address ✓

## Date Format Requirements

The **Date of Birth** field must be:
- ✅ A valid date (e.g., 1990-05-15)
- ✅ In YYYY-MM-DD format
- ❌ NOT "Invalid date"
- ❌ NOT empty/null
- ❌ NOT just a string like "May 15, 1990"

The HTML date input (`<input type="date">`) automatically formats it correctly when you select a date from the picker.

## Troubleshooting

### "I filled in the date but still getting the error"

1. **Make sure you clicked Save** after entering the date
2. **Check the browser console** for any save errors
3. **Refresh the page** and check if the date is still there
4. **Try a different browser** if the date picker isn't working

### "The date picker isn't showing"

Some browsers have issues with `<input type="date">`. Try:
- Using Chrome or Edge (best support)
- Updating your browser
- Checking if JavaScript is enabled

### "I saved my profile but PDS still shows errors"

1. **Go back to My Profile** and verify the date is actually saved
2. **Check that it shows a date** (not "N/A") in the view mode
3. **Try importing again** from the PDS page
4. **Check browser console** for any error messages

## Quick Checklist

Before trying to use PDS, verify in My Profile:

- [ ] Date of Birth is filled in and saved
- [ ] Province is filled in
- [ ] Barangay is filled in
- [ ] Place of Birth is filled in
- [ ] Mobile Number is filled in
- [ ] Email Address is filled in
- [ ] You clicked "Save" and saw success message
- [ ] You can see the date when viewing (not editing) your profile

Once all checkboxes are ✅, go to PDS and click "Import from My Profile"!

## Still Having Issues?

If you've completed all the steps above and still see errors:

1. **Check the exact error message** - it will tell you which field is missing
2. **Look at the `missingInProfile` object** in the error - it shows exactly what's missing
3. **Verify in the database** that your dean_personal_profiles record has the date_of_birth field populated
4. **Check browser console** for any JavaScript errors
5. **Try logging out and back in** to refresh your session

## Technical Details (for developers)

The import process:
1. Frontend calls `GET /api/dean-pds` 
2. If 404, automatically calls `POST /api/dean-pds/import-from-profile`
3. Backend fetches `dean_personal_profiles` record
4. Maps fields: `date_of_birth`, `province`, `barangay`, etc.
5. Validates all required fields are present
6. Creates PDS record if validation passes

Field mapping:
- `personalProfile.date_of_birth` → `pdsData.date_of_birth`
- `personalProfile.province` → `pdsData.residential_province` & `pdsData.permanent_province`
- `personalProfile.barangay` → `pdsData.residential_city` & `pdsData.permanent_city`

The validation happens in `backend/controllers/dean-pds.controller.js` in the `importFromProfile` function.
