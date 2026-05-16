# Testing Guide: Bulk Upload Feature

## Prerequisites

1. **Database Migration**
   ```bash
   # Run the migration to create the new table
   mysql -u your_username -p your_database < backend/migrations/create-organization-bulk-upload-table.sql
   ```

2. **Restart Backend Server**
   ```bash
   cd backend
   npm start
   ```

3. **Prepare Test CSV File**
   Create a CSV file with the following format:
   ```csv
   sr_code,student_name,position,gender,program,section,year_level,email
   21-12345,Juan Dela Cruz,Member,Male,BSIT,IT-3A,3rd Year,juan@example.com
   21-12346,Maria Santos,Member,Female,BSCS,CS-2B,2nd Year,maria@example.com
   21-12347,Pedro Reyes,Member,Male,BSIT,IT-1C,1st Year,pedro@example.com
   ```

## Test Cases

### Test 1: Successful Bulk Upload

**Steps:**
1. Login as an organization user
2. Navigate to Members Management
3. Click "Bulk Upload" button
4. Fill in the form:
   - **File**: Select your test CSV file
   - **Department**: Enter "College of Computer Studies"
   - **Academic Year**: Select an academic year
   - **Term Start Date**: Select a date
5. Click "Upload Members"

**Expected Results:**
- ✅ Success message appears
- ✅ Upload results show correct counts
- ✅ Members appear in the members list
- ✅ Modal closes automatically

**Database Verification:**
```sql
-- Check if members were created
SELECT * FROM organization_members 
WHERE department = 'College of Computer Studies' 
ORDER BY created_at DESC 
LIMIT 10;

-- Check if bulk upload record was created
SELECT * FROM organization_bulk_uploads 
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected in `organization_bulk_uploads`:**
- `file_name`: Your CSV file name (e.g., "test-members.csv")
- `department`: "College of Computer Studies"
- `total_records`: 3
- `inserted_count`: 3
- `updated_count`: 0
- `skipped_count`: 0
- `upload_status`: "completed"

---

### Test 2: Missing Department Field

**Steps:**
1. Open bulk upload modal
2. Select a CSV file
3. Fill in Academic Year and Term Start Date
4. **Leave Department field empty**
5. Click "Upload Members"

**Expected Results:**
- ❌ Error message: "Please fill all required fields and select a file"
- ❌ Upload does not proceed
- ❌ No records created in database

---

### Test 3: Partial Upload (Some Invalid Rows)

**Steps:**
1. Create a CSV with some invalid rows:
   ```csv
   sr_code,student_name,position,gender,program,section,year_level,email
   21-12345,Juan Dela Cruz,Member,Male,BSIT,IT-3A,3rd Year,juan@example.com
   ,Missing SR Code,Member,Male,BSIT,IT-3A,3rd Year,invalid@example.com
   21-12347,Pedro Reyes,Member,Male,BSIT,IT-1C,1st Year,pedro@example.com
   ```
2. Upload the file with department filled

**Expected Results:**
- ⚠️ Upload completes with warnings
- ✅ Valid rows are processed
- ❌ Invalid rows are skipped
- ✅ Upload results show:
  - Total: 3
  - Inserted: 2
  - Skipped: 1
  - Errors: 1 (with details)

**Database Verification:**
```sql
SELECT * FROM organization_bulk_uploads 
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected:**
- `upload_status`: "partial"
- `inserted_count`: 2
- `skipped_count`: 1

---

### Test 4: Duplicate Upload (Update Existing)

**Steps:**
1. Upload the same CSV file twice with the same department
2. Use the same academic year and term

**Expected Results:**
- ✅ First upload: All records inserted
- ✅ Second upload: All records updated
- ✅ Upload results show:
  - Inserted: 0
  - Updated: 3 (or number of records)

**Database Verification:**
```sql
-- Should have 2 bulk upload records
SELECT file_name, inserted_count, updated_count, created_at 
FROM organization_bulk_uploads 
ORDER BY created_at DESC 
LIMIT 2;
```

---

### Test 5: View Bulk Upload History

**Steps:**
1. Perform multiple uploads (at least 3)
2. Call the history API endpoint:
   ```bash
   curl -X GET "http://localhost:3000/api/organization/members/bulk-upload/history?page=1&limit=10" \
   -H "Authorization: Bearer YOUR_TOKEN"
   ```

**Expected Results:**
- ✅ Returns list of uploads
- ✅ Each record shows:
  - File name
  - Department
  - Statistics
  - Academic year info
  - Uploader info
  - Timestamp
