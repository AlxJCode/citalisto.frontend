# 📘 APIs Públicas - Documentación

APIs sin autenticación para widget de reservas públicas.

**Base URL:** `/api/v1/appointments/public/business/{slug}/`

**Rate Limits:**
- Listados: 20 req/min por IP
- Disponibilidad: 30 req/min por IP
- Bookings: 5 req/min + 10 req/hour por IP

---

## 1. 👨‍⚕️ Listar Profesionales

**Endpoint:** `GET /professionals/?branch_id={id}`

**Descripción:** Lista profesionales de una sucursal con sus servicios.

### Request
```
GET /api/v1/appointments/public/business/consultorio-dental-rojas/professionals/?branch_id=01KBE5K7DKYZGC58KEZ43KCNRZ
```

**Query Params:**
- `branch_id` *(required)*: ULID de la sucursal

### Response 200
```json
{
  "results": [
    {
      "id": "01KBGT2BSDV13M5TKG25X679AB",
      "name": "Juan",
      "last_name": "Pérez",
      "profile_photo": "https://...",
      "description": "Especialista en...",
      "services": [
        {
          "id": "01KBC8G6DNXX2TP6CGPB8H4N9Q",
          "name": "Limpieza dental",
          "price": "50.00",
          "duration_minutes": 30,
          "is_active": true
        }
      ]
    }
  ]
}
```

**Errores:**
- `400`: Falta `branch_id`
- `404`: Branch o business no encontrado
- `429`: Rate limit excedido

---

## 2. 📅 Consultar Disponibilidad

**Endpoint:** `GET /availability/?professional_id={id}&service_id={id}&date=YYYY-MM-DD`

**Descripción:** Retorna horarios disponibles para un profesional y servicio en una fecha.

### Request
```
GET /api/v1/appointments/public/business/consultorio-dental-rojas/availability/?professional_id=01KBGT2BSDV13M5TKG25X679AB&service_id=01KBC8G6DNXX2TP6CGPB8H4N9Q&date=2025-12-10
```

**Query Params:**
- `professional_id` *(required)*: ULID del profesional
- `service_id` *(required)*: ULID del servicio
- `date` *(required)*: Fecha en formato `YYYY-MM-DD`

**Validaciones:**
- Solo fechas actuales o futuras
- Buffer de 15 min para reservas del día actual
- Usa timezone del negocio

### Response 200
```json
{
  "date": "2025-12-10",
  "slots": [
    "09:00:00",
    "09:30:00",
    "10:00:00",
    "14:00:00",
    "14:30:00"
  ]
}
```

**Notas:**
- Los slots son horarios de inicio (`start_time`)
- `end_time` = `start_time` + `service.duration_minutes`
- Lista vacía si no hay slots disponibles

**Errores:**
- `400`: Parámetros faltantes o fecha inválida
- `404`: Professional o service no encontrado
- `429`: Rate limit excedido

---

## 3. ✅ Crear Reserva

**Endpoint:** `POST /bookings/`

**Descripción:** Crea una reserva pública. Resuelve o crea el customer automáticamente.

### Request
```
POST /api/v1/appointments/public/business/consultorio-dental-rojas/bookings/
Content-Type: application/json
```

**Body:**
```json
{
  "professional_id": "01KBGT2BSDV13M5TKG25X679AB",
  "service_id": "01KBC8G6DNXX2TP6CGPB8H4N9Q",
  "date": "2025-12-10",
  "start_time": "10:00",
  "full_name": "Juan Pérez García",
  "email": "juan@example.com",
  "phone": "+51999888777",
  "notes": "Primera vez"
}
```

**Campos:**
- `professional_id` *(required, ULID)*: Profesional
- `service_id` *(required, ULID)*: Servicio
- `date` *(required, YYYY-MM-DD)*: Fecha de la cita
- `start_time` *(required, HH:MM)*: Hora de inicio
- `full_name` *(required, string)*: Nombre completo (se separa automáticamente)
- `email` *(required, email)*: Email del cliente
- `phone` *(required, string)*: Teléfono
- `notes` *(optional, string)*: Notas adicionales

**Validaciones:**
- Solo fechas actuales o futuras
- Buffer de 15 min para el día actual
- Slot debe estar disponible
- Profesional debe atender el servicio
- Email único por business (reutiliza customer si existe)

### Response 201
```json
{
  "id": "01KBH8X9Y2Z3A4B5C6D7E8F9G0",
  "confirmation_code": "BK-01KBH8X9",
  "date": "2025-12-10",
  "start_time": "10:00:00",
  "end_time": "10:30:00",
  "professional_name": "Juan Pérez",
  "service_name": "Limpieza dental",
  "branch_name": "Sede Centro",
  "status": "pending"
}
```

**Errores:**
- `400`: Validación de datos, slot no disponible, profesional no atiende servicio
- `404`: Professional o service no encontrado
- `429`: Rate limit excedido (5/min o 10/hour)

---

## 🔒 Seguridad

**Rate Limiting por IP:**
```
/professionals/   → 20 req/min
/availability/    → 30 req/min
/bookings/        → 5 req/min + 10 req/hour
```

**Headers de Response:**
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 18
X-RateLimit-Reset: 1702145234
```

**Protecciones:**
- ✅ Sin autenticación requerida
- ✅ Rate limiting agresivo por IP
- ✅ Validación de business por slug
- ✅ Buffer de tiempo para reservas
- ✅ Validación de disponibilidad real
- ✅ Timezone correcto del negocio

---

## 🧪 Ejemplos de Uso

### Flujo Completo

```javascript
// 1. Listar profesionales de una sucursal
const professionals = await fetch(
  '/api/v1/appointments/public/business/mi-negocio/professionals/?branch_id=01XXX'
);

// 2. Consultar disponibilidad
const availability = await fetch(
  '/api/v1/appointments/public/business/mi-negocio/availability/?professional_id=01YYY&service_id=01ZZZ&date=2025-12-10'
);

// 3. Crear reserva
const booking = await fetch(
  '/api/v1/appointments/public/business/mi-negocio/bookings/',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      professional_id: '01YYY',
      service_id: '01ZZZ',
      date: '2025-12-10',
      start_time: '10:00',
      full_name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+51999888777'
    })
  }
);
```

---

## ⚠️ Consideraciones

- **IDs son ULID** (26 caracteres), no UUID
- **Timezone:** Se usa el timezone configurado en el negocio
- **Customer:** Se crea automáticamente si no existe (por email)
- **Full Name:** Se separa automáticamente en nombre/apellido
- **Buffer:** 15 minutos mínimo de anticipación para el día actual
- **Status:** Bookings públicos inician con `status: "pending"`
- **Source:** Se marca como `source: "widget"`

---

## 📞 Soporte

Para reportar problemas: https://github.com/tu-repo/issues
