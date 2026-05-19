const jwt = require("jsonwebtoken");
require('dotenv').config();

// This script helps debug JWT token issues
// Usage: node debug-dean-token.js "YOUR_JWT_TOKEN_HERE"

const token = process.argv[2];

if (!token) {
  console.log('❌ Please provide a JWT token as an argument');
  console.log('Usage: node debug-dean-token.js "YOUR_JWT_TOKEN_HERE"');
  process.exit(1);
}

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  
  console.log('✅ Token is valid!\n');
  console.log('═'.repeat(80));
  console.log('Token Contents:');
  console.log('═'.repeat(80));
  console.log(JSON.stringify(decoded, null, 2));
  console.log('═'.repeat(80));
  
  if (decoded.role === 'dean') {
    console.log('\n✅ Token has dean role');
    console.log(`User ID: ${decoded.user_id}`);
    console.log(`Dean ID: ${decoded.dean_id || 'NOT IN TOKEN'}`);
    
    if (!decoded.dean_id) {
      console.log('\n⚠️  WARNING: dean_id is missing from token!');
      console.log('This might cause issues. User should log out and log back in.');
    }
  } else {
    console.log(`\n⚠️  Token role is "${decoded.role}", not "dean"`);
  }
  
} catch (error) {
  console.log('❌ Token verification failed!');
  console.log('Error:', error.message);
  
  if (error.name === 'TokenExpiredError') {
    console.log('\n⚠️  Token has expired. User needs to log in again.');
  } else if (error.name === 'JsonWebTokenError') {
    console.log('\n⚠️  Token is invalid or malformed.');
  }
}
