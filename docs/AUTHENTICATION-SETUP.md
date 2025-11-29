# Vendora Authentication System Documentation

## Overview

The Vendora platform implements a dual authentication system with separate flows for:
1. **Admin Portal** - For platform owners and administrators
2. **Vendor/POS Portal** - For merchants managing their stores

## Authentication Flows

### Admin Authentication Flow

#### Sign Up Process
1. Navigate to `/admin/auth/register`
2. Enter full name, work email, and password
3. Submit form to create admin account
4. System sends email verification link
5. Verify email via link `/admin/auth/verify-email?token=xxx`
6. Optional: Enable 2FA in account settings
7. Redirect to login page

#### Login Process
1. Navigate to `/admin/auth/login`
2. Enter email and password
3. System validates credentials and applies rate limiting
4. If account is locked: Display lockout expiry time
5. If 2FA enabled: Prompt for TOTP/email code
6. On success: Issue session with HttpOnly, Secure, SameSite cookies
7. Redirect to `/admin/dashboard`

### Vendor/POS Authentication Flow

#### Sign Up Process
1. Navigate to `/pos/auth/register`
2. **Step 1**: Select subscription plan (Basic, Pro, or Enterprise)
3. **Step 2**: Enter business details (business name, email, password)
4. **Step 3**: Redirect to payment processor (Stripe/PayPal)
5. On payment success: Webhook activates subscription
6. System provisions tenant and subdomain (e.g., myshop.vendora.site)
7. Send email verification link
8. Verify email via `/pos/auth/verify-email?token=xxx`
9. Redirect to login page

#### Login Process
1. Navigate to `/pos/auth/login`
2. Enter email and password
3. System validates credentials and applies rate limiting
4. If account is locked: Display lockout expiry time
5. If 2FA enabled: Prompt for TOTP/email code
6. On success: Issue session with role-based access
7. Redirect to `/pos/dashboard`

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Hashed using Argon2id or bcrypt (cost ≥ 12)

### Rate Limiting & Account Lockout
- **Failed Attempts**: 5 attempts allowed
- **Lockout Duration**: 15 minutes
- **Implementation**: Backend tracks `failed_login_attempts` and `account_locked_until`
- **UI Feedback**: Display lockout expiry time to user

### Two-Factor Authentication (2FA)
- **Methods**: TOTP (Google Authenticator) or Email-based
- **Setup**: Optional during registration, can enable in settings
- **Flow**: After password validation, prompt for 6-digit code
- **Implementation**: Stores encrypted `two_factor_secret` in database

### Email Verification
- **Token**: Random UUID stored with 30-60 minute expiry
- **Process**:
  - Generate token on registration
  - Send email with verification link
  - Validate token and mark `is_email_verified = true`
  - Token is single-use only

### Session Management
- **Storage**: HttpOnly, Secure, SameSite=Lax cookies
- **Tracking**: Session token, IP address, user agent
- **Expiration**: Configurable session timeout
- **Revocation**: Can revoke individual sessions or all sessions

## File Structure

```
client-side/
├── app/
│   ├── admin/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx                 # Admin login page
│   │       ├── register/
│   │       │   └── page.tsx                 # Admin registration page
│   │       ├── verify-email/
│   │       │   └── page.tsx                 # Admin email verification
│   │       └── forgot-password/
│   │           └── page.tsx                 # Admin password reset request
│   └── pos/
│       └── auth/
│           ├── login/
│           │   └── page.tsx                 # Vendor login page
│           ├── register/
│           │   └── page.tsx                 # Vendor registration (multi-step)
│           ├── verify-email/
│           │   └── page.tsx                 # Vendor email verification
│           └── forgot-password/
│               └── page.tsx                 # Vendor password reset request
├── components/
│   └── auth/
│       ├── email-verification.tsx           # Reusable email verification component
│       └── subscription-plan-selector.tsx   # Subscription plan selection UI
└── types/
    └── auth.ts                              # TypeScript type definitions
```

