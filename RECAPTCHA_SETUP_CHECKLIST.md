# reCAPTCHA Setup Checklist

Follow these steps in order to implement Google reCAPTCHA in your system.

## ☐ Step 1: Get reCAPTCHA Keys (5 minutes)

1. Go to https://www.google.com/recaptcha/admin/create
2. Sign in with your Google account
3. Fill in the registration form:
   - **Label**: `Faculty Management System` (or your app name)
   - **reCAPTCHA type**: Select **reCAPTCHA v2** → **"I'm not a robot" Checkbox**
   - **Domains**: 
     - Add `localhost` (for development)
     - Add your production domain (e.g., `yourdomain.com`)
4. Accept the reCAPTCHA Terms of Service
5. Click **Submit**
6. **Copy and save**:
   - ✅ **Site Key** (starts with `6L...`) - for frontend
   - ✅ **Secret Key** (starts with `6L...`) - for backend

## ☐ Step 2: Backend Setup (10 minutes)

### 2.1 Install Dependencies
```bash
cd backend
npm install axios
```

### 2.2 Update Environment Variables
Edit `backend/.env` and add:
```env
# Google reCAPTCHA Configuration
RECAPTCHA_SECRET_KEY=your_secret_key_here
RECAPTCHA_ENABLED=true
```

**Important**: Replace `your_secret_key_here` with your actual Secret Key from Step 1

### 2.3 Files Already Created
✅ `backend/middleware/recaptcha.middleware.js` - Already created

### 2.4 Update Auth Routes
Edit `backend/routes/auth.routes.js`:

```javascript
const verifyRecaptcha = require("../middleware/recaptcha.middleware");

// Add verifyRecaptcha middleware to login route
router.post("/login", verifyRecaptcha, authController.login);

// Optional: Add to password reset
router.post("/forgot-password", verifyRecaptcha, authController.forgotPassword);
```

### 2.5 Update Faculty Requirements Routes
Edit `backend/routes/faculty-requirement.routes.js`:

```javascript
const verifyRecaptcha = require("../middleware/recaptcha.middleware");

// Add to submit route
router.post(
	"/submit",
	verifyRecaptcha,  // Add this line
	upload.array("files", 10),
	requirementController.submitRequirement,
);
```

### 2.6 Update Organization Routes
Edit `backend/routes/organization.routes.js`:

```javascript
const verifyRecaptcha = require("../middleware/recaptcha.middleware");

// Add to document submission route
router.post(
	"/documents",
	verifyRecaptcha,  // Add this line
	upload.single("document"),
	organizationController.submitDocument,
);
```

## ☐ Step 3: Frontend Setup (15 minutes)

### 3.1 Files Already Created
✅ `client/src/app/services/recaptcha.service.ts` - Already created

### 3.2 Update index.html
Edit `client/src/index.html` and add reCAPTCHA script in `<head>`:

```html
<head>
  <!-- ... existing head content ... -->
  
  <!-- Google reCAPTCHA -->
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</head>
```

### 3.3 Update Environment Files

**Edit `client/src/app/environments/environment.ts`:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  recaptchaSiteKey: 'your_site_key_here', // Add this line
};
```

**Edit `client/src/app/environments/environment.prod.ts`:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-domain.com/api',
  recaptchaSiteKey: 'your_site_key_here', // Add this line
};
```

**Important**: Replace `your_site_key_here` with your actual Site Key from Step 1

### 3.4 Update Login Component

**Edit `client/src/app/features/auth/login/login.ts`:**

Add imports:
```typescript
import { RecaptchaService } from '../../../services/recaptcha.service';
import { environment } from '../../../environments/environment';
```

Add to class:
```typescript
private recaptchaService = inject(RecaptchaService);
recaptchaSiteKey = environment.recaptchaSiteKey;
```

Update login method:
```typescript
async login() {
  if (!this.email() || !this.password()) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Information',
      text: 'Please enter both email and password',
    });
    return;
  }

  this.loading.set(true);

  try {
    // Get reCAPTCHA token
    const recaptchaToken = await this.recaptchaService.executeRecaptcha('login');

    // Attempt login with reCAPTCHA token
    this.authService.login(this.email(), this.password(), recaptchaToken).subscribe({
      next: (response) => {
        this.loading.set(false);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome back!',
          timer: 1500,
          showConfirmButton: false,
        });
        this.redirectToDashboard();
      },
      error: (error) => {
        this.loading.set(false);
        this.recaptchaService.resetRecaptcha(); // Reset on error
        
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.error?.message || 'Invalid credentials',
        });
      },
    });
  } catch (error) {
    this.loading.set(false);
    Swal.fire({
      icon: 'error',
      title: 'reCAPTCHA Error',
      text: error as string || 'Please complete the reCAPTCHA challenge',
    });
  }
}
```

