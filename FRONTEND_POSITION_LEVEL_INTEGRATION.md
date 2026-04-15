# Frontend Position Level Integration Guide

## Completed Changes

### 1. Dropdown Service ✅

**File**: `client/src/app/services/dropdown.service.ts`

Added:

```typescript
export interface DropdownPositionLevel {
  value: string;
  label: string;
}

getPositionLevels(): Observable<DropdownPositionLevel[]> {
  return this.http.get<DropdownPositionLevel[]>(`${this.apiUrl}/position-levels`);
}
```

### 2. Dean Faculty Service ✅

**File**: `client/src/app/services/dean-faculty.service.ts`

Updated interfaces to include `position_level?:string`:

- `Faculty` interface
- `CreateFacultyData` interface
- `UpdateFacultyData` interface

### 3. Superadmin Dean Service ✅

**File**: `client/src/app/services/superadmin-dean.service.ts`

Updated interfaces to include `position_level?: string`:

- `Dean` interface
- `CreateDeanData` interface
- `UpdateDeanData` interface

### 4. Dean Faculty Management Component ✅

**File**: `client/src/app/features/dean/faculty-management/faculty-management.ts`

Changes made:

- Imported `DropdownPositionLevel` from dropdown service
- Added `positionLevels = signal<DropdownPositionLevel[]>([]);`
- Added `loadPositionLevels()` method in `ngOnInit()`
- Updated `createForm` to include `position_level: ''`
- Updated `editForm` to include `position_level: ''`
- Updated `openCreateModal()` to reset position_level
- Updated `openEditModal()` to load faculty's position_level
- Updated `submitEditForm()` to include position_level in update data

**File**: `client/src/app/features/dean/faculty-management/faculty-management.html`

Added position level dropdown in both Create and Edit modals:

```html
<div class="mb-4">
  <label class="block text-sm font-medium text-gray-700 mb-2"
    >Position Level (Optional)</label
  >
  <select
    [(ngModel)]="createForm.position_level"
    name="position_level"
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
  >
    <option value="">Select Position Level</option>
    @for (level of positionLevels(); track level.value) {
    <option [value]="level.value">{{ level.label }}</option>
    }
  </select>
</div>
```

## Remaining Changes Needed

### 5. Superadmin Dean Management Component

**File**: `client/src/app/features/superadmin/dean-management/dean-management.ts`

Add the following changes (same pattern as faculty management):

1. Import `DropdownPositionLevel`:

```typescript
import {
  DropdownService,
  DropdownDepartment,
  DropdownPositionLevel,
} from "../../../services/dropdown.service";
```

2. Add signal for position levels:

```typescript
positionLevels = signal<DropdownPositionLevel[]>([]);
```

3. Load position levels in `ngOnInit()`:

```typescript
ngOnInit() {
  this.loadDeans();
  this.loadDepartments();
  this.loadPositionLevels(); // ADD THIS
}

loadPositionLevels() {
  this.dropdownService.getPositionLevels().subscribe({
    next: (levels) => this.positionLevels.set(levels),
    error: (error) => console.error('Error loading position levels:', error),
  });
}
```

4. Update `createForm` to include position_level:

```typescript
createForm: CreateDeanData = {
  employee_id: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  contact_number: "",
  department: "",
  position_level: "", // ADD THIS
};
```

5. Update `editForm` to include position_level:

```typescript
editForm = {
  dean_id: 0,
  employee_id: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  contact_number: "",
  department: "",
  position_level: "", // ADD THIS
};
```

6. Update `openCreateModal()`:

```typescript
openCreateModal() {
  this.createForm = {
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    department: '',
    position_level: '', // ADD THIS
  };
  this.showCreateModal.set(true);
}
```

7. Update `openEditModal()`:

```typescript
openEditModal(dean: Dean) {
  this.editForm = {
    dean_id: dean.dean_id,
    employee_id: dean.employee_id,
    first_name: dean.first_name,
    middle_name: dean.middle_name || '',
    last_name: dean.last_name,
    email: dean.email,
    contact_number: dean.contact_number || '',
    department: dean.department,
    position_level: dean.position_level || '', // ADD THIS
  };
  this.showEditModal.set(true);
}
```

