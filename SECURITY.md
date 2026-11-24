# Security Policy

## Supported Versions

We actively maintain security updates for the following versions:

| Version | Supported |
|---------|-----------|
| Latest (main branch) | ✅ Yes |
| Previous releases | ❌ No |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public issue
2. Email: **dineshreddypothula@gmail.com** with subject "[SECURITY] Repository Name - Brief Description"
3. Include:
   - Affected repository and version/commit
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 5 business days
- **Fix Development:** Depends on severity (typically 7-30 days)
- **Disclosure:** Coordinated after fix is deployed

## Security Measures Implemented

### Authentication & Authorization
- JWT-based authentication with short-lived access tokens
- Refresh token rotation
- Role-based access control (RBAC)
- Google OAuth 2.0 integration
- Password hashing with bcryptjs (12 rounds)

### API Security
- Helmet.js security headers
- CORS restricted to known origins
- Rate limiting on API endpoints
- Input validation and sanitization
- MongoDB injection prevention

### Data Protection
- Environment variables for secrets (never committed)
- HTTPS in production
- Secure cookie flags (HttpOnly, Secure, SameSite)
- No sensitive data in logs

### Dependencies
- Regular dependency updates
- `npm audit` in CI pipeline
- Automated security scanning (Dependabot)

## Responsible Disclosure

We appreciate security researchers who follow responsible disclosure. We will:
- Credit you in the fix (if desired)
- Provide a timeline for resolution
- Notify you when the fix is deployed

## Scope

This policy applies to all repositories in this portfolio:
- smartServe
- swapr
- NoteEzy
- LeetCode
- Netflix-Analysis
- Superstore-Sales-PowerBI-Dashboard

---

*Last updated: November 2024*