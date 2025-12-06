# Flujo de Autenticación - Sistema de Reservas

Documentación del flujo de autenticación implementado con SimpleJWT y arquitectura minimalista.

---

## 📋 Índice

1. [Filosofía](#filosofía)
2. [Flujo de Autenticación](#flujo-de-autenticación)
3. [Endpoints](#endpoints)
4. [Estructura del JWT](#estructura-del-jwt)
5. [Ejemplos de Uso](#ejemplos-de-uso)
6. [Implementación Frontend](#implementación-frontend)
7. [Seguridad](#seguridad)

---

## Filosofía

### Principios de Diseño

✅ **JWT Minimalista**
- El token solo contiene información esencial: `user_id`, `exp`, `jti`
- NO incluye roles, permisos ni datos del usuario
- Tamaño reducido del token
- Mayor seguridad (menos información expuesta)

✅ **Separación de Responsabilidades**
- `/auth/token/` → Solo autenticación (retorna tokens)
- `/auth/me/` → Solo información del usuario
- Cada endpoint tiene una responsabilidad única y clara

✅ **Escalabilidad**
- Fácil de extender con nuevos campos en `/me`
- No requiere regenerar tokens al actualizar información del usuario
- Compatible con microservicios

✅ **Seguridad**
- Token blacklist habilitado
- Rotación de refresh tokens
- Información sensible no expuesta en el token

---

## Flujo de Autenticación

### Diagrama de Flujo

```
┌─────────────┐                                    ┌──────────────┐
│   Frontend  │                                    │   Backend    │
└──────┬──────┘                                    └──────┬───────┘
       │                                                  │
       │  1. POST /api/v1/auth/token/                    │
       │  {                                               │
       │    "username": "user@example.com",               │
       │    "password": "password123"                     │
       │  }                                               │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │  2. Validar credenciales                        │
       │                                                  ├─┐
       │                                                  │ │
       │                                                  │<┘
       │                                                  │
       │  3. Respuesta con tokens                        │
       │  {                                               │
       │    "refresh": "<refresh_token>",                 │
       │    "access": "<access_token>"                    │
       │  }                                               │
       │<─────────────────────────────────────────────────┤
       │                                                  │
       │  4. Guardar tokens en localStorage/cookies      │
       ├─┐                                                │
       │ │                                                │
       │<┘                                                │
       │                                                  │
       │  5. GET /api/v1/auth/me/                        │
       │  Headers: {                                      │
       │    Authorization: "Bearer <access_token>"        │
       │  }                                               │
       ├─────────────────────────────────────────────────>│
       │                                                  │
       │  6. Validar token y extraer user_id             │
       │                                                  ├─┐
       │                                                  │ │
       │                                                  │<┘
       │                                                  │
       │  7. Respuesta con información del usuario       │
       │  {                                               │
       │    "success": true,                              │
       │    "data": {                                     │
       │      "id": 1,                                    │
       │      "username": "user@example.com",             │
       │      "role": "OWNER",                            │
       │      "business_model": { ... }                   │
       │    }                                             │
       │  }                                               │
       │<─────────────────────────────────────────────────┤
       │                                                  │
       │  8. Guardar datos del usuario en estado         │
       ├─┐                                                │
       │ │                                                │
       │<┘                                                │
```

---

## Endpoints

### 1. POST /api/v1/auth/token/

**Descripción:** Autenticación de usuario y obtención de tokens JWT

**Request:**
```json
{
  "username": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized):**
```json
{
  "detail": "No active account found with the given credentials"
}
```

**Características:**
- ✅ Solo retorna tokens (`access` y `refresh`)
- ✅ NO incluye información del usuario
- ✅ NO incluye roles ni permisos
- ✅ Respuesta limpia y minimalista

---

### 2. GET /api/v1/auth/me/

**Descripción:** Obtener información del usuario autenticado

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "status": "success",
  "message": "Información del usuario obtenida exitosamente",
  "data": {
    "id": 1,
    "username": "juan.perez",
    "email": "juan.perez@example.com",
    "dni": "12345678",
    "first_name": "Juan",
    "last_name": "Pérez",
    "mother_last_name": "García",
    "role": "OWNER",
    "role_display": "Dueño",
    "business": 5,
    "business_model": {
      "id": 5,
      "name": "Barbería El Corte Perfecto",
      "category": 2,
      "category_model": {
        "id": 2,
        "name": "Barbería",
        "description": "Servicios de barbería profesional",
        "logo": "/media/categories/logos/barberia.png"
      },
      "logo": "/media/businesses/logos/barberia_corte.png",
      "phone": "+52 55 1234 5678",
      "timezone": "America/Mexico_City",
      "owner": 1
    },
    "profile_picture": "/media/users/profiles/juan_perez.jpg",
    "is_active": true,
    "is_staff": false,
    "password_change_required": false,
    "last_password_change": "2025-11-15T10:30:00Z",
    "created": "2025-01-10T08:00:00Z",
    "modified": "2025-11-20T14:20:00Z"
  },
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 45
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "status": "error",
  "message": "Authentication credentials were not provided.",
  "data": null,
  "error": {
    "code": 401,
    "type": "authentication_error",
    "message": "Authentication credentials were not provided.",
    "details": null,
    "timestamp": "2025-11-29T10:30:00.123456Z"
  },
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 5
  }
}
```

**Características:**
- ✅ Retorna información completa del usuario
- ✅ Incluye relaciones FK expandidas (`business_model`)
- ✅ Solo requiere token de autenticación válido
- ✅ Respuesta estandarizada con ApiResponse

---

### 3. POST /api/v1/auth/token/refresh/

**Descripción:** Renovar access token usando refresh token

**Request:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Nota:** Con `ROTATE_REFRESH_TOKENS=True`, también se obtiene un nuevo refresh token.

---

### 4. POST /api/v1/auth/token/verify/

**Descripción:** Verificar si un token es válido

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{}
```

**Response (401 Unauthorized):**
```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

---

## Estructura del JWT

### Payload del Access Token

```json
{
  "token_type": "access",
  "exp": 1732886400,
  "iat": 1732800000,
  "jti": "3f2504e04f8911d39a0c0305e82c3301",
  "user_id": 1
}
```

### Campos del Token

| Campo | Descripción | Tipo |
|-------|-------------|------|
| `token_type` | Tipo de token ("access" o "refresh") | string |
| `exp` | Fecha de expiración (timestamp Unix) | number |
| `iat` | Fecha de emisión (timestamp Unix) | number |
| `jti` | ID único del token (para blacklist) | string |
| `user_id` | ID del usuario autenticado | number |

### ⚠️ Lo que NO está en el token

- ❌ Roles del usuario
- ❌ Permisos
- ❌ Información del negocio
- ❌ Email, nombre, etc.
- ❌ Datos sensibles

**Ventajas:**
- Token más pequeño (menor ancho de banda)
- Mayor seguridad (menos información expuesta)
- No requiere regenerar token al actualizar datos del usuario

---

## Ejemplos de Uso

### Flujo Completo de Login

```typescript
// 1. Login
async function login(username: string, password: string) {
  const response = await fetch('/api/v1/auth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const tokens = await response.json();
  // { "refresh": "...", "access": "..." }

  // 2. Guardar tokens
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);

  // 3. Obtener información del usuario
  const userResponse = await fetch('/api/v1/auth/me/', {
    headers: {
      'Authorization': `Bearer ${tokens.access}`
    }
  });

  const userData = await userResponse.json();

  // 4. Guardar información del usuario en el estado
  // (Redux, Context, Zustand, etc.)
  store.dispatch(setUser(userData.data));

  return userData.data;
}
```

---

### Interceptor de Axios

```typescript
import axios from 'axios';

// Configurar interceptor para agregar token automáticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para renovar token automáticamente
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado renovar aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Renovar access token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/api/v1/auth/token/refresh/', {
          refresh: refreshToken
        });

        const { access, refresh } = response.data;

        // Guardar nuevos tokens
        localStorage.setItem('access_token', access);
        if (refresh) {
          localStorage.setItem('refresh_token', refresh);
        }

        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);

      } catch (refreshError) {
        // Si falla la renovación, redirigir a login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

### Hook de React para Autenticación

```typescript
// hooks/useAuth.ts

import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  role_display: string;
  business: number | null;
  business_model: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar información del usuario al montar
  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/v1/auth/me/');
      setUser(response.data.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuario');
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(username: string, password: string) {
    setLoading(true);
    setError(null);

    try {
      // 1. Obtener tokens
      const tokenResponse = await axios.post('/api/v1/auth/token/', {
        username,
        password
      });

      const { access, refresh } = tokenResponse.data;

      // 2. Guardar tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // 3. Cargar información del usuario
      await loadUser();

      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
}
```

---

### Uso del Hook en Componentes

```typescript
// components/LoginForm.tsx

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function LoginForm() {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = await login(username, password);

    if (success) {
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario o Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

---

### Protected Route Component

```typescript
// components/ProtectedRoute.tsx

import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}

// Uso:
// <ProtectedRoute requiredRole={['OWNER', 'STAFF']}>
//   <Dashboard />
// </ProtectedRoute>
```

---

## Implementación Frontend

### Tipos TypeScript

```typescript
// types/auth.ts

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  refresh: string;
  access: string;
}

export interface UserMe {
  id: number;
  username: string;
  email: string;
  dni: string | null;
  first_name: string;
  last_name: string;
  mother_last_name: string;
  role: "SUPERADMIN" | "OWNER" | "STAFF" | "CUSTOMER";
  role_display: string;
  business: number | null;
  business_model: Business | null;
  profile_picture: string | null;
  is_active: boolean;
  is_staff: boolean;
  password_change_required: boolean;
  last_password_change: string | null;
  created: string;
  modified: string;
}

export interface Business {
  id: number;
  name: string;
  category: number;
  category_model: Category;
  logo: string | null;
  phone: string | null;
  timezone: string;
  owner: number;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
}
```

---

### Servicio de Autenticación

```typescript
// services/auth.service.ts

import axios from 'axios';
import { LoginRequest, TokenResponse, UserMe } from '@/types/auth';
import { ApiResponse } from '@/types/api';

const API_URL = '/api/v1';

export class AuthService {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await axios.post<TokenResponse>(
      `${API_URL}/auth/token/`,
      credentials
    );
    return response.data;
  }

  async getMe(): Promise<UserMe> {
    const response = await axios.get<ApiResponse<UserMe>>(
      `${API_URL}/auth/me/`
    );
    return response.data.data;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await axios.post<TokenResponse>(
      `${API_URL}/auth/token/refresh/`,
      { refresh: refreshToken }
    );
    return response.data;
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await axios.post(`${API_URL}/auth/token/verify/`, { token });
      return true;
    } catch {
      return false;
    }
  }

  saveTokens(tokens: TokenResponse): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export const authService = new AuthService();
```

---

## Seguridad

### Buenas Prácticas Implementadas

✅ **Token Blacklist**
- Tokens invalidados se agregan a una lista negra
- Previene reutilización de tokens comprometidos
- Configurado con `BLACKLIST_AFTER_ROTATION=True`

✅ **Rotación de Refresh Tokens**
- Cada vez que se usa un refresh token, se genera uno nuevo
- El token anterior se invalida
- Configurado con `ROTATE_REFRESH_TOKENS=True`

✅ **Expiración de Tokens**
- Access Token: 1 día
- Refresh Token: 7 días
- Tokens expirados son automáticamente rechazados

✅ **JWT Minimalista**
- Solo contiene información esencial
- Reduce superficie de ataque
- Menor riesgo si el token es comprometido

### Recomendaciones Adicionales

🔒 **Almacenamiento de Tokens**
- Usar `httpOnly` cookies en producción (más seguro que localStorage)
- Considerar implementar secure cookies con `sameSite=strict`
- Evitar almacenar tokens en sessionStorage o localStorage si es posible

🔒 **HTTPS Obligatorio**
- Siempre usar HTTPS en producción
- Los tokens deben transmitirse solo por conexiones seguras

🔒 **Validación del Token**
- Validar token en cada petición
- Verificar expiración
- Verificar firma del token

🔒 **Logout**
- Implementar endpoint de logout que invalide el refresh token
- Limpiar tokens del cliente al hacer logout

---

## Resumen Rápido

### Para el Frontend

1. **Login:**
   ```
   POST /api/v1/auth/token/
   → Obtener access y refresh tokens
   ```

2. **Obtener Usuario:**
   ```
   GET /api/v1/auth/me/
   Header: Authorization: Bearer <access_token>
   → Obtener información completa del usuario
   ```

3. **Renovar Token:**
   ```
   POST /api/v1/auth/token/refresh/
   Body: { "refresh": "<refresh_token>" }
   → Obtener nuevo access token
   ```

### Estructura de Datos

**Tokens:**
```json
{
  "refresh": "...",
  "access": "..."
}
```

**Usuario (/me):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "role": "OWNER",
    "business_model": { ... }
  }
}
```

---

**Versión:** 1.0
**Última actualización:** 2025-11-29
**Documentación relacionada:**
- [API Response Documentation](./API_RESPONSE_DOCUMENTATION.md)
- [Models Schema](./MODELS_SCHEMA.md)
