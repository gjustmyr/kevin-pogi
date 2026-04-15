# Position Level Feature

## Overview

Added "Position Level" field to faculty and dean account creation/editing forms. This field allows tracking academic positions like Lecturer 1, Professor 1, Associate Professor, etc.

## Backend Changes

### 1. Database Migration

**File**: `backend/migrations/2026-04-14-add-position-level.sql`

- Added `position_level` column to `faculties` table (VARCHAR(100), nullable)
- Added `position_level` column to `deans` table (VARCHAR(100), nullable)
- Migration executed successfully

### 2. Models Updated

**Files**:

- `backend/models/faculty.model.js` - Added position_level field
- `backend/models/dean.model.js` - Added position_level field

### 3. Controllers Updated

**Files**:

- `backend/controllers/dean-faculty.controller.js`
  - Updated `createFaculty()` to accept and save position_level
  - Updated `updateFaculty()` to accept and update position_level
- `backend/controllers/superadmin-dean.controller.js`
  - Updated `createDean()` to accept and save position_level
  - Updated `updateDean()` to accept and update position_level

### 4. Dropdown API Added

**File**: `backend/controllers/dropdown.controller.js`

- Added `getPositionLevels()` endpoint with 22 position levels:
  - Lecturer 1, 2, 3
  - Instructor 1, 2, 3
  - Assistant Professor 1, 2, 3, 4
  - Associate Professor 1, 2, 3, 4, 5
  - Professor 1, 2, 3, 4, 5, 6
  - University Professor

**File**: `backend/routes/dropdown.routes.js`

- Added route: `GET /api/dropdown/position-levels`

## Position Levels Available

The system supports the following academic position levels (based on Philippine academic ranking system):

1. **Lecturer** (3 levels)
   - Lecturer 1
   - Lecturer 2
   - Lecturer 3

2. **Instructor** (3 levels)
   - Instructor 1
   - Instructor 2
   - Instructor 3

3. **Assistant Professor** (4 levels)
   - Assistant Professor 1
   - Assistant Professor 2
   - Assistant Professor 3
   - Assistant Professor 4

4. **Associate Professor** (5 levels)
   - Associate Professor 1
   - Associate Professor 2
   - Associate Professor 3
   - Associate Professor 4
   - Associate Professor 5

5. **Professor** (6 levels)
   - Professor 1
   - Professor 2
   - Professor 3
   - Professor 4
   - Professor 5
   - Professor 6

6. **University Professor** (highest rank)

## Frontend Integration Needed

To complete this feature, the following frontend changes are required:

### 1. Update Dropdown Service

**File**: `client/src/app/services/dropdown.service.ts`

Add interface and method:

```typescript
export interface DropdownPositionLevel {
  value: string;
  label: string;
}

getPositionLevels(): Observable<DropdownPositionLevel[]> {
  return this.http.get<DropdownPositionLevel[]>(`${this.apiUrl}/position-levels`);
}
```

### 2. Update Dean Faculty Management Component

**File**: `client/src/app/features/dean/faculty-management/faculty-management.ts`

Add to form:

```html
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2"
    >Position Level</label
  >
  <select
    [(ngModel)]="facultyForm.position_level"
    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
  >
    <option value="">Select Position Level</option>
    @for (level of positionLevels(); track level.value) {
    <option [value]="level.value">{{ level.label }}</option>
    }
  </select>
</div>
```

Add to component:

```typescript
positionLevels = signal<DropdownPositionLevel[]>([]);

ngOnInit() {
  this.loadPositionLevels();
  // ... other init code
}

loadPositionLevels() {
  this.dropdownService.getPositionLevels().subscribe({
    next: (levels) => this.positionLevels.set(levels),
    error: (error) => console.error('Error loading position levels:', error)
  });
}
```

### 3. Update Superadmin Dean Management Component

**File**: `client/src/app/features/superadmin/dean-management/dean-management.ts`

Same changes as faculty management above.

### 4. Update Faculty/Dean List Display

Add position_level to the table columns to display the position level for each faculty/dean.

## API Endpoints

### Get Position Levels

```
GET /api/dropdown/position-levels
Authorization: Bearer <token>

Response:
[
  { "value": "Lecturer 1", "label": "Lecturer 1" },
  { "value": "Lecturer 2", "label": "Lecturer 2" },
  ...
]
```

### Create Faculty (Updated)

```
POST /api/dean/faculty
Authorization: Bearer <token>

Body:
{
  "employee_id": "12345",
  "first_name": "John",
  "middle_name": "M",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "contact_number": "09123456789",
  "position_level": "Assistant Professor 1"  // NEW FIELD
}
```

### Create Dean (Updated)

```
POST /api/superadmin/deans
Authorization: Bearer <token>

Body:
{
  "employee_id": "12345",
  "first_name": "Jane",
  "middle_name": "M",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "contact_number": "09123456789",
  "department": "College of Engineering",
  "position_level": "Professor 3"  // NEW FIELD
}
```

## Testing

1. Start backend server:

   ```bash
   cd backend
   npm start
   ```

2. Test position levels endpoint:

   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:3000/api/dropdown/position-levels
   ```

3. Create faculty/dean with position_level field
4. Verify position_level is saved in database
5. Update faculty/dean and change position_level
6. Verify position_level is updated

## Database Schema

```sql
-- Faculty table
ALTER TABLE faculties
ADD COLUMN position_level VARCHAR(100) NULL;

-- Dean table
ALTER TABLE deans
ADD COLUMN position_level VARCHAR(100) NULL;
```

## Files Modified

### Backend

1. `backend/migrations/2026-04-14-add-position-level.sql` - NEW
2. `backend/models/faculty.model.js` - Updated
3. `backend/models/dean.model.js` - Updated
4. `backend/controllers/dean-faculty.controller.js` - Updated
5. `backend/controllers/superadmin-dean.controller.js` - Updated
6. `backend/controllers/dropdown.controller.js` - Updated
7. `backend/routes/dropdown.routes.js` - Updated

### Frontend (TO DO)

1. `client/src/app/services/dropdown.service.ts` - Needs update
2. `client/src/app/features/dean/faculty-management/faculty-management.ts` - Needs update
3. `client/src/app/features/superadmin/dean-management/dean-management.ts` - Needs update

## Notes

- Position level is optional (nullable) to maintain backward compatibility
- The field uses a dropdown for consistency
- Position levels follow the Philippine academic ranking system
- The field is stored as VARCHAR(100) to allow for future additions
- All existing faculty/dean records will have NULL position_level until updated
