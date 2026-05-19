const ExcelJS = require("exceljs");
const path = require("path");

async function inspectTemplate() {
  try {
    const templatePath = path.join(
      __dirname,
      "public/templates/pds-template.xlsx"
    );

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.getWorksheet(1);

    console.log("\n=== INSPECTING PDS TEMPLATE ===\n");

    // Check rows 10-25 for personal information section
    console.log("--- ROWS 10-25 (Personal Info Section) ---");
    for (let row = 10; row <= 25; row++) {
      const rowData = worksheet.getRow(row);
      console.log(`\nRow ${row}:`);
      
      // Check columns A to O (1 to 15)
      for (let col = 1; col <= 15; col++) {
        const cell = rowData.getCell(col);
        const colLetter = String.fromCharCode(64 + col); // A=65, B=66, etc.
        
        // Show all cells, even empty ones, to see structure
        const value = cell.value || "(empty)";
        const isMerged = cell.isMerged ? " [MERGED]" : "";
        const master = cell.master ? ` [MASTER: ${cell.master.address}]` : "";
        
        // Only show if has value or is merged
        if (cell.value || cell.isMerged) {
          console.log(`  ${colLetter}${row}: "${value}"${isMerged}${master}`);
        }
      }
    }

    console.log("\n=== DONE ===\n");
  } catch (error) {
    console.error("Error inspecting template:", error);
  }
}

inspectTemplate();
