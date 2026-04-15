const fs = require("fs");
const path = require("path");

// Create upload directories
const uploadDirs = [
  "uploads",
  "uploads/profiles",
  "uploads/awards",
  "uploads/seminars",
  "uploads/research",
  "uploads/extension",
];

uploadDirs.forEach((dir) => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  } else {
    console.log(`✓ Directory already exists: ${dir}`);
  }
});

console.log("\n✓ Upload directories setup complete!");
