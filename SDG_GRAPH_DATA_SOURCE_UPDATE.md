# SDG Graph Data Source Update

## Problem
The SDG pie chart on the organization dashboard was getting data from the **Events** system (organization_events table), but the Events functionality has been removed. SDG data is now collected through the **Report Submission** form and stored in the organization_documents table.

## Solution
Updated the SDG graph to get data from report submissions instead of events.

---

## Changes Made

### 1. Backend Controller
**File:** `backend/controllers/organization-document.controller.js`

Added new method `getReportsBySDGPerYear()`:
- Queries `organization_documents` table for documents with SDGs
- Parses the `sdgs` JSON column (array of SDG IDs)
- Groups by year (from academic year, activity date, or submission date)
- Counts reports per SDG per year
- Returns data in same format as old events endpoint for compatibility

### 2. Backend Route
**File:** `backend/routes/organization.routes.js`

Added new route:
```javascript
GET /api/organization/analytics/sdg-per-year
```

### 3. Frontend Service
**File:** `client/src/app/services/event-analytics.service.ts`

Added new method:
```typescript
getReportsBySDGPerYear(): Observable<SDGEventData[]>
```
Calls: `/api/organization/analytics/sdg-per-year`

### 4. Frontend Dashboard
**File:** `client/src/app/features/dashboards/organization/organization.ts`

Updated `loadSDGEventData()` method:
- Changed from `getEventsBySDGPerYear()` to `getReportsBySDGPerYear()`
- Now loads SDG data from report submissions

---

## Data Flow (NEW)

```
Organization Dashboard
    ↓
loadSDGEventData()
    ↓
EventAnalyticsService.getReportsBySDGPerYear()
    ↓
GET /api/organization/analytics/sdg-per-year
    ↓
organization-document.controller.getReportsBySDGPerYear()
    ↓
Query organization_documents table
    ↓
Parse sdgs JSON column
    ↓
Group by year and SDG number
    ↓
Return aggregated data
    ↓
Display in SDG pie chart
```

---

## Data Flow (OLD - Removed)

```
Organization Dashboard
    ↓
loadSDGEventData()
    ↓
EventAnalyticsService.getEventsBySDGPerYear()
    ↓
GET /api/organization/events/analytics/sdg-per-year
    ↓
organization-event-analytics.controller.getEventsBySDGPerYear()
    ↓
Query organization_events + organization_event_sdgs tables
    ↓
Return aggregated data
```

---

## Testing

To verify the changes work:

1. **Submit a report with SDGs:**
   - Go to Documents → Submit Report
   - Fill in Title of Activity, Date, Venue, Participants
   - Select Academic Year and Semester
   - **Check at least 1 SDG checkbox** (e.g., SDG 4, SDG 5)
   - Upload a document
   - Submit

2. **Check the dashboard:**
   - Go to Dashboard
   - Look at the "Reports per SDG per Year" pie chart
   - It should show the SDGs you selected in the report

3. **Verify in browser console:**
   - Open Developer Tools (F12)
   - Go to Network tab
   - Refresh the dashboard
   - Look for request to `/api/organization/analytics/sdg-per-year`
   - Check the response data

---

## Database Schema

The SDG data is stored in the `organization_documents` table:

```sql
sdgs JSON NULL  -- Array of SDG IDs, e.g., [4, 5, 6]
```

Example data:
```json
{
  "document_id": 1,
  "document_title": "Community Outreach Program",
  "activity_date": "2026-05-15",
  "sdgs": [1, 4, 10],
  "academic_year_id": 2,
  "submitted_date": "2026-05-19"
}
```

---

## Notes

- The chart component (`app-sdg-events-chart`) still uses the name "events" but now displays report data
- The data format remains the same: `{ year, sdg_number, event_count }`
- The `event_count` field name is kept for compatibility with the chart component
- Year is determined by: Academic Year > Activity Date > Submission Date (in that priority)