8. Update `submitEditForm()` to include position_level in update data:

```typescript
this.deanService.updateDean(this.editForm.dean_id, {
  employee_id: this.editForm.employee_id,
  first_name: this.editForm.first_name,
  middle_name: this.editForm.middle_name,
  last_name: this.editForm.last_name,
  email: this.editForm.email,
  contact_number: this.editForm.contact_number,
  department: this.editForm.department,
  position_level: this.editForm.position_level, // ADD THIS
});
```

**File**: `client/src/app/features/superadmin/dean-management/dean-management.html`

Add position level dropdown in both Create and Edit modals (after contact_number field):

```html
<div class="mb-4">
  <label class="block text-sm font-medium text-gray-700 mb-2"
    >Position Level (Optional)</label
  >
  <select
    [(ngModel)]="createForm.position_level"
    name="position_level"
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
  >
    <option value="">Select Position Level</option>
    @for (level of positionLevels(); track level.value) {
    <option [value]="level.value">{{ level.label }}</option>
    }
  </select>
</div>
```

And in the edit modal:

```html
<div class="mb-4">
  <label class="block text-sm font-medium text-gray-700 mb-2"
    >Position Level (Optional)</label
  >
  <select
    [(ngModel)]="editForm.position_level"
    name="position_level"
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
  >
    <option value="">Select Position Level</option>
    @for (level of positionLevels(); track level.value) {
    <option [value]="level.value">{{ level.label }}</option>
    }
  </select>
</div>
```

## Optional: Display Position Level in Tables

### Faculty List Table

**File**: `client/src/app/features/dean/faculty-management/faculty-management.html`

Add column header:

```html
<th
  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
>
  Position Level
</th>
```

Add table cell:

```html
<td class="px-6 py-4 text-sm">{{ faculty.position_level || 'N/A' }}</td>
```

### Dean List Table

**File**: `client/src/app/features/superadmin/dean-management/dean-management.html`

Add column header:

```html
<th
  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
>
  Position Level
</th>
```

Add table cell:

```html
<td class="px-6 py-4 text-sm">{{ dean.position_level || 'N/A' }}</td>
```

## Testing Checklist

### Dean Faculty Management

- [ ] Position level dropdown loads with 22 options
- [ ] Can create faculty with position level
- [ ] Can create faculty without position level (optional)
- [ ] Can edit faculty and change position level
- [ ] Can edit faculty and clear position level
- [ ] Position level displays in faculty list (if column added)
- [ ] Position level saves correctly to database

### Superadmin Dean Management

- [ ] Position level dropdown loads with 22 options
- [ ] Can create dean with position level
- [ ] Can create dean without position level (optional)
- [ ] Can edit dean and change position level
- [ ] Can edit dean and clear position level
- [ ] Position level displays in dean list (if column added)
- [ ] Position level saves correctly to database

## Position Levels Available

1. Lecturer 1, 2, 3
2. Instructor 1, 2, 3
3. Assistant Professor 1, 2, 3, 4
4. Associate Professor 1, 2, 3, 4, 5
5. Professor 1, 2, 3, 4, 5, 6
6. University Professor

## Files Modified

### Completed ✅

1. `client/src/app/services/dropdown.service.ts`
2. `client/src/app/services/dean-faculty.service.ts`
3. `client/src/app/services/superadmin-dean.service.ts`
4. `client/src/app/features/dean/faculty-management/faculty-management.ts`
5. `client/src/app/features/dean/faculty-management/faculty-management.html`

### Remaining ⏳

6. `client/src/app/features/superadmin/dean-management/dean-management.ts`
7. `client/src/app/features/superadmin/dean-management/dean-management.html`

## Summary

The position level feature is now integrated into the Dean Faculty Management module. The same pattern needs to be applied to the Superadmin Dean Management module. The dropdown is static and fixed in the system with 22 predefined academic position levels following the Philippine academic ranking system.
