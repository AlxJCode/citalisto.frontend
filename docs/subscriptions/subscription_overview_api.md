# Subscription Overview API

## Descripción

Endpoint que retorna un resumen consolidado de la última suscripción del negocio y su uso actual del mes. A diferencia de otros endpoints, este retorna la última suscripción independientemente de su estado (activa, cancelada, expirada o suspendida).

---

## Endpoint

```
GET /api/v1/subscriptions/overview/
```

---

## Autenticación y Permisos

- **Autenticación:** Token JWT requerido
- **Permiso:** `IsOwner` (solo propietarios del negocio)

---

## Request

No requiere parámetros. El negocio se obtiene del usuario autenticado.

### Headers
```
Authorization: Bearer <token>
```

---

## Response

### Success (200 OK)

```json
{
  "success": true,
  "message": "Resumen de suscripción obtenido exitosamente",
  "data": {
    "subscription": {
      "id": 15,
      "business": 8,
      "plan": 2,
      "plan_detail": {
        "id": 2,
        "name": "Plan Profesional",
        "slug": "profesional",
        "description": "Plan ideal para negocios en crecimiento",
        "price": "49.99",
        "billing_period": "monthly",
        "billing_period_display": "Mensual",
        "max_branches": 5,
        "max_professionals": 10,
        "max_bookings_per_month": 500,
        "max_whatsapp_per_month": 300,
        "whatsapp_enabled": true,
        "custom_branding_enabled": false,
        "api_access_enabled": true,
        "analytics_enabled": true
      },
      "status": "active",
      "status_display": "Activa",
      "started_at": "2026-01-01T00:00:00Z",
      "expires_at": null,
      "auto_renew": true,
      "trial_ends_at": null,
      "cancelled_at": null,
      "is_first_month": true,
      "effective_limits": {
        "branches": 5,
        "professionals": 10,
        "bookings": 387,
        "whatsapp": 232
      }
    },
    "usage": {
      "id": 23,
      "business": 8,
      "period_start": "2026-01-01",
      "period_end": "2026-01-31",
      "branches_count": 2,
      "professionals_count": 5,
      "bookings_count": 145,
      "whatsapp_messages_sent": 89,
      "email_messages_sent": 12,
      "last_updated": "2026-01-06T15:30:00Z",
      "subscription": {
        "id": 15,
        "plan_name": "Plan Profesional",
        "status": "active",
        "is_first_month": true
      },
      "usage_percentages": {
        "branches": 40.0,
        "professionals": 50.0,
        "bookings": 37.47,
        "whatsapp": 38.36
      }
    }
  }
}
```

### Error: No subscription found (404 Not Found)

```json
{
  "success": false,
  "message": "No tienes ninguna suscripción registrada",
  "data": null
}
```

### Error: No usage found (404 Not Found)

```json
{
  "success": false,
  "message": "No se encontró información de uso",
  "data": null
}
```

### Error: Unauthorized (401 Unauthorized)

```json
{
  "success": false,
  "message": "Authentication credentials were not provided.",
  "data": null
}
```

### Error: Forbidden (403 Forbidden)

```json
{
  "success": false,
  "message": "You do not have permission to perform this action.",
  "data": null
}
```

---

## Campos Importantes

### subscription.effective_limits

Límites efectivos considerando prorateo del primer mes:
- **branches:** Límite de sucursales (no se prorratea)
- **professionals:** Límite de profesionales (no se prorratea)
- **bookings:** Límite de reservas mensuales (prorrateado en primer mes)
- **whatsapp:** Límite de mensajes WhatsApp mensuales (prorrateado en primer mes)

**Valor `null`** indica recurso ilimitado.

### usage.usage_percentages

Porcentajes de uso calculados automáticamente:
- Valores entre `0` y `100`
- **Valor `null`** indica que el recurso es ilimitado (no se calcula porcentaje)

### subscription.status

Posibles valores:
- `active`: Suscripción activa
- `cancelled`: Suscripción cancelada
- `expired`: Suscripción expirada
- `suspended`: Suscripción suspendida

---

## Diferencias con Otros Endpoints

| Endpoint | Retorna | Filtro |
|----------|---------|--------|
| `/subscriptions/current/` | Solo suscripción activa | `status=active` |
| `/subscriptions/usage/` | Solo uso actual | - |
| `/subscriptions/stats/` | Suscripción activa + uso + alertas | `status=active` |
| `/subscriptions/overview/` | **Última suscripción + uso** | **Última por fecha** |

**Ventaja principal:** `/overview/` funciona aunque la suscripción esté cancelada o expirada, útil para mostrar información histórica o gestionar renovaciones.

---

## Notas Técnicas

1. **Prorateo del primer mes:**
   - Los límites de `bookings` y `whatsapp` se prorratean según días disponibles
   - Los límites de `branches` y `professionals` NO se prorratean

2. **Usage se resetea mensualmente:**
   - `bookings_count` y `whatsapp_messages_sent` se reinician el día 1 de cada mes
   - `branches_count` y `professionals_count` se calculan en tiempo real

3. **OneToOne relationship:**
   - Existe solo un `Usage` por `Business` (relación 1:1)
   - Puede haber múltiples `Subscription` por `Business` (relación 1:N)

4. **Serializers utilizados:**
   - `SubscriptionSerializer`: Incluye `plan_detail`, `effective_limits`, `is_first_month`
   - `UsageSerializer`: Incluye `subscription`, `usage_percentages`

---

## Ejemplo de Uso (Frontend)

```javascript
// Fetch subscription overview
const response = await fetch('/api/v1/subscriptions/overview/', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const { success, data } = await response.json();

if (success) {
  const { subscription, usage } = data;

  console.log('Plan:', subscription.plan_detail.name);
  console.log('Status:', subscription.status_display);
  console.log('Sucursales:', `${usage.branches_count}/${subscription.effective_limits.branches}`);
  console.log('Uso de reservas:', `${usage.usage_percentages.bookings}%`);
}
```

---

## Casos de Uso Recomendados

1. **Dashboard del owner:** Mostrar resumen rápido de suscripción y consumo
2. **Widget de límites:** Visualizar barras de progreso de uso
3. **Página de facturación:** Mostrar plan actual y renovaciones
4. **Gestión de upgrade/downgrade:** Evaluar necesidad de cambio de plan
5. **Notificaciones:** Alertar cuando se acerque a límites (>80%)
