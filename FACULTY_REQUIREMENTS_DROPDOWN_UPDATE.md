# Faculty Requirements: Dropdown Implementation

## Summary
Changed the faculty requirements submission interface from a text input with autocomplete to a proper dropdown menu. "Certificate" is now the first option, and "Other Documents" allows manual text entry for custom document names.

## Changes Made

### 1. Standard Requirements List
**File:** `client/src/app/services/faculty-requirement.service.ts`

Updated the requirements list:
- **"Certificate"** - Now the first option (primary use case)
- Standard academic requirements (Instructional Materials, Exams, etc.)
- **"Other Documents"** - Last option, triggers custom name input

```typescript
export const STANDARD_REQUIREMENTS = [
  'Certificate',
  'Instructional Materials',
  'Student Class Attendance Sheet',
  // ... other standard requirements
  'Other Documents',
];
```

### 2. UI Changes
**File:** `client/src/app/features/faculty/requirements/requirements.html`

#### Changed from Text Input to Dropdown
**Before:**
```html
<input type="text" [(ngModel)]="submitForm.requirement_name" list="standard-requirements" />
<datalist id="standard-requirements">...</datalist>
```

**After:**
```html
<select [(ngModel)]="submitForm.requirement_name">
  <option value="">Select Requirement Type</option>
  @for (reqName of standardRequirements; track $index) {
    <option [value]="reqName">{{ reqName }}</option>
  }
</select>
```

#### Added Conditional Custom Name Input
When "Other Documents" is selected, a text input appears:
```html
@if (submitForm.requirement_name === 'Other Documents') {
  <div>
    <label>Document Name *</label>
    <input type="text" [(ngModel)]="submitForm.custom_requirement_name" />
  </div>
}
```

### 3. TypeScript Logic
**File:** `client/src/app/features/faculty/requirements/requirements.ts`

#### Added Custom Name Field
```typescript
submitForm = {
  academic_year_id: 0,
  semester: '',
  requirement_name: '',
  custom_requirement_name: '',  // NEW
};
```

#### Updated Validation
- Checks if "Other Documents" is selected
- Validates that custom name is provided
- Uses custom name when submitting if "Other Documents" is selected

```typescript
if (this.submitForm.requirement_name === 'Other Documents' && !this.submitForm.custom_requirement_name) {
  // Show error
  return;
}

const requirementName = this.submitForm.requirement_name === 'Other Documents' 
  ? this.submitForm.custom_requirement_name 
  : this.submitForm.requirement_name;
```

#### Updated Reset Logic
Both `openSubmitModal()` and `closeSubmitModal()` now reset the custom name field.

## User Experience

### Submitting Certificates
1. Click "Submit Portfolio"
2. Select Academic Year and Semester
3. Select **"Certificate"** from dropdown (first option)
4. Upload multiple certificate files (up to 10 files, 200MB each)
5. Submit

### Submitting Standard Requirements
1. Click "Submit Portfolio"
2. Select Academic Year and Semester
3. Select requirement from dropdown (e.g., "Midterm Exam", "Class Record")
4. Upload files
5. Submit

### Submitting Other Documents
1. Click "Submit Portfolio"
2. Select Academic Year and Semester
3. Select **"Other Documents"** from dropdown
4. **New field appears:** "Document Name"
5. Type custom document name (e.g., "Research Paper", "Training Materials")
6. Upload files
7. Submit

## Benefits

✅ **Clearer Interface** - Dropdown is more intuitive than text input with datalist  
✅ **Certificate Priority** - "Certificate" is the first option, making it easy to find  
✅ **Flexibility** - "Other Documents" allows custom names when needed  
✅ **Better Validation** - Ensures proper requirement type selection  
✅ **Consistent UX** - Dropdown matches other form fields (Academic Year, Semester)  
✅ **No Typing Errors** - Predefined options prevent typos in standard requirements  
✅ **Multiple Files** - Can upload as many files as needed (up to 10 per submission)

## Technical Details

### Dropdown Options (in order)
1. Certificate ⭐ (Primary option)
2. Instructional Materials
3. Student Class Attendance Sheet
4. Acknowledgement Receipt of Syllabus
5. Acknowledgement Receipt of Exam
6. Midterm Exam
7. Final Exam
8. TQS (Teaching Quality Survey)
9. Student Exam (Highest)
10. Student Exam (Middle)
11. Student Exam (Lowest)
12. Key to Correction of Midterm Exam
13. Key to Correction of Final Exam
14. Report of Grades
15. Class Record
16. Other Documents 📝 (Triggers custom name input)

### Validation Rules
- Requirement type must be selected
- If "Other Documents" is selected, custom name is required
- At least one file must be uploaded
- Academic year and semester must be selected

### File Upload Capabilities
- Multiple files per submission (up to 10 files)
- 200MB per file size limit
- Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG
- Can add more files to existing submissions
