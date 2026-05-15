# PDS Excel Export - Cell Mapping Documentation

## Overview
This document describes the cell mappings for the Personal Data Sheet (PDS) Excel export functionality.

## Implementation Files
- **Controller**: `backend/controllers/pds-excel-export.controller.js`
- **Routes**: 
  - Faculty: `backend/routes/pds.routes.js` → `/api/pds/export/excel`
  - Dean: `backend/routes/dean-pds.routes.js` → `/api/dean-pds/export/excel`

## Cell Mappings

### Personal Information Section

| Field | Cell Range | Format | Notes |
|-------|-----------|--------|-------|
| Surname | D10:N10 | Text | |
| First Name | D11:K11 | Text | |
| Name Extension | L11:M11 | Text | |
| Middle Name | D12:N12 | Text | |
| Date of Birth | D13:F13 | MM/DD/YYYY | |
| Place of Birth | H13:N13 | Text | |
| Sex | D14:F14 | Text | |
| Civil Status | D15:F15 | Text | |
| Citizenship | D16:F16 | Text | |
| Dual Citizenship Country | D17:F17 | Text | Only if dual citizenship |
| Height | D22:F23 | Number + "m" | Merged cells |
| Weight | D24:F24 | Number + "kg" | |
| Blood Type | D25:F26 | Text | Merged cells |
| GSIS/UMID ID No. | D27:F28 | Text | Merged cells |
| Pag-IBIG ID No. | D29:F30 | Text | Merged cells |
| PhilHealth No. | D31:F31 | Text | |
| SSS/PhilSys Number | D32:F32 | Text | |
| TIN No. | D33:F33 | Text | |
| Agency Employee No. | D34:F34 | Text | |

### Contact Information

| Field | Cell Range | Format | Notes |
|-------|-----------|--------|-------|
| Telephone No. | I32:N32 | Text | |
| Mobile No. | I33:N33 | Text | |
| Email Address | I34:N34 | Text | |

### Residential Address

| Field | Cell Range | Format | Notes |
|-------|-----------|--------|-------|
| House/Block/Lot No. | I17:K17 | Text | |
| Street | L17:N17 | Text | |
| Subdivision/Village | I19:K20 | Text | Merged cells |
| Barangay | L19:N20 | Text | Merged cells |
| City/Municipality | I22:K22 | Text | |
| Province | L22:N22 | Text | |
| ZIP Code | I24:N24 | Text | |

### Permanent Address

| Field | Cell Range | Format | Notes |
|-------|-----------|--------|-------|
| House/Block/Lot No. | I25:K25 | Text | |
| Street | L25:N25 | Text | |
| Subdivision/Village | I27:K27 | Text | |
| Barangay | L27:N27 | Text | |
| City/Municipality | J29 | Text | |
| Province | M27 | Text | |
| ZIP Code | I31:K31 | Text | |

### Family Background

| Field | Cell Range | Format | Notes |
|-------|-----------|--------|-------|
| Spouse Surname | D36:H36 | Text | |
| Spouse First Name | D37:F37 | Text | |
| Spouse Name Extension | G37:H37 | Text | |
| Spouse Middle Name | D38:H38 | Text | |
| Spouse Occupation | D39:H39 | Text | |
| Spouse Employer | D40:H40 | Text | |
| Spouse Business Address | D41:H41 | Text | |
| Spouse Telephone | D42:H42 | Text | |
| Father Surname | D43:H43 | Text | |
| Father First Name | D44:F44 | Text | |
| Father Name Extension | G44:H44 | Text | |
| Father Middle Name | D45:H45 | Text | |
| Mother Surname | D47:H47 | Text | |
| Mother First Name | D48:H48 | Text | |
| Mother Middle Name | D49:H49 | Text | |

### Children Information

| Field | Starting Row | Column | Format | Max Entries |
|-------|-------------|--------|--------|-------------|
| Child Name | 36 | J | Text | 12 |
| Date of Birth | 36 | L | MM/DD/YYYY | 12 |

**Note**: Each child occupies one row, starting from row 36.

### Educational Background

| Level | Row | Columns | Fields |
|-------|-----|---------|--------|
| ELEMENTARY | 54 | D-F (Level), G-I (School), J (From), K (To), L (Units), M (Year), N (Honors) | |
| SECONDARY | 55 | D-F (Level), G-I (School), J (From), K (To), L (Units), M (Year), N (Honors) | |
| VOCATIONAL | 56 | D-F (Level), G-I (School), J (From), K (To), L (Units), M (Year), N (Honors) | |
| COLLEGE | 57 | D-F (Level), G-I (School), J (From), K (To), L (Units), M (Year), N (Honors) | |
| GRADUATE STUDIES | 58 | D-F (Level), G-I (School), J (From), K (To), L (Units), M (Year), N (Honors) | |

### Signature Section

| Field | Cell Range | Format | Notes |
|-------|-----------|--------|-------|
| Signature | D60:I60 | Text/Image | Space for signature |
| Date | L60:M60 | MM/DD/YYYY | Current date |

### Civil Service Eligibility

