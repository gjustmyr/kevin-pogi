# Faculty Requirements: Certificates Inclusion

## Summary
Updated the faculty requirements submission interface to clarify that certificates should be included as part of the uploaded documents.

## Changes Made

### 1. UI Clarification
**File:** `client/src/app/features/faculty/requirements/requirements.html`

Added informational text in both file upload sections:

#### Submit Requirement Modal
- Added helper text above file input: 
  > "**Include all relevant documents:** certificates, reports, documentation, etc."
- Uses info icon (🛈) to draw attention
- Appears in the initial submission modal

#### Add Files Modal
- Added same helper text above file input
- Ensures users know to include certificates when adding more files to existing submissions

### 2. Standard Requirements List
**File:** `client/src/app/services/faculty-requirement.service.ts`

Added certificate-related requirement types to the autocomplete suggestions:
- `Training Certificates`
- `Seminar Certificates`
- `Workshop Certificates`
- `Conference Certificates`
- `Professional Development Certificates`

These appear in the dropdown when faculty members type in the "Requirement Name" field, making it easier to submit certificate-related requirements.

## User Experience Improvements

### Before
- No explicit mention of certificates in the UI
- Faculty might be unsure whether to include certificates
- Limited certificate-related options in requirement name suggestions

### After
- ✅ Clear instruction to include certificates and other documents
- ✅ Visual indicator (info icon) draws attention to the instruction
- ✅ Certificate-specific requirement types available in autocomplete
- ✅ Consistent messaging in both submission and add-files modals

## Technical Details

### File Upload Capabilities
The system already supports:
- Multiple file uploads (up to 10 files per submission)
- 200MB per file size limit
- Various file formats: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG
- Ability to add more files to existing submissions

### Requirement Types
Faculty can now easily select from certificate-specific requirement types:
1. **Training Certificates** - For training programs attended
2. **Seminar Certificates** - For seminars and talks
3. **Workshop Certificates** - For hands-on workshops
4. **Conference Certificates** - For academic conferences
5. **Professional Development Certificates** - For PD activities

Or they can still type any custom requirement name.

## Usage Examples

### Example 1: Submitting Training Certificates
1. Click "Submit Portfolio"
2. Select Academic Year and Semester
3. Type "Training Certificates" (autocomplete will suggest it)
4. Upload certificate files (can upload multiple certificates at once)
5. Submit

### Example 2: Adding Certificates to Existing Submission
1. Find the existing requirement submission
2. Click "Add Files"
3. See the instruction: "Include all relevant documents: certificates, reports, documentation, etc."
4. Select additional certificate files
5. Add files

## Benefits
- ✅ Reduces confusion about what to upload
- ✅ Encourages comprehensive documentation
- ✅ Makes certificate submission more discoverable
- ✅ Improves compliance with portfolio requirements
- ✅ Provides clear guidance without being restrictive
