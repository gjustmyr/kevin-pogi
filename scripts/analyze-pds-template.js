const ExcelJS = require("exceljs");
const path = require("path");

async function analyzePDSTemplate() {
  try {
    const workbook = new ExcelJS.Workbook();
    const templatePath = path.join(
      __dirname,
      "../client/public/assets/template - pds .xlsx",
    );

    console.log("Loading template from:", templatePath);
    await workbook.xlsx.readFile(templatePath);

    console.log("\n=== EXCEL TEMPLATE ANALYSIS ===\n");
    console.log(`Total Worksheets: ${workbook.worksheets.length}\n`);

    workbook.worksheets.forEach((worksheet, index) => {
      console.log(`\n${"=".repeat(80)}`);
      console.log(`WORKSHEET ${index + 1}: "${worksheet.name}"`);
      console.log(`${"=".repeat(80)}\n`);

      console.log(`Dimensions: ${worksheet.dimensions?.model || "Unknown"}`);
      console.log(`Row Count: ${worksheet.rowCount}`);
      console.log(`Column Count: ${worksheet.columnCount}\n`);

      // Analyze merged cells
      if (worksheet.model.merges && worksheet.model.merges.length > 0) {
        console.log("Merged Cells:");
        worksheet.model.merges.forEach((merge) => {
          console.log(`  - ${merge}`);
        });
        console.log("");
      }

      // Find cells with text that might be labels
      console.log("POTENTIAL FIELD LABELS (cells with text):");
      console.log("-".repeat(80));

      const labels = [];
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          const value = cell.value;
          if (value && typeof value === "string" && value.trim().length > 0) {
            const cellAddress = cell.address;
            labels.push({
              cell: cellAddress,
              row: rowNumber,
              col: colNumber,
              value: value.trim(),
              isMerged: cell.isMerged || false,
            });
          } else if (value && typeof value === "object" && value.richText) {
            // Handle rich text
            const text = value.richText.map((rt) => rt.text).join("");
            if (text.trim().length > 0) {
              labels.push({
                cell: cell.address,
                row: rowNumber,
                col: colNumber,
                value: text.trim(),
                isMerged: cell.isMerged || false,
              });
            }
          }
        });
      });

      // Group labels by sections
      const sections = {
        personalInfo: [],
        familyBackground: [],
        education: [],
        eligibility: [],
        workExperience: [],
        voluntary: [],
        training: [],
        other: [],
        references: [],
        questionnaire: [],
      };

      labels.forEach((label) => {
        const lowerValue = label.value.toLowerCase();

        if (
          lowerValue.includes("surname") ||
          lowerValue.includes("first name") ||
          lowerValue.includes("middle name") ||
          lowerValue.includes("date of birth") ||
          lowerValue.includes("sex") ||
          lowerValue.includes("civil status") ||
          lowerValue.includes("citizenship") ||
          lowerValue.includes("height") ||
          lowerValue.includes("weight") ||
          lowerValue.includes("blood type") ||
          lowerValue.includes("gsis") ||
          lowerValue.includes("pag-ibig") ||
          lowerValue.includes("philhealth") ||
          lowerValue.includes("sss") ||
          lowerValue.includes("tin") ||
          lowerValue.includes("residential") ||
          lowerValue.includes("permanent") ||
          lowerValue.includes("telephone") ||
          lowerValue.includes("mobile") ||
          lowerValue.includes("email")
        ) {
          sections.personalInfo.push(label);
        } else if (
          lowerValue.includes("spouse") ||
          lowerValue.includes("father") ||
          lowerValue.includes("mother") ||
          lowerValue.includes("children") ||
          lowerValue.includes("child")
        ) {
          sections.familyBackground.push(label);
        } else if (
          lowerValue.includes("elementary") ||
          lowerValue.includes("secondary") ||
          lowerValue.includes("vocational") ||
          lowerValue.includes("college") ||
          lowerValue.includes("graduate") ||
          lowerValue.includes("education") ||
          lowerValue.includes("school") ||
          lowerValue.includes("degree")
        ) {
          sections.education.push(label);
        } else if (
          lowerValue.includes("eligibility") ||
          lowerValue.includes("civil service") ||
          lowerValue.includes("license") ||
          lowerValue.includes("rating") ||
          lowerValue.includes("examination")
        ) {
          sections.eligibility.push(label);
        } else if (
          lowerValue.includes("work experience") ||
          lowerValue.includes("position") ||
          lowerValue.includes("department") ||
          lowerValue.includes("salary") ||
          lowerValue.includes("appointment")
        ) {
          sections.workExperience.push(label);
        } else if (
          lowerValue.includes("voluntary") ||
          lowerValue.includes("organization")
        ) {
          sections.voluntary.push(label);
        } else if (
          lowerValue.includes("training") ||
          lowerValue.includes("seminar") ||
          lowerValue.includes("learning") ||
          lowerValue.includes("development")
        ) {
          sections.training.push(label);
        } else if (
          lowerValue.includes("skill") ||
          lowerValue.includes("recognition") ||
          lowerValue.includes("membership") ||
          lowerValue.includes("association")
        ) {
          sections.other.push(label);
        } else if (
          lowerValue.includes("reference") ||
          lowerValue.includes("character")
        ) {
          sections.references.push(label);
        } else if (lowerValue.match(/\d+[a-z]?\./)) {
          // Numbered questions
          sections.questionnaire.push(label);
        }
      });

      // Print sections
      Object.keys(sections).forEach((sectionName) => {
        if (sections[sectionName].length > 0) {
          console.log(
            `\n${sectionName
              .toUpperCase()
              .replace(/([A-Z])/g, " $1")
              .trim()}:`,
          );
          sections[sectionName].forEach((label) => {
            console.log(
              `  ${label.cell.padEnd(8)} (Row ${String(label.row).padEnd(3)}) - ${label.value.substring(0, 60)}`,
            );
          });
        }
      });

      // Find empty cells that might be input fields (cells next to labels)
      console.log("\n\nPOTENTIAL INPUT CELLS (empty cells near labels):");
      console.log("-".repeat(80));

      const inputCells = [];
      labels.forEach((label) => {
        // Check cells to the right
        const rightCell = worksheet.getCell(label.row, label.col + 1);
        const rightCellAddress = rightCell.address;
        if (
          !rightCell.value ||
          (typeof rightCell.value === "string" && rightCell.value.trim() === "")
        ) {
          inputCells.push({
            cell: rightCellAddress,
            label: label.value.substring(0, 40),
            labelCell: label.cell,
          });
        }

        // Check cell below
        const belowCell = worksheet.getCell(label.row + 1, label.col);
        const belowCellAddress = belowCell.address;
        if (
          !belowCell.value ||
          (typeof belowCell.value === "string" && belowCell.value.trim() === "")
        ) {
          inputCells.push({
            cell: belowCellAddress,
            label: label.value.substring(0, 40),
            labelCell: label.cell,
          });
        }
      });

      // Remove duplicates and print
      const uniqueInputCells = [
        ...new Map(inputCells.map((item) => [item.cell, item])).values(),
      ];
      uniqueInputCells.slice(0, 50).forEach((input) => {
        console.log(
          `  ${input.cell.padEnd(8)} <- for "${input.label}" (near ${input.labelCell})`,
        );
      });

      if (uniqueInputCells.length > 50) {
        console.log(
          `  ... and ${uniqueInputCells.length - 50} more input cells`,
        );
      }
    });

    console.log("\n\n" + "=".repeat(80));
    console.log("ANALYSIS COMPLETE");
    console.log("=".repeat(80));
    console.log("\nNext Steps:");
    console.log("1. Review the cell addresses above");
    console.log("2. Open the Excel file and verify the correct cells");
    console.log(
      "3. Update the pds-excel-export.service.ts with correct cell addresses",
    );
    console.log("4. Test with sample data\n");
  } catch (error) {
    console.error("Error analyzing template:", error);
    process.exit(1);
  }
}

// Run the analysis
analyzePDSTemplate();