**Edit `client/src/app/features/auth/login/login.html`:**

Add reCAPTCHA widget before the login button:
```html
<!-- Add this div before the login button -->
<div class="mb-4 flex justify-center">
  <div class="g-recaptcha" 
       [attr.data-sitekey]="recaptchaSiteKey"
       data-theme="light"
       data-size="normal">
  </div>
</div>

<!-- Existing login button -->
<button type="submit" ...>
  Login
</button>
```

### 3.5 Update Auth Service

**Edit `client/src/app/services/auth.service.ts`:**

Update login method signature:
```typescript
login(email: string, password: string, recaptchaToken: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/auth/login`, { 
    email, 
    password,
    recaptchaToken // Add this
  }).pipe(
    tap((response: any) => {
      // ... existing logic
    })
  );
}
```

## ☐ Step 4: Testing (10 minutes)

### 4.1 Development Testing
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd client && npm start`
3. Navigate to login page
4. Verify reCAPTCHA widget appears
5. Try logging in without checking reCAPTCHA → Should fail
6. Check reCAPTCHA and login → Should succeed

### 4.2 Test Scenarios
- ☐ Login without reCAPTCHA → Should show error
- ☐ Login with reCAPTCHA → Should succeed
- ☐ Submit requirement without reCAPTCHA → Should fail
- ☐ Submit requirement with reCAPTCHA → Should succeed
- ☐ Check backend logs for verification messages

### 4.3 Disable for Development (Optional)
If you want to disable reCAPTCHA during development:
```env
RECAPTCHA_ENABLED=false
```

## ☐ Step 5: Production Deployment

### 5.1 Pre-Deployment Checklist
- ☐ Verify production domain is added to reCAPTCHA admin console
- ☐ Update `environment.prod.ts` with correct Site Key
- ☐ Set `RECAPTCHA_ENABLED=true` in production `.env`
- ☐ Verify Secret Key is set in production environment
- ☐ Test on staging environment first

### 5.2 Security Checklist
- ☐ Never commit `.env` file to git
- ☐ Keep Secret Key confidential
- ☐ Use HTTPS in production
- ☐ Monitor reCAPTCHA admin console for suspicious activity
- ☐ Set up rate limiting as additional protection

## ☐ Step 6: Monitoring & Maintenance

### 6.1 Monitor Usage
- Check Google reCAPTCHA admin console: https://www.google.com/recaptcha/admin
- Review verification statistics
- Check for unusual patterns

### 6.2 Backend Logs
Monitor backend logs for:
- `✅ reCAPTCHA verification successful`
- `❌ reCAPTCHA verification failed`
- `⚠️  reCAPTCHA verification skipped`

### 6.3 Troubleshooting
**reCAPTCHA not showing:**
- Check if script is loaded in browser console
- Verify Site Key is correct
- Check domain is registered

**Verification fails:**
- Verify Secret Key is correct
- Check domain matches registered domain
- Ensure backend can reach Google's API

## Additional Forms to Protect (Optional)

Consider adding reCAPTCHA to:
- ☐ Password reset form
- ☐ Organization document submissions
- ☐ Faculty requirement submissions
- ☐ User registration (if applicable)
- ☐ Contact forms

## Quick Reference

### Environment Variables
```env
# Backend (.env)
RECAPTCHA_SECRET_KEY=6L...your_secret_key
RECAPTCHA_ENABLED=true

# Frontend (environment.ts)
recaptchaSiteKey: '6L...your_site_key'
```

### Import Middleware
```javascript
const verifyRecaptcha = require("../middleware/recaptcha.middleware");
router.post("/route", verifyRecaptcha, controller.method);
```

### Frontend Usage
```typescript
const token = await this.recaptchaService.executeRecaptcha();
this.service.method(data, token).subscribe(...);
this.recaptchaService.resetRecaptcha(); // After submission
```

## Support

- Google reCAPTCHA Docs: https://developers.google.com/recaptcha
- Admin Console: https://www.google.com/recaptcha/admin
- FAQ: https://developers.google.com/recaptcha/docs/faq

---

**Estimated Total Time**: 40-50 minutes
**Difficulty**: Intermediate
**Impact**: High (Prevents bot attacks and spam)
