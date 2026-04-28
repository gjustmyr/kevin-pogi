# Organization Events Feature Implementation

## Overview

This feature allows organizations to manage events with student attendance tracking via CSV upload.

## Backend Implementation ✅

### Database Tables Created

1. `organization_events` - Main events table
2. `organization_event_sdgs` - SDG alignments (1-to-many)
3. `organization_event_guests` - Event guests (optional, 1-to-many)
4. `organization_event_attendees` - Student attendance records

### Files Created

- `backend/migrations/2026-04-28-create-organization-events.sql`
- `backend/models/organization-event.model.js`
- `backend/models/organization-event-sdg.model.js`
- `backend/models/organization-event-guest.model.js`
- `backend/models/organization-event-attendee.model.js`
- `backend/controllers/organization-event.controller.js`
- `backend/routes/organization-event.routes.js`

### API Endpoints

- `GET /api/organization/events` - List all events with attendee count
- `GET /api/organization/events/:id` - Get event details
- `POST /api/organization/events` - Create new event
- `PUT /api/organization/events/:id` - Update event
- `DELETE /api/organization/events/:id` - Delete event
- `GET /api/organization/events/:id/attendees` - Get attendees list
- `POST /api/organization/events/:id/attendees/upload` - Upload CSV
- `GET /api/organization/events/template/download` - Download CSV template
- `DELETE /api/organization/events/:id/attendees/:attendeeId` - Delete attendee

### Event Fields

- Title
- Date Implemented
- Status (Planned, Ongoing, Completed, Cancelled)
- Start Time & End Time (e.g., 7:00 AM - 5:00 PM)
- Description
- SDGs (1-to-many, SDG 1-17)
- Guests (optional, 1-to-many with name, title, affiliation)
- Attendee Count (calculated)

### CSV Upload Format

```csv
sr_code,student_name,year_level,section,program,department
21-12345,Juan Dela Cruz,3rd Year,BSIT-3A,BS Information Technology,CICS
```

## Required Package Installation

```bash
cd backend
npm install csv-parser
```

## Database Migration

Run when database server is available:

```bash
cd backend
node run-migration.js 2026-04-28-create-organization-events.sql
```

## Frontend Implementation (TODO)

### Files to Create

1. `client/src/app/features/organization/events/events.component.ts`
2. `client/src/app/features/organization/events/events.component.html`
3. `client/src/app/features/organization/events/events.component.css`
4. `client/src/app/services/organization-event.service.ts`

### Features Needed

- Events table with CRUD operations
- Event form with:
  - Basic info (title, date, time, status, description)
  - SDG multi-select (checkboxes for SDG 1-17)
  - Guest list management (add/remove guests)
  - Attendee count display
- Attendee management modal:
  - Upload CSV button
  - Download template button
  - Attendees table with delete option
- Add "Events" tab to organization dashboard navigation

### Integration Points

- Add route in `client/src/app/app.routes.ts`
- Add navigation link in organization layout
- Create service for API calls

## Notes

- CSV upload handles duplicates (skips existing sr_code for same event)
- All operations are scoped to the logged-in organization
- Attendee count is calculated dynamically
- Foreign key constraints ensure data integrity
