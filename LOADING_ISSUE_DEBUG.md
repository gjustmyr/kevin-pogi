# Webpage Loading Issue - Debugging Guide

## Problema
Ang webpage ay palaging naka-loading at hindi nag-loload ng content.

## Possible Causes at Solutions

### 1. Check Browser Console
Buksan ang browser console (F12) at tingnan kung may:
- **Red errors** - JavaScript errors na nag-block ng app
- **Network errors** - Failed API requests (404, 500, CORS errors)
- **Warnings** - Deprecation warnings o configuration issues

### 2. Check Network Tab
Sa browser DevTools > Network tab:
- Tingnan kung may **pending requests** na hindi nag-complete
- Check kung may **failed requests** (red status)
- Verify kung ang API URL ay tama (`http://localhost:3000/api`)

### 3. Common Issues

#### A. CORS Error
**Symptom:** Console shows "CORS policy" error
**Solution:** Check backend CORS configuration

```javascript
// backend/index.js - Verify CORS is configured
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

#### B. API Not Responding
**Symptom:** Network requests stuck in "pending"
**Solution:** 
1. Verify backend is running: `cd backend && npm start`
2. Test API directly: Open `http://localhost:3000/api/health` in browser

#### C. Environment Configuration
**Symptom:** API calls going to wrong URL
**Solution:** Check `client/src/app/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',  // Must match backend port
};
```

#### D. Infinite Loop in Component
**Symptom:** Component keeps loading, high CPU usage
**Solution:** Check for infinite loops in:
- `ngOnInit()` methods
- Signal updates that trigger themselves
- Recursive API calls

### 4. Quick Diagnostic Steps

1. **Clear browser cache and reload** (Ctrl+Shift+R)
2. **Check if backend is running:**
   ```cmd
   netstat -ano | findstr :3000
   ```
3. **Test backend health:**
   ```cmd
   curl http://localhost:3000/api/health
   ```
4. **Check Angular dev server:**
   ```cmd
   cd client
   ng serve
   ```

### 5. Specific Component Issues

If loading happens on a specific page, check:
- Component's `ngOnInit()` for blocking operations
- HTTP requests that don't have error handlers
- Guards that might be blocking navigation

### 6. Browser-Specific Issues

Try:
- Different browser (Chrome, Firefox, Edge)
- Incognito/Private mode
- Disable browser extensions

## Next Steps

1. Open browser console (F12)
2. Note any errors or warnings
3. Check Network tab for failed requests
4. Share the specific error messages for targeted help