| Field | Starting Row | Column | Format | Max Entries |
|-------|-------------|--------|--------|-------------|
| Career Service | 61 | D | Text | 7 |
| Rating | 61 | F | Text | 7 |
| Date of Examination | 61 | G | MM/DD/YYYY | 7 |
| Place of Examination | 61 | I | Text | 7 |
| License Number | 61 | K | Text | 7 |
| License Validity | 61 | M | MM/DD/YYYY | 7 |

### Work Experience

| Field | Starting Row | Column | Format | Max Entries |
|-------|-------------|--------|--------|-------------|
| Date From | 69 | D | MM/DD/YYYY | 28 |
| Date To | 69 | E | MM/DD/YYYY | 28 |
| Position Title | 69 | F | Text | 28 |
| Department/Agency | 69 | G | Text | 28 |
| Monthly Salary | 69 | H | Currency (2 decimals) | 28 |
| Salary Grade | 69 | J | Text | 28 |
| Status of Appointment | 69 | K | Text | 28 |
| Government Service | 69 | L | Y/N | 28 |

### Learning and Development (Trainings)

| Field | Starting Row | Column | Format | Max Entries |
|-------|-------------|--------|--------|-------------|
| Title | 98 | D | Text | 21 |
| Date From | 98 | F | MM/DD/YYYY | 21 |
| Date To | 98 | G | MM/DD/YYYY | 21 |
| Number of Hours | 98 | H | Number | 21 |
| Type of LD | 98 | I | Text | 21 |
| Conducted By | 98 | J | Text | 21 |

### Voluntary Work

| Field | Starting Row | Column | Format | Max Entries |
|-------|-------------|--------|--------|-------------|
| Organization Name & Address | 120 | D | Text | 7 |
| Date From | 120 | F | MM/DD/YYYY | 7 |
| Date To | 120 | G | MM/DD/YYYY | 7 |
| Number of Hours | 120 | H | Number | 7 |
| Position/Nature of Work | 120 | I | Text | 7 |

### Other Information

| Category | Starting Row | Column | Max Entries |
|----------|-------------|--------|-------------|
| Skills | 128 | D | 7 |
| Recognitions | 128 | F | 7 |
| Memberships | 128 | H | 7 |

### References

| Field | Starting Row | Column | Format | Max Entries |
|-------|-------------|--------|--------|-------------|
| Name | 136 | D | Text | 3 |
| Address | 136 | F | Text | 3 |
| Telephone Number | 136 | H | Text | 3 |

### Questionnaire Responses

| Question | Row | Answer Column | Details Column | Format |
|----------|-----|---------------|----------------|--------|
| 34a | 140 | D | E | YES/NO |
| 34b | 141 | D | E | YES/NO |
| 35a | 142 | D | E | YES/NO |
| 35b | 143 | D | E | YES/NO |
| 36 | 144 | D | E (details), F (date), G (status) | YES/NO |
| 37 | 145 | D | E | YES/NO |
| 38 | 146 | D | E | YES/NO |
| 39 | 147 | D | E | YES/NO |
| 40 | 148 | D | E | YES/NO |
| 41 | 149 | D | E (country) | YES/NO |
| 42 | 150 | D | E (group) | YES/NO |
| 43 | 151 | D | E (id_no) | YES/NO |
| 44 | 152 | D | E (id_no) | YES/NO |

## API Endpoints

### Faculty PDS Export
```
GET /api/pds/export/excel
Authorization: Bearer {token}
```

**Response**: Excel file download with filename format `PDS_{Surname}_{FirstName}_{YYYYMMDD}.xlsx`

### Dean PDS Export
```
GET /api/dean-pds/export/excel
Authorization: Bearer {token}
```

**Response**: Excel file download with filename format `PDS_{Surname}_{FirstName}_{YYYYMMDD}.xlsx`

## Data Formatting Rules

1. **Dates**: All dates are formatted as MM/DD/YYYY
2. **Boolean Values**: Converted to "YES" or "NO"
3. **Currency**: Formatted with 2 decimal places
4. **Null/Undefined**: Empty string (blank cell)
5. **Text Fields**: Trimmed of whitespace
6. **Height**: Displayed with "m" unit
7. **Weight**: Displayed with "kg" unit

## Template File

The system looks for a template file at:
```
backend/public/templates/pds-template.xlsx
```

If the template exists, it will be used as the base and data will be populated into it. If the template doesn't exist, a new workbook will be created.

## Usage Example

### Frontend (JavaScript/Angular)
```javascript
// Faculty export
fetch('/api/pds/export/excel', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'PDS.xlsx';
  a.click();
});

// Dean export
fetch('/api/dean-pds/export/excel', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'PDS.xlsx';
  a.click();
});
```

## Error Handling

The API returns the following error responses:

- **401 Unauthorized**: Invalid or missing authentication token
- **404 Not Found**: Faculty/Dean profile not found OR PDS not found
- **500 Internal Server Error**: Failed to generate Excel file

## Notes

1. The implementation uses the `xlsx` library (already installed in package.json)
2. All cell mappings follow the official Philippine government PDS template (CS Form No. 212, Revised 2017)
3. The export works for both Faculty and Dean users with the same data structure
4. Maximum entries are enforced to prevent overflow in the template
5. The file is generated in memory and streamed directly to the client (no temporary files)
