# GlobalLoader - Loader Global Creativo

Componente de carga fullscreen con diseño moderno y animaciones suaves.

## Características

- ✅ Fullscreen overlay con backdrop blur
- ✅ Loader creativo con anillos animados
- ✅ Logo "C" de CitaListo en el centro
- ✅ Texto personalizable
- ✅ Transiciones suaves de entrada/salida
- ✅ Portal rendering (renderiza fuera del DOM normal)
- ✅ Previene scroll cuando está visible
- ✅ Z-index 9999 (sobre todo el contenido)

## Uso Básico

```tsx
"use client";

import { useLoader } from "@/contexts/LoaderContext";

export default function MyComponent() {
    const { showLoader, hideLoader } = useLoader();

    const handleAction = async () => {
        // Mostrar loader
        showLoader();

        try {
            await someAsyncOperation();
        } finally {
            // Ocultar loader
            hideLoader();
        }
    };

    return <button onClick={handleAction}>Hacer algo</button>;
}
```

## Con Texto Personalizado

```tsx
const handleLogin = async () => {
    showLoader("Iniciando sesión...");
    await login();
    hideLoader();
};

const handleSave = async () => {
    showLoader("Guardando cambios...");
    await saveData();
    hideLoader();
};
```

## Ejemplo: Navegación con Loader

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useLoader } from "@/contexts/LoaderContext";

export default function NavigationExample() {
    const router = useRouter();
    const { showLoader } = useLoader();

    const navigateTo = (path: string) => {
        showLoader("Cargando página...");
        router.push(path);
        // El loader se ocultará automáticamente cuando la nueva página se monte
    };

    return (
        <button onClick={() => navigateTo("/dashboard")}>
            Ir al Dashboard
        </button>
    );
}
```

## API del Hook useLoader

```typescript
interface LoaderContextType {
    isLoading: boolean;        // Estado actual del loader
    showLoader: (text?: string) => void;  // Mostrar loader con texto opcional
    hideLoader: () => void;     // Ocultar loader
}
```

## Diseño del Loader

El loader consiste en:

1. **Overlay con blur**: Fondo blanco semi-transparente con efecto blur
2. **3 anillos animados**: Cada uno con color diferente y velocidad única
   - Azul (#1890ff) - 1.5s
   - Verde (#52c41a) - 2s (reverso)
   - Amarillo (#faad14) - 2.5s
3. **Logo central**: Círculo con gradiente azul y letra "C"
4. **Animación pulse**: El logo pulsa suavemente
5. **Texto de carga**: Fade in/out debajo del loader

## Notas

- El loader está integrado globalmente en el `RootLayout`
- No necesitas importar el componente `GlobalLoader` directamente, solo usa el hook `useLoader`
- El texto por defecto es "Cargando..." si no se especifica
- El scroll del body se previene automáticamente cuando el loader está visible
