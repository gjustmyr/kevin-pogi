// Quick test script to verify backend is responding
const http = require('http');

console.log('Testing backend server...\n');

// Test 1: Check if server is listening
const testEndpoint = (path, description) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`✓ ${description}`);
        console.log(`  Status: ${res.statusCode}`);
        console.log(`  Response: ${data.substring(0, 100)}...\n`);
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`✗ ${description}`);
      console.log(`  Error: ${error.message}\n`);
      reject(error);
    });

    req.on('timeout', () => {
      console.log(`✗ ${description}`);
      console.log(`  Error: Request timeout\n`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
};

// Run tests
(async () => {
  try {
    await testEndpoint('/api/hello', 'Test 1: Basic API endpoint');
    await testEndpoint('/api/dropdown/academic-years', 'Test 2: Dropdown endpoint (no auth)');
    
    console.log('✓ Backend server is responding correctly!');
    console.log('\nIf the webpage is still loading:');
    console.log('1. Open browser console (F12)');
    console.log('2. Check for JavaScript errors');
    console.log('3. Check Network tab for failed requests');
    console.log('4. Verify Angular dev server is running on port 4200');
    
  } catch (error) {
    console.log('\n✗ Backend server is NOT responding!');
    console.log('\nTroubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm start');
    console.log('2. Check if port 3000 is in use by another process');
    console.log('3. Check backend console for errors');
  }
})();
