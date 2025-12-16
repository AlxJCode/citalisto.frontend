# 🔐 Flujo de Autenticación con Tokens - Documentación Técnica

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Componentes del Sistema](#componentes-del-sistema)
3. [Flujo Completo Paso a Paso](#flujo-completo-paso-a-paso)
4. [Código de Implementación](#código-de-implementación)
5. [Seguridad](#seguridad)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura General

### Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                         ARQUITECTURA                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Client Component │  (Navegador)
│  - React         │
│  - "use client"  │
└────────┬─────────┘
         │
         │ fetch("/api/auth/token")
         │ (HTTP Request con cookies automáticas)
         ↓
┌────────────────────────────────────────────────────────────────┐
│               API ROUTE (Server-Side)                          │
│  /app/api/auth/token/route.ts                                  │
│                                                                 │
│  export async function GET() {                                 │
│    const token = await getAccessToken(); ← Lee cookie HttpOnly │
│    return NextResponse.json({ token });                        │
│  }                                                              │
└────────┬───────────────────────────────────────────────────────┘
         │
         │ getAccessToken()
         ↓
┌────────────────────────────────────────────────────────────────┐
│              SESSION MANAGEMENT (Server-Side)                  │
│  /lib/auth/session.ts                                          │
│                                                                 │
│  export async function getAccessToken() {                      │
│    const cookieStore = await cookies(); ← next/headers         │
│    return cookieStore.get("access_token")?.value;              │
│  }                                                              │
└────────┬───────────────────────────────────────────────────────┘
         │
         │ return token
         ↓
┌────────────────────────────────────────────────────────────────┐
│                    API CLIENT (Client-Side)                    │
│  /lib/api/client.ts                                            │
│                                                                 │
│  apiClient.interceptors.request.use(async (config) => {        │
│    const token = await getToken(); ← fetch a API Route         │
│    config.headers.Authorization = `Bearer ${token}`;           │
│    return config;                                              │
│  });                                                            │
└────────┬───────────────────────────────────────────────────────┘
         │
         │ axios.get("/backend-api/data", {
         │   headers: { Authorization: "Bearer ..." }
         │ })
         ↓
┌────────────────────────────────────────────────────────────────┐
│                      BACKEND API                               │
│  Django/FastAPI/etc.                                           │
└────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes del Sistema

### 1. **Session Management (`/lib/auth/session.ts`)**

**Propósito:** Manejar cookies HttpOnly en el servidor

**Características:**
- ✅ Solo se ejecuta en Server Components/Server Actions/API Routes
- ✅ Usa `cookies()` de `next/headers`
- ✅ Gestiona tokens con cookies HttpOnly seguras
- ❌ NO se puede importar en Client Components

**Funciones principales:**

| Función | Descripción | Uso |
|---------|-------------|-----|
| `getAccessToken()` | Lee token de cookie HttpOnly | API Routes, Server Actions |
| `setSession(tokens)` | Guarda tokens en cookies | Después de login |
| `removeSession()` | Elimina cookies | Logout |
| `getSession()` | Obtiene datos del usuario | Server Components |
| `refreshUserData()` | Actualiza datos del usuario | Después de cambios de perfil |

---

### 2. **API Route (`/app/api/auth/token/route.ts`)**

**Propósito:** Puente entre cliente y cookies del servidor

**¿Por qué existe?**
- Client Components NO pueden usar `cookies()` de `next/headers`
- Esta API Route se ejecuta en el servidor
- Recibe cookies automáticamente en el request
- Lee el token de la cookie y lo retorna

**Flujo de seguridad:**

```typescript
// 1. Client hace request
fetch("/api/auth/token")

// 2. Navegador AUTOMÁTICAMENTE incluye cookies HttpOnly
Request Headers:
  Cookie: access_token=eyJhbGc...; refresh_token=...

// 3. API Route lee la cookie
const token = await getAccessToken(); // Lee de cookies()

// 4. Si no hay cookie válida → 401
if (!token) {
  return NextResponse.json({ token: null }, { status: 401 });
}

// 5. Si hay cookie → retorna token
return NextResponse.json({ token: "eyJhbGc..." });
```

**Protecciones:**
- ✅ Solo funciona si el usuario tiene cookie válida
- ✅ Cookies con `httpOnly`, `secure`, `sameSite`
- ✅ Request externo sin cookies → 401 Unauthorized

---

### 3. **API Client (`/lib/api/client.ts`)**

**Propósito:** Cliente HTTP para hacer requests al backend

**Características:**
- Interceptor de request: Agrega token automáticamente
- Interceptor de response: Maneja errores de autenticación
- Cache de token en memoria (optimización)
- Compatible con Client y Server Components

**Funciones:**

| Función | Descripción |
|---------|-------------|
| `getToken()` | Obtiene token desde API Route |
| `clearTokenCache()` | Limpia cache del token |
| Request interceptor | Agrega `Authorization: Bearer <token>` |
| Response interceptor | Maneja 401 (token expirado) |

---

## 🔄 Flujo Completo Paso a Paso

### Fase 1: Login

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUARIO HACE LOGIN                                       │
└─────────────────────────────────────────────────────────────┘

Usuario ingresa credenciales
    ↓
Client Component → Server Action
    ↓
Server Action → Backend API (/auth/login/)
    ↓
Backend retorna tokens: { access: "...", refresh: "..." }
    ↓
Server Action ejecuta setSession(tokens)
    ↓
setSession() guarda tokens en cookies HttpOnly:
    ✓ access_token (expira en 1 día)
    ✓ refresh_token (expira en 7 días)
    ✓ user_data (datos del usuario)
    ↓
Server Action ejecuta setUserData(userData)
    ↓
Redirect a dashboard
```

**Código de ejemplo:**

```typescript
// app/login/actions.ts
"use server";

import { setSession, setUserData } from "@/lib/auth/session";
import { loginApi } from "@/features/auth/services/auth.api";

export async function loginAction(email: string, password: string) {
    // 1. Llamar al backend
    const response = await loginApi(email, password);

    // 2. Guardar tokens en cookies HttpOnly
    await setSession({
        access: response.tokens.access,
        refresh: response.tokens.refresh,
    });

    // 3. Guardar datos del usuario
    await setUserData(response.user);

    // 4. Retornar éxito
    return { success: true };
}
```

---

### Fase 2: Request Autenticado

```
┌─────────────────────────────────────────────────────────────┐
│ 2. USUARIO HACE REQUEST A API PROTEGIDA                     │
└─────────────────────────────────────────────────────────────┘

Client Component necesita datos
    ↓
Llama a: apiClient.get("/backend-api/services/")
    ↓
Axios Request Interceptor se activa
    ↓
Interceptor ejecuta: getToken()
    ↓
getToken() verifica cache en memoria
    ├─ Si hay cache → retorna token
    └─ Si NO hay cache:
        ↓
        fetch("/api/auth/token")
        ↓
        Navegador AUTOMÁTICAMENTE envía cookies HttpOnly
        ↓
        API Route (servidor):
            1. Recibe request con cookies
            2. Ejecuta getAccessToken()
            3. getAccessToken() usa cookies()
            4. Lee cookie "access_token"
            5. Retorna { token: "eyJhbGc..." }
        ↓
        getToken() recibe token
        ↓
        Guarda en cache (cachedToken = token)
        ↓
        Retorna token
    ↓
Interceptor agrega header:
    Authorization: Bearer eyJhbGc...
    ↓
Request se envía al backend con token
    ↓
Backend valida token → retorna datos
    ↓
Client Component recibe datos
```

**Código de ejemplo:**

```typescript
// Client Component
"use client";

import { apiClient } from "@/lib/api/client";
import { useEffect, useState } from "react";

export function ServicesPage() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        // 1. Llamar al backend
        apiClient.get("/services/")
            .then(response => {
                // 4. Datos recibidos
                setServices(response.data);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }, []);

    // Renderizar...
}
```

---

### Fase 3: Token Expirado (401)

```
┌─────────────────────────────────────────────────────────────┐
│ 3. TOKEN EXPIRA O ES INVÁLIDO                               │
└─────────────────────────────────────────────────────────────┘

Client Component hace request
    ↓
apiClient envía request con token
    ↓
Backend responde: 401 Unauthorized
    ↓
Axios Response Interceptor detecta status === 401
    ↓
Interceptor ejecuta:
    1. clearTokenCache() → limpia cache en memoria
    2. fetch("/api/auth/logout") → limpia cookies del servidor
    3. window.location.href = "/login" → redirect
    ↓
Usuario es redirigido al login
```

**Código de ejemplo:**

```typescript
// lib/api/client.ts

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;

        if (status === 401) {
            console.log("Token expired, redirecting to login");

            // 1. Limpiar cache
            clearTokenCache();

            // 2. Limpiar cookies del servidor
            try {
                await fetch("/api/auth/logout", { method: "POST" });
            } catch (e) {
                console.error("Error clearing session:", e);
            }

            // 3. Redirect
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);
```

---

### Fase 4: Logout

```
┌─────────────────────────────────────────────────────────────┐
│ 4. USUARIO HACE LOGOUT                                      │
└─────────────────────────────────────────────────────────────┘

Usuario hace click en "Cerrar sesión"
    ↓
Client Component → Server Action
    ↓
Server Action ejecuta removeSession()
    ↓
removeSession() elimina cookies:
    ✓ access_token
    ✓ refresh_token
    ✓ user_data
    ↓
Server Action ejecuta clearTokenCache() (opcional)
    ↓
Redirect a /login
```

**Código de ejemplo:**

```typescript
// app/dashboard/actions.ts
"use server";

import { removeSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function logoutAction() {
    // 1. Eliminar cookies
    await removeSession();

    // 2. Redirect
    redirect("/login");
}
```

---

## 💻 Código de Implementación

### Archivo 1: `/lib/auth/session.ts`

```typescript
// Server-side session management using httpOnly cookies

import { cookies } from "next/headers";
import { SessionUser } from "./types";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const USER_DATA_COOKIE = "user_data";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

/**
 * Get access token from cookies
 * Must be called from Server Component, Server Action, or API Route
 */
export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value || null;
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || null;
}

/**
 * Set session tokens in httpOnly cookies
 * Must be called from Server Action or Route Handler
 */
export async function setSession(tokens: {
    access: string;
    refresh: string
}): Promise<void> {
    const cookieStore = await cookies();

    // Access token expires in 1 day
    cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.access, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24, // 1 day
    });

    // Refresh token expires in 7 days
    cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refresh, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

/**
 * Set user data in httpOnly cookie
 */
export async function setUserData(userData: SessionUser): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(USER_DATA_COOKIE, JSON.stringify(userData), {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24, // 1 day
    });
}

/**
 * Get user data from cookie
 */
export async function getUserData(): Promise<SessionUser | null> {
    try {
        const cookieStore = await cookies();
        const userDataCookie = cookieStore.get(USER_DATA_COOKIE)?.value;

        if (!userDataCookie) {
            return null;
        }

        return JSON.parse(userDataCookie) as SessionUser;
    } catch (error) {
        console.error("Failed to parse user data from cookie:", error);
        return null;
    }
}

/**
 * Remove session (logout)
 * Must be called from Server Action or Route Handler
 */
export async function removeSession(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    cookieStore.delete(USER_DATA_COOKIE);
}

/**
 * Get current session
 * Returns user data if authenticated
 */
export async function getSession(): Promise<SessionUser | null> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return null;
    }

    return await getUserData();
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}
```

---

### Archivo 2: `/app/api/auth/token/route.ts`

```typescript
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/session";

