const ExcelJS = require("exceljs");

async function verifyTemplateStructure() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("client/public/assets/template - pds .xlsx");

  console.log("=== TEMPLATE STRUCTURE ANALYSIS ===\n");
  console.log(`Total Worksheets: ${workbook.worksheets.length}\n`);

  workbook.worksheets.forEach((worksheet, index) => {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`SHEET ${index + 1}: ${worksheet.name}`);
    console.log("=".repeat(60));

    // Scan rows 10-35 for personal information section
    console.log("\n--- PERSONAL INFORMATION SECTION (Rows 10-35) ---");
    for (let row = 10; row <= 35; row++) {
      const rowData = worksheet.getRow(row);
      const cells = [];

      // Check columns A through P
      for (let col = 1; col <= 16; col++) {
        const cell = rowData.getCell(col);
        const colLetter = String.fromCharCode(64 + col);

        if (cell.value) {
          const value =
            typeof cell.value === "object"
              ? JSON.stringify(cell.value).substring(0, 50)
              : String(cell.value).substring(0, 50);

          cells.push(`${colLetter}${row}: "${value}"`);
        }
      }

      if (cells.length > 0) {
        console.log(`Row ${row}: ${cells.join(" | ")}`);
      }
    }

    // Scan rows 36-50 for family/education section
    console.log("\n--- FAMILY/EDUCATION SECTION (Rows 36-50) ---");
    for (let row = 36; row <= 50; row++) {
      const rowData = worksheet.getRow(row);
      const cells = [];

      for (let col = 1; col <= 16; col++) {
        const cell = rowData.getCell(col);
        const colLetter = String.fromCharCode(64 + col);

        if (cell.value) {
          const value =
            typeof cell.value === "object"
              ? JSON.stringify(cell.value).substring(0, 50)
              : String(cell.value).substring(0, 50);

          cells.push(`${colLetter}${row}: "${value}"`);
        }
      }

      if (cells.length > 0) {
        console.log(`Row ${row}: ${cells.join(" | ")}`);
      }
    }

    // Only analyze first sheet in detail
    if (index === 0) {
      console.log("\n--- MERGED CELLS ---");
      if (worksheet.model.merges) {
        Object.keys(worksheet.model.merges)
          .slice(0, 20)
          .forEach((merge) => {
            console.log(`Merged: ${merge}`);
          });
      }
    }
  });
}

verifyTemplateStructure().catch(console.error);
