require("dotenv").config();
const mysql = require("mysql2/promise");

async function seedDocumentTypes() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("Seeding document types...\n");

    const documentTypes = [
      {
        type_name: "Financial Report",
        description:
          "Financial statements and budget reports for the organization",
        required_per_semester: true,
      },
      {
        type_name: "Activity Report",
        description:
          "Summary of activities and events conducted by the organization",
        required_per_semester: true,
      },
      {
        type_name: "Constitution and By-Laws",
        description: "Organization's constitution and by-laws document",
        required_per_semester: false,
      },
      {
        type_name: "Attendance Sheet",
        description: "Attendance records for meetings and events",
        required_per_semester: true,
      },
      {
        type_name: "Meeting Minutes",
        description: "Minutes of meetings held by the organization",
        required_per_semester: true,
      },
      {
        type_name: "Budget Proposal",
        description: "Proposed budget for upcoming activities and operations",
        required_per_semester: true,
      },
    ];

    for (const docType of documentTypes) {
      // Check if document type already exists
      const [existing] = await connection.query(
        "SELECT * FROM document_types WHERE type_name = ?",
        [docType.type_name],
      );

      if (existing.length > 0) {
        console.log(`✓ "${docType.type_name}" already exists, skipping...`);
      } else {
        await connection.query(
          "INSERT INTO document_types (type_name, description, required_per_semester, is_active) VALUES (?, ?, ?, ?)",
          [
            docType.type_name,
            docType.description,
            docType.required_per_semester,
            true,
          ],
        );
        console.log(`✓ Added "${docType.type_name}"`);
      }
    }

    console.log("\n✓ Document types seeded successfully!");

    // Show all document types
    const [allTypes] = await connection.query(
      "SELECT document_type_id, type_name, required_per_semester, is_active FROM document_types ORDER BY type_name",
    );
    console.log("\nAll document types:");
    console.table(allTypes);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

seedDocumentTypes();