/**
 * API Route to get access token from httpOnly cookie
 * This allows Client Components to obtain the token without directly
 * accessing httpOnly cookies (which is impossible from the client)
 *
 * Security:
 * - Only works if user has valid httpOnly cookie
 * - Cookies are sent automatically by browser
 * - External requests without cookies will get 401
 */
export async function GET() {
    const token = await getAccessToken();

    if (!token) {
        return NextResponse.json({ token: null }, { status: 401 });
    }

    return NextResponse.json({ token });
}
```

---

### Archivo 3: `/app/api/auth/logout/route.ts`

```typescript
import { NextResponse } from "next/server";
import { removeSession } from "@/lib/auth/session";

/**
 * API Route to logout and clear session cookies
 */
export async function POST() {
    try {
        await removeSession();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error during logout:", error);
        return NextResponse.json(
            { success: false, error: "Logout failed" },
            { status: 500 }
        );
    }
}
```

---

### Archivo 4: `/lib/api/client.ts`

```typescript
// Axios client configuration with interceptors

import axios from "axios";

// Create axios instance
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// In-memory token cache (cleared on page reload)
let cachedToken: string | null = null;

/**
 * Get token from API Route
 * Uses cache to avoid multiple requests
 */
const getToken = async (): Promise<string | null> => {
    if (cachedToken) {
        return cachedToken;
    }

    try {
        const response = await fetch("/api/auth/token");
        const data = await response.json();
        cachedToken = data.token;
        return cachedToken;
    } catch (error) {
        console.error("🔴 Error fetching token:", error);
        return null;
    }
};

