# reCAPTCHA Quick Start Guide

## ⚡ Quick Setup (5 Minutes)

### 1️⃣ Get Your Keys (2 minutes)
1. Visit: https://www.google.com/recaptcha/admin/create
2. Choose: **reCAPTCHA v2** → **"I'm not a robot" Checkbox**
3. Add domains: `localhost` and your production domain
4. Copy both keys:
   - **Site Key** (6L...) → for frontend
   - **Secret Key** (6L...) → for backend

### 2️⃣ Update Backend (1 minute)
Edit `backend/.env`:
```env
RECAPTCHA_SECRET_KEY=6L...your_secret_key_here
RECAPTCHA_ENABLED=true
```

### 3️⃣ Update Frontend (1 minute)
Edit `client/src/app/environments/environment.ts`:
```typescript
recaptchaSiteKey: '6L...your_site_key_here',
```

Edit `client/src/app/environments/environment.prod.ts`:
```typescript
recaptchaSiteKey: '6L...your_site_key_here',
```

### 4️⃣ Test (1 minute)
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd client && npm start
```

Visit `http://localhost:4200/login` and verify:
- ✅ reCAPTCHA widget appears
- ✅ Login fails without checking reCAPTCHA
- ✅ Login succeeds with reCAPTCHA checked

---

## 🔧 Development Mode

To disable reCAPTCHA during development:
```env
RECAPTCHA_ENABLED=false
```

---

## ✅ What's Already Done

All code is implemented! You just need to:
1. Get your reCAPTCHA keys from Google
2. Update the 3 configuration files above
3. Test the login

---

## 📁 Files Modified

### Backend (3 files)
- `backend/.env` - Added reCAPTCHA config
- `backend/routes/auth.routes.js` - Added middleware
- `backend/middleware/recaptcha.middleware.js` - ✅ Created

### Frontend (6 files)
- `client/src/index.html` - Added reCAPTCHA script
- `client/src/app/environments/environment.ts` - Added site key
- `client/src/app/environments/environment.prod.ts` - Added site key
- `client/src/app/services/recaptcha.service.ts` - ✅ Created
- `client/src/app/features/auth/login/login.ts` - Updated logic
- `client/src/app/features/auth/login/login.html` - Added widget
- `client/src/app/shared/interface/auth.interface.ts` - Updated interface

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Widget not showing | Check browser console, verify site key |
| Verification fails | Check secret key in backend/.env |
| "reCAPTCHA not loaded" | Check internet connection, disable ad blockers |
| Backend 400 error | Ensure RECAPTCHA_ENABLED=true |

---

## 📚 Full Documentation

- **Complete Guide**: `RECAPTCHA_IMPLEMENTATION_COMPLETE.md`
- **Detailed Steps**: `RECAPTCHA_IMPLEMENTATION_GUIDE.md`
- **Checklist**: `RECAPTCHA_SETUP_CHECKLIST.md`

---

**Status**: ✅ Implementation Complete - Ready for Keys
