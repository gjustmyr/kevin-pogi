# Accomplishments to Portfolio Rename

## Summary
Replaced all instances of "Accomplishments" with "Portfolio" in the dean and faculty portal navigation and UI elements.

## Files Modified

### 1. Dean Portal Navigation
- **client/src/app/features/dashboards/dean/dean.html**
  - Changed sidebar menu item from "Accomplishments" to "Portfolio"
  - Comment updated from `<!-- Accomplishments -->` to `<!-- Portfolio -->`

- **client/src/app/components/dean-sidebar/dean-sidebar.html**
  - Changed sidebar menu item from "Accomplishments" to "Portfolio"
  - Comment updated from `<!-- Accomplishments -->` to `<!-- Portfolio -->`

### 2. Faculty Portal Navigation
- **client/src/app/shared/components/layout.component.ts**
  - Changed navigation link text from "Accomplishments" to "Portfolio"

### 3. Faculty Requirements Page
- **client/src/app/features/faculty/requirements/requirements.html**
  - Changed button text from "Submit Accomplishments" to "Submit Portfolio"

### 4. Dean Requirements Monitoring
- **client/src/app/features/dean/requirements-monitoring/requirements-monitoring.html**
  - Changed placeholder text from "view their accomplishments" to "view their portfolio"

## Technical Notes
- The internal route/tab identifier `'accomplishments'` was kept unchanged to avoid breaking routing logic
- Only user-facing text labels were changed
- All navigation functionality remains the same

## Testing Checklist
- ✅ Dean portal sidebar shows "Portfolio" instead of "Accomplishments"
- ✅ Faculty portal sidebar shows "Portfolio" instead of "Accomplishments"
- ✅ Faculty requirements page button shows "Submit Portfolio"
- ✅ Dean requirements monitoring shows "portfolio" in placeholder text
- ✅ Navigation still works correctly when clicking the renamed menu items