/**
 * Clear token cache
 * Call this after login/logout to force fresh token fetch
 */
export const clearTokenCache = () => {
    console.log("🟡 Clearing token cache");
    cachedToken = null;
};

// Request interceptor: Add Authorization header
apiClient.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle authentication errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;

        // Token expired or invalid (401 Unauthorized)
        if (status === 401) {
            console.log("🔴 Token expired or invalid, redirecting to login");

            // Clear token cache
            clearTokenCache();

            // Clear server-side cookies
            try {
                await fetch("/api/auth/logout", { method: "POST" });
            } catch (e) {
                console.error("Error clearing session:", e);
            }

            // Redirect to login
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        // For 403 (Forbidden), don't logout - just reject
        // 403 means authenticated but no permission for this resource
        return Promise.reject(error);
    }
);
```

---

## 🔒 Seguridad

### Protecciones Implementadas

| Amenaza | Protección | Cómo funciona |
|---------|------------|---------------|
| **XSS** | Cookies HttpOnly | JavaScript NO puede leer las cookies |
| **CSRF** | `sameSite: "lax"` | Cookies NO se envían en requests cross-origin |
| **MITM** | `secure: true` | Cookies solo en HTTPS (producción) |
| **Token en localStorage** | No usado | Evita vulnerabilidad XSS |
| **Request externo** | Cookie requerida | Sin cookie válida → 401 |

---

### ¿Por qué es seguro exponer `/api/auth/token`?

**Pregunta:** ¿No es peligroso tener un endpoint público que retorna tokens?

**Respuesta:** NO es peligroso porque:

1. **La API NO es realmente pública**
   - Requiere cookie HttpOnly válida
   - Sin cookie → 401 Unauthorized

2. **Las cookies HttpOnly son inaccesibles desde JavaScript**
   - Un atacante con XSS NO puede robar la cookie
   - Solo el navegador envía la cookie automáticamente

3. **Protección CSRF con `sameSite: "lax"`**
   - Requests desde otros dominios NO incluyen la cookie
   - Solo requests desde tu dominio funcionan

4. **Comparación con alternativas:**

```typescript
// ❌ INSEGURO: localStorage
localStorage.setItem('token', token); // Vulnerable a XSS

