# Faculty Notifications - Troubleshooting Guide

## ❌ Issue: "Faculty Notifications" Menu Not Showing

If you can't see the "Faculty Notifications" menu item in the dean sidebar, follow these steps:

---

## ✅ Solution: Restart Frontend

### Step 1: Stop the Frontend Server
1. Go to the terminal/command prompt where your frontend is running
2. Press `Ctrl + C` to stop the server
3. Wait for it to fully stop

### Step 2: Restart the Frontend
```bash
cd client
npm start
```

### Step 3: Wait for Compilation
Wait for the message:
```
✔ Browser application bundle generation complete.
✔ Built at: [timestamp]
```

### Step 4: Refresh Browser
1. Go to your browser
2. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Or clear cache and reload

### Step 5: Login and Check
1. Login as a dean
2. Look at the left sidebar
3. You should now see "Faculty Notifications" between "Faculty" and "Organization"

---

## 🔍 Alternative: Check Browser Console

If it still doesn't show:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors (red text)
4. Share the error messages if you see any

---

## 📋 Quick Checklist

- [ ] Frontend server restarted
- [ ] Browser cache cleared
- [ ] Logged in as dean (not faculty/organization)
- [ ] No errors in browser console
- [ ] Backend is running (port 3000)
- [ ] Frontend is running (port 7283)

---

## 🎯 Expected Result

After restarting, you should see this in the sidebar:

```
Dean Portal
├── Dashboard
├── Faculty
├── Faculty Notifications  ← This should appear
├── Organization
├── Portfolio
├── Credentials
└── Personal Data Sheet
```

---

## 🆘 Still Not Working?

If you still can't see it after restarting:

1. **Check the browser console** (F12) for errors
2. **Verify you're logged in as a dean**
3. **Try a different browser**
4. **Check if the files exist:**
   - `client/src/app/features/dean/faculty-notifications/faculty-notifications.ts`
   - `client/src/app/features/dean/faculty-notifications/faculty-notifications.html`
   - `client/src/app/features/dean/faculty-notifications/faculty-notifications.css`

---

## 💡 Pro Tip

For faster development, use Angular's development server which auto-reloads:
```bash
cd client
ng serve --port 7283
```

This will automatically reload when you make changes to the code.

---

**Status:** Frontend needs restart to show new menu item  
**Action:** Restart frontend server and refresh browser
