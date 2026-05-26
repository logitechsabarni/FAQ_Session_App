# Authentication Guide

This document explains the authentication system used in FAQ_Session, including JWT handling, protected routes, and security best practices.

## Overview

FAQ_Session uses **Supabase Auth** for authentication, which provides:
- Secure email/password authentication
- JWT (JSON Web Token) based sessions
- Automatic token refresh
- Row Level Security integration
- Session persistence

## Authentication Flow

### Registration Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   User      │     │   Frontend   │     │   Supabase   │
└──────┬──────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ 1. Fill form       │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ 2. signUp()        │
       │                    │───────────────────>│
       │                    │                    │
       │                    │                    │ - Create user
       │                    │                    │ - Hash password
       │                    │                    │ - Trigger profile
       │                    │                    │   creation
       │                    │                    │
       │                    │ 3. Session + JWT   │
       │                    │<───────────────────│
       │                    │                    │
       │ 4. Redirect home   │                    │
       │<───────────────────│                    │
       │                    │                    │
```

### Login Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   User      │     │   Frontend   │     │   Supabase   │
└──────┬──────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ 1. Enter creds     │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ 2. signInWith      │
       │                    │    Password()      │
       │                    │───────────────────>│
       │                    │                    │
       │                    │                    │ - Verify password
       │                    │                    │ - Generate JWT
       │                    │                    │ - Create session
       │                    │                    │
       │                    │ 3. Session + JWT   │
       │                    │<───────────────────│
       │                    │                    │
       │                    │ 4. Fetch profile   │
       │                    │───────────────────>│
       │                    │                    │
       │                    │ 5. Profile data    │
       │                    │<───────────────────│
       │                    │                    │
       │ 6. Redirect        │                    │
       │<───────────────────│                    │
       │                    │                    │
```

## Implementation Details

### AuthContext

The `AuthContext` provides authentication state and methods:

```typescript
interface AuthContextType {
  user: User | null;           // Current user from Supabase Auth
  profile: Profile | null;     // User profile from database
  session: Session | null;     // Current session with JWT
  loading: boolean;            // Loading state
  
  signUp: (email, password, name) => Promise<{ error }>;
  signIn: (email, password) => Promise<{ error }>;
  signOut: () => Promise<void>;
  updateProfile: (updates) => Promise<{ error }>;
}
```

### Session Management

#### Token Storage
Sessions are managed by Supabase's client library:
- JWT access token stored in memory
- Refresh token stored in localStorage
- Automatic token refresh handled by SDK

#### Session Persistence
```typescript
// In AuthContext.tsx
useEffect(() => {
  // Get initial session on mount
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  // Listen for auth state changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

### Protected Routes

Routes requiring authentication use the `ProtectedRoute` component:

```typescript
// In AppRoutes.tsx
{
  path: 'add-faq',
  element: (
    <ProtectedRoute>
      <AddFAQ />
    </ProtectedRoute>
  ),
}
```

The component checks authentication:
```typescript
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to login, preserve intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

### JWT Structure

The JWT contains:
```json
{
  "aud": "authenticated",
  "exp": 1234567890,
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "app_metadata": {},
  "user_metadata": {
    "name": "John Doe"
  }
}
```

### Authorization Headers

Supabase client automatically includes the JWT in requests:
```typescript
// Headers sent with each request
{
  "Authorization": "Bearer <access_token>",
  "apikey": "<anon_key>"
}
```

## Row Level Security (RLS)

RLS policies use authentication to control data access:

### Using auth.uid()

```sql
-- Get the current user's ID
auth.uid()  -- Returns: uuid

-- Example policy
CREATE POLICY "Users can update own FAQs"
  ON faqs FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);
```

### Policy Types

| Operation | Policy Type | Check |
|-----------|-------------|-------|
| SELECT | USING | Read condition |
| INSERT | WITH CHECK | Insert condition |
| UPDATE | USING + WITH CHECK | Both conditions |
| DELETE | USING | Delete condition |

### Example RLS Policies

```sql
-- FAQs policies
-- Public read
CREATE POLICY "Anyone can view FAQs"
  ON faqs FOR SELECT
  USING (true);

-- Authenticated create
CREATE POLICY "Authenticated users can create FAQs"
  ON faqs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Owner update
CREATE POLICY "Users can update own FAQs"
  ON faqs FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Owner delete
CREATE POLICY "Users can delete own FAQs"
  ON faqs FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);
```

## Security Best Practices

### 1. Never Store Sensitive Data in User Metadata

```typescript
// BAD: Don't store roles here (user can modify)
user_metadata: {
  role: 'admin'  // User can change this!
}

// GOOD: Use app_metadata (server-controlled)
app_metadata: {
  role: 'admin'  // Only server can modify
}
```

### 2. Always Use RLS

Even with authenticated routes, RLS is essential:
- Frontend checks can be bypassed
- Direct database access must be controlled
- Defense in depth principle

### 3. Validate on Both Frontend and Backend

```typescript
// Frontend validation (UX)
if (password.length < 6) {
  setError('Password too short');
  return;
}

// Backend (Supabase Auth) also validates
// RLS policies provide additional security
```

### 4. Use HTTPS in Production

- JWTs are transmitted in headers
- Never use HTTP in production
- Supabase URLs are always HTTPS

### 5. Keep Secrets Secret

```env
# Public (ok in frontend)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Private (server only - if needed)
SUPABASE_SERVICE_ROLE_KEY=...  # Never expose!
```

## Authentication States

### Loading State
```typescript
if (loading) {
  return <LoadingSpinner />;
}
```

### Unauthenticated State
```typescript
if (!user) {
  return <Navigate to="/login" />;
}
```

### Authenticated State
```typescript
return <ProtectedContent />;
```

## Profile Creation

When a user signs up, a profile is automatically created:

```sql
-- Trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

## Session Handling

### Checking Session
```typescript
const { data: { session } } = await supabase.auth.getSession();
```

### Listening for Changes
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User signed in
  }
  if (event === 'SIGNED_OUT') {
    // User signed out
  }
  if (event === 'TOKEN_REFRESHED') {
    // Token was refreshed
  }
});
```

### Getting Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

## Sign Out Flow

```typescript
const signOut = async () => {
  await supabase.auth.signOut();
  setUser(null);
  setProfile(null);
  setSession(null);
  // User redirected to home
};
```

## Future Enhancements

Potential authentication improvements:

1. **OAuth Providers**
   - Google
   - GitHub
   - Twitter

2. **Two-Factor Authentication**
   ```typescript
   // Enroll in TOTP
   const { data, error } = await supabase.auth.mfa.enroll({
     factorType: 'totp'
   });
   ```

3. **Magic Links**
   ```typescript
   const { data, error } = await supabase.auth.signInWithOtp({
     email: 'user@example.com'
   });
   ```

4. **Session Timeout Configuration**
   - Configurable in Supabase dashboard
   - Default: 1 hour access token, 1 week refresh

## Troubleshooting

### "Invalid JWT"
- Check token hasn't expired
- Verify correct anon key
- Ensure clock is synchronized

### "User not found"
- Verify user exists in auth.users
- Check profile was created
- Confirm correct user ID

### "Permission denied"
- Review RLS policies
- Check auth.uid() matches expectations
- Verify user is authenticated

### Session not persisting
- Check localStorage is enabled
- Verify cookies aren't blocked
- Ensure same domain/subdomain
