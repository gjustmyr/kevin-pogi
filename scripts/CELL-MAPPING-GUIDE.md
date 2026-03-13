# PDS Excel Cell Mapping Guide

This document contains the correct cell addresses for filling the PDS Excel template based on the analysis of `template - pds .xlsx`.

## How to Use This Guide

1. Open `client/src/app/services/pds-excel-export.service.ts`
2. Replace the cell addresses in the `exportToExcel` method with the ones listed below
3. Test with sample data to verify correctness

## Cell Mappings by Section

### I. Personal Information (Page 1)

| Field            | Label Cell | Input Cell | Notes                             |
| ---------------- | ---------- | ---------- | --------------------------------- |
| surname          | B47        | C47        | Last name                         |
| first_name       | B48        | C48        | Given name                        |
| middle_name      | B49        | C49        | Middle name                       |
| name_extension   | H44        | I44        | Jr., Sr., III, etc.               |
| date_of_birth    | N36        | O36        | Format: MM/DD/YYYY                |
| place_of_birth   | B15        | C15        | City/Municipality                 |
| sex              | -          | -          | Not auto-detected, check template |
| civil_status     | C18        | D18        | Single, Married, etc.             |
| height           | C23        | D23        | In meters                         |
| weight           | C24        | D24        | In kilograms                      |
| blood_type       | C26        | D26        | A+, O-, etc.                      |
| citizenship_type | I15        | J15        | Filipino, Dual, etc.              |

### Government IDs

| Field              | Label Cell | Input Cell | Notes             |
| ------------------ | ---------- | ---------- | ----------------- |
| gsis_id_no         | -          | -          | Not auto-detected |
| pag_ibig_id_no     | C30        | D30        | Pag-IBIG number   |
| philhealth_no      | B31        | C31        | PhilHealth number |
| sss_no             | -          | -          | Not auto-detected |
| tin_no             | N59        | O59        | Tax ID number     |
| agency_employee_no | -          | -          | Not auto-detected |

### Addresses

| Field               | Label Cell | Input Cell | Notes                    |
| ------------------- | ---------- | ---------- | ------------------------ |
| residential_address | G17        | H17        | Full residential address |
| permanent_address   | G25        | H25        | Full permanent address   |
| telephone_no        | B42        | C42        | Landline number          |
| mobile_no           | G33        | H33        | Mobile/cell number       |
| email_address       | G34        | H34        | Email address            |

### II. Family Background

| Field              | Label Cell | Input Cell | Notes                |
| ------------------ | ---------- | ---------- | -------------------- |
| spouse_surname     | B36        | C36        | Spouse's last name   |
| spouse_first_name  | -          | -          | Not auto-detected    |
| spouse_occupation  | -          | -          | Not auto-detected    |
| father_surname     | B43        | C43        | Father's last name   |
| father_first_name  | -          | -          | Not auto-detected    |
| mother_maiden_name | H46        | I46        | Mother's maiden name |

### Children

- **Start Row:** 37
- Children should be listed starting from row 37
- Each child occupies one row
- Columns: Name, Date of Birth

### III. Educational Background

| Level            | Row | Notes           |
| ---------------- | --- | --------------- |
| Elementary       | 54  | Basic education |
| Secondary        | 55  | High school     |
| Vocational       | 56  | Trade/technical |
| College          | 57  | Undergraduate   |
| Graduate Studies | 58  | Masters/PhD     |

### IV. Civil Service Eligibility

- **Start Row:** Not auto-detected
- Check Sheet 2 (C2) for eligibility section
- Columns: Career Service, Rating, Date, Place, License

### V. Work Experience

- **Start Row:** Not auto-detected
- Check Sheet 2 for work experience section
- Columns: From, To, Position, Department, Salary, etc.

### VI. Voluntary Work

- **Start Row:** Not auto-detected
- Check Sheet 3 for voluntary work section
- Columns: Organization, From, To, Hours, Position

### VII. Learning and Development (Trainings)

- **Start Row:** Not auto-detected
- Check Sheet 3 for training section
- Columns: Title, From, To, Hours, Type, Conducted By

### VIII. Other Information

- **Skills Start Row:** Not auto-detected
- **Recognition Start Row:** Not auto-detected
- **Membership Start Row:** Not auto-detected
- Check Sheet 3 for other information section

### IX. References

- **Start Row:** Not auto-detected
- Check Sheet 4 (C4) for references section
- Columns: Name, Address, Contact Number

## Multi-Sheet Structure

The PDS template has **4 main sheets**:

