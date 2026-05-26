# How to Enable reCAPTCHA with Real Keys

## 🔒 Current Status

**reCAPTCHA is DISABLED** (`RECAPTCHA_ENABLED=false` in backend/.env)

This allows you to continue development without reCAPTCHA blocking your login. The widget still appears on the frontend, but the backend skips verification.

---

## ✅ Why It's Disabled

The test keys I initially configured don't work with Google's actual verification API. To use reCAPTCHA in production, you need to:

1. Register your own site with Google
2. Get your own Site Key and Secret Key
3. Update the configuration files
4. Enable verification

---

## 🚀 How to Enable reCAPTCHA (When Ready)

### Step 1: Register Your Site with Google (5 minutes)

1. **Go to**: https://www.google.com/recaptcha/admin/create

2. **Sign in** with your Google account

3. **Fill in the registration form**:
   - **Label**: `Faculty Management System` (or your preferred name)
   - **reCAPTCHA type**: Select **reCAPTCHA v2** → **"I'm not a robot" Checkbox**
   - **Domains**: 
     - For development: Add `localhost`
     - For production: Add your actual domain (e.g., `yourdomain.com`)
     - You can add multiple domains

4. **Accept** the reCAPTCHA Terms of Service

5. **Click Submit**

6. **Copy your keys**:
   - **Site Key** (starts with `6L...`) - This goes in the frontend
   - **Secret Key** (starts with `6L...`) - This goes in the backend

---

### Step 2: Update Backend Configuration (1 minute)

Edit `backend/.env`:

```env
# Google reCAPTCHA Configuration
RECAPTCHA_SECRET_KEY=6L...your_actual_secret_key_here
RECAPTCHA_ENABLED=true
```

**Important**: 
- Replace `6L...your_actual_secret_key_here` with your actual Secret Key
- Change `RECAPTCHA_ENABLED=true` to enable verification

---

### Step 3: Update Frontend Configuration (1 minute)

**For Development:**

Edit `client/src/app/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  recaptchaSiteKey: '6L...your_actual_site_key_here', // Replace this
};
```

**For Production:**

Edit `client/src/app/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api',
  recaptchaSiteKey: '6L...your_actual_site_key_here', // Replace this
};
```

**Important**: Replace `6L...your_actual_site_key_here` with your actual Site Key

---

### Step 4: Restart Your Application (1 minute)

**Backend:**
```bash
# Stop the backend (Ctrl+C)
cd backend
npm start
```

**Frontend:**
```bash
# Stop the frontend (Ctrl+C)
cd client
npm start
```

---

### Step 5: Test (2 minutes)

1. Go to: `http://localhost:4200/login`
2. You should see the reCAPTCHA widget
3. Enter your credentials
4. Check the "I'm not a robot" box
5. Click "Sign In"

**Expected Results**:

✅ **With reCAPTCHA checked**: Login succeeds

❌ **Without reCAPTCHA checked**: Error message appears

**Backend console should show**:
```
✅ reCAPTCHA verification successful
```

---

## 🔧 Current Setup (Development Mode)

### What Works Now

With `RECAPTCHA_ENABLED=false`:

✅ Login works without reCAPTCHA verification
✅ Widget still appears (for UI consistency)
✅ No blocking during development
✅ You can continue working on other features

### What Happens

1. Frontend sends reCAPTCHA token (if checked)
2. Backend receives the token
3. Backend **skips verification** (because `RECAPTCHA_ENABLED=false`)
4. Login proceeds normally

Backend logs will show:
```
⚠️  reCAPTCHA verification skipped (disabled in environment)
```

---

## 📋 Quick Reference

### Files to Update When Enabling

| File | What to Change |
|------|----------------|
| `backend/.env` | Add Secret Key, set `RECAPTCHA_ENABLED=true` |
| `client/src/app/environments/environment.ts` | Add Site Key |
| `client/src/app/environments/environment.prod.ts` | Add Site Key |

### Keys You Need

| Key Type | Where It Goes | Purpose |
|----------|---------------|---------|
| **Site Key** | Frontend (environment files) | Renders the widget |
| **Secret Key** | Backend (.env file) | Verifies the token |

---

## 🌐 Domain Configuration

### For Development (localhost)

When registering with Google, add:
```
localhost
```

This allows testing on your local machine.

### For Production

When deploying, add your actual domain:
```
yourdomain.com
www.yourdomain.com
```

You can add multiple domains to the same reCAPTCHA registration.

---

## 🔒 Security Notes

### Keep Secret Key Secret

❌ **Never**:
- Commit `.env` file to git
- Share your Secret Key publicly
- Use the same keys for dev and production (optional, but recommended)

✅ **Always**:
- Keep Secret Key in `.env` file only
- Add `.env` to `.gitignore`
- Use environment variables in production

### Production Checklist

Before deploying to production:

- [ ] Register production domain with Google reCAPTCHA
- [ ] Get production keys (separate from dev keys)
- [ ] Update `environment.prod.ts` with production Site Key
- [ ] Set production Secret Key in server environment
- [ ] Set `RECAPTCHA_ENABLED=true` in production
- [ ] Test on production domain
- [ ] Monitor reCAPTCHA admin console for suspicious activity

---

## 🆘 Troubleshooting

### "invalid-input-secret" Error

**Problem**: Wrong Secret Key in backend

**Solution**: 
1. Check `backend/.env` has correct Secret Key
2. Verify you copied the Secret Key (not Site Key)
3. Restart backend server

### "invalid-input-response" Error

**Problem**: Token is invalid or expired

**Solution**:
1. Check frontend has correct Site Key
2. Ensure domain matches registered domain
3. Token expires after ~2 minutes - try again

### Widget Not Showing

**Problem**: Wrong Site Key or domain not registered

**Solution**:
1. Check `environment.ts` has correct Site Key
2. Verify domain is registered in Google admin
3. Check browser console for errors

### Verification Always Fails

**Problem**: Keys don't match or domain mismatch

**Solution**:
1. Verify Site Key and Secret Key are from same registration
2. Check domain in Google admin matches your domain
3. For localhost, ensure "localhost" is added to domains

---

## 📊 Monitoring

### Google reCAPTCHA Admin Console

Visit: https://www.google.com/recaptcha/admin

Here you can:
- View verification statistics
- Monitor suspicious activity
- Manage domains
- Regenerate keys if needed
- See error rates

---

## 🎯 When to Enable

### Enable reCAPTCHA When:

✅ Deploying to production
✅ Opening to public users
✅ Experiencing bot attacks
✅ Need to prevent brute force attempts

### Keep Disabled When:

⏸️ Actively developing
⏸️ Running automated tests
⏸️ Debugging login issues
⏸️ Testing with multiple accounts

---

## 📝 Summary

**Current Status**: 
- ✅ Code is fully implemented
- ✅ Widget appears on login page
- ⏸️ Verification is disabled for development
- 🔒 Ready to enable with real keys

**To Enable**:
1. Get keys from Google (5 min)
2. Update 3 config files (2 min)
3. Restart app (1 min)
4. Test (2 min)

**Total Time**: ~10 minutes when you're ready

---

**Documentation**: Complete  
**Code**: Ready  
**Status**: Disabled for development  
**Action**: Enable when ready for production