// ❌ INSEGURO: Cookie accesible desde JS
document.cookie = `token=${token}`; // Vulnerable a XSS

// ✅ SEGURO: HttpOnly cookie + API Route
// Cookie NO accesible desde JavaScript
// Solo el navegador la envía automáticamente
```

---

### Validación de Seguridad

**Test 1: Request externo sin cookies**

```bash
curl https://tu-app.com/api/auth/token

# Response:
{
  "token": null
}
# Status: 401 Unauthorized
```

**Test 2: Request desde Postman sin cookies**

```
GET https://tu-app.com/api/auth/token

Response:
{
  "token": null
}
Status: 401
```

**Test 3: Request desde tu app con sesión activa**

```javascript
// Desde consola del navegador con sesión activa
fetch("/api/auth/token").then(r => r.json()).then(console.log)

// Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
// Status: 200 ✅
```

---

### Mejoras Opcionales de Seguridad

#### 1. Rate Limiting

```typescript
// app/api/auth/token/route.ts
import { ratelimit } from "@/lib/redis";

export async function GET(request: Request) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 }
        );
    }

    // ... rest of code
}
```

#### 2. Content Security Policy (CSP)

```typescript
// next.config.js
const securityHeaders = [
    {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY'
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    }
];

module.exports = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: securityHeaders,
            },
        ];
    },
};
```

#### 3. Token Refresh (Opcional)

```typescript
// lib/api/client.ts

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Intentar refresh del token
                await fetch("/api/auth/refresh", { method: "POST" });

                // Limpiar cache para obtener nuevo token
                clearTokenCache();

                // Reintentar request original
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Si refresh falla, hacer logout
                clearTokenCache();
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);
```

---

## 🐛 Troubleshooting

### Problema 1: "Error: cookies() expects to have requestAsyncStorage"

**Causa:** Estás intentando usar `cookies()` en un Client Component

**Solución:**
```typescript
// ❌ NO HACER (en Client Component)
import { getAccessToken } from '@/lib/auth/session';
const token = await getAccessToken();

