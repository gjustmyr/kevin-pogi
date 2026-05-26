# Academic Year Filter Bug Fix

## Problem
When filtering by a specific academic year (e.g., 2025-2026) and then switching back to "All Academic Years," the files from the filtered academic year were no longer visible.

## Root Cause
The filter properties (`selectedAcademicYear`, `selectedSemester`, etc.) were defined as **Angular signals** but were being used with `[(ngModel)]` in the templates. 

When you use `[(ngModel)]` with a signal, Angular tries to update the signal function itself rather than calling `.set()` on it. This breaks the two-way binding, causing the filter to malfunction when switching between values.

## Solution
Converted filter properties from signals to regular properties in all affected components. This allows `[(ngModel)]` to work correctly with two-way data binding.

## Files Modified

### Organization Portal
1. **client/src/app/features/organization/documents/organization-documents.ts**
   - Changed `selectedAcademicYear`, `selectedSemester`, `selectedDocumentType`, `selectedStatus` from signals to regular properties
   - Updated all references to these properties (removed `()` calls)

2. **client/src/app/features/organization/documents/organization-documents.html**
   - Updated checklist filter bindings to remove signal call syntax

### Faculty Portal
3. **client/src/app/features/faculty/requirements/requirements.ts**
   - Changed `selectedAcademicYear`, `selectedSemester`, `selectedStatus` from signals to regular properties
   - Updated all references to these properties

4. **client/src/app/features/faculty/requirements/requirements.html**
   - Changed from `[ngModel]` + `(ngModelChange)` with `.set()` to simple `[(ngModel)]`
   - Removed signal call syntax from all filter dropdowns

### Dean Portal
5. **client/src/app/features/dashboards/dean/dean.ts**
   - Changed `selectedAcademicYear`, `selectedSemester` from signals to regular properties
   - Updated all references to these properties

6. **client/src/app/features/dean/requirements-monitoring/requirements-monitoring.ts**
   - Changed `selectedAcademicYear`, `selectedSemester`, `selectedFacultyId` from signals to regular properties
   - Updated all references to these properties including:
     - `isSpecificPeriodSelected()` method
     - `setFacultyClearanceStatus()` call

7. **client/src/app/features/dean/member-demographics/dean-member-demographics.ts**
   - Changed `selectedOrganization`, `selectedAcademicYear`, `selectedSemester` from signals to regular properties
   - Updated all references to these properties

8. **client/src/app/features/dean/member-demographics/dean-member-demographics.html**
   - Updated template condition from `@if (!selectedOrganization())` to `@if (!selectedOrganization)`

## Technical Details

### Before (Broken)
```typescript
// TypeScript
selectedAcademicYear = signal<number | undefined>(undefined);

// HTML
<select [(ngModel)]="selectedAcademicYear">
  <option [ngValue]="undefined">All Years</option>
</select>

// Usage in methods
if (this.selectedAcademicYear() !== 0) { ... }

// This breaks because:
// 1. ngModel tries to assign to the signal function
// 2. Calling selectedAcademicYear() after ngModel breaks it
```

### After (Fixed)
```typescript
// TypeScript
selectedAcademicYear: number | undefined = undefined;

// HTML
<select [(ngModel)]="selectedAcademicYear">
  <option [ngValue]="undefined">All Years</option>
</select>

// Usage in methods
if (this.selectedAcademicYear !== 0) { ... }

// This works because:
// 1. ngModel can properly assign to a regular property
// 2. Direct property access works consistently
```

## Compilation Errors Fixed
- TS2349: This expression is not callable (Type 'Number' has no call signatures)
- TS2349: This expression is not callable (Type 'String' has no call signatures)
- TS2532: Object is possibly 'undefined'
- TS2722: Cannot invoke an object which is possibly 'undefined'

## Testing
After these changes:
1. Select a specific academic year → documents/requirements should filter correctly ✅
2. Switch back to "All Academic Years" → all documents/requirements should be visible again ✅
3. The filter should work consistently in all three portals (Dean, Faculty, Organization) ✅
4. Application should compile without TypeScript errors ✅

## Note
Properties that are only used for display (not with ngModel) can remain as signals. Only properties used with two-way binding need to be regular properties.
