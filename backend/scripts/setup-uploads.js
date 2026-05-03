const fs = require("fs");
const path = require("path");

const uploadDirs = [
  "uploads",
  "uploads/temp",
  "uploads/pds",
  "uploads/credentials",
  "uploads/events",
  "uploads/documents",
  "uploads/profiles",
];

console.log("=".repeat(60));
console.log("SETUP UPLOAD DIRECTORIES");
console.log("=".repeat(60));

uploadDirs.forEach((dir) => {
  const dirPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created: ${dir}`);
  } else {
    console.log(`✓ Exists: ${dir}`);
  }
});

console.log("\n" + "=".repeat(60));
console.log("✅ UPLOAD DIRECTORIES READY!");
console.log("=".repeat(60));