## Type Definitions

### User Types
```typescript
export type UserType = "admin" | "vendor"

export interface AdminUser {
  id: string
  full_name: string
  email: string
  role: "super_admin" | "support" | "billing"
  is_email_verified: boolean
  two_factor_enabled: boolean
  status: "active" | "suspended"
}

export interface VendorUser {
  id: string
  business_name: string
  email: string
  subscription_plan: string | null
  subscription_status: "active" | "trial" | "canceled" | "past_due"
  store_domain: string | null
  is_email_verified: boolean
  two_factor_enabled: boolean
  status: "active" | "suspended" | "deleted"
}
```

### Authentication Data
```typescript
export interface AdminLoginCredentials {
  email: string
  password: string
  user_type: "admin"
}

export interface VendorLoginCredentials {
  email: string
  password: string
  user_type: "vendor"
}

export interface AdminRegisterData {
  full_name: string
  email: string
  password: string
  password_confirmation: string
  user_type: "admin"
}

export interface VendorRegisterData {
  business_name: string
  email: string
  password: string
  password_confirmation: string
  subscription_plan: string
  user_type: "vendor"
}
```

## UI Components

### Login Pages
- **Admin**: `/admin/auth/login` - Blue theme, focused on admin credentials
- **Vendor**: `/pos/auth/login` - Purple theme, business-focused branding
- **Features**:
  - Email and password fields
  - Password visibility toggle
  - "Forgot password?" link
  - Rate limiting feedback
  - Account lockout display
  - 2FA code input (when enabled)

### Registration Pages
- **Admin**: `/admin/auth/register` - Single-step registration
- **Vendor**: `/pos/auth/register` - Multi-step registration
  - Step 1: Select subscription plan
  - Step 2: Enter business details
  - Step 3: Payment processing (redirects to Stripe/PayPal)
- **Features**:
  - Form validation with Zod
  - Password strength indicator
  - Real-time error display
  - Success confirmation

### Email Verification
- **Component**: Reusable for both admin and vendor
- **Features**:
  - Automatic verification on page load
  - Success/failure feedback
  - Resend verification email option
  - Auto-redirect after success

### Subscription Plan Selector
- **Plans**: Basic ($29), Pro ($79), Enterprise ($199)
- **Features**:
  - Visual comparison of features
  - "Most Popular" badge
  - 14-day free trial indicator
  - Click to select/deselect

### Password Reset
- **Step 1**: Enter email to receive reset link
- **Step 2**: Click link in email
- **Step 3**: Enter new password
- **Features**:
  - Email validation
  - Token expiry handling
  - Password confirmation
  - Success feedback

## API Endpoints (To Be Implemented)

### Admin Endpoints
```
POST /api/admin/auth/register           # Create admin account
POST /api/admin/auth/login              # Admin login
POST /api/admin/auth/verify-2fa         # Verify 2FA code
POST /api/admin/auth/verify-email       # Verify email token
POST /api/admin/auth/forgot-password    # Request password reset
POST /api/admin/auth/reset-password     # Reset password with token
POST /api/admin/auth/resend-verification # Resend verification email
POST /api/admin/auth/logout             # Logout admin
GET  /api/admin/auth/me                 # Get current admin user
```

### Vendor Endpoints
```
POST /api/vendor/auth/register          # Create vendor account
POST /api/vendor/auth/login             # Vendor login
POST /api/vendor/auth/verify-2fa        # Verify 2FA code
POST /api/vendor/auth/verify-email      # Verify email token
POST /api/vendor/auth/forgot-password   # Request password reset
POST /api/vendor/auth/reset-password    # Reset password with token
POST /api/vendor/auth/resend-verification # Resend verification email
POST /api/vendor/auth/logout            # Logout vendor
GET  /api/vendor/auth/me                # Get current vendor user
```

