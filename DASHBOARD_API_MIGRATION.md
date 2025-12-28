# 📋 Migración del Dashboard API - Cambios Aplicados

## ✅ Resumen de Cambios

El hook `useDashboard()` y sus tipos han sido actualizados para reflejar la nueva estructura del endpoint `/api/v1/dashboard/overview/`.

---

## 🔄 Cambios en la Estructura de Datos

### ❌ **Campos Eliminados**

| Campo Antiguo | Razón |
|---------------|-------|
| `bookings_origin` | Ya no existe en el API |
| `bookings_origin.widget` | Eliminado |
| `bookings_origin.manual` | Eliminado |
| `bookings_origin.widget_percentage` | Eliminado |
| `attendance` | Ya no existe en el API |
| `attendance.rate` | Eliminado |
| `attendance.completed` | Eliminado |
| `attendance.cancelled` | Eliminado |

### ✅ **Campos Agregados**

| Campo Nuevo | Tipo | Descripción |
|-------------|------|-------------|
| `whatsapp.period_start` | `string` | Fecha de inicio del período de facturación |
| `whatsapp.period_end` | `string` | Fecha de fin del período de facturación |
| `monthly_revenue` | `MonthlyRevenueApi[]` | Array con ingresos de últimos 12 meses |

### 📊 **Nueva Interfaz: MonthlyRevenue**

```typescript
// API (snake_case)
export interface MonthlyRevenueApi {
    month: string;           // "2025-01"
    count: number;           // Cantidad de citas completadas
    total_revenue: string;   // "12500.00"
}

// Frontend (camelCase)
export interface MonthlyRevenue {
    month: string;           // "2025-01"
    count: number;           // Cantidad de citas completadas
    totalRevenue: string;    // "12500.00"
}
```

---

## 📁 Archivos Modificados

### 1. `src/features/dashboard/types/dashboard.types.ts`

**Cambios aplicados:**

✅ Eliminado `bookings_origin` de `DashboardDataApi`
✅ Eliminado `attendance` de `DashboardDataApi`
✅ Agregado `period_start` y `period_end` a `whatsapp`
✅ Agregado `monthly_revenue: MonthlyRevenueApi[]`
✅ Creada interfaz `MonthlyRevenueApi`
✅ Creada interfaz `MonthlyRevenue`
✅ Actualizada función `mapDashboardData()` con nuevos mapeos

---

## 🔍 Comparación Antes/Después

### **ANTES (Estructura Antigua)**

```typescript
interface DashboardDataApi {
    business: { ... }
    agenda: { ... }
    revenue: { ... }
    whatsapp: {
        used: number;
        limit: number;
        remaining: number;
        percentage: number;
        // ❌ Sin period_start/period_end
    };
    next_bookings: NextBookingApi[];
    bookings_origin: {          // ❌ Ya no existe
        widget: number;
        manual: number;
        widget_percentage: number;
    };
    attendance: {               // ❌ Ya no existe
        rate: number;
        completed: number;
        cancelled: number;
    };
    top_services: TopServiceApi[];
    // ❌ Sin monthly_revenue
}
```

### **DESPUÉS (Estructura Nueva)**

```typescript
interface DashboardDataApi {
    business: { ... }
    agenda: { ... }
    revenue: { ... }
    whatsapp: {
        used: number;
        limit: number;
        remaining: number;
        percentage: number;
        period_start: string;    // ✅ NUEVO
        period_end: string;      // ✅ NUEVO
    };
    next_bookings: NextBookingApi[];
    top_services: TopServiceApi[];
    monthly_revenue: MonthlyRevenueApi[];  // ✅ NUEVO
}
```

---

## 🎯 Impacto en Componentes

### ⚠️ **Componentes que NECESITAN actualización**

Si tienes componentes usando estos campos eliminados, deberás actualizarlos:

```typescript
// ❌ YA NO FUNCIONAN
data.bookingsOrigin.widget
data.bookingsOrigin.manual
data.bookingsOrigin.widgetPercentage
data.attendance.rate
data.attendance.completed
data.attendance.cancelled

// ✅ USAR EN SU LUGAR
data.monthlyRevenue  // Para gráficos de tendencia
data.whatsapp.periodStart  // Para mostrar período de facturación
data.whatsapp.periodEnd
```

### ✅ **Nuevos campos disponibles**

```typescript
// Período de facturación de WhatsApp
const { periodStart, periodEnd } = data.whatsapp;

// Ingresos históricos (últimos 12 meses)
data.monthlyRevenue.forEach(item => {
    console.log(`Mes: ${item.month}`);
    console.log(`Citas completadas: ${item.count}`);
    console.log(`Ingresos: $${item.totalRevenue}`);
});
```

