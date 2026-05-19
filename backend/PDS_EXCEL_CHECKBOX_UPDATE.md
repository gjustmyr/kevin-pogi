# PDS Excel Export - Checkbox Update

## Changes Made

Updated the PDS Excel export to display **checkbox symbols** (☑/☐) instead of plain text for multiple-choice fields.

## Checkbox Symbols Used

- **☑** - Checked (selected option)
- **☐** - Unchecked (not selected)

## Fields Updated

### 1. Sex at Birth
**Before:** `Male` or `Female`  
**After:** `☑ Male    ☐ Female` or `☐ Male    ☑ Female`

### 2. Civil Status
**Before:** `Single`, `Married`, `Widowed`, `Separated`, or `Others`  
**After:** `☑ Single    ☐ Married    ☐ Widowed    ☐ Separated    ☐ Others`

### 3. Citizenship
**Before:** `Filipino` or `Dual Citizenship`  
**After:** `☑ Filipino    ☐ Dual Citizenship` or `☐ Filipino    ☑ Dual Citizenship`

If Dual Citizenship is selected, the country is shown: `Country: [Country Name]`

### 4. Questionnaire Responses (Questions 34-44)
**Before:** `YES` or `NO`  
**After:** `☑ YES    ☐ NO` or `☐ YES    ☑ NO`

## Implementation Details

### Helper Functions Added

```javascript
/**
 * Create checkbox symbol
 * @param {boolean} checked - Whether the checkbox should be checked
 * @returns {string} - Checkbox symbol (☑ or ☐)
 */
const checkbox = (checked) => {
  return checked ? "☑" : "☐";
};

/**
 * Get checkbox for a specific value
 * @param {string} currentValue - The current value
 * @param {string} targetValue - The value to check against
 * @returns {string} - Checkbox symbol
 */
const checkboxFor = (currentValue, targetValue) => {
  return checkbox(currentValue === targetValue);
};
```

### Example Usage

```javascript
// Sex field
worksheet.getCell("E16").value = 
  `${checkboxFor(pds.sex, "Male")} Male    ${checkboxFor(pds.sex, "Female")} Female`;

// Civil Status field
const civilStatusText = [
  `${checkboxFor(pds.civil_status, "Single")} Single`,
  `${checkboxFor(pds.civil_status, "Married")} Married`,
  `${checkboxFor(pds.civil_status, "Widowed")} Widowed`,
  `${checkboxFor(pds.civil_status, "Separated")} Separated`,
  `${checkboxFor(pds.civil_status, "Others")} Others`,
].join("    ");
worksheet.getCell("E17").value = civilStatusText;

// Questionnaire YES/NO
worksheet.getCell("D140").value = 
  `${checkbox(pds.q34_a_answer)} YES    ${checkbox(!pds.q34_a_answer)} NO`;
```

## File Modified

- `backend/controllers/pds-excel-export.controller.js`

## Benefits

1. **Visual Clarity**: Checkboxes make it immediately clear which option is selected
2. **Professional Appearance**: Matches the official PDS form format
3. **Print-Friendly**: Checkboxes are clearly visible when printed
4. **Consistent**: Same checkbox style used throughout the document
5. **Unicode Support**: Uses standard Unicode checkbox characters (☑ U+2611, ☐ U+2610)

## Testing

### Test Cases:
1. ✅ Export PDS with Male selected → Shows `☑ Male    ☐ Female`
2. ✅ Export PDS with Female selected → Shows `☐ Male    ☑ Female`
3. ✅ Export PDS with Single status → Shows `☑ Single` with others unchecked
4. ✅ Export PDS with Filipino citizenship → Shows `☑ Filipino    ☐ Dual Citizenship`
5. ✅ Export PDS with Dual Citizenship → Shows `☐ Filipino    ☑ Dual Citizenship` + country
6. ✅ Export PDS with YES answers → Shows `☑ YES    ☐ NO`
7. ✅ Export PDS with NO answers → Shows `☐ YES    ☑ NO`

### How to Test:
1. Log in as Faculty or Dean
2. Fill out the PDS form
3. Click "Export to Excel"
4. Open the downloaded Excel file
5. Verify checkboxes appear correctly for:
   - Sex at Birth
   - Civil Status
   - Citizenship
   - All questionnaire responses

## Compatibility

- ✅ **Excel**: Displays checkboxes correctly
- ✅ **Google Sheets**: Displays checkboxes correctly
- ✅ **LibreOffice Calc**: Displays checkboxes correctly
- ✅ **PDF Export**: Checkboxes are preserved when converting to PDF
- ✅ **Printing**: Checkboxes print clearly

## Notes

- Checkbox symbols are Unicode characters, not actual form controls
- They are read-only in the exported Excel file
- The spacing between options uses 4 spaces for better readability
- All questionnaire responses now show both YES and NO options with appropriate checkboxes

## Example Output

### Sex at Birth
```
☑ Male    ☐ Female
```

### Civil Status
```
☐ Single    ☑ Married    ☐ Widowed    ☐ Separated    ☐ Others
```

### Citizenship
```
☑ Filipino    ☐ Dual Citizenship
```

### Questionnaire Response
```
☑ YES    ☐ NO
```

## Future Enhancements

Potential improvements for future versions:
- Add checkbox symbols to other multiple-choice fields
- Use actual Excel checkbox form controls (requires more complex implementation)
- Add color coding for checked vs unchecked boxes
- Support for custom checkbox styles based on template preferences
