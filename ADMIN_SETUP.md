# Admin Login Setup Guide

## Quick Setup (All Users to Admin)

To promote all existing users to admin role:

```bash
node promote_admin.js
```

Then login with any existing account at http://localhost:3005/login

## Promote Specific User by Email

To promote a specific user to admin:

```bash
node promote_user.js user@example.com
```

## Manual SQL Method

If you have access to Supabase SQL Editor or psql:

1. **Find the user ID:**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```

2. **Update the profile:**
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE id = 'user-uuid-here';
   ```

## Create New Admin Account

1. Sign up at http://localhost:3005/signup
2. After signup, run: `node promote_user.js your-email@example.com`
3. Or use the SQL method above

## Login

Once a user has admin role, simply login at:
**http://localhost:3005/login**

Then navigate to:
**http://localhost:3005/admin**
