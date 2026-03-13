const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

async function mapPDSFields() {
  try {
    const workbook = new ExcelJS.Workbook();
    const templatePath = path.join(
      __dirname,
      "../client/public/assets/template - pds .xlsx",
    );

    console.log("Loading template from:", templatePath);
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.worksheets[0]; // First sheet

    console.log("\n=== PDS FIELD MAPPING GENERATOR ===\n");

    // Define the fields we need to map
    const fieldsToMap = {
      "Personal Information": [
        "surname",
        "first_name",
        "middle_name",
        "name_extension",
        "date_of_birth",
        "place_of_birth",
        "sex",
        "civil_status",
        "height",
        "weight",
        "blood_type",
        "gsis_id_no",
        "pag_ibig_id_no",
        "philhealth_no",
        "sss_no",
        "tin_no",
        "agency_employee_no",
        "citizenship_type",
        "residential_address",
        "permanent_address",
        "telephone_no",
        "mobile_no",
        "email_address",
      ],
      "Family Background": [
        "spouse_name",
        "spouse_occupation",
        "spouse_employer",
        "spouse_business_address",
        "spouse_telephone",
        "father_name",
        "mother_maiden_name",
        "children_start_row",
      ],
      "Educational Background": [
        "elementary_row",
        "secondary_row",
        "vocational_row",
        "college_row",
        "graduate_row",
      ],
      "Civil Service Eligibility": ["eligibility_start_row"],
      "Work Experience": ["work_experience_start_row"],
      "Voluntary Work": ["voluntary_work_start_row"],
      "Learning and Development": ["training_start_row"],
      "Other Information": [
        "skills_start_row",
        "recognition_start_row",
        "membership_start_row",
      ],
      References: ["reference_start_row"],
    };

    // Search for keywords in the template
    const cellMap = {};

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        const value = cell.value;
        let textValue = "";

        if (typeof value === "string") {
          textValue = value.toLowerCase().trim();
        } else if (value && typeof value === "object" && value.richText) {
          textValue = value.richText
            .map((rt) => rt.text)
            .join("")
            .toLowerCase()
            .trim();
        }

        if (textValue) {
          // Map common field patterns
          if (
            textValue.includes("surname") &&
            !textValue.includes("spouse") &&
            !textValue.includes("father") &&
            !textValue.includes("mother")
          ) {
            cellMap["surname"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (
            textValue.includes("first name") &&
            !textValue.includes("spouse") &&
            !textValue.includes("father") &&
            !textValue.includes("mother")
          ) {
            cellMap["first_name"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (
            textValue.includes("middle name") &&
            !textValue.includes("spouse") &&
            !textValue.includes("father") &&
            !textValue.includes("mother")
          ) {
            cellMap["middle_name"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (
            textValue.includes("extension") ||
            textValue.includes("name extension")
          ) {
            cellMap["name_extension"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("date of birth")) {
            cellMap["date_of_birth"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("place of birth")) {
            cellMap["place_of_birth"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue === "sex" || textValue.includes("sex:")) {
            cellMap["sex"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("civil status")) {
            cellMap["civil_status"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("height")) {
            cellMap["height"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("weight")) {
            cellMap["weight"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("blood type")) {
            cellMap["blood_type"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("gsis")) {
            cellMap["gsis_id_no"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("pag-ibig") || textValue.includes("pagibig")) {
            cellMap["pag_ibig_id_no"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("philhealth")) {
            cellMap["philhealth_no"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("sss")) {
            cellMap["sss_no"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("tin")) {
            cellMap["tin_no"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("citizenship")) {
            cellMap["citizenship_type"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("residential address")) {
            cellMap["residential_address"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("permanent address")) {
            cellMap["permanent_address"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("telephone")) {
            cellMap["telephone_no"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("mobile")) {
            cellMap["mobile_no"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("e-mail") || textValue.includes("email")) {
            cellMap["email_address"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }

          // Family Background
          if (textValue.includes("spouse") && textValue.includes("surname")) {
            cellMap["spouse_surname"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (
            textValue.includes("spouse") &&
            textValue.includes("first name")
          ) {
            cellMap["spouse_first_name"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (
            textValue.includes("spouse") &&
            textValue.includes("occupation")
          ) {
            cellMap["spouse_occupation"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("father") && textValue.includes("surname")) {
            cellMap["father_surname"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("mother") && textValue.includes("maiden")) {
            cellMap["mother_maiden_name"] = {
              label: cell.address,
              input: worksheet.getCell(rowNumber, colNumber + 1).address,
            };
          }
          if (textValue.includes("name of children")) {
            cellMap["children_start_row"] = {
              label: cell.address,
              startRow: rowNumber + 1,
            };
          }

          // Educational Background
          if (textValue.includes("elementary")) {
            cellMap["elementary_row"] = { label: cell.address, row: rowNumber };
          }
          if (textValue.includes("secondary")) {
            cellMap["secondary_row"] = { label: cell.address, row: rowNumber };
          }
          if (textValue.includes("vocational")) {
            cellMap["vocational_row"] = { label: cell.address, row: rowNumber };
          }
          if (textValue.includes("college")) {
            cellMap["college_row"] = { label: cell.address, row: rowNumber };
          }
          if (textValue.includes("graduate studies")) {
            cellMap["graduate_row"] = { label: cell.address, row: rowNumber };
          }

          // Work Experience
          if (
            textValue.includes("work experience") &&
            textValue.includes("inclusive")
          ) {
            cellMap["work_experience_start_row"] = {
              label: cell.address,
              startRow: rowNumber + 1,
            };
          }

          // Training
          if (textValue.includes("learning and development")) {
            cellMap["training_start_row"] = {
              label: cell.address,
              startRow: rowNumber + 1,
            };
          }

          // References
          if (textValue.includes("character reference")) {
            cellMap["reference_start_row"] = {
              label: cell.address,
              startRow: rowNumber + 1,
            };
          }
        }
      });
    });

    // Generate TypeScript code
    console.log("\n=== GENERATED CELL MAPPING ===\n");
    console.log("Copy this into your pds-excel-export.service.ts:\n");
    console.log("```typescript");
    console.log("// Personal Information");
    Object.keys(cellMap).forEach((key) => {
      if (cellMap[key].input) {
        console.log(
          `this.setCellValue(worksheet, '${cellMap[key].input}', pds.${key});`,
        );
      } else if (cellMap[key].startRow) {
        console.log(`// ${key} starts at row ${cellMap[key].startRow}`);
      } else if (cellMap[key].row) {
        console.log(`// ${key} is at row ${cellMap[key].row}`);
      }
    });
    console.log("```\n");

    // Save to JSON file
    const outputPath = path.join(__dirname, "pds-cell-mapping.json");
    fs.writeFileSync(outputPath, JSON.stringify(cellMap, null, 2));
    console.log(`\nCell mapping saved to: ${outputPath}`);
    console.log(
      "\nYou can now review this file and update your service accordingly.\n",
    );
  } catch (error) {
    console.error("Error mapping fields:", error);
    process.exit(1);
  }
}

// Run the mapper
mapPDSFields();
