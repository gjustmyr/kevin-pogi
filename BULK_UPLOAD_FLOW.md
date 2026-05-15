# Bulk Upload Flow Diagram

## User Interface Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Bulk Upload Modal                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📄 Select CSV/Excel File                                   │
│     [Choose File] ← members-2024.csv                        │
│                                                             │
│  🏢 Department * (NEW)                                      │
│     [College of Computer Studies____________]              │
│                                                             │
│  📅 Academic Year *                                         │
│     [2024-2025 ▼]                                          │
│                                                             │
│  📆 Term Start Date *                                       │
│     [2024-08-15]                                           │
│                                                             │
│     [Cancel]  [Upload Members]                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐
│   CSV File   │
│              │
│ SR Code      │
│ Name         │
│ Position     │
│ Program      │
│ ...          │
└──────┬───────┘
       │
       │ Upload with Department
       ▼
┌──────────────────────────────────────────────────────────┐
│              Backend Processing                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. Parse CSV file                                       │
│  2. For each row:                                        │
│     - Extract student data                               │
│     - Add department from form                           │
│     - Create/Update in organization_members              │
│  3. Track statistics (inserted/updated/skipped)          │
│  4. Create bulk upload record                            │
│                                                          │
└──────┬───────────────────────────────────┬───────────────┘
       │                                   │
       │                                   │
       ▼                                   ▼
┌──────────────────────┐      ┌──────────────────────────┐
│ organization_members │      │ organization_bulk_uploads│
├──────────────────────┤      ├──────────────────────────┤
│ ✓ Individual records │      │ ✓ File name only         │
│ ✓ Full names         │      │ ✓ Department             │
│ ✓ SR codes           │      │ ✓ Statistics             │
│ ✓ Positions          │      │ ✓ Upload status          │
│ ✓ Programs           │      │ ✗ NO individual names    │
│ ✓ Department         │      │                          │
└──────────────────────┘      └──────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│           organization_bulk_uploads (NEW TABLE)             │
├─────────────────────────────────────────────────────────────┤
│ upload_id (PK)                                              │
│ organization_id (FK) ──────────┐                            │
│ file_name                      │                            │
│ department                     │                            │
│ academic_year_id (FK) ─────┐   │                            │
│ term_start_date            │   │                            │
│ total_records              │   │                            │
│ inserted_count             │   │                            │
│ updated_count              │   │                            │
│ skipped_count              │   │                            │
│ uploaded_by (FK) ──────┐   │   │                            │
│ upload_status          │   │   │                            │
│ created_at             │   │   │                            │
│ updated_at             │   │   │                            │
└────────────────────────┼───┼───┼────────────────────────────┘
                         │   │   │
                         │   │   └──> organizations
                         │   └──────> academic_years
                         └──────────> users
```

## Example Upload Record

```json
{
  "upload_id": 1,
  "organization_id": 5,
  "file_name": "ccs-members-spring-2024.csv",
  "department": "College of Computer Studies",
  "academic_year_id": 3,
  "term_start_date": "2024-08-15",
  "total_records": 50,
  "inserted_count": 45,
  "updated_count": 3,
  "skipped_count": 2,
  "uploaded_by": 12,
  "upload_status": "completed",
  "created_at": "2024-05-15T10:30:00Z"
}
```

## Key Benefits

```
┌─────────────────────────────────────────────────────────────┐
│                         BEFORE                              │
├─────────────────────────────────────────────────────────────┤
│ ❌ No department tracking                                   │
│ ❌ No upload history                                        │
│ ❌ No audit trail                                           │
│ ❌ Hard to track bulk operations                            │
└─────────────────────────────────────────────────────────────┘

                            ⬇️

┌─────────────────────────────────────────────────────────────┐
│                         AFTER                               │
├─────────────────────────────────────────────────────────────┤
│ ✅ Department field required                                │
│ ✅ Complete upload history                                  │
│ ✅ Audit trail with statistics                              │
│ ✅ Privacy-friendly (no name duplication)                   │
│ ✅ Easy to track and manage uploads                         │
└─────────────────────────────────────────────────────────────┘
```

## Upload Status Logic

```
┌─────────────────────────────────────────────────────────────┐
│                    Upload Processing                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Process Rows  │
                    └───────┬───────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ All Success  │ │ Some Failed  │ │  All Failed  │
    └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
           │                │                │
           ▼                ▼                ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │  completed   │ │   partial    │ │    failed    │
    └──────────────┘ └──────────────┘ └──────────────┘
```

## Privacy & Compliance

```
┌─────────────────────────────────────────────────────────────┐
│              Data Storage Separation                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Individual Member Data                                     │
│  ├─ Stored in: organization_members                        │
│  ├─ Contains: Full names, SR codes, personal info          │
│  └─ Purpose: Active member management                      │
│                                                             │
│  Bulk Upload Metadata                                       │
│  ├─ Stored in: organization_bulk_uploads                   │
│  ├─ Contains: File name, department, statistics            │
│  ├─ Does NOT contain: Individual names                     │
│  └─ Purpose: Audit trail and tracking                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
