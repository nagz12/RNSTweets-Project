# Two-Step Authentication System - Setup Guide

## Overview
RNSTweets now features a comprehensive two-step email authentication system with OTP verification. The system enforces domain restriction (@rnsit.ac.in), password strength requirements, and secure session management.

## Database Models

### User Model
Fields added/required for authentication:
- `email` (unique, lowercase, @rnsit.ac.in enforced)
- `username` (unique, 3-30 chars, alphanumeric + underscore)
- `displayName` (user's full name)
- `passwordHash` (bcryptjs hashed password)
- `isVerified` (boolean, set to true after OTP verification)
- `empathyScore` (defaults to 100 for new users, range 0-100)
- `totalDemerits` (defaults to 0)
- `isSuspended` (defaults to false)

### EmailOtp Model
Stores OTP codes for signup and login:
- `email` (lowercase)
- `codeHash` (bcryptjs hashed 6-digit code)
- `purpose` ("signup" or "login")
- `expiresAt` (10 minutes from creation)
- `used` (boolean, enforces single-use)
- Auto-deletes after 1 hour via TTL index

### PendingSignup Model
Temporary storage during two-step signup:
- `email` (lowercase, @rnsit.ac.in enforced)
- `name` (display name)
- `username` (3-30 chars, alphanumeric + underscore)
- `passwordHash` (bcryptjs hashed)
- `expiresAt` (30 minutes from creation)

## Environment Variables

Add these to `.env.local`:

```env
# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
# For Gmail: Generate App Password at https://myaccount.google.com/apppasswords

# JWT Configuration
JWT_SECRET=your-very-secret-key-change-in-production

# Base URL (for links in emails, development/production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# In production: NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

## API Endpoints

### Signup Flow
**Step 1: POST /api/auth/signup/start**
- Request: `{ name, email, username, password }`
- Validates: @rnsit.ac.in domain, password strength, username uniqueness
- Response: `{ email, message }` or error
- Action: Creates PendingSignup, sends OTP

**Step 2: POST /api/auth/signup/verify**
- Request: `{ email, otp }`
- Validates: OTP correctness, expiration, single-use
- Response: `{ success, message }` or error
- Action: Creates User with empathyScore=100, clears PendingSignup, sets session cookie

### Login Flow
**Step 1: POST /api/auth/login/start**
- Request: `{ email, password }`
- Validates: @rnsit.ac.in domain, user exists, not suspended, password matches
- Response: `{ email, message }` or error
- Action: Sends OTP

**Step 2: POST /api/auth/login/verify**
- Request: `{ email, otp }`
- Validates: OTP correctness, expiration, single-use, user not suspended
- Response: `{ success, message }` or error
- Action: Generates JWT token, sets session cookie

### Session Management
**GET /api/auth/session**
- Returns: `{ userId, email, role }` if authenticated
- Returns: 401 if no valid session

**POST /api/auth/logout**
- Clears session cookie
- Returns: `{ success }`

### OTP Management
**POST /api/auth/otp/resend**
- Request: `{ email, purpose }`
- purpose: "signup" or "login"
- Invalidates old OTPs and sends new one
- Returns: `{ success, message }`

## Frontend Components

### Signup Page (`app/signup/page.tsx`)
Two-step form:
1. **Credentials Step**: Name, Email, Username, Password with validation hints
2. **OTP Step**: 6-digit code input with resend and back options
- Domain validation shows error for non-@rnsit.ac.in emails
- Password requirements displayed (8+ chars, mixed case, number)
- On success: Redirects to `/feed`

### Login Page (`app/login/page.tsx`)
Two-step form:
1. **Credentials Step**: Email, Password
2. **OTP Step**: 6-digit code input with resend and back options
- Domain validation enforced
- On success: Redirects to `/feed`

## Session & Authorization

### Session Hook (`hooks/use-auth-check.ts`)
- Validates session by calling GET /api/auth/session
- Redirects to /login if unauthorized
- Use in protected pages:
  ```tsx
  const isAuthed = useAuthCheck();
  if (!isAuthed) return <div>Loading...</div>;
  // Protected content...
  ```

### Protecting Routes
Add session validation to protected pages:
```tsx
"use client";
import { useAuthCheck } from "@/hooks/use-auth-check";

export default function ProtectedPage() {
  const isAuthed = useAuthCheck();
  if (!isAuthed) return <div>Loading...</div>;
  return <div>Protected Content</div>;
}
```

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Username Requirements
- 3-30 characters
- Alphanumeric characters and underscores only
- Must be unique

## Security Features
- ✅ @rnsit.ac.in domain enforcement (signup & login)
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Bcrypt OTP code hashing
- ✅ 6-digit OTP (100000-999999 range)
- ✅ 10-minute OTP expiration
- ✅ Single-use OTP enforcement
- ✅ JWT tokens with 7-day expiration
- ✅ HttpOnly, Secure session cookies
- ✅ Account suspension enforcement
- ✅ Empathy score initialization (100 for new users)

## Verification Endpoints
Verified emails after signup:
- Check `user.isVerified === true` before allowing access
- Resend OTP available on both signup and login

## Testing Checklist
- [ ] Signup with non-@rnsit.ac.in email shows error
- [ ] Signup with weak password shows validation error
- [ ] Signup sends OTP to email (check spam folder)
- [ ] Signup OTP verification creates account with empathyScore=100
- [ ] Login with non-existent user shows error
- [ ] Login with suspended account shows error
- [ ] Login sends OTP to email
- [ ] Login OTP verification creates session and redirects to /feed
- [ ] Session persists across page refreshes
- [ ] Logout clears session
- [ ] Protected routes redirect to login when not authenticated
- [ ] OTP resend functionality works
- [ ] OTP expires after 10 minutes
- [ ] Used OTP cannot be reused

## Deployment Notes
1. Set `JWT_SECRET` to a strong random value in production
2. Set `NEXT_PUBLIC_BASE_URL` to your production domain
3. Configure EMAIL_* variables with production email service
4. Ensure MongoDB is accessible from production servers
5. Set `NODE_ENV=production` for secure cookies
6. Update domain restriction in endpoints if needed (currently hardcoded as @rnsit.ac.in)
