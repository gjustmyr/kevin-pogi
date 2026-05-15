const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testCreateAward() {
  try {
    console.log("Testing Award Creation API...\n");
    
    // You need to replace this with a valid JWT token from your login
    const token = "YOUR_JWT_TOKEN_HERE";
    
    const formData = new FormData();
    formData.append('award_title', 'API Test Award');
    formData.append('awarding_body', 'Test Organization');
    formData.append('date_received', '2024-01-15');
    formData.append('level', 'Institutional');
    formData.append('description', 'Test description from API');
    
    console.log("Sending request to http://localhost:3000/api/dean/profile/awards");
    console.log("Data:", {
      award_title: 'API Test Award',
      awarding_body: 'Test Organization',
      date_received: '2024-01-15',
      level: 'Institutional',
      description: 'Test description from API'
    });
    
    const response = await fetch('http://localhost:3000/api/dean/profile/awards', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log("\n✓ Award created successfully!");
      console.log("Response:", result);
    } else {
      console.log("\n❌ Failed to create award");
      console.log("Status:", response.status);
      console.log("Response:", result);
    }
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

console.log("=".repeat(60));
console.log("IMPORTANT: You need to get a valid JWT token first!");
console.log("=".repeat(60));
console.log("1. Login to the application");
console.log("2. Open browser DevTools > Network tab");
console.log("3. Make any API request");
console.log("4. Copy the 'Authorization: Bearer xxx' token");
console.log("5. Replace YOUR_JWT_TOKEN_HERE in this script");
console.log("=".repeat(60) + "\n");

// Uncomment this line after adding your token
// testCreateAward();

console.log("Script ready. Uncomment the last line after adding your token.");
