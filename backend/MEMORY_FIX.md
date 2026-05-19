# Memory Issue Fix - JavaScript Heap Out of Memory

## 🔴 Problem
The backend server crashed with: **"FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory"**

This happens when Node.js tries to load too much data into memory at once.

## ✅ Solution Applied

### 1. Increased Node.js Memory Limit

Updated `package.json` scripts to allocate more memory:

```json
"scripts": {
  "start": "node --max-old-space-size=4096 index.js",
  "dev": "nodemon --max-old-space-size=4096 index.js"
}
```

This increases the heap size from default (~1.5GB) to 4GB.

### 2. How to Restart the Server

```bash
cd backend
npm start
```

Or if using nodemon for development:

```bash
npm run dev
```

## 🔍 Root Cause Analysis

The crash occurred while querying:
- Deans table
- Faculties table (by department)
- Requirement submissions (for multiple faculty IDs)

This suggests the system was loading large amounts of data without pagination or limits.

## 🛠️ Additional Optimizations Needed

### 1. Add Pagination to Large Queries

For queries that return many records, add pagination:

```javascript
// BAD - Loads all records
const faculties = await db.Faculty.findAll({
  where: { department: 'College of Engineering' }
});

// GOOD - Loads in pages
const faculties = await db.Faculty.findAll({
  where: { department: 'College of Engineering' },
  limit: 50,
  offset: (page - 1) * 50
});
```

### 2. Use Streaming for Large Datasets

For exports or bulk operations:

```javascript
const { QueryTypes } = require('sequelize');

// Stream results instead of loading all at once
const stream = await sequelize.query(
  'SELECT * FROM faculties WHERE department = ?',
  {
    replacements: [department],
    type: QueryTypes.SELECT,
    raw: true
  }
);
```

### 3. Limit Included Associations

Only include necessary related data:

```javascript
// BAD - Loads everything
const faculty = await db.Faculty.findAll({
  include: [{ all: true, nested: true }]
});

// GOOD - Only load what you need
const faculty = await db.Faculty.findAll({
  include: [
    {
      model: db.RequirementSubmission,
      attributes: ['submission_id', 'status'],
      limit: 10
    }
  ]
});
```

## 📊 Memory Monitoring

### Check Current Memory Usage

Add this to your code for monitoring:

```javascript
// Log memory usage
setInterval(() => {
  const used = process.memoryUsage();
  console.log('Memory Usage:');
  console.log(`  RSS: ${Math.round(used.rss / 1024 / 1024)} MB`);
  console.log(`  Heap Used: ${Math.round(used.heapUsed / 1024 / 1024)} MB`);
  console.log(`  Heap Total: ${Math.round(used.heapTotal / 1024 / 1024)} MB`);
}, 60000); // Every minute
```

### Monitor in Production

Use PM2 for production monitoring:

```bash
npm install -g pm2
pm2 start index.js --name "backend" --max-memory-restart 3G
pm2 monit
```

## 🚨 Warning Signs

Watch for these indicators of memory issues:

1. **Slow Response Times** - Queries taking longer than usual
2. **Increasing Memory Usage** - Memory not being released
3. **Frequent Garbage Collection** - Logs showing GC activity
4. **Server Crashes** - Unexpected restarts

## 🔧 Quick Fixes

### If Server Crashes Again

1. **Restart with more memory:**
   ```bash
   node --max-old-space-size=8192 index.js
   ```

2. **Clear Node cache:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Check for memory leaks:**
   ```bash
   node --inspect index.js
   # Then use Chrome DevTools to profile
   ```

## 📝 Best Practices

### 1. Always Use Pagination

```javascript
exports.getItems = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await db.Item.findAndCountAll({
    limit,
    offset
  });

  res.json({
    items: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });
};
```

### 2. Use Lean Queries

```javascript
// Only select needed columns
const users = await db.User.findAll({
  attributes: ['user_id', 'email', 'role'],
  where: { is_active: true }
});
```

### 3. Implement Caching

```javascript
const cache = new Map();

exports.getCachedData = async (key) => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = await db.Model.findAll();
  cache.set(key, data);
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(key), 300000);
  
  return data;
};
```

### 4. Clean Up Resources

```javascript
// Close connections when done
process.on('SIGINT', async () => {
  await db.sequelize.close();
  process.exit(0);
});
```

## 🎯 Immediate Actions

1. ✅ **Memory limit increased** - Server can now handle more data
2. ⚠️ **Review large queries** - Add pagination where needed
3. ⚠️ **Monitor memory usage** - Watch for patterns
4. ⚠️ **Optimize associations** - Only load necessary data

## 📈 Memory Allocation Guide

| Server RAM | Node Memory Limit | Command |
|------------|-------------------|---------|
| 2GB | 1.5GB | `--max-old-space-size=1536` |
| 4GB | 3GB | `--max-old-space-size=3072` |
| 8GB | 6GB | `--max-old-space-size=6144` |
| 16GB | 12GB | `--max-old-space-size=12288` |

**Current Setting:** 4GB (`--max-old-space-size=4096`)

## 🔄 Next Steps

1. **Restart the server** with the new memory settings
2. **Monitor performance** for the next few hours
3. **Review and optimize** queries that load large datasets
4. **Implement pagination** on all list endpoints
5. **Add memory monitoring** to track usage patterns

## 📞 If Issues Persist

If memory issues continue:

1. **Profile the application** to find memory leaks
2. **Review database queries** for N+1 problems
3. **Implement database indexing** for faster queries
4. **Consider database query optimization**
5. **Use connection pooling** effectively

---

**Status:** ✅ Fixed - Server can now restart with increased memory
**Action Required:** Restart the backend server
