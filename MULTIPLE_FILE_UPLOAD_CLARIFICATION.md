# Multiple File Upload Clarification

## Issue
Users reported that only one file could be uploaded even though the interface says "multiple documents are allowed."

## Root Cause Analysis
The system **already supports multiple file uploads** (up to 10 files per submission). The issue was likely:
1. **User confusion** - Users may not know how to select multiple files in the file picker
2. **Unclear instructions** - The UI didn't explicitly explain how to select multiple files

## Solution Implemented

### 1. Added Clear Instructions
**File:** `client/src/app/features/faculty/requirements/requirements.html`

Added helpful text above both file input fields:
```html
<p class="text-xs text-gray-600 mb-2">
  <i class="fas fa-info-circle text-blue-500"></i>
  Hold <strong>Ctrl</strong> (Windows) or <strong>Cmd</strong> (Mac) to select multiple files at once
</p>
```

### 2. Updated Labels
- Changed "Files * (You can upload multiple files)" to "Files * (Upload multiple files - up to 10 files)"
- Changed "Select Files to Add *" to "Select Files to Add * (up to 10 files)"
- Made the file limit more prominent

### 3. Added File Count Validation
**File:** `client/src/app/features/faculty/requirements/requirements.ts`

Added validation to prevent uploading more than 10 files:
```typescript
if (files.length > 10) {
  Swal.fire({
    icon: 'warning',
    title: 'Too Many Files',
    text: 'You can upload a maximum of 10 files at once. Please select fewer files.',
    confirmButtonColor: '#2563eb',
  });
  return;
}
```

## How Multiple File Upload Works

### For Users (Windows)
1. Click the file input button
2. In the file picker dialog, **hold Ctrl** key
3. Click on multiple files to select them
4. Click "Open"
5. All selected files will be uploaded

### For Users (Mac)
1. Click the file input button
2. In the file picker dialog, **hold Cmd** key
3. Click on multiple files to select them
4. Click "Open"
5. All selected files will be uploaded

### Alternative Method (All Platforms)
1. Click the file input button
2. Click the first file
3. **Hold Shift** key
4. Click the last file (selects all files in between)
5. Click "Open"

## Technical Implementation

### Frontend
- **HTML**: `<input type="file" multiple>` attribute enables multiple file selection
- **TypeScript**: `Array.from(input.files)` converts FileList to array
- **Service**: `files.forEach((file) => { formData.append('files', file); })` appends all files

### Backend
- **Route**: `upload.array("files", 10)` accepts up to 10 files
- **Controller**: Processes all uploaded files and stores them individually
- **Database**: Each file is stored as a separate record linked to the submission

## Validation Rules

### File Count
- **Minimum**: 1 file required
- **Maximum**: 10 files per submission
- **Error**: Shows warning if more than 10 files selected

### File Size
- **Per File**: 200MB maximum
- **Total**: No explicit total limit (but 10 files × 200MB = 2GB theoretical max)
- **Error**: Shows error listing files that exceed 200MB

### File Types
Accepted formats:
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Images: JPG, JPEG, PNG

## User Interface Updates

### Submit Requirement Modal
```
Files * (Upload multiple files - up to 10 files)
ℹ️ Hold Ctrl (Windows) or Cmd (Mac) to select multiple files at once
[File Input Button]

Selected files (3):
- certificate1.pdf (2.5 MB) [×]
- certificate2.pdf (1.8 MB) [×]
- report.docx (0.5 MB) [×]
```

### Add Files Modal
```
Select Files to Add * (up to 10 files)
ℹ️ Hold Ctrl (Windows) or Cmd (Mac) to select multiple files at once
[File Input Button]

Selected files (2):
- additional_doc.pdf (3.2 MB) [×]
- supplement.xlsx (0.8 MB) [×]
```

## Benefits

✅ **Clear Instructions** - Users know exactly how to select multiple files  
✅ **Better Validation** - Prevents uploading too many files  
✅ **Improved UX** - File limit is prominently displayed  
✅ **Cross-Platform** - Instructions work for both Windows and Mac  
✅ **Visual Feedback** - Selected files are listed with sizes  
✅ **Easy Removal** - Individual files can be removed before submission

## Testing Checklist

- ✅ Can select multiple files using Ctrl+Click (Windows)
- ✅ Can select multiple files using Cmd+Click (Mac)
- ✅ Can select range of files using Shift+Click
- ✅ Shows warning when selecting more than 10 files
- ✅ Shows error when any file exceeds 200MB
- ✅ Displays all selected files with sizes
- ✅ Can remove individual files before submission
- ✅ All files are uploaded successfully
- ✅ All files appear in the requirements table after submission
- ✅ Can download individual files after upload

## Common User Mistakes

### Mistake 1: Not Holding Ctrl/Cmd
**Problem**: Clicking files without holding Ctrl/Cmd deselects previous files  
**Solution**: Instructions now explicitly mention holding Ctrl/Cmd

### Mistake 2: Trying to Upload Too Many Files
**Problem**: Selecting more than 10 files  
**Solution**: Validation now shows clear warning message

### Mistake 3: Files Too Large
**Problem**: Selecting files larger than 200MB  
**Solution**: Validation shows which specific files are too large

## Future Enhancements (Optional)

1. **Drag & Drop**: Allow dragging multiple files onto the file input area
2. **Progress Bar**: Show upload progress for large files
3. **Batch Upload**: Allow uploading files in batches if total exceeds 10
4. **File Preview**: Show thumbnails for image files
5. **Total Size Display**: Show total size of all selected files
