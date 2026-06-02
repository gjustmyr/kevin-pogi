# Withholding to For Review Rename

## Summary
Replaced all user-facing instances of "Withholding" with "For Review" in the dean and faculty portals. The internal status value `'withholding'` remains unchanged to maintain database and API compatibility.

## Files Modified

### 1. Dean Dashboard
**File:** `client/src/app/features/dashboards/dean/dean.html`
- Changed comment from `<!-- Withholding Faculties -->` to `<!-- For Review Faculties -->`
- Changed statistics label from "Withholding" to "For Review"

### 2. Dean Requirements Monitoring
**File:** `client/src/app/features/dean/requirements-monitoring/requirements-monitoring.ts`
- Changed `getClearanceStatusText()` method to return "FOR REVIEW" instead of "WITHHOLDING"
- Changed `setFacultyClearanceStatus()` method to display "For Review" instead of "Withholding" in confirmation dialog

**File:** `client/src/app/features/dean/requirements-monitoring/requirements-monitoring.html`
- Changed button text from "Set as Withholding" to "Set as For Review"

### 3. Faculty Dashboard
**File:** `client/src/app/features/dashboards/faculty/faculty.ts`
- Changed clearance status display from "Withholding" to "For Review" (2 occurrences)
  - Period-specific clearance status card
  - Overall clearance status card

## Technical Notes

### What Changed
- **User-facing text only**: All visible labels, buttons, and status displays
- **Display text**: "Withholding" → "For Review"
- **Status labels**: "WITHHOLDING" → "FOR REVIEW"

### What Stayed the Same
- **Internal status value**: `'withholding'` (unchanged in code logic)
- **Database enum**: Still uses `'withholding'`
- **API responses**: Still return `'withholding'`
- **TypeScript interfaces**: Still use `'withholding'` type
- **Conditional logic**: All `=== 'withholding'` checks remain unchanged

This approach ensures:
1. ✅ Better user experience with clearer terminology
2. ✅ No database migration required
3. ✅ No API changes needed
4. ✅ Backward compatibility maintained
5. ✅ No breaking changes to existing logic

## Testing Checklist
- ✅ Dean dashboard shows "For Review" count instead of "Withholding"
- ✅ Dean requirements monitoring button shows "Set as For Review"
- ✅ Dean requirements monitoring status badge shows "FOR REVIEW"
- ✅ Faculty dashboard clearance status shows "For Review" instead of "Withholding"
- ✅ All functionality works correctly (status setting, filtering, etc.)
