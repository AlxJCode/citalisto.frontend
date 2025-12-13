# API Pública - Gestión de Citas

Endpoints públicos para consultar y cancelar citas sin autenticación usando `public_token`.

## Endpoints

### 1. Consultar Datos de la Cita

**GET** `/api/v1/public/bookings/{public_token}/`

Obtiene información pública de una cita para mostrar al usuario antes de cancelar.

#### Parámetros de URL
- `public_token` (UUID) - Token público único de la cita

#### Rate Limit
- 20 req/min por IP

#### Response Exitoso (200 OK)
```json
{
  "success": true,
  "message": "Datos de la cita obtenidos exitosamente",
  "data": {
    "date": "2025-12-20",
    "start_time": "10:00:00",
    "end_time": "11:00:00",
    "status": "confirmed",
    "business_name": "Clínica Dental Sonrisas",
    "professional_name": "Dr. Juan Pérez",
    "service_name": "Limpieza Dental",
    "branch_name": "Sucursal Centro",
    "branch_address": "Av. Principal 123",
    "cancelled_at": null,
    "cancellation_reason": null
  }
}
```

#### Casos de Error
- **404 Not Found**: Token inválido o cita no existe

---

### 2. Cancelar Cita

**PATCH** `/api/v1/public/bookings/{public_token}/cancel/`

Cancela una cita usando el token público. Solo permite cancelar citas en estado `pending` o `confirmed`.

#### Parámetros de URL
- `public_token` (UUID) - Token público único de la cita

#### Rate Limit
- 5 req/min por IP

#### Body (opcional)
```json
{
  "cancellation_reason": "Tengo un imprevisto y no podré asistir"
}
```

#### Response Exitoso (200 OK)
```json
{
  "success": true,
  "message": "Cita cancelada exitosamente",
  "data": {
    "id": "01HKXXX...",
    "status": "cancelled",
    "cancelled_at": "2025-12-13T15:30:00Z",
    "message": "Tu cita ha sido cancelada exitosamente"
  }
}
```

#### Casos de Error

**400 Bad Request** - Estado no cancelable
```json
{
  "success": false,
  "message": "Error al cancelar la cita",
  "errors": {
    "non_field_errors": [
      "Solo se pueden cancelar citas en estado 'Pendiente' o 'Confirmada'. Esta cita está en estado 'Completada'"
    ]
  }
}
```

**404 Not Found** - Token inválido
```json
{
  "success": false,
  "message": "Not found"
}
```

---

## Flujo de Usuario

1. Usuario recibe link de cancelación: `https://app.com/cancel/{public_token}`
2. Frontend consulta: `GET /api/v1/public/bookings/{public_token}/`
3. Muestra datos de la cita y botón "Cancelar"
4. Usuario confirma cancelación: `PATCH /api/v1/public/bookings/{public_token}/cancel/`
5. Cita queda cancelada con timestamp y motivo opcional

---

## Validaciones

### Consulta
- ✅ Token debe existir
- ✅ Sin restricciones de estado (puede consultar cualquier cita)

### Cancelación
- ✅ Token debe existir
- ✅ Solo estados `pending` o `confirmed`
- ✅ `cancellation_reason` opcional (máx 500 caracteres)
- ✅ Actualiza: `status`, `cancelled_at`, `cancellation_reason`

---

## Seguridad

- **Sin autenticación**: El UUID actúa como credencial (imposible de adivinar)
- **Rate limiting**: Protección contra abuso
- **Solo lectura limitada**: No expone datos sensibles del negocio
- **Idempotente**: Cancelar una cita ya cancelada retorna error 400

---

## Ejemplo de Uso

### Consultar cita
```bash
curl -X GET https://api.example.com/api/v1/public/bookings/550e8400-e29b-41d4-a716-446655440000/
```

### Cancelar sin motivo
```bash
curl -X PATCH https://api.example.com/api/v1/public/bookings/550e8400-e29b-41d4-a716-446655440000/cancel/
```

### Cancelar con motivo
```bash
curl -X PATCH https://api.example.com/api/v1/public/bookings/550e8400-e29b-41d4-a716-446655440000/cancel/ \
  -H "Content-Type: application/json" \
  -d '{"cancellation_reason": "Emergencia familiar"}'
```