- ✅ Pagination works correctly

**Example Response:**
```json
{
  "uploads": [
    {
      "upload_id": 3,
      "file_name": "members-batch-3.csv",
      "department": "College of Computer Studies",
      "total_records": 50,
      "inserted_count": 48,
      "updated_count": 2,
      "skipped_count": 0,
      "upload_status": "completed",
      "created_at": "2024-05-15T14:30:00Z",
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
  "totalItems": 3
}
```

---

### Test 6: Different Departments

**Steps:**
1. Upload CSV with department "College of Computer Studies"
2. Upload another CSV with department "College of Engineering"
3. Check database

**Expected Results:**
- ✅ Members have correct department assigned
- ✅ Two separate bulk upload records created
- ✅ Each record has correct department

**Database Verification:**
```sql
-- Check members by department
SELECT department, COUNT(*) as count 
FROM organization_members 
GROUP BY department;

-- Check bulk uploads by department
SELECT department, file_name, total_records 
FROM organization_bulk_uploads 
ORDER BY created_at DESC;
```

---

### Test 7: Large File Upload

**Steps:**
1. Create a CSV with 100+ records
2. Upload with department filled

**Expected Results:**
- ✅ All records processed
- ✅ Upload completes successfully
- ✅ Correct statistics in bulk upload record
- ✅ No timeout errors

---

### Test 8: Invalid File Format

**Steps:**
1. Try to upload a non-CSV file (e.g., .txt, .pdf)
2. Or upload a CSV with wrong columns

**Expected Results:**
- ❌ Error message appears
- ❌ No records created
- ❌ No bulk upload record created

---

## Verification Checklist

After all tests, verify:

- [ ] All valid members are in `organization_members` table
- [ ] All uploads are tracked in `organization_bulk_uploads` table
- [ ] No individual names are stored in `organization_bulk_uploads`
- [ ] Department field is populated for all members
- [ ] Upload statistics are accurate
- [ ] Upload status is correct (completed/partial/failed)
- [ ] Timestamps are correct
- [ ] Foreign key relationships work
- [ ] Pagination works for history endpoint

## SQL Queries for Verification

```sql
-- Count total bulk uploads
SELECT COUNT(*) as total_uploads 
FROM organization_bulk_uploads;

-- View all bulk uploads with details
SELECT 
  upload_id,
  file_name,
  department,
  total_records,
  inserted_count,
  updated_count,
  skipped_count,
  upload_status,
  created_at
FROM organization_bulk_uploads
ORDER BY created_at DESC;

-- Count members by department
SELECT 
  department,
  COUNT(*) as member_count
FROM organization_members
GROUP BY department;

-- View recent uploads with organization info
SELECT 
  bu.file_name,
  bu.department,
  bu.total_records,
  bu.upload_status,
  o.organization_name,
  u.username as uploaded_by,
  bu.created_at
FROM organization_bulk_uploads bu
JOIN organizations o ON bu.organization_id = o.organization_id
JOIN users u ON bu.uploaded_by = u.user_id
ORDER BY bu.created_at DESC
LIMIT 10;

-- Check for any uploads without department (should be none)
SELECT * FROM organization_bulk_uploads 
WHERE department IS NULL OR department = '';
```

## Common Issues & Solutions

### Issue 1: Migration Fails
**Solution:** Check if table already exists, drop it first if needed:
```sql
DROP TABLE IF EXISTS organization_bulk_uploads;
```
Then run migration again.

### Issue 2: Foreign Key Constraint Error
**Solution:** Ensure referenced tables exist:
- `organizations`
- `academic_years`
- `users`

### Issue 3: Department Field Not Showing
**Solution:** 
- Clear browser cache
- Restart frontend dev server
- Check browser console for errors

### Issue 4: Upload Record Not Created
**Solution:**
- Check backend logs for errors
- Verify model is properly loaded in `models/index.js`
- Ensure relationships are defined correctly

## Performance Testing

For large uploads (1000+ records):

```bash
# Monitor backend logs
tail -f backend/logs/app.log

# Check database performance
SHOW PROCESSLIST;

# Check table sizes
SELECT 
  table_name,
  table_rows,
  data_length,
  index_length
FROM information_schema.tables
WHERE table_schema = 'your_database'
AND table_name IN ('organization_members', 'organization_bulk_uploads');
```

## Success Criteria

✅ All test cases pass
✅ No errors in backend logs
✅ Database records are correct
✅ UI is responsive and user-friendly
✅ Department field is required and validated
✅ Only file names are stored (not individual names)
✅ Upload history is accessible and accurate
