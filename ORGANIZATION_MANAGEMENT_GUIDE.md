# Organization Management System

## Overview

This system allows organizations to manage their members, hierarchy, advisers, and submit required documents every semester.

## Features

### 1. Organization Structure & Hierarchy

**Hierarchical Structure:**

- President (top level)
- Vice President (reports to President)
- Officers (report to Vice President):
  - Secretary
  - Treasurer
  - Auditor
  - Two P.R.O. (Public Relations Officers)
  - Business Manager
  - Multimedia Director
  - COMDRRM Head

**Sub-units:**

- Multimedia Members (under Multimedia Director)
- COMDRRM Members (2 members under COMDRRM Head)
- Year Representatives (1st to 3rd Year, under the two P.R.O.s)

### 2. Advisers

- Each organization has **two advisers** assigned from the department faculty
- Advisers are assigned by the Dean
- Advisers are peers within the organization structure

### 3. Member Management

**Features:**

- Organizations can add, edit, and remove members
- Each member has:
  - SR Code (Student Reference Code)
  - Name (First, Middle, Last)
  - Email and Contact Number
  - Year Level (1st to 5th Year)
  - Position
  - Term dates (start and end)
  - Academic Year/Term assignment

**Auto-populate Feature:**

- When adding a member, if you enter an SR Code or name of someone who was previously a member, the system automatically fills in their details
- This prevents re-entering information for students who:
  - Are re-elected to the same position
  - Are reassigned to a different position
  - Return after a term absence

**Hierarchy View:**

- View organization structure as a tree
- See reporting relationships
- Track active and inactive members

### 4. Document Submission

Organizations must submit these documents **every semester**:

1. Application for committee heads and members
2. Application for year representatives
3. Recognition documents
4. Membership fee documentation
5. Event proposals (as needed)
6. Acknowledgment or accomplishment reports (as needed)

**Document Workflow:**

1. Organization submits document
2. Status: Pending
3. Dean reviews document
4. Dean can: Approve, Reject, or Request Revision
5. Dean can add review comments

**Submission Checklist:**

- Organizations can view which required documents have been submitted for the current semester
- See submission status for each document type

## Database Schema

### Tables Created:

1. **organization_advisers**
   - Stores faculty advisers for organizations (max 2 active per organization)
2. **organization_members**
   - Stores student members with their positions and hierarchy
   - Tracks term dates and academic year
   - Self-referential for hierarchy (parent_member_id)

3. **document_types**
   - Defines types of documents organizations must submit
   - Indicates if required per semester

4. **organization_documents**
   - Stores submitted documents
   - Tracks review status and dean feedback

5. **organization_position_templates**
   - Defines valid positions and their hierarchy levels
   - Sets maximum allowed per position

## API Endpoints

### Organization Routes (`/api/organization/dashboard`)

**Member Management:**

- `GET /members` - List all members with pagination and filters
- `GET /members/search-history` - Search for previous member by SR Code or name
- `GET /members/hierarchy` - Get organization hierarchy tree
- `POST /members` - Add new member
- `PUT /members/:id` - Update member details
- `DELETE /members/:id` - Remove member

**Position Management:**

- `GET /positions` - Get list of valid positions

**Document Management:**

- `GET /documents` - List submitted documents
- `GET /documents/types` - Get available document types
- `GET /documents/checklist` - Get submission checklist for semester
- `POST /documents` - Submit new document (with file upload)
- `PUT /documents/:id` - Update/resubmit document
- `DELETE /documents/:id` - Delete document
- `GET /documents/:id/download` - Download document

**Adviser Management:**

- `GET /advisers` - View assigned advisers

### Dean Routes (`/api/dean/organization-management`)

**Adviser Management:**

- `GET /:organizationId/advisers` - View organization's advisers
- `POST /:organizationId/advisers` - Assign adviser to organization
- `DELETE /advisers/:id` - Remove adviser

**Document Review:**

- `GET /documents` - List all organization documents in department
- `PUT /documents/:id/review` - Review document (approve/reject/request revision)
- `GET /documents/:id/download` - Download document for review

## Usage Guide

### For Organizations:

**Adding Members:**

1. Navigate to Members section
2. Click "Add Member"
3. Enter SR Code - system will auto-populate if student was previously a member
4. If not auto-populated, enter all details manually
5. Select position from dropdown
6. Assign supervisor if applicable (for hierarchy)
7. Select current academic year/term
8. Set term start date (end date optional)

**Submitting Documents:**

1. Navigate to Documents section
2. View submission checklist to see what's required
3. Click "Submit Document"
4. Select document type
5. Select academic year and semester
6. Enter document title
7. Upload file (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG - max 10MB)
8. Submit and wait for dean review

### For Deans:

**Assigning Advisers:**

1. Navigate to Organizations section
2. Select an organization
3. View Advisers tab
4. Click "Assign Adviser"
5. Select faculty member from department
6. Maximum 2 active advisers per organization

**Reviewing Documents:**

1. Navigate to Organization Documents section
2. View pending submissions
3. Download document to review
4. Click "Review"
5. Select status: Approved, Rejected, or Revision Needed
6. Add review comments
7. Submit review

## Migration Instructions

Run the migration to create all necessary tables:

```bash
mysql -u username -p database_name < backend/migrations/2026-03-17-create-organization-structure.sql
```

This creates:

- organization_advisers table
- organization_members table
- document_types table (with seeded data)
- organization_documents table
- organization_position_templates table (with seeded positions)

## File Upload Configuration

Documents are stored in: `uploads/organization-documents/`

Allowed file types:

- PDF, DOC, DOCX (documents)
- XLS, XLSX (spreadsheets)
- JPG, JPEG, PNG (images)

Maximum file size: 10MB

## Next Steps

1. **Frontend Development:**
   - Create organization dashboard component
   - Build member management UI with hierarchy view
   - Create document submission interface
   - Build dean review interface

2. **Enhancements:**
   - Email notifications for document status changes
   - Calendar integration for events
   - Batch member import from CSV
   - Document templates download
   - Analytics dashboard for deans

3. **Testing:**
   - Test member auto-populate functionality
   - Verify hierarchy relationships
   - Test document upload and review workflow
   - Validate maximum advisers constraint

## Notes

- Organizations can only manage their own members and documents
- Deans can only view/manage organizations in their department
- Member SR Codes are indexed for fast auto-populate searches
- Document review history is preserved (reviewer, date, comments)
- Inactive members are retained for historical records
- Advisers can be removed (deactivated) but records are kept
