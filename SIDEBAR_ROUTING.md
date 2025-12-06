# Sistema de Navegación del Sidebar

## Cómo Funciona

El Sidebar utiliza **detección automática** de la ruta actual para determinar qué elemento del menú debe estar seleccionado y qué submenús deben estar abiertos.

### Componentes Principales

1. **`src/components/layout/Sidebar/index.tsx`**
   - Usa `usePathname()` de Next.js para obtener la ruta actual
   - Mapea la ruta al `selectedKey` y `openKeys` correspondientes
   - Actualiza automáticamente cuando cambia la ruta

2. **`src/components/layout/items.tsx`**
   - Define la estructura del menú con sus keys
   - Contiene los enlaces a las páginas

3. **`ROUTE_TO_MENU_KEY`** (en Sidebar)
   - Objeto que mapea rutas a configuración del menú
   - Define qué key debe estar seleccionado para cada ruta
   - Define qué submenús deben estar abiertos

## Cómo Agregar Nuevas Rutas

### Paso 1: Agregar el item al menú

En `src/components/layout/items.tsx`:

```tsx
{
    key: "mi-nueva-seccion",
    label: "Mi Sección",
    icon: <IconoOutlined />,
    children: [
        {
            key: "mi-nueva-seccion-opcion1",
            label: <Link href="/mi-seccion/opcion1">Opción 1</Link>,
        },
        {
            key: "mi-nueva-seccion-opcion2",
            label: <Link href="/mi-seccion/opcion2">Opción 2</Link>,
        },
    ],
}
```

### Paso 2: Agregar el mapeo de rutas

En `src/components/layout/Sidebar/index.tsx`, dentro de `ROUTE_TO_MENU_KEY`:

```tsx
const ROUTE_TO_MENU_KEY: Record<string, { selectedKey: string; openKeys: string[] }> = {
    // ... rutas existentes

    // Nueva ruta padre
    "/mi-seccion": {
        selectedKey: "mi-nueva-seccion-opcion1",  // Key del primer hijo
        openKeys: ["mi-nueva-seccion"]             // Key del padre para abrirlo
    },

    // Rutas hijas
    "/mi-seccion/opcion1": {
        selectedKey: "mi-nueva-seccion-opcion1",
        openKeys: ["mi-nueva-seccion"]
    },
    "/mi-seccion/opcion2": {
        selectedKey: "mi-nueva-seccion-opcion2",
        openKeys: ["mi-nueva-seccion"]
    },
};
```

### Paso 3: Crear las páginas

No es necesario pasar props al `Sidebar`, el sistema detecta automáticamente:

```tsx
// src/app/(protected)/mi-seccion/layout.tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/auth";

export default async function MiSeccionLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    return <Sidebar user={session}>{children}</Sidebar>;
}
```

## Ejemplo: Professionals

### Estructura de rutas:
- `/professionals` → Lista de profesionales
- `/professionals/availabilities` → Disponibilidad de profesionales

### Configuración en items.tsx:
```tsx
{
    key: "professionals",
    label: "Profesionales",
    icon: <TeamOutlined />,
    children: [
        {
            key: "professionals-list",
            label: <Link href="/professionals">Listado</Link>,
        },
        {
            key: "professionals-availability",
            label: <Link href="/professionals/availabilities">Disponibilidad</Link>,
        },
    ],
}
```

### Configuración en ROUTE_TO_MENU_KEY:
```tsx
"/professionals": {
    selectedKey: "professionals-list",
    openKeys: ["professionals"]
},
"/professionals/availabilities": {
    selectedKey: "professionals-availability",
    openKeys: ["professionals"]
},
```

## Ventajas de este Sistema

✅ **No necesitas pasar props manualmente** - El sistema detecta automáticamente la ruta
✅ **DRY (Don't Repeat Yourself)** - La configuración está centralizada
✅ **Mantiene el submenu abierto** - Los `openKeys` aseguran que el submenu permanezca abierto
✅ **Sincronización automática** - El menú se actualiza cuando cambias de ruta
✅ **Soporte para rutas dinámicas** - Puede matchear por prefijo si no hay match exacto

## Troubleshooting

### El item no se selecciona correctamente
1. Verifica que la key en `items.tsx` coincida con `selectedKey` en `ROUTE_TO_MENU_KEY`
2. Asegúrate de que la ruta en `ROUTE_TO_MENU_KEY` coincida exactamente con la URL

### El submenu no se abre
1. Verifica que `openKeys` contenga la key del item padre
2. La key del padre debe coincidir con la key definida en `items.tsx`

### Para rutas con parámetros dinámicos
El sistema intenta matchear por prefijo. Si tienes `/professionals/[id]`, puedes agregar:

```tsx
"/professionals/": {
    selectedKey: "professionals-list",
    openKeys: ["professionals"]
},
```

Y el sistema lo detectará automáticamente.
