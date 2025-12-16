# Dashboard API - Documentación

## Endpoint Principal

### `GET /api/v1/dashboard/overview/`

Retorna un resumen completo del negocio con métricas clave del dashboard.

**Autenticación:** Bearer Token (JWT)
**Permisos:** Usuario autenticado con Business asociado

---

## Request

```http
GET /api/v1/dashboard/overview/
Authorization: Bearer <access_token>
```

---

## Response Structure

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    "business": { ... },
    "agenda": { ... },
    "whatsapp": { ... },
    "next_bookings": [ ... ],
    "bookings_origin": { ... },
    "attendance": { ... },
    "top_services": [ ... ]
  }
}
```

---

## Data Sections

### 1. **business**
Información del negocio y plan activo.

```json
{
  "name": "Spa Relax",
  "plan_name": "Premium"
}
```

---

### 2. **agenda**
Estadísticas de reservas de hoy y futuras.

```json
{
  "today": 12,        // Reservas para hoy
  "upcoming": 45      // Reservas futuras
}
```

---

### 3. **whatsapp**
Uso de mensajes WhatsApp del mes.

```json
{
  "used": 380,
  "limit": 500,
  "remaining": 120,
  "percentage": 76
}
```

---

### 4. **next_bookings**
Próximas 5 reservas ordenadas por fecha/hora.

```json
[
  {
    "id": 1234,
    "date": "2025-12-16",
    "start_time": "14:00:00",
    "service_name": "Masaje Relajante",
    "customer_name": "Juan Pérez",
    "professional_name": "María López",
    "status": "confirmed"
  }
]
```

**Campos:**
- `date`, `start_time`: Fecha y hora de la cita
- `service_name`: Nombre del servicio
- `customer_name`: Cliente (o "Sin nombre")
- `professional_name`: Profesional asignado
- `status`: Estado (`pending`, `confirmed`, `cancelled`, `completed`)

---

### 5. **bookings_origin**
Origen de reservas del mes actual.

```json
{
  "widget": 28,            // Reservas desde widget público
  "manual": 15,            // Reservas manuales (business/customer)
  "widget_percentage": 65  // % widget del total
}
```

**Fuentes:**
- `widget`: Reservas desde el widget público
- `manual`: Suma de `business` + `customer` (creadas manualmente)

---

### 6. **attendance**
Tasa de asistencia del mes actual.

```json
{
  "rate": 92,         // % de asistencia
  "completed": 85,    // Reservas completadas
  "cancelled": 7      // Reservas canceladas
}
```

**Cálculo:** `rate = (completed / (completed + cancelled)) * 100`

---

### 7. **top_services**
Top 3 servicios más reservados del mes.

```json
[
  {
    "name": "Masaje Relajante",
    "count": 42,
    "revenue": "2100.00"
  },
  {
    "name": "Facial Hidratante",
    "count": 28,
    "revenue": "1400.00"
  }
]
```

**Ordenado por:** Cantidad de reservas (descendente)
**Revenue:** Suma de precios de todas las reservas de ese servicio

---

## Lógica del Servicio

- **Periodo de análisis:** Mes actual (desde día 1 hasta hoy)
- **Reservas futuras:** `date >= hoy`
- **Reservas del día:** `date = hoy`
- **Filtro principal:** Todas las queries filtran por `business` del usuario autenticado

---

## Ejemplo de Uso

### cURL
```bash
curl -X GET "https://api.example.com/api/v1/dashboard/overview/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### JavaScript (Fetch)
```javascript
const response = await fetch('/api/v1/dashboard/overview/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const data = await response.json();
console.log(data.data.agenda.today); // Reservas de hoy
```

### Python (requests)
```python
import requests

headers = {'Authorization': f'Bearer {access_token}'}
response = requests.get(
    'https://api.example.com/api/v1/dashboard/overview/',
    headers=headers
)
data = response.json()['data']
print(f"Plan: {data['business']['plan_name']}")
```

---

## Notas Técnicas

- **Optimización:** Usa `select_related()` en `next_bookings` para reducir queries
- **Timezone:** Todas las fechas usan `timezone.now()` (UTC)
- **Multi-tenant:** Automáticamente filtra por el Business del usuario
- **Performance:** Ejecuta ~7 queries (una por sección + joins optimizados)

---

## Archivos Relacionados

- **View:** `applications/dashboard/api_views.py:7`
- **Service:** `applications/dashboard/services.py:5`
- **URLs:** `applications/dashboard/urls.py`
- **Route:** `config/urls.py:84`
