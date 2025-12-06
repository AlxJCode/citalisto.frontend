# Route Protection Guide

Guía para proteger rutas en Next.js sin usar middleware.

## 📋 Estrategias de Protección

### 1. **Layout-Based Protection (Recomendado)**

Protege todas las páginas dentro de un grupo de rutas.

```tsx
// app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ProtectedLayout({ children }) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return <>{children}</>;
}
```

**Ventajas:**
- ✅ Protege automáticamente todas las páginas hijas
- ✅ Código DRY (no repetir en cada página)
- ✅ Fácil de mantener

**Estructura:**
```
app/
├── (protected)/
│   ├── layout.tsx      ← Auth check aquí
│   ├── dashboard/page.tsx
│   ├── bookings/page.tsx
│   └── customers/page.tsx
```

---

### 2. **Page-Level Protection**

Protección específica por página.

```tsx
// app/admin/users/page.tsx
import { requireAuth } from "@/lib/auth";

export default async function UsersPage() {
    const user = await requireAuth(); // Throws si no auth

    return <div>Users: {user.email}</div>;
}
```

**Ventajas:**
- ✅ Control granular por página
- ✅ Útil para casos especiales

---

### 3. **Role-Based Protection**

Protección basada en roles.

```tsx
// app/admin/page.tsx
import { withRole } from "@/lib/auth";

export default async function AdminPage() {
    // Solo permite OWNER y SUPERADMIN
    await withRole({
        allowedRoles: ["OWNER", "SUPERADMIN"],
    });

    return <div>Admin Panel</div>;
}
```

---

## 🎯 Ejemplos Completos

### Ejemplo 1: Dashboard Protegido

```tsx
// app/(protected)/dashboard/page.tsx
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
    const session = await getSession(); // Ya validado por layout

    return (
        <div>
            <h1>Welcome, {session!.first_name}</h1>
            <p>Role: {session!.role_display}</p>
        </div>
    );
}
```

### Ejemplo 2: Login (Redirige si ya autenticado)

```tsx
// app/(public)/login/page.tsx
export default function LoginPage() {
    // El layout público redirige a /dashboard si ya está autenticado
    return <LoginForm />;
}
```

### Ejemplo 3: Admin con Verificación de Rol

```tsx
// app/(protected)/admin/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }) {
    const session = await getSession();

    // Ya validado por (protected) layout parent
    // Aquí solo verificamos rol
    if (session!.role !== "OWNER" && session!.role !== "SUPERADMIN") {
        redirect("/unauthorized");
    }

    return <>{children}</>;
}
```

### Ejemplo 4: Página Pública que Muestra Contenido Diferente

```tsx
// app/page.tsx
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function HomePage() {
    const session = await getSession();

    if (session) {
        return (
            <div>
                <h1>Welcome back, {session.first_name}!</h1>
                <Link href="/dashboard">Go to Dashboard</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>Welcome to Our App</h1>
            <Link href="/login">Login</Link>
        </div>
    );
}
```

---

## 📁 Estructura Recomendada

```
app/
├── (public)/                    # Rutas públicas
│   ├── layout.tsx              # Redirige a /dashboard si autenticado
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
│
├── (protected)/                 # Rutas que requieren auth
│   ├── layout.tsx              # Verifica autenticación
│   ├── dashboard/page.tsx
│   ├── bookings/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── customers/
│   │   └── page.tsx
│   └── profile/page.tsx
│
├── (admin)/                     # Rutas solo para admin
│   ├── layout.tsx              # Verifica auth + role OWNER/SUPERADMIN
│   ├── users/page.tsx
│   ├── settings/page.tsx
│   └── analytics/page.tsx
│
├── page.tsx                     # Home pública
├── about/page.tsx               # Página pública
└── unauthorized/page.tsx        # Página de acceso denegado
```

---

## 🛠️ Helpers Disponibles

### `getSession()`
Obtiene la sesión actual (null si no autenticado)

```tsx
const session = await getSession();
if (session) {
    console.log(session.email);
}
```

### `requireAuth()`
Requiere autenticación (lanza error si no autenticado)

```tsx
const user = await requireAuth(); // Throws AuthError si no auth
```

### `isAuthenticated()`
Verifica si está autenticado (boolean)

```tsx
const isAuth = await isAuthenticated();
```

### `withRole()`
Requiere roles específicos

```tsx
await withRole({
    allowedRoles: ["OWNER", "STAFF"],
    redirectTo: "/unauthorized", // opcional
});
```

---

## ⚡ Performance Tips

1. **Cache de sesión**: `getSession()` hace fetch a `/auth/me/` cada vez. Considera cachear en el server si es necesario.

2. **Parallel data fetching**: Obtén sesión y datos en paralelo:

```tsx
export default async function DashboardPage() {
    const [session, bookings] = await Promise.all([
        requireAuth(),
        fetchBookings(),
    ]);

    return <Dashboard user={session} bookings={bookings} />;
}
```

3. **Use Suspense boundaries** para mejor UX:

```tsx
export default async function DashboardLayout({ children }) {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <AuthCheck>{children}</AuthCheck>
        </Suspense>
    );
}
```

---

## 🔒 Security Checklist

- ✅ Verificar auth en **server components** (nunca en cliente)
- ✅ Usar `httpOnly` cookies (ya configurado)
- ✅ Verificar roles en rutas sensibles
- ✅ Redirigir correctamente (no solo ocultar UI)
- ✅ Logs de acceso denegado (para auditoría)

---

## 📝 Ejemplo Real: Sistema de Reservas

```tsx
// app/(protected)/bookings/layout.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BookingsLayout({ children }) {
    const session = await getSession();

    // Validado por parent layout (protected)
    // Aquí podríamos agregar lógica adicional
    if (session!.business === null) {
        redirect("/setup-business"); // No tiene negocio configurado
    }

    return (
        <div>
            <h2>Bookings - {session!.business_model?.name}</h2>
            {children}
        </div>
    );
}
```

```tsx
// app/(protected)/bookings/[id]/page.tsx
import { requireAuth } from "@/lib/auth";
import { getBooking } from "@/services/bookings";

export default async function BookingDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const user = await requireAuth();
    const booking = await getBooking(Number(params.id));

    // Verificar que la reserva pertenece al negocio del usuario
    if (booking.business !== user.business) {
        redirect("/unauthorized");
    }

    return <BookingDetail booking={booking} />;
}
```

---

**Última actualización:** 2025-11-29