1. **Sheet 1 (C1):** Personal Information, Family Background, Education
2. **Sheet 2 (C2):** Civil Service Eligibility, Work Experience
3. **Sheet 3 (C3):** Voluntary Work, Training, Other Information
4. **Sheet 4 (C4):** Questionnaire, References, Declaration

## Important Notes

1. **Merged Cells:** Many cells in the template are merged. Make sure to write to the top-left cell of merged ranges.

2. **Multiple Sheets:** The template spans 4 sheets. You need to:
   - Get the correct worksheet for each section
   - Use `workbook.getWorksheet(1)` for Sheet 1
   - Use `workbook.getWorksheet(2)` for Sheet 2, etc.

3. **Array Data:** For sections with multiple entries (children, education, work experience, etc.):
   - Start at the specified row
   - Increment row number for each entry
   - Respect the template's capacity limits

4. **Date Format:** Use MM/DD/YYYY format for all dates

5. **Address Format:** Combine address components with commas

## Example Code

```typescript
// Get the correct worksheet
const worksheet1 = workbook.getWorksheet(1); // Personal Info
const worksheet2 = workbook.getWorksheet(2); // Eligibility, Work
const worksheet3 = workbook.getWorksheet(3); // Voluntary, Training
const worksheet4 = workbook.getWorksheet(4); // Questionnaire, References

// Personal Information (Sheet 1)
this.setCellValue(worksheet1, "C47", pds.surname?.toUpperCase());
this.setCellValue(worksheet1, "C48", pds.first_name?.toUpperCase());
this.setCellValue(worksheet1, "C49", pds.middle_name?.toUpperCase());
this.setCellValue(worksheet1, "I44", pds.name_extension?.toUpperCase());
this.setCellValue(worksheet1, "O36", this.formatDate(pds.date_of_birth));
this.setCellValue(worksheet1, "C15", pds.place_of_birth);

// Children (Sheet 1, starting at row 37)
if (pds.children && pds.children.length > 0) {
  let childRow = 37;
  pds.children.forEach((child, index) => {
    if (index < 12) {
      // Template capacity
      this.setCellValue(worksheet1, `C${childRow}`, child.child_name);
      this.setCellValue(
        worksheet1,
        `D${childRow}`,
        this.formatDate(child.date_of_birth),
      );
      childRow++;
    }
  });
}

// Educational Background (Sheet 1)
if (pds.education && pds.education.length > 0) {
  const eduRows = {
    ELEMENTARY: 54,
    SECONDARY: 55,
    VOCATIONAL: 56,
    COLLEGE: 57,
    "GRADUATE STUDIES": 58,
  };
  pds.education.forEach((edu) => {
    const row = eduRows[edu.level];
    if (row) {
      this.setCellValue(worksheet1, `C${row}`, edu.school_name);
      this.setCellValue(worksheet1, `D${row}`, edu.degree_course);
      this.setCellValue(worksheet1, `E${row}`, edu.period_from);
      this.setCellValue(worksheet1, `F${row}`, edu.period_to);
      this.setCellValue(worksheet1, `G${row}`, edu.highest_level_earned);
      this.setCellValue(worksheet1, `H${row}`, edu.year_graduated);
      this.setCellValue(worksheet1, `I${row}`, edu.scholarship_honors);
    }
  });
}
```

## Testing Checklist

- [ ] Personal information appears in correct cells
- [ ] All government IDs are in correct locations
- [ ] Addresses are properly formatted
- [ ] Family background data is correct
- [ ] Children list appears in correct rows
- [ ] Educational background fills correct rows
- [ ] Work experience appears on Sheet 2
- [ ] Trainings appear on Sheet 3
- [ ] References appear on Sheet 4
- [ ] Dates are formatted correctly (MM/DD/YYYY)
- [ ] No data appears in wrong cells
- [ ] Merged cells are handled correctly

## Troubleshooting

**Problem:** Data appears in wrong cells

- **Solution:** Verify you're using the correct worksheet (1-4)
- **Solution:** Check if the cell is part of a merged range

**Problem:** Some fields are not detected

- **Solution:** Manually inspect the Excel file to find the correct cells
- **Solution:** Update the mapping in the service

**Problem:** Array data (children, education) not appearing

- **Solution:** Verify the start row is correct
- **Solution:** Check if you're incrementing the row counter properly

## Manual Verification Steps

1. Open `client/public/assets/template - pds .xlsx`
2. Click on each cell to see its address in the formula bar
3. Note which cells should contain which data
4. Compare with the mappings in this guide
5. Update the service if there are discrepancies
