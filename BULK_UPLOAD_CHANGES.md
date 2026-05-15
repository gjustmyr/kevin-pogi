# Bulk Upload Feature Changes

## Overview
The bulk upload feature has been modified to store only the file name and department information, rather than listing individual names from the uploaded CSV/Excel file. A new "Department" field has been added to the bulk upload process.

## Changes Made

### 1. Database Changes

#### New Table: `organization_bulk_uploads`
A new table has been created to track bulk upload metadata:

**Fields:**
- `upload_id` - Primary key
- `organization_id` - Reference to the organization
- `file_name` - Original name of the uploaded CSV/Excel file
- `department` - Department to which the uploaded members belong
- `academic_year_id` - Academic year for the bulk upload
- `term_start_date` - Term start date for the uploaded members
- `total_records` - Total number of records in the file
- `inserted_count` - Number of records successfully inserted
- `updated_count` - Number of records updated
- `skipped_count` - Number of records skipped
- `uploaded_by` - User ID who performed the upload
- `upload_status` - Status: 'completed', 'partial', or 'failed'
- `created_at` - Timestamp of upload
- `updated_at` - Last update timestamp

**Migration File:** `backend/migrations/create-organization-bulk-upload-table.sql`

### 2. Backend Changes

#### New Model
**File:** `backend/models/organization-bulk-upload.model.js`
- Defines the OrganizationBulkUpload model with all necessary fields and relationships

#### Updated Files

**File:** `backend/models/index.js`
- Added OrganizationBulkUpload model
- Added relationships:
  - Organization → OrganizationBulkUpload (one-to-many)
  - AcademicYear → OrganizationBulkUpload (one-to-many)
  - User → OrganizationBulkUpload (one-to-many)

**File:** `backend/controllers/organization-member.controller.js`
- Modified `bulkUploadMembers()` function:
  - Added `department` as a required field
  - Department from the form is now assigned to all uploaded members
  - After processing, creates a record in `organization_bulk_uploads` table
  - Stores only file name, department, and summary statistics (not individual names)
  - Determines upload status based on results (completed/partial/failed)

- Added new function `getBulkUploadHistory()`:
  - Retrieves paginated list of bulk upload records
  - Includes academic year and uploader information
  - Shows file name, department, and upload statistics

**File:** `backend/routes/organization.routes.js`
- Added new route: `GET /members/bulk-upload/history`
  - Retrieves bulk upload history for the organization

### 3. Frontend Changes

#### Updated Files

**File:** `client/src/app/features/organization/members/organization-members.html`
- Added "Department" input field to the bulk upload modal
- Field is marked as required with red asterisk
- Positioned between the file upload and academic year fields

**File:** `client/src/app/features/organization/members/organization-members.ts`
- Updated `bulkUploadForm` signal to include `department` field
- Modified `uploadMembers()` method:
  - Added validation for department field
  - Includes department in FormData sent to backend
- Updated `openBulkUploadModal()` to initialize department as empty string

## How It Works

### Upload Process

1. User opens the bulk upload modal
2. User selects a CSV/Excel file
3. User enters the **Department** (e.g., "College of Computer Studies")
4. User selects Academic Year and Term Start Date
5. User clicks "Upload Members"

### Backend Processing

1. File is parsed and individual members are created/updated in `organization_members` table
2. Each member record gets the department value from the form (not from CSV)
3. After processing all rows, a single record is created in `organization_bulk_uploads` table containing:
   - File name (e.g., "members-2024.csv")
   - Department
   - Upload statistics (total, inserted, updated, skipped)
   - Upload status

### What Gets Stored

**Individual Names:** Stored in `organization_members` table (existing behavior)
**Bulk Upload Record:** Only stores:
- File name
- Department
- Summary statistics
- Metadata (academic year, uploader, timestamp)

**Individual names are NOT stored in the bulk upload tracking table.**

## API Endpoints

### Upload Members (Modified)
```
POST /api/organization/members/bulk-upload
```

**Request Body (FormData):**
- `file` - CSV/Excel file
- `academic_year_id` - Academic year ID
- `term_start_date` - Term start date
- `department` - Department name (NEW)

**Response:**
```json
{
  "message": "Bulk upload completed",
  "results": {
    "total": 50,
    "inserted": 45,
    "updated": 3,
    "skipped": 2,
    "errors": []
  }
}
```

### Get Bulk Upload History (NEW)
```
GET /api/organization/members/bulk-upload/history?page=1&limit=10
```

**Response:**
```json
{
  "uploads": [
    {
      "upload_id": 1,
      "file_name": "members-2024.csv",
      "department": "College of Computer Studies",
      "total_records": 50,
      "inserted_count": 45,
      "updated_count": 3,
      "skipped_count": 2,
      "upload_status": "completed",
      "created_at": "2024-05-15T10:30:00Z",
      "AcademicYear": {
        "year_start": 2024,
        "year_end": 2025
      },
      "uploader": {
        "username": "org_admin"
      }
    }
  ],
  "currentPage": 1,
  "totalPages": 1,
  "totalItems": 1
}
```

## Database Migration

To apply the database changes, run the migration SQL file:

```bash
mysql -u your_username -p your_database < backend/migrations/create-organization-bulk-upload-table.sql
```

Or execute the SQL directly in your database management tool.

## Testing

### Test Scenarios

1. **Successful Upload**
   - Upload a valid CSV file with department field filled
   - Verify members are created in database
   - Verify bulk upload record is created with correct file name and department
   - Check that upload_status is 'completed'

2. **Partial Upload**
   - Upload a CSV with some invalid rows
   - Verify valid rows are processed
   - Verify bulk upload record shows correct counts
   - Check that upload_status is 'partial'

3. **Missing Department**
   - Try to upload without entering department
   - Verify validation error is shown
   - Verify upload is prevented

4. **View Upload History**
   - Perform multiple uploads
   - Access bulk upload history endpoint
   - Verify all uploads are listed with correct information

## Benefits

1. **Privacy**: Individual names are not duplicated in the bulk upload tracking table
2. **Efficiency**: Only metadata is stored for tracking purposes
3. **Organization**: Department field helps categorize uploads
4. **Audit Trail**: Complete history of bulk uploads with statistics
5. **Compliance**: Easier to manage data retention policies

## Notes

- The department field is required and must be filled before upload
- The department value applies to all members in the uploaded file
- Individual member records still contain all original information
- The bulk upload table is for tracking and auditing purposes only
- File names are stored as originally uploaded (e.g., "members-spring-2024.csv")
