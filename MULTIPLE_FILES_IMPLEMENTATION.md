# Multiple File Upload Feature Implementation

## Overview

Implemented support for faculty to submit 1 to many files per requirement submission.

## Changes Made

### 1. Database Changes

#### New Table: `requirement_files`

Created a new table to store multiple files per requirement submission.

**Location:** `backend/migrations/2026-03-16-create-requirement-files-table.sql`

**Structure:**

- `file_id` (Primary Key)
- `submission_id` (Foreign Key to requirement_submissions)
- `file_path` (Path to uploaded file)
- `file_name` (Original file name)
- `file_size` (File size in bytes)
- `upload_date` (Upload timestamp)

**Migration Script:** Automatically migrates existing files from `requirement_submissions` table to the new `requirement_files` table for backward compatibility.

**To run migration:**

```bash
cd backend
mysql -u your_username -p your_database < migrations/2026-03-16-create-requirement-files-table.sql
```

### 2. Backend Changes

#### New Model

**File:** `backend/models/requirement-file.model.js`

- Created `RequirementFile` model with proper Sequelize definitions

#### Updated Models Index

**File:** `backend/models/index.js`

- Added `RequirementFile` model import
- Created one-to-many relationship between `RequirementSubmission` and `RequirementFile`

#### Updated Routes

**File:** `backend/routes/faculty-requirement.routes.js`

**Changes:**

- Updated `/submit` endpoint to accept multiple files via `upload.array("files", 10)`
- Removed `/update` endpoint (replaced with add files functionality)
- Added `POST /:submission_id/add-files` - Add more files to existing submission
- Added `DELETE /:submission_id/files/:file_id` - Delete individual file

#### Updated Controllers

**File:** `backend/controllers/faculty-requirement.controller.js`

**Updated Methods:**

- `getMyRequirements()` - Now includes files association
- `submitRequirement()` - Handles multiple file uploads, creates records in `requirement_files` table
- `deleteRequirement()` - Deletes all associated files from both database and filesystem

**New Methods:**

- `addFiles()` - Add additional files to existing requirement submission
- `deleteFile()` - Delete a specific file from a requirement submission (prevents deleting last file)

**File:** `backend/controllers/dean-requirement.controller.js`

- Updated all queries to include `files` association for proper display

### 3. Frontend Changes

#### Updated Service

**File:** `client/src/app/services/faculty-requirement.service.ts`

**New Interface:**

```typescript
export interface RequirementFile {
	file_id: number;
	submission_id: number;
	file_path: string;
	file_name: string;
	file_size: number;
	upload_date: string;
}
```

**Updated Interface:**

```typescript
export interface RequirementSubmission {
	// ... existing fields ...
	files?: RequirementFile[]; // Array of files
}
```

**Updated Methods:**

- `submitRequirement()` - Now accepts `File[]` array instead of single `File`
- Removed `updateRequirement()` method

**New Methods:**

- `addFiles(submission_id, files)` - Add more files to existing submission
- `deleteFile(submission_id, file_id)` - Delete specific file

#### Updated Component

**File:** `client/src/app/features/faculty/requirements/requirements.ts`

**Properties Changed:**

- `selectedFile` → `selectedFiles: File[]` (array of files)
- Removed `updateFile`, `showUpdateModal`, `selectedSubmission`
- Added `addFiles: File[]`, `showAddFilesModal`, `addFilesSubmission`

**Updated Methods:**

- `onFileSelected()` - Now handles multiple file selection
- `submitRequirement()` - Sends multiple files
- Removed `openUpdateModal()`, `closeUpdateModal()`, `onUpdateFileSelected()`, `updateRequirement()`

**New Methods:**

- `removeFile(index)` - Remove file from selection before submit
- `openAddFilesModal(submission)` - Open modal to add more files
- `closeAddFilesModal()` - Close add files modal
- `onAddFilesSelected(event)` - Handle file selection in add files modal
- `removeAddFile(index)` - Remove file from add files selection
- `submitAddFiles()` - Submit additional files to existing requirement

#### Updated Template

**File:** `client/src/app/features/faculty/requirements/requirements.html`

**Submit Modal:**

- File input now has `multiple` attribute
- Shows list of all selected files with individual remove buttons
- Displays file count and total size
- Added file type restrictions

**Action Buttons:**

- Replaced "Update" button with "Add Files" button
- New button shown only for non-validated requirements

**New Modal:**

- Replaced "Update Modal" with "Add Files Modal"
- Allows selecting multiple additional files
- Shows current file count for the requirement
- Individual file management with remove buttons

## Features

### Faculty Can Now:

1. **Submit Multiple Files** - Upload up to 10 files per requirement submission (max 10MB each)
2. **Add More Files** - Add additional files to existing non-validated submissions
3. **Remove Files Before Submit** - Remove files from selection before submitting
4. **View All Files** - See all files associated with each requirement
5. **Delete Individual Files** - (Backend ready, UI can be extended)

### Supported File Types:

- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- Images (.jpg, .jpeg, .png)

### Business Rules:

1. **Minimum Files:** At least 1 file required per submission
2. **Maximum Files:** Up to 10 files per submission
3. **File Size Limit:** 10MB per file
4. **Add Files:** Can add more files to pending/returned submissions
5. **Cannot Modify:** Cannot add/delete files from validated submissions
6. **Last File Protection:** Cannot delete the last file (must delete entire submission instead)

## Testing Checklist

### Backend Testing:

- [ ] Run database migration successfully
- [ ] Test creating new submission with multiple files
- [ ] Test adding files to existing submission
- [ ] Test deleting individual files
- [ ] Test that files are properly included in all queries
- [ ] Verify file deletion from filesystem works
- [ ] Test validation prevents modifying validated requirements

### Frontend Testing:

- [ ] Test selecting multiple files in submit modal
- [ ] Test removing files before submission
- [ ] Test submitting with 1 file
- [ ] Test submitting with multiple files (up to 10)
- [ ] Test adding files to existing submission
- [ ] Test file size/type validation
- [ ] Verify proper error messages display
- [ ] Test that validated requirements cannot be modified

## Backward Compatibility

- Old `requirement_submissions` table retains `file_path`, `file_name`, `file_size` columns
- Migration automatically copies existing files to new `requirement_files` table
- Existing submissions will work seamlessly with new system
- Controllers handle both new multi-file format and legacy single-file format

## Next Steps (Optional Enhancements)

1. Add UI to view/manage individual files in requirements table
2. Add file preview functionality
3. Implement file download for individual files (not just submission)
4. Add bulk file upload with drag-and-drop
5. Display file thumbnails for images
6. Add file compression for large files
