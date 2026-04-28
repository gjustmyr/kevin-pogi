# Organization Events Frontend - Remaining Tasks

## Status

✅ Backend Complete (API, Models, Controllers, Routes)
✅ Service Created (`organization-event.service.ts`)
✅ Component TypeScript Created (`organization-events.ts`)
⏳ Component HTML Needed
⏳ Dashboard Integration Needed

## Files to Create/Update

### 1. Create HTML Template

**File:** `client/src/app/features/organization/events/organization-events.html`

**Required Sections:**

- Events table with columns:
  - Title
  - Date
  - Time (start_time - end_time)
  - Status (badge with color)
  - SDGs (count or list)
  - Attendees (count with button)
  - Actions (Edit, Delete, View Attendees)
- Add Event button
- Event Modal with tabs:
  - Basic Info (title, date, time, status, description)
  - SDGs (checkboxes for SDG 1-17)
  - Guests (add/remove guest list)
- Attendees Modal:
  - Upload CSV section
  - Download Template button
  - Attendees table (sr_code, name, year, section, program, department)
  - Delete attendee button per row

### 2. Update Organization Dashboard

**File:** `client/src/app/features/dashboards/organization/organization.ts`

Add to imports:

```typescript
import { OrganizationEventsComponent } from "../../organization/events/organization-events";
```

Add to component imports array:

```typescript
imports: [..., OrganizationEventsComponent]
```

**File:** `client/src/app/features/dashboards/organization/organization.html`

Add Events tab button in sidebar (after Documents, before Advisers):

```html
<!-- Events -->
<li>
  <button
    (click)="selectTab('events')"
    [class.bg-green-50]="activeTab() === 'events'"
    [class.text-green-600]="activeTab() === 'events'"
    class="flex items-center w-full px-2 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 group"
  >
    <svg
      class="shrink-0 w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <span class="flex-1 ms-3 whitespace-nowrap text-left">Events</span>
  </button>
</li>
```

Add Events content section (after documents, before advisers):

```html
} @else if (activeTab() === 'events') { <app-organization-events />
```

### 3. Install Backend Package

```bash
cd backend
npm install csv-parser
```

### 4. Run Database Migration

```bash
cd backend
node run-migration.js 2026-04-28-create-organization-events.sql
```

## HTML Template Structure Example

```html
<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <h3 class="text-lg font-semibold text-gray-900">Organization Events</h3>
    <button
      (click)="openEventModal()"
      class="px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      Add Event
    </button>
  </div>

  <!-- Events Table -->
  <table class="w-full">
    <thead>
      <tr>
        <th>Title</th>
        <th>Date</th>
        <th>Time</th>
        <th>Status</th>
        <th>SDGs</th>
        <th>Attendees</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      @for (event of events(); track event.id) {
      <tr>
        <td>{{ event.title }}</td>
        <td>{{ event.date_implemented }}</td>
        <td>{{ event.start_time }} - {{ event.end_time }}</td>
        <td>
          <span [class]="getStatusColor(event.status)">{{ event.status }}</span>
        </td>
        <td>{{ event.sdgs?.length || 0 }} SDGs</td>
        <td>
          <button (click)="openAttendeesModal(event)">
            {{ event.attendee_count || 0 }} students
          </button>
        </td>
        <td>
          <button (click)="openEventModal(event)">Edit</button>
          <button (click)="deleteEvent(event.id!)">Delete</button>
        </td>
      </tr>
      }
    </tbody>
  </table>
</div>

<!-- Event Modal -->
@if (showEventModal()) {
<div class="modal">
  <!-- Form fields for event -->
</div>
}

<!-- Attendees Modal -->
@if (showAttendeesModal()) {
<div class="modal">
  <!-- CSV upload and attendees table -->
</div>
}
```

## SDG Names Reference

1. No Poverty
2. Zero Hunger
3. Good Health and Well-being
4. Quality Education
5. Gender Equality
6. Clean Water and Sanitation
7. Affordable and Clean Energy
8. Decent Work and Economic Growth
9. Industry, Innovation and Infrastructure
10. Reduced Inequalities
11. Sustainable Cities and Communities
12. Responsible Consumption and Production
13. Climate Action
14. Life Below Water
15. Life on Land
16. Peace, Justice and Strong Institutions
17. Partnerships for the Goals

## Testing Checklist

- [ ] Can create event with SDGs and guests
- [ ] Can edit event
- [ ] Can delete event
- [ ] Can upload CSV with attendees
- [ ] Can download CSV template
- [ ] Can view attendees list
- [ ] Can delete individual attendee
- [ ] Attendee count updates correctly
- [ ] Duplicate attendees are skipped
- [ ] CSV validation works
