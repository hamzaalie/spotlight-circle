# Admin Panel Access Guide

## 🔐 Security Features

The admin panel is **fully secured** with multiple layers of protection:

### 1. **Middleware Protection**
- All `/admin/*` routes are protected by middleware
- Redirects non-admin users to `/dashboard`
- Blocks unauthenticated access

### 2. **Layout-Level Protection**
- Admin layout verifies user role on server-side
- Double-checks ADMIN role before rendering

### 3. **API Route Protection**
- All admin API endpoints verify ADMIN role
- Returns 403 Forbidden for non-admin users

### 4. **UI Visibility**
- Admin Panel button only shows to users with ADMIN role
- Regular users never see admin links

---

## 🚀 How to Access the Admin Panel

### Step 1: Create an Admin User

You need to manually set a user's role to ADMIN in the database.

**Option A: Using Prisma Studio (Recommended)**

```powershell
# Open Prisma Studio
npx prisma studio
```

1. Go to the `User` model
2. Find your user account by email
3. Change the `role` field from `PROFESSIONAL` to `ADMIN`
4. Save the changes

**Option B: Using Database Query**

```sql
-- Replace 'your.email@example.com' with your actual email
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your.email@example.com';
```

**Option C: Using PowerShell Script**

I've created a helper script below.

### Step 2: Sign Out and Sign In Again

After changing your role:
1. Sign out of your account
2. Sign back in
3. Your session will now include the ADMIN role

### Step 3: Access the Admin Panel

Once logged in as an admin:

1. **From Dashboard Navigation**
   - Look for the "Admin Panel" button in the top navigation bar
   - Click it to enter the admin panel

2. **Direct URL**
   - Navigate to: `http://localhost:3000/admin`
   - You'll be redirected automatically if not admin

---

## 📋 Admin Panel Features

Once inside, you'll have access to:

### **Overview** (`/admin`)
- Platform statistics
- Quick actions
- Recent activity feed

### **Users** (`/admin/users`)
- View all users
- Search and filter
- Change user roles
- View detailed user information
- Delete users

### **Analytics** (`/admin/analytics`)
- User growth metrics
- Referral statistics
- Conversion rates
- Top referrers
- Geographic distribution

### **Referrals** (`/admin/referrals`)
- View all platform referrals
- Filter by status and date
- Monitor referral activity

### **Support** (`/admin/support`)
- View and respond to support tickets
- Manage customer inquiries

### **Settings** (`/admin/settings`)
- Configure email settings
- Edit email templates
- Platform configuration
- Security settings

---

## 🛡️ Security Best Practices

1. **Limit Admin Accounts**
   - Only create admin accounts for trusted team members
   - Regularly audit admin user list

2. **Use Strong Passwords**
   - Admin accounts should use strong, unique passwords
   - Consider implementing 2FA in production

3. **Monitor Admin Activity**
   - Keep logs of admin actions
   - Review changes regularly

4. **Production Environment**
   - Never expose database credentials
   - Use environment variables for all secrets
   - Enable audit logging

---

## 🐛 Troubleshooting

### "Access Denied" or Redirected to Dashboard

**Cause**: User doesn't have ADMIN role

**Solution**:
1. Check database: User role must be exactly `ADMIN`
2. Sign out and sign back in to refresh session
3. Clear browser cache if needed

### Admin Button Not Showing

**Cause**: Session not updated after role change

**Solution**:
1. Sign out completely
2. Close all browser tabs
3. Sign back in

### Can't Access Admin Routes

**Cause**: Middleware blocking access

**Solution**:
1. Verify role in database is `ADMIN` (not `admin` - case-sensitive)
2. Check browser console for errors
3. Verify middleware is running (check terminal output)

---

## 🔄 Reverting Admin Access

To remove admin access from a user:

```sql
UPDATE users 
SET role = 'PROFESSIONAL' 
WHERE email = 'user@example.com';
```

User must sign out and back in for changes to take effect.

---

## 📞 Support

If you encounter issues:
1. Check the database user role
2. Verify middleware is protecting routes
3. Check browser console for errors
4. Review server logs for authentication issues
