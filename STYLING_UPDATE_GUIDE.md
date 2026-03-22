# Styling Update Guide

## Overview

This document outlines the comprehensive styling changes needed across the entire frontend application.

## Changes Required

### 1. Sidebar Active State Colors

**Change**: All sidebar active states from blue to green across all user types

**Pattern to Replace**:

- `[class.bg-blue-50]` → `[class.bg-green-50]`
- `[class.text-blue-600]` → `[class.text-green-600]`
- `hover:bg-blue-50` → `hover:bg-green-50`
- `hover:text-blue-600` → `hover:text-green-600`
- `hover:border-blue-300` → `hover:border-green-300`
- `border-blue-500` → `border-green-500`

**Files to Update**:

- `client/src/app/features/dashboards/dean/dean.ts` ✅ (COMPLETED)
- `client/src/app/features/dashboards/faculty/faculty.ts`
- `client/src/app/features/dashboards/superadmin/superadmin.ts`
- `client/src/app/features/dashboards/organization/organization.ts`
- Any other dashboard components with sidebars

### 2. Focus Ring Colors

**Change**: All focus rings from blue to green

**Pattern to Replace**:

- `focus:ring-blue-500` → `focus:ring-green-500`
- `focus:ring-blue-600` → `focus:ring-green-600`

**Files to Update**:

- All form inputs across the application
- All interactive elements with focus states

### 3. Loading Spinners

**Change**: All loading spinner colors from blue to green

**Pattern to Replace**:

- `border-blue-600` → `border-green-600`

**Files to Update**:

- All components with loading states

### 4. Section Borders

**Change**: Add consistent border styling to all content sections

**Pattern to Apply**:

```html
class="p-4 border border-gray-200 border-dashed rounded-lg bg-white"
```

**Replace**:

- `class="bg-white rounded-lg shadow-sm p-6"` → `class="p-4 border border-gray-200 border-dashed rounded-lg bg-white"`
- `class="bg-white rounded-xl p-6 shadow-lg"` → `class="p-4 border border-gray-200 border-dashed rounded-lg bg-white"`

**Files to Update**:

- All dashboard components
- All form containers
- All card/section containers
- Statistics cards
- Filter sections
- Content panels

### 5. Primary Action Colors

**Change**: Primary buttons and actions from blue to green

**Pattern to Replace**:

- `bg-blue-500` → `bg-green-500`
- `bg-blue-600` → `bg-green-600`
- `text-blue-600` → `text-green-600`
- `from-blue-500 to-blue-600` → `from-green-500 to-green-600`

**Note**: Keep semantic colors (red for delete/danger, yellow for warning, etc.)

### 6. Progress Bars and Indicators

**Change**: Progress bars from blue to green

**Pattern to Replace**:

- `bg-blue-500` (in progress bars) → `bg-green-500`
- `bg-blue-600` (in progress bars) → `bg-green-600`

## Implementation Priority

### Phase 1: Critical UI Elements (COMPLETED for Dean)

- ✅ Dean dashboard sidebar
- ✅ Dean dashboard tabs
- ✅ Dean dashboard dropdowns
- ✅ Dean dashboard focus rings
- ✅ Dean dashboard loading spinners

### Phase 2: Other Dashboards

- Faculty dashboard
- Superadmin dashboard
- Organization dashboard

### Phase 3: Component Pages

- Faculty management pages
- Organization management pages
- Requirements monitoring pages
- Credentials pages
- Announcements pages
- PDS form

### Phase 4: Section Borders

- Add `p-4 border border-gray-200 border-dashed rounded-lg` to all content sections
- Replace shadow-based cards with bordered sections
- Ensure consistent spacing

## Search and Replace Commands

For bulk updates, use these regex patterns:

### Sidebar Colors

```regex
Find: \[class\.bg-blue-50\]
Replace: [class.bg-green-50]

Find: \[class\.text-blue-600\]
Replace: [class.text-green-600]

Find: hover:bg-blue-50
Replace: hover:bg-green-50

Find: hover:text-blue-600
Replace: hover:text-green-600
```

### Focus Rings

```regex
Find: focus:ring-blue-([0-9]+)
Replace: focus:ring-green-$1
```

### Loading Spinners

```regex
Find: border-blue-600 border-r-transparent
Replace: border-green-600 border-r-transparent
```

## Testing Checklist

After applying changes:

- [ ] Verify all sidebars show green active states
- [ ] Check all form inputs have green focus rings
- [ ] Confirm loading spinners are green
- [ ] Validate all sections have dashed borders
- [ ] Test hover states on interactive elements
- [ ] Ensure no blue colors remain (except semantic uses)
- [ ] Check responsive behavior
- [ ] Verify accessibility (contrast ratios)

## Notes

- Keep semantic colors unchanged (red for errors, yellow for warnings, etc.)
- Maintain existing spacing and layout
- Preserve all functionality
- Test on all user types (dean, faculty, superadmin, organization)
- Ensure consistent styling across all pages

## Status

- Dean Dashboard: ✅ Sidebar and tabs updated to green
- Faculty Dashboard: ⏳ Pending
- Superadmin Dashboard: ⏳ Pending
- Organization Dashboard: ⏳ Pending
- Section Borders: ⏳ Pending (needs to be applied across all components)