// ✅ HACER (en Client Component)
const response = await fetch("/api/auth/token");
const data = await response.json();
const token = data.token;
```

---

### Problema 2: Token siempre retorna `null`

**Causa:** La cookie no se está guardando correctamente

**Debug:**

```typescript
// 1. Verificar que setSession se llama después de login
await setSession({ access: "...", refresh: "..." });

// 2. Verificar en DevTools → Application → Cookies
// Debe aparecer: access_token, refresh_token

// 3. Verificar que la cookie tiene httpOnly=true
// En DevTools debe aparecer la columna "HttpOnly" marcada

// 4. Verificar en API Route
export async function GET() {
    const token = await getAccessToken();
    console.log("🔍 Token from cookie:", token); // Debug
    // ...
}
```

---

### Problema 3: CORS error al llamar `/api/auth/token`

**Causa:** Request cross-origin bloqueado

**Solución:**

```typescript
// next.config.js
module.exports = {
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_APP_URL },
                    { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
                ],
            },
        ];
    },
};
```

---

### Problema 4: Token se pierde después de refresh

**Causa:** La cookie tiene `maxAge` muy corto o se está eliminando

**Solución:**

```typescript
// Verificar maxAge en session.ts
cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.access, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24, // 1 día ← Verificar este valor
});

// Verificar que no se llama removeSession() accidentalmente
```

---

### Problema 5: Cache del token causa problemas

**Causa:** Token cacheado está obsoleto

**Solución:**

```typescript
// Limpiar cache después de operaciones importantes
import { clearTokenCache } from '@/lib/api/client';

// Después de login
await loginAction();
clearTokenCache(); // Forzar obtener nuevo token

// Después de logout
await logoutAction();
clearTokenCache(); // Limpiar token antiguo

// Después de cambiar contraseña
await changePasswordAction();
clearTokenCache(); // Token puede haber cambiado
```

---

### Problema 6: 401 en producción pero funciona en desarrollo

**Causa:** Configuración de cookies diferentes entre entornos

**Solución:**

```typescript
// session.ts
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ← Solo HTTPS en prod
    sameSite: "lax" as const,
    path: "/",
    domain: process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN // Ej: ".tudominio.com"
        : undefined,
};
```

---

## 📊 Comparación con Otras Arquitecturas

| Arquitectura | Seguridad | Complejidad | Performance | Recomendación |
|--------------|-----------|-------------|-------------|---------------|
| **API Route + HttpOnly Cookies** (actual) | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ✅ **RECOMENDADO** |
| localStorage + Token | ⭐ | ⭐ | ⭐⭐⭐⭐⭐ | ❌ Vulnerable a XSS |
| Server Actions únicamente | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⚠️ Más seguro pero muy complejo |
| Next.js Middleware | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⚠️ Solo Server Components |
| Session Cookies (sin JWT) | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⚠️ Requiere backend stateful |

---

## 📚 Referencias

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [HTTP Cookies Security](https://owasp.org/www-community/HttpOnly)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SameSite Cookies Explained](https://web.dev/samesite-cookies-explained/)

---

## ✅ Checklist de Implementación

- [ ] Archivo `lib/auth/session.ts` creado con funciones de sesión
- [ ] Archivo `app/api/auth/token/route.ts` creado
- [ ] Archivo `app/api/auth/logout/route.ts` creado
- [ ] Archivo `lib/api/client.ts` modificado con interceptors
- [ ] Login llama `setSession()` y `setUserData()`
- [ ] Logout llama `removeSession()`
- [ ] `clearTokenCache()` se llama después de login/logout
- [ ] Cookies configuradas con `httpOnly`, `secure`, `sameSite`
- [ ] Probado en desarrollo sin errores
- [ ] Probado flujo completo: login → requests → logout
- [ ] Probado manejo de 401 (token expirado)
- [ ] Verificado en DevTools que cookies son HttpOnly
- [ ] Rate limiting implementado (opcional)
- [ ] CSP headers configurados (opcional)

---

**Última actualización:** 2025-01-XX
**Versión:** 1.0
**Autor:** Equipo de Desarrollo
