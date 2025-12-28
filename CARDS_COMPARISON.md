# 📊 Comparación de Cards de Estadísticas

## 🎯 Resumen Ejecutivo

He creado **4 variantes de cards** para tu dashboard dental:

| Variante | Archivo | Mejor uso | Ventaja principal |
|----------|---------|-----------|-------------------|
| **Original** | `MetricCard` | Métricas simples | Minimalista, rápido de leer |
| **Con Progress Bar** | `MetricCardWithProgress` | Uso de recursos | Visualiza límites/objetivos |
| **Con Tendencia** | `MetricCardWithTrend` | Comparación temporal | Muestra crecimiento |
| **Con Ring** | `MetricCardWithRing` | Porcentajes | Muy visual, compacto |

---

## 📁 Archivos Creados

```
src/components/dashboard/
├── MetricCard/                      ← Original (ya existía)
│   ├── index.tsx
│   └── styles.module.css
├── MetricCardWithProgress/          ← NUEVO
│   ├── index.tsx
│   └── styles.module.css
├── MetricCardWithTrend/             ← NUEVO
│   ├── index.tsx
│   └── styles.module.css
└── MetricCardWithRing/              ← NUEVO
    ├── index.tsx
    └── styles.module.css

src/app/(protected)/
└── dashboard-demo/                  ← Página de demostración
    ├── layout.tsx
    └── page.tsx
```

---

## 🔍 Detalles de Cada Variante

### 1️⃣ MetricCard (Original)

**Características:**
- Icono con fondo de color a la izquierda
- Número grande
- Label descriptivo
- Subtitle opcional

**Props:**
```typescript
interface MetricCardProps {
    icon: ReactNode;
    iconBgColor: string;
    iconColor: string;
    value: string | number;
    label: string;
    subtitle?: string;
    valueColor?: string;
    onClick?: () => void;
}
```

**Ejemplo de uso:**
```tsx
<MetricCard
    icon={<CalendarOutlined />}
    iconBgColor="#e6f4ff"
    iconColor="#1890ff"
    value={5}
    label="Citas de Hoy"
    subtitle="Próxima: 10:30 AM"
/>
```

**Cuándo usar:**
- ✅ Números simples sin contexto adicional
- ✅ Métricas que no necesitan comparación
- ✅ Dashboard minimalista

---

### 2️⃣ MetricCardWithProgress

**Características:**
- Todo lo del card original
- **Progress bar** debajo con separador
- Colores personalizables
- Opción de mostrar/ocultar porcentaje

**Props adicionales:**
```typescript
progress?: {
    percent: number;
    strokeColor?: string;
    showInfo?: boolean;
    status?: "success" | "exception" | "normal" | "active";
}
```

**Ejemplo de uso:**
```tsx
<MetricCardWithProgress
    icon={<MessageOutlined />}
    iconBgColor="#f6ffed"
    iconColor="#52c41a"
    value="350 restantes"
    label="Mensajes WhatsApp"
    subtitle="650 de 1000 usados"
    progress={{
        percent: 65,
        strokeColor: "#52c41a",
    }}
/>
```

**Cuándo usar:**
- ✅ Recursos con límite (WhatsApp, almacenamiento)
- ✅ Progreso hacia objetivo
- ✅ Métricas con capacidad máxima

---

### 3️⃣ MetricCardWithTrend

**Características:**
- Todo lo del card original
- **Indicador de tendencia** (↑ ↓)
- Color verde/rojo según dirección
- Label opcional para la tendencia

**Props adicionales:**
```typescript
trend?: {
    value: number;          // ej: 12 (significa 12%)
    direction: "up" | "down";
    label?: string;         // ej: "vs mes anterior"
}
```

**Ejemplo de uso:**
```tsx
<MetricCardWithTrend
    icon={<DollarOutlined />}
    iconBgColor="#f6ffed"
    iconColor="#52c41a"
    value="$45,500"
    label="Ingresos del Mes"
    trend={{
        value: 18,
        direction: "up",
        label: "vs mes pasado",
    }}
/>
```

**Cuándo usar:**
- ✅ Tienes datos históricos (mes anterior, semana anterior)
- ✅ Quieres mostrar mejora/deterioro
- ✅ Dashboard ejecutivo/gerencial

---

### 4️⃣ MetricCardWithRing

**Características:**
- **Progress ring circular** (Progress de Ant Design)
- Icono dentro del ring
- Porcentaje visible
- Layout vertical centrado
- Color automático según porcentaje

**Props:**
```typescript
interface MetricCardWithRingProps {
    icon: ReactNode;
    value: string | number;
    label: string;
    subtitle?: string;
    progress: {
        percent: number;
        strokeColor?: string | { [key: string]: string };
        format?: (percent?: number) => ReactNode;
    };
    onClick?: () => void;
}
```