---

## 📊 Ejemplo de Uso Actualizado

### **Consumir el hook:**

```typescript
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';

const MyComponent = () => {
    const { data, loading, fetchDashboard } = useDashboard();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    if (loading) return <Skeleton />;
    if (!data) return <Empty />;

    return (
        <div>
            {/* ✅ Datos básicos siguen igual */}
            <h1>{data.business.name}</h1>
            <p>Plan: {data.business.planName}</p>
            <p>Citas hoy: {data.agenda.today}</p>

            {/* ✅ WhatsApp con nuevo período */}
            <p>Mensajes usados: {data.whatsapp.used} / {data.whatsapp.limit}</p>
            <p>Período: {data.whatsapp.periodStart} - {data.whatsapp.periodEnd}</p>

            {/* ✅ NUEVO: Ingresos mensuales */}
            <h2>Últimos 12 meses</h2>
            {data.monthlyRevenue.map(item => (
                <div key={item.month}>
                    <p>{item.month}: ${item.totalRevenue} ({item.count} citas)</p>
                </div>
            ))}

            {/* ❌ YA NO DISPONIBLE */}
            {/* <p>Tasa asistencia: {data.attendance.rate}%</p> */}
            {/* <p>Desde widget: {data.bookingsOrigin.widgetPercentage}%</p> */}
        </div>
    );
};
```

---

## 🔧 Migración de Componentes

### **Si usabas `attendance`:**

**ANTES:**
```typescript
<StatCard
    value={`${data.attendance.rate}%`}
    label="Tasa de Asistencia"
/>
```

**DESPUÉS (calcular manualmente si es necesario):**
```typescript
// Opción 1: Calcular desde monthly_revenue del mes actual
const currentMonth = dayjs().format('YYYY-MM');
const currentMonthData = data.monthlyRevenue.find(
    item => item.month === currentMonth
);

// Opción 2: Usar solo las métricas disponibles
<StatCard
    value={data.agenda.today}
    label="Citas de Hoy"
/>
```

### **Si usabas `bookings_origin`:**

**ANTES:**
```typescript
<PieChart
    widget={data.bookingsOrigin.widget}
    manual={data.bookingsOrigin.manual}
/>
```

**DESPUÉS (usar monthly_revenue para gráficos):**
```typescript
<LineChart
    data={data.monthlyRevenue.map(item => ({
        month: item.month,
        revenue: parseFloat(item.totalRevenue),
        count: item.count
    }))}
/>
```

---

## 🚀 Beneficios de la Nueva Estructura

### ✅ **Ventajas:**

1. **Datos históricos disponibles:** Ahora tienes `monthly_revenue` con 12 meses de datos
2. **Período de facturación claro:** WhatsApp ahora incluye `period_start` y `period_end`
3. **Menos dependencias:** Eliminación de campos poco usados (`bookings_origin`, `attendance`)
4. **API más eficiente:** Menos queries en el backend
5. **Datos más precisos:** `monthly_revenue` usa solo citas `completed`

### 📈 **Nuevas posibilidades:**

- Gráficos de tendencia de ingresos (últimos 12 meses)
- Comparación mes a mes
- Predicción de ingresos
- Dashboard más rico con datos históricos

---

## ✅ Checklist de Migración

- [x] Actualizar `DashboardDataApi` con nuevos campos
- [x] Agregar interfaces `MonthlyRevenueApi` y `MonthlyRevenue`
- [x] Actualizar `DashboardData` (frontend types)
- [x] Actualizar función `mapDashboardData()`
- [ ] Revisar componentes que usan `data.attendance.*`
- [ ] Revisar componentes que usan `data.bookingsOrigin.*`
- [ ] Crear gráficos con `data.monthlyRevenue`
- [ ] Actualizar tests (si existen)

---

## 📝 Próximos Pasos

1. **Buscar referencias a campos eliminados:**
   ```bash
   # Buscar uso de attendance
   grep -r "attendance\." src/

   # Buscar uso de bookingsOrigin
   grep -r "bookingsOrigin" src/
   ```

2. **Actualizar componentes afectados**

3. **Crear nuevos componentes para `monthlyRevenue`:**
   - Gráfico de línea con tendencia
   - Tabla comparativa mes a mes
   - Cards con comparación vs mes anterior

---

¡La migración del hook `useDashboard()` está completa! 🎉
