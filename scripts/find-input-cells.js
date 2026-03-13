const ExcelJS = require("exceljs");

async function findInputCells() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("client/public/assets/template - pds .xlsx");

  const sheet1 = workbook.getWorksheet(1);

  console.log(
    "=== FINDING INPUT CELLS (WHITE CELLS NEXT TO GRAY LABELS) ===\n",
  );

  // Check rows 10-35 for personal information
  for (let row = 10; row <= 35; row++) {
    const rowData = sheet1.getRow(row);

    // Check each column
    for (let col = 1; col <= 16; col++) {
      const cell = rowData.getCell(col);
      const colLetter = String.fromCharCode(64 + col);

      // Check if cell has a fill (gray background)
      const hasGrayFill =
        cell.fill && cell.fill.type === "pattern" && cell.fill.fgColor;

      // Check if cell has value
      if (cell.value) {
        const value =
          typeof cell.value === "object"
            ? JSON.stringify(cell.value).substring(0, 30)
            : String(cell.value).substring(0, 30);

        // Check the next cell (to the right)
        const nextCell = rowData.getCell(col + 1);
        const nextColLetter = String.fromCharCode(64 + col + 1);
        const nextHasValue = nextCell.value ? true : false;
        const nextValue = nextCell.value
          ? typeof nextCell.value === "object"
            ? JSON.stringify(nextCell.value).substring(0, 30)
            : String(nextCell.value).substring(0, 30)
          : "";

        console.log(
          `Row ${row}: ${colLetter}${row} = "${value}" ${hasGrayFill ? "[GRAY]" : "[WHITE]"} | Next: ${nextColLetter}${row} = "${nextValue}" ${nextHasValue ? "[HAS VALUE]" : "[EMPTY]"}`,
        );
      }
    }
  }

  console.log("\n=== CHECKING SPECIFIC CELLS FROM SCREENSHOT ===\n");

  // Based on screenshot, check specific cells
  const testCells = [
    { row: 10, col: "C", label: "SURNAME" },
    { row: 11, col: "C", label: "FIRST NAME" },
    { row: 11, col: "M", label: "NAME EXTENSION" },
    { row: 12, col: "C", label: "MIDDLE NAME" },
    { row: 13, col: "C", label: "DATE OF BIRTH" },
    { row: 15, col: "C", label: "PLACE OF BIRTH" },
    { row: 16, col: "C", label: "SEX AT BIRTH" },
    { row: 17, col: "C", label: "CIVIL STATUS" },
    { row: 22, col: "C", label: "HEIGHT" },
    { row: 24, col: "C", label: "WEIGHT" },
    { row: 25, col: "C", label: "BLOOD TYPE" },
  ];

  testCells.forEach((test) => {
    const cell = sheet1.getCell(`${test.col}${test.row}`);
    const hasGrayFill =
      cell.fill && cell.fill.type === "pattern" && cell.fill.fgColor;
    const fillColor =
      hasGrayFill && cell.fill.fgColor
        ? JSON.stringify(cell.fill.fgColor)
        : "none";

    console.log(
      `${test.label}: ${test.col}${test.row} - Fill: ${fillColor} - Value: "${cell.value || "EMPTY"}"`,
    );
  });
}

findInputCells().catch(console.error);