**Ejemplo de uso:**
```tsx
<MetricCardWithRing
    icon={<CheckCircleOutlined />}
    value="87%"
    label="Tasa de Asistencia"
    subtitle="87 de 100 pacientes"
    progress={{
        percent: 87,
    }}
/>
```

**Cuándo usar:**
- ✅ Porcentajes y tasas
- ✅ Dashboard visual/gráfico
- ✅ Espacio limitado horizontal

---

## 🎨 Comparación Visual

### Tamaño y Espacio

| Card | Altura aprox | Ancho óptimo | Densidad info |
|------|--------------|--------------|---------------|
| Original | ~100px | Flexible | Baja |
| WithProgress | ~140px | Flexible | Media |
| WithTrend | ~100px | Flexible | Alta |
| WithRing | ~200px | Más compacto | Media |

### Complejidad Visual

```
Original:         ████░░░░░░ (4/10) - Muy limpio
WithProgress:     ██████░░░░ (6/10) - Balanceado
WithTrend:        ███████░░░ (7/10) - Rico en info
WithRing:         ████████░░ (8/10) - Muy visual
```

---

## 💡 Recomendaciones por Métrica

Para tu dashboard dental, te recomiendo esta combinación:

| Métrica | Card Recomendado | Razón |
|---------|------------------|-------|
| **Citas de Hoy** | `MetricCardWithTrend` | Ver si hay más/menos citas vs mes anterior |
| **Pendientes Confirmar** | `MetricCard` simple | No necesita gráfico, es accionable |
| **Tasa Asistencia** | `MetricCardWithRing` | Porcentaje visual, muy importante |
| **Ingresos Mes** | `MetricCardWithTrend` | Ver crecimiento vs mes anterior |
| **WhatsApp** | `MetricCardWithProgress` | Recurso limitado, mostrar uso |
| **Cancelaciones** | `MetricCardWithTrend` | Ver si están bajando/subiendo |

---

## 🚀 Cómo Probar las Variantes

### 1. Accede a la página demo:
```
/dashboard-demo
```

### 2. Verás 5 secciones:
- ✅ Variante Original
- ✅ Variante 1: Progress Bar
- ✅ Variante 2: Tendencia
- ✅ Variante 3: Progress Ring
- ✅ Mix Recomendado

### 3. Compara visualmente y decide cuál te gusta más

---

## 📝 Cómo Implementar en Dashboard Real

### Opción A: Usa solo una variante para todo
```tsx
import MetricCardWithTrend from "@/components/dashboard/MetricCardWithTrend";

// Usar en todas las métricas
<MetricCardWithTrend ... />
```

### Opción B: Mix de variantes (recomendado)
```tsx
import MetricCard from "@/components/dashboard/MetricCard";
import MetricCardWithProgress from "@/components/dashboard/MetricCardWithProgress";
import MetricCardWithTrend from "@/components/dashboard/MetricCardWithTrend";
import MetricCardWithRing from "@/components/dashboard/MetricCardWithRing";

// Usar según tipo de métrica
<MetricCardWithTrend ... />      // Para ingresos
<MetricCardWithProgress ... />   // Para WhatsApp
<MetricCardWithRing ... />       // Para asistencia
```

---

## 🎯 Próximos Pasos

1. **Prueba la demo** en `/dashboard-demo`
2. **Decide qué variante(s) usar** según tu preferencia
3. **Actualiza `/dashboard-new/page.tsx`** con las variantes elegidas
4. **Opcional:** Combina features (ej: Progress + Trend en un solo card)

---

## ❓ Preguntas Frecuentes

### ¿Puedo combinar Progress y Trend en un mismo card?
Sí, solo necesitas agregar ambas props al componente. Puedo crear un `MetricCardComplete` que tenga todas las opciones.

### ¿Cuál es la más rápida de leer?
El **Original** es el más rápido (scan en 1 segundo). El **WithRing** toma más tiempo pero es más memorable.

### ¿Cuál ocupa menos espacio?
**WithRing** ocupa menos ancho pero más alto. **Original** es el más eficiente en espacio total.

### ¿Necesito datos históricos para usar WithTrend?
Sí, necesitas al menos 2 períodos para comparar (actual vs anterior). Si no tienes, usa otra variante.

---

## 🔧 Personalización Adicional

Todos los componentes soportan:
- ✅ `onClick` para hacer el card clickeable
- ✅ Colores personalizados
- ✅ CSS Modules para estilos custom
- ✅ Responsive (funcionan en mobile/tablet/desktop)

---

¡Prueba `/dashboard-demo` y dime cuál te gusta más! 🎨
