# PDS Excel Template Analysis Scripts

These scripts help you identify the correct cell addresses in your PDS Excel template.

## Installation

First, install the required dependencies:

```bash
npm install
```

## Scripts

### 1. Analyze PDS Template

This script analyzes the entire Excel template and shows you all the labels and potential input cells:

```bash
npm run analyze-pds
```

**Output:**

- Lists all worksheets in the template
- Shows merged cells
- Groups labels by section (Personal Info, Family, Education, etc.)
- Identifies potential input cells near labels
- Saves detailed analysis to console

### 2. Map PDS Fields

This script automatically maps common PDS fields to their cell addresses:

```bash
npm run map-pds
```

**Output:**

- Generates TypeScript code with cell mappings
- Saves mapping to `scripts/pds-cell-mapping.json`
- Shows suggested code to copy into your service

## How to Use

1. **Run the analyzer first:**

   ```bash
   npm run analyze-pds
   ```

   This will show you the structure of your Excel template.

2. **Run the field mapper:**

   ```bash
   npm run map-pds
   ```

   This will generate the cell mapping code.

3. **Review the output:**
   - Check the console output for generated TypeScript code
   - Open `scripts/pds-cell-mapping.json` to see the full mapping
   - Verify the cell addresses by opening the Excel file

4. **Update your service:**
   - Open `client/src/app/services/pds-excel-export.service.ts`
   - Replace the cell addresses with the correct ones from the mapping
   - Test with sample data

## Manual Verification

To manually verify cell addresses:

1. Open the Excel template: `client/public/assets/template - pds .xlsx`
2. Look at the cell addresses in the formula bar
3. Note which cells should contain which data
4. Update the service accordingly

## Example Cell Mapping

```typescript
// Personal Information
this.setCellValue(worksheet, "C7", pds.surname);
this.setCellValue(worksheet, "C8", pds.first_name);
this.setCellValue(worksheet, "C9", pds.middle_name);

// Family Background
this.setCellValue(worksheet, "C30", spouseName);
this.setCellValue(worksheet, "C47", fatherName);

// Children (starting at row 35)
let childRow = 35;
pds.children.forEach((child, index) => {
  this.setCellValue(worksheet, `C${childRow}`, child.child_name);
  this.setCellValue(worksheet, `D${childRow}`, child.date_of_birth);
  childRow++;
});
```

## Troubleshooting

**Issue:** Script can't find the template file

- **Solution:** Make sure the template exists at `client/public/assets/template - pds .xlsx`

**Issue:** Cell addresses are wrong

- **Solution:** Open the Excel file and manually verify the cell addresses, then update the service

**Issue:** Data appears in wrong cells

- **Solution:** The template might have merged cells. Check the "Merged Cells" section in the analyzer output

## Tips

- The Excel template uses 1-based indexing (A1, B2, etc.)
- Merged cells can affect cell addressing
- Some templates have multiple sheets - make sure you're using the correct one
- Test with a small dataset first before filling all fields