### Payment Webhook
```
POST /api/webhooks/payment              # Handle Stripe/PayPal webhooks
```

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Auth Configuration
NEXT_PUBLIC_SESSION_TIMEOUT=3600000     # 1 hour in milliseconds
NEXT_PUBLIC_TOKEN_REFRESH_INTERVAL=300000 # 5 minutes

# Payment Configuration
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
```

## Integration with Backend

### Expected Backend Response Format

#### Login Success
```json
{
  "user": { /* AdminUser or VendorUser */ },
  "token": "jwt_token_here",
  "session_token": "session_uuid",
  "requires_two_factor": false,
  "requires_email_verification": false
}
```

#### Login with 2FA Required
```json
{
  "requires_two_factor": true,
  "message": "Please enter your verification code"
}
```

#### Account Locked
```json
{
  "account_locked": true,
  "lockout_expiry": "2025-11-02T15:30:00Z",
  "message": "Account locked due to multiple failed attempts"
}
```

#### Registration Success
```json
{
  "message": "Registration successful. Please check your email.",
  "payment_url": "https://checkout.stripe.com/xxx" // For vendors only
}
```

## Security Best Practices

1. **Never store passwords in plain text** - Always use Argon2id or bcrypt
2. **Use HTTPS only** - All authentication endpoints must use SSL/TLS
3. **Implement CSRF protection** - Use tokens for state-changing operations
4. **Rate limit all endpoints** - Prevent brute force attacks
5. **Log security events** - Track logins, failed attempts, password changes
6. **Use secure session tokens** - Random UUIDs, not predictable values
7. **Implement password history** - Prevent password reuse
8. **Enforce strong passwords** - Minimum complexity requirements
9. **Enable 2FA for admin accounts** - Require for privileged access
10. **Regular security audits** - Review logs and access patterns

## Testing Checklist

### Admin Flow
- [ ] Register new admin account
- [ ] Receive and verify email
- [ ] Login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Account locks after 5 failed attempts
- [ ] 2FA code works (if enabled)
- [ ] Forgot password sends email
- [ ] Password reset works with valid token
- [ ] Session persists across page refresh
- [ ] Logout clears session

### Vendor Flow
- [ ] Select subscription plan
- [ ] Register new vendor account
- [ ] Redirect to payment processor
- [ ] Webhook activates subscription
- [ ] Receive and verify email
- [ ] Login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Account locks after 5 failed attempts
- [ ] 2FA code works (if enabled)
- [ ] Forgot password sends email
- [ ] Password reset works with valid token
- [ ] Session persists across page refresh
- [ ] Logout clears session
- [ ] Subdomain is provisioned

## Future Enhancements

1. **Social Login** - Google, Facebook, Apple Sign-In
2. **Biometric Authentication** - Face ID, Touch ID support
3. **Magic Links** - Passwordless authentication via email
4. **Remember Me** - Extended session duration option
5. **Multi-language Support** - i18n for auth pages
6. **Progressive Web App** - Offline login capability
7. **Security Questions** - Additional account recovery option
8. **IP Whitelisting** - Admin account access restrictions
9. **Audit Logs** - Detailed authentication event logging
10. **Admin Approval** - Require approval for new vendor accounts

## Support & Troubleshooting

### Common Issues

**Issue**: Email verification link not working
**Solution**: Check token expiry, resend verification email

**Issue**: Account locked indefinitely
**Solution**: Check `account_locked_until` field, ensure lockout duration is set

**Issue**: 2FA code not accepted
**Solution**: Verify time sync on server and client, check secret encryption

**Issue**: Payment webhook not received
**Solution**: Verify webhook endpoint URL in Stripe/PayPal dashboard

**Issue**: Session expires too quickly
**Solution**: Adjust `SESSION_TIMEOUT` environment variable

## Contact

For questions or issues with authentication:
- Development Team: dev@vendora.com
- Security Issues: security@vendora.com
- Support: support@vendora.com