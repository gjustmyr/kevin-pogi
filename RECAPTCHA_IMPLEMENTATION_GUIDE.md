# Google reCAPTCHA Implementation Guide

## Overview
This guide provides step-by-step instructions to integrate Google reCAPTCHA v2 into the system to prevent bot activity and automated spam on login and submission forms.

## Prerequisites

### 1. Get reCAPTCHA Keys
1. Go to https://www.google.com/recaptcha/admin/create
2. Register your site:
   - **Label**: Your application name (e.g., "Faculty Management System")
   - **reCAPTCHA type**: Select "reCAPTCHA v2" → "I'm not a robot" Checkbox
   - **Domains**: Add your domains (e.g., `localhost`, `yourdomain.com`)
3. Accept terms and submit
4. Copy the **Site Key** (for frontend) and **Secret Key** (for backend)

## Backend Implementation

### Step 1: Install Required Package

```bash
cd backend
npm install axios
```

### Step 2: Add Environment Variables

Add to `backend/.env`:

```env
# Google reCAPTCHA
RECAPTCHA_SECRET_KEY=your_secret_key_here
RECAPTCHA_ENABLED=true
```

### Step 3: Create reCAPTCHA Middleware

Create file: `backend/middleware/recaptcha.middleware.js`

```javascript
const axios = require('axios');

/**
 * Middleware to verify Google reCAPTCHA token
 * Validates the reCAPTCHA response from the client
 */
const verifyRecaptcha = async (req, res, next) => {
	// Skip reCAPTCHA verification if disabled (for development/testing)
	if (process.env.RECAPTCHA_ENABLED !== 'true') {
		console.log('reCAPTCHA verification skipped (disabled in environment)');
		return next();
	}

	const recaptchaToken = req.body.recaptchaToken;

	// Check if token is provided
	if (!recaptchaToken) {
		return res.status(400).json({
			message: 'reCAPTCHA verification required. Please complete the reCAPTCHA challenge.',
		});
	}

	try {
		// Verify token with Google reCAPTCHA API
		const response = await axios.post(
			'https://www.google.com/recaptcha/api/siteverify',
			null,
			{
				params: {
					secret: process.env.RECAPTCHA_SECRET_KEY,
					response: recaptchaToken,
					remoteip: req.ip || req.connection.remoteAddress,
				},
			}
		);

		const { success, score, 'error-codes': errorCodes } = response.data;

		// Check if verification was successful
		if (!success) {
			console.error('reCAPTCHA verification failed:', errorCodes);
			return res.status(400).json({
				message: 'reCAPTCHA verification failed. Please try again.',
				errors: errorCodes,
			});
		}

		// For reCAPTCHA v2, success is boolean
		// For reCAPTCHA v3, you would check the score here
		console.log('reCAPTCHA verification successful');
		
		// Attach verification result to request for logging
		req.recaptchaVerified = true;
		
		next();
	} catch (error) {
		console.error('reCAPTCHA verification error:', error.message);
		return res.status(500).json({
			message: 'reCAPTCHA verification service unavailable. Please try again later.',
		});
	}
};

module.exports = verifyRecaptcha;
```

### Step 4: Update Auth Controller

Modify `backend/controllers/auth.controller.js` to expect recaptchaToken:

```javascript
// At the top of login function, the recaptchaToken will be validated by middleware
// The token should be removed from the body before processing
exports.login = async (req, res) => {
	try {
		const { email, password, recaptchaToken } = req.body; // recaptchaToken validated by middleware
		
		// Remove recaptchaToken from further processing
		delete req.body.recaptchaToken;
		
		// ... rest of login logic
	} catch (error) {
		// ... error handling
	}
};
```

### Step 5: Update Auth Routes

Modify `backend/routes/auth.routes.js`:

```javascript
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifyRecaptcha = require("../middleware/recaptcha.middleware");

// Login route with reCAPTCHA verification
router.post("/login", verifyRecaptcha, authController.login);

// Password reset request with reCAPTCHA
router.post("/forgot-password", verifyRecaptcha, authController.forgotPassword);

// Other routes...
module.exports = router;
```

### Step 6: Update Submission Routes

Add reCAPTCHA to faculty requirements and organization documents:

**backend/routes/faculty-requirement.routes.js:**
```javascript
const verifyRecaptcha = require("../middleware/recaptcha.middleware");

// Submit requirement with reCAPTCHA
router.post(
	"/submit",
	verifyRecaptcha,
	upload.array("files", 10),
	requirementController.submitRequirement,
);
```

**backend/routes/organization.routes.js:**
```javascript
const verifyRecaptcha = require("../middleware/recaptcha.middleware");

// Submit document with reCAPTCHA
router.post(
	"/documents",
	verifyRecaptcha,
	upload.single("document"),
	organizationController.submitDocument,
);
```

## Frontend Implementation

### Step 1: Add reCAPTCHA Script to index.html

Modify `client/src/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Faculty Management System</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/x-icon" href="favicon.ico" />
  
  <!-- Google reCAPTCHA -->
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### Step 2: Add reCAPTCHA Site Key to Environment

Modify `client/src/app/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  recaptchaSiteKey: 'your_site_key_here', // Add this
};
```

Modify `client/src/app/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-domain.com/api',
  recaptchaSiteKey: 'your_site_key_here', // Add this
};
```

### Step 3: Create reCAPTCHA Service

Create file: `client/src/app/services/recaptcha.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

declare const grecaptcha: any;

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private siteKey = environment.recaptchaSiteKey;

  /**
   * Execute reCAPTCHA and get token
   * @param action Optional action name for reCAPTCHA v3
   * @returns Promise with reCAPTCHA token
   */
  async executeRecaptcha(action: string = 'submit'): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof grecaptcha === 'undefined') {
        reject('reCAPTCHA not loaded');
        return;
      }

      try {
        // For reCAPTCHA v2, we need to render and get response
        const response = grecaptcha.getResponse();
        if (response) {
          resolve(response);
        } else {
          reject('Please complete the reCAPTCHA challenge');
        }
      } catch (error) {
        reject('reCAPTCHA error: ' + error);
      }
    });
  }

  /**
   * Reset reCAPTCHA widget
   */
  resetRecaptcha(): void {
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.reset();
    }
  }

  /**
   * Get site key for rendering reCAPTCHA
   */
  getSiteKey(): string {
    return this.siteKey;
  }
}
```

### Step 4: Update Login Component

Modify `client/src/app/features/auth/login/login.html`:

Add reCAPTCHA widget before the login button:

```html
<!-- Add this before the login button -->
<div class="mb-4 flex justify-center">
  <div class="g-recaptcha" 
       [attr.data-sitekey]="recaptchaSiteKey"
       data-theme="light"
       data-size="normal">
  </div>
</div>

<!-- Login button -->
<button
  type="submit"
  [disabled]="loading()"
  class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
>
  {{ loading() ? 'Logging in...' : 'Login' }}
</button>
```

Modify `client/src/app/features/auth/login/login.ts`:

```typescript
import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth.service';
import { RecaptchaService } from '../../../services/recaptcha.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

export class LoginComponent implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);
  private recaptchaService = inject(RecaptchaService);

  email = signal('');
  password = signal('');
  loading = signal(false);
  recaptchaSiteKey = environment.recaptchaSiteKey;

  ngOnInit() {
    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }
  }

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
          this.recaptchaService.resetRecaptcha(); // Reset reCAPTCHA on error
          
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.error?.message || 'Invalid credentials or reCAPTCHA verification failed',
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

  private redirectToDashboard() {
    const user = this.authService.currentUser();
    if (!user) return;

    const roleRoutes: { [key: string]: string } = {
      superadmin: '/superadmin/dashboard',
      dean: '/dean/dashboard',
      faculty: '/faculty/dashboard',
      organization: '/organization/dashboard',
    };

    this.router.navigate([roleRoutes[user.role] || '/']);
  }
}
```

### Step 5: Update Auth Service

Modify `client/src/app/services/auth.service.ts`:

```typescript
login(email: string, password: string, recaptchaToken: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/auth/login`, { 
    email, 
    password,
    recaptchaToken // Add reCAPTCHA token
  }).pipe(
    tap((response: any) => {
      // ... existing login logic
    })
  );
}
```

## Testing

### Development Testing
1. Set `RECAPTCHA_ENABLED=false` in `.env` to disable during development
2. Test login and submission forms work without reCAPTCHA
3. Enable reCAPTCHA and test with valid tokens

### Production Testing
1. Ensure `RECAPTCHA_ENABLED=true` in production
2. Test login with and without completing reCAPTCHA
3. Verify backend rejects requests without valid tokens
4. Test submission forms with reCAPTCHA

## Security Considerations

1. **Never expose secret key** - Keep it in `.env` and never commit to git
2. **Always validate on backend** - Frontend validation can be bypassed
3. **Use HTTPS in production** - reCAPTCHA requires secure connections
4. **Monitor reCAPTCHA admin console** - Check for suspicious activity
5. **Rate limiting** - Consider adding rate limiting in addition to reCAPTCHA

## Troubleshooting

### reCAPTCHA not showing
- Check if script is loaded in index.html
- Verify site key is correct
- Check browser console for errors

### Verification fails
- Verify secret key is correct in backend
- Check if domain is registered in reCAPTCHA admin
- Ensure backend can reach Google's API

### Development issues
- Use `localhost` as domain in reCAPTCHA admin
- Set `RECAPTCHA_ENABLED=false` for local testing without internet

## Additional Forms to Protect

Consider adding reCAPTCHA to:
- Password reset requests
- User registration (if applicable)
- Contact forms
- Bulk upload operations
- Any public-facing forms

## Maintenance

1. **Monitor usage** - Check Google reCAPTCHA admin console regularly
2. **Update keys** - Rotate keys periodically for security
3. **Review logs** - Monitor backend logs for failed verifications
4. **Update domains** - Add new domains when deploying to new environments
