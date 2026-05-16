const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Read the PDS template
const templatePath = path.join(
  __dirname,
  "../public/templates/pds-template.xlsx",
);

if (!fs.existsSync(templatePath)) {
  console.error("❌ Template file not found at:", templatePath);
  process.exit(1);
}

console.log("📄 Analyzing PDS Template...\n");

const workbook = XLSX.readFile(templatePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

console.log("Sheet Name:", sheetName);
console.log("Range:", worksheet["!ref"]);
console.log("\n" + "=".repeat(80) + "\n");

// Get all cells with content
const range = XLSX.utils.decode_range(worksheet["!ref"]);
let markdown = `# PDS Template Cell Mapping Analysis\n\n`;
markdown += `**Sheet Name:** ${sheetName}\n`;
markdown += `**Range:** ${worksheet["!ref"]}\n`;
markdown += `**Generated:** ${new Date().toISOString()}\n\n`;

markdown += `## Merged Cells\n\n`;
if (worksheet["!merges"]) {
  markdown += `| Merge Range | Start Cell | End Cell |\n`;
  markdown += `|-------------|------------|----------|\n`;
  worksheet["!merges"].forEach((merge) => {
    const startCell = XLSX.utils.encode_cell(merge.s);
    const endCell = XLSX.utils.encode_cell(merge.e);
    markdown += `| ${startCell}:${endCell} | ${startCell} | ${endCell} |\n`;
  });
} else {
  markdown += `No merged cells found.\n`;
}

markdown += `\n## Cell Contents by Row\n\n`;

// Group cells by row
const cellsByRow = {};
for (let R = range.s.r; R <= range.e.r; ++R) {
  cellsByRow[R] = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
    const cell = worksheet[cellAddress];
    if (cell && cell.v !== undefined && cell.v !== "") {
      cellsByRow[R].push({
        address: cellAddress,
        value: cell.v,
        type: cell.t,
      });
    }
  }
}

// Output cells by row
for (let R = range.s.r; R <= range.e.r; ++R) {
  if (cellsByRow[R].length > 0) {
    markdown += `### Row ${R + 1}\n\n`;
    markdown += `| Cell | Value | Type |\n`;
    markdown += `|------|-------|------|\n`;
    cellsByRow[R].forEach((cell) => {
      const value = String(cell.value)
        .replace(/\n/g, " ")
        .replace(/\|/g, "\\|");
      markdown += `| ${cell.address} | ${value} | ${cell.type} |\n`;
    });
    markdown += `\n`;
  }
}

// Look for specific patterns that might be checkboxes or form fields
markdown += `## Potential Form Fields\n\n`;
markdown += `Looking for cells that might contain checkboxes, radio buttons, or input fields...\n\n`;

const formFieldPatterns = [
  "CITIZENSHIP",
  "Filipino",
  "Dual",
  "by birth",
  "by naturalization",
  "Male",
  "Female",
  "Single",
  "Married",
  "Widowed",
  "Separated",
  "YES",
  "NO",
];

markdown += `| Row | Cell | Content | Notes |\n`;
markdown += `|-----|------|---------|-------|\n`;

for (let R = range.s.r; R <= range.e.r; ++R) {
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
    const cell = worksheet[cellAddress];
    if (cell && cell.v) {
      const value = String(cell.v);
      formFieldPatterns.forEach((pattern) => {
        if (value.includes(pattern)) {
          markdown += `| ${R + 1} | ${cellAddress} | ${value.replace(/\|/g, "\\|")} | Contains "${pattern}" |\n`;
        }
      });
    }
  }
}

// Save to file
const outputPath = path.join(__dirname, "../PDS_TEMPLATE_ANALYSIS.md");
fs.writeFileSync(outputPath, markdown);

console.log("✅ Analysis complete!");
console.log("📝 Report saved to:", outputPath);
console.log("\n" + "=".repeat(80) + "\n");

// Also print summary to console
console.log("SUMMARY:");
console.log("--------");
console.log("Total Rows:", range.e.r + 1);
console.log("Total Columns:", range.e.c + 1);
console.log(
  "Merged Cells:",
  worksheet["!merges"] ? worksheet["!merges"].length : 0,
);
console.log("\nCheck the generated markdown file for detailed cell mappings.");
