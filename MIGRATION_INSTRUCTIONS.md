# Faculty Credentials Tables Migration

## Issue

The `faculty_credentials` and `credential_certificates` tables don't exist in the database, which is why certificates are not showing on the faculty credentials page.

## Solution

Run the migration file to create these tables.

## Steps to Run Migration

### Option 1: Using MySQL Workbench or phpMyAdmin

1. Open MySQL Workbench or phpMyAdmin
2. Connect to your database: `dyasmir_clearance_system`
3. Open the file: `backend/migrations/2026-03-22-create-faculty-credentials-tables.sql`
4. Execute the SQL script

### Option 2: Using Command Line

```bash
# Navigate to project root
cd /path/to/your/project

# Run the migration
mysql -u root -p dyasmir_clearance_system < backend/migrations/2026-03-22-create-faculty-credentials-tables.sql
```

### Option 3: Using Node.js Script

Create a file `run-migration.js` in the backend folder:

```javascript
const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");

async function runMigration() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Add your password if needed
    database: "dyasmir_clearance_system",
    multipleStatements: true,
  });

  try {
    const sql = await fs.readFile(
      path.join(
        __dirname,
        "migrations",
        "2026-03-22-create-faculty-credentials-tables.sql",
      ),
      "utf8",
    );

    await connection.query(sql);
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await connection.end();
  }
}

runMigration();
```

Then run:

```bash
cd backend
node run-migration.js
```

## What This Migration Does

1. Creates the `faculty_credentials` table to store faculty education and credential information
2. Creates the `credential_certificates` table to store additional certificates uploaded by faculty
3. Sets up proper foreign key relationships between the tables

## After Running Migration

1. Restart your backend server
2. The certificates should now appear on the faculty credentials page
3. Faculty can upload and view their additional certificates
