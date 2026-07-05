# TradeLog India — Backend

Spring Boot 3.2 + MySQL 8 + JWT + Google OAuth

## Quick Start

### 1. MySQL Setup
```sql
mysql -u root -p < src/main/resources/schema.sql
```

### 2. Environment Variables
Set these before running (or edit application.yml directly for local dev):

| Variable | Description |
|---|---|
| `DB_USERNAME` | MySQL username (default: root) |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | 32+ char secret key |
| `MAIL_USERNAME` | Gmail address for OTP emails |
| `MAIL_PASSWORD` | Gmail App Password (not your Gmail password) |
| `TWILIO_ACCOUNT_SID` | From twilio.com console |
| `TWILIO_AUTH_TOKEN` | From twilio.com console |
| `TWILIO_FROM_NUMBER` | Your Twilio phone number (+1xxxxxxxxxx) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `FRONTEND_URL` | e.g. http://localhost:5173 |

### 3. Run
```bash
./mvnw spring-boot:run
```
Server starts at http://localhost:8080

## Default Admin Account
- Email: admin@tradelog.in
- Password: Admin@123
- ⚠️ Change this immediately after first login!

## API Overview

### Auth (Public)
```
POST /api/auth/register              Register new user
POST /api/auth/send-email-otp        Send email verification OTP
POST /api/auth/verify-email-otp      Verify email OTP
POST /api/auth/send-mobile-otp       Send mobile OTP (Twilio)
POST /api/auth/verify-mobile-otp     Verify mobile OTP → activates account
POST /api/auth/login                 Email + password → JWT
POST /api/auth/login/mobile/send-otp Send login OTP to mobile
POST /api/auth/login/mobile          Mobile + OTP → JWT
POST /api/auth/refresh               Refresh access token
GET  /api/auth/oauth2/authorize/google → Google OAuth redirect
```

### Trades (Authenticated)
```
GET    /api/trades          List with filters: segment, side, from, to, symbol
POST   /api/trades          Create trade
PUT    /api/trades/{id}     Update trade
DELETE /api/trades/{id}     Delete trade
GET    /api/trades/{id}     Get single trade
```

### Import (Authenticated)
```
POST /api/import/zerodha    Upload Zerodha CSV
POST /api/import/upstox     Upload Upstox CSV
POST /api/import/angel      Upload Angel One CSV
GET  /api/import/logs       Your import history
```

### Admin (ADMIN role only)
```
GET    /api/admin/stats              Platform-wide stats
GET    /api/admin/users              All users (paginated, searchable)
GET    /api/admin/users/{id}         User detail
GET    /api/admin/users/{id}/trades  User's trades
PUT    /api/admin/users/{id}/ban     Ban user
PUT    /api/admin/users/{id}/unban   Unban user
DELETE /api/admin/users/{id}         Delete user
```

## JWT Usage
```
Authorization: Bearer <accessToken>
```
Access token expires in 15 minutes. Use refresh token to get a new one.

## Google OAuth Setup
1. Go to console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Add redirect URI: http://localhost:8080/api/auth/oauth2/callback/google
4. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

## Gmail App Password Setup
1. Enable 2FA on your Gmail
2. Go to myaccount.google.com → Security → App Passwords
3. Generate password for "Mail"
4. Use that as MAIL_PASSWORD (not your Gmail password)

## Broker CSV Import Notes
- **Zerodha**: Download from Kite → Console → Reports → Tradebook
- **Upstox**: Download from Upstox Pro → Reports → Trade History
- **Angel One**: Download from Angel One → Reports → Trade Book
