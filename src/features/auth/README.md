# Authentication System

Modern, secure authentication system for Next.js 15 using Server Actions and httpOnly cookies.

## Architecture

### 1. Server Auth Layer (`/src/lib/auth/`)
- `session.ts` - Server-side session management (cookies)
- `token.ts` - JWT token utilities (decode, verify, check expiration)
- `types.ts` - Auth type definitions

### 2. Server Actions (`/src/features/auth/actions/`)
- `auth.actions.ts` - Server actions for login, register, logout, refresh

### 3. API Services (`/src/features/auth/services/`)
- `auth.api.ts` - HTTP calls to backend API

### 4. Client Hook (`/src/features/auth/hooks/`)
- `useAuth.ts` - Client-side hook for auth operations

### 5. API Proxy (`next.config.ts`)
- Reverse proxy configuration
- Routes `/api/*` to backend automatically

## Usage Examples

### 1. Login Form (Client Component)

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isPending } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login({ email, password });

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

### 2. Protected Server Component

```tsx
import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  // This will throw if user is not authenticated
  const user = await requireAuth();

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>Role: {user.role}</p>
      <p>Business ID: {user.businessId}</p>
    </div>
  );
}
```

### 3. Get Session in Server Component

```tsx
import { getSession } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    return <p>Please login</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {session.email}</p>
      <p>Role: {session.role}</p>
    </div>
  );
}
```

### 4. Logout Button

```tsx
'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';

export function LogoutButton() {
  const { logout, isPending } = useAuth();

  return (
    <button onClick={logout} disabled={isPending}>
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

### 5. Register Form

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isPending } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    username: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await register(formData);

    if (result.success) {
      router.push('/dashboard');
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}
```

### 6. Check Auth in Server Action

```tsx
'use server';

import { requireAuth } from '@/lib/auth';

export async function createBooking(formData: FormData) {
  // Ensure user is authenticated
  const user = await requireAuth();

  // Use user.id, user.businessId, etc.
  // ...
}
```

### 7. API Call with Auth Token

```tsx
import { getAccessToken } from '@/lib/auth';

export async function fetchUserData() {
  const token = await getAccessToken();

  const response = await fetch('https://api.example.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
```

## Security Features

✅ **httpOnly Cookies** - Tokens stored in httpOnly cookies (not accessible to JavaScript)
✅ **Server-Side Session** - Session managed on server, not in localStorage
✅ **Automatic Token Refresh** - Refresh token stored separately
✅ **Reverse Proxy** - API calls proxied through Next.js server
✅ **CSRF Protection** - sameSite: 'lax' cookie attribute
✅ **Secure in Production** - Secure flag enabled in production

## Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://www.citalistoapi.iveltech.com
```

## Proxy Configuration

The proxy is configured in `next.config.ts`:

```ts
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
    },
  ];
}
```

All calls to `/api/*` are automatically proxied to the backend.

## Token Refresh

The system doesn't auto-refresh tokens. To implement auto-refresh:

1. Check token expiration before API calls
2. Call `refresh()` from `useAuth` when needed
3. Retry failed request with new token

Example:

```tsx
const { refresh } = useAuth();

async function fetchWithRefresh(url: string) {
  let response = await fetch(url);

  if (response.status === 401) {
    await refresh();
    response = await fetch(url);
  }

  return response;
}
```
