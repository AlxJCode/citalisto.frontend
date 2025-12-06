# Backend Context for Frontend - SaaS de Reservas

Este documento proporciona toda la información necesaria para que el equipo de frontend pueda integrarse correctamente con el backend del sistema de reservas.

---

## ⚡ Quick Start - Lo Más Importante

# Dominio: 
https://www.citalistoapi.iveltech.com/

### 1. Patrón de Serialización `_model` ⚠️

**CRÍTICO**: El backend usa dos tipos de serializers según el contexto:

- **`DetailSerializer`** (listados paginados): Incluye campos `_model` con objetos completos anidados
- **`Serializer`** (operaciones individuales): Solo incluye IDs de las relaciones FK

#### ¿Cuándo se usa cada uno?

| Contexto | Serializer Usado | Campos `_model` |
|----------|------------------|-----------------|
| GET /api/v1/bookings/ (con paginación) | `BookingDetailSerializer` | ✅ Sí |
| GET /api/v1/bookings/123/ | `BookingSerializer` | ❌ No |
| POST /api/v1/bookings/ | `BookingSerializer` | ❌ No |
| PUT/PATCH /api/v1/bookings/123/ | `BookingSerializer` | ❌ No |

#### Ejemplo Concreto

```json
// GET /api/v1/bookings/?page=1 (BookingDetailSerializer)
{
  "data": [{
    "id": 1,
    "professional": 5,                    // ID del profesional
    "professional_model": {               // Objeto completo anidado
      "id": 5,
      "name": "Carlos",
      "last_name": "Ramírez"
    },
    "service": 2,                         // ID del servicio
    "service_model": {                    // Objeto completo anidado
      "id": 2,
      "name": "Corte de cabello",
      "price": "25000.00"
    }
  }]
}

// GET /api/v1/bookings/1/ (BookingSerializer)
{
  "data": {
    "id": 1,
    "professional": 5,   // Solo ID
    "service": 2         // Solo ID
    // NO hay professional_model ni service_model
  }
}
```

### 2. Nombres de Campos FK

**Todos los campos FK usan el nombre del modelo en minúsculas (SIN `_id`):**

```json
{
  "business": 5,        // ✅ Correcto
  "professional": 10,   // ✅ Correcto
  "service": 2,         // ✅ Correcto
  "business_id": 5      // ❌ Incorrecto
}
```

### 3. Estructura ApiResponse Estándar

```json
{
  "success": true,
  "data": { /* objeto o array */ },
  "message": "Mensaje descriptivo",
  "pagination": { /* solo si hay paginación */ }
}
```

### 4. Autenticación JWT

```http
Authorization: Bearer {access_token}
```

---

## 📋 Tabla de Contenidos

1. [Arquitectura General](#1-arquitectura-general-del-backend)
2. [Autenticación y Autorización](#2-autenticación-y-autorización)
3. [Estructura ApiResponse](#3-estructura-de-respuestas-api-apiresponse)
4. [Endpoints Principales](#4-endpoints-principales)
5. [Lógica de Disponibilidad](#5-lógica-de-disponibilidad-prioridad)
6. [Validaciones del Backend](#6-validaciones-del-backend)
7. [Paginación](#7-paginación)
8. [Filtros y Query Parameters](#8-filtros-y-query-parameters)
9. [Estados de Reserva](#9-estados-de-reserva-booking-status)
10. [Multi-Tenant](#10-multi-tenant-importante)
11. [Manejo de Errores HTTP](#11-manejo-de-errores-http)
12. [Timezone Handling](#12-timezone-handling)
13. [CORS y Headers](#13-cors-y-headers)
14. [Versionado de API](#14-versionado-de-api)
15. [Recursos Adicionales](#15-recursos-adicionales)
16. [Ejemplo de Flujo Completo](#16-ejemplo-de-flujo-completo)
17. [Consideraciones de Performance](#17-consideraciones-de-performance)
18. [Notas Finales](#18-notas-finales)
19. [Resumen Patrón `_model`](#19-resumen-del-patrón-de-serialización-_model)

---

## 1. Arquitectura General del Backend

### Stack Tecnológico
- **Framework**: Django + Django REST Framework (DRF)
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Arquitectura**: Multi-tenant (cada negocio es un tenant independiente)

### Principios Arquitectónicos
- **Separation of Concerns**: Modelos → Serializers → Services → Views
- **Fat Services, Thin Views**: La lógica de negocio está en services, las views solo coordinan
- **Multi-tenant**: Todos los datos se filtran automáticamente por Business (tenant)

---

## 2. Autenticación y Autorización

### 2.1 Sistema de Autenticación JWT

El backend utiliza autenticación basada en **JSON Web Tokens (JWT)**.

#### Endpoints de Autenticación

```
POST /api/v1/auth/login/
POST /api/v1/auth/register/
POST /api/v1/auth/refresh/
POST /api/v1/auth/logout/
GET  /api/v1/auth/me/
```

#### Login Request
```json
POST /api/v1/auth/login/
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

#### Login Response
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "full_name": "Juan Pérez",
      "role": "owner",
      "business_id": 5
    }
  },
  "message": "Login exitoso"
}
```

#### Refresh Token Request
```json
POST /api/v1/auth/refresh/
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Refresh Token Response
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

### 2.2 Uso de Tokens en Requests

Todos los endpoints protegidos requieren el token de acceso en el header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Roles de Usuario

- **owner**: Propietario del negocio (acceso total)
- **staff**: Empleado con permisos limitados
- **customer**: Cliente final (solo lectura de sus propias reservas)

---

## 3. Estructura de Respuestas API (ApiResponse)

**TODAS** las respuestas del backend siguen el formato `ApiResponse`.

### 3.1 Respuesta Exitosa (Sin Paginación)

Cuando se obtiene un recurso individual o se crea/actualiza, se usa el **serializer básico**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Corte de cabello",
    "business": 5,
    "price": "25000.00",
    "duration_minutes": 30
  },
  "message": "Operación exitosa"
}
```

### 3.2 Respuesta Exitosa (Con Paginación)

**IMPORTANTE**: Cuando hay paginación, se usa el **DetailSerializer** que incluye campos `_model`:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Corte de cabello",
      "business": 5,
      "business_model": {
        "id": 5,
        "name": "Barbería El Corte",
        "category": 2,
        "category_model": {
          "id": 2,
          "name": "Barbería"
        }
      },
      "price": "25000.00",
      "duration_minutes": 30
    }
  ],
  "pagination": {
    "count": 100,
    "next": "http://api.example.com/api/v1/services/?page=2",
    "previous": null,
    "page_size": 20,
    "current_page": 1,
    "total_pages": 5
  },
  "message": "Listado exitoso"
}
```

**Patrón de serialización:**
- **Campo FK directo**: Siempre contiene el ID (ej: `"business": 5`)
- **Campo FK con `_model`**: Contiene el objeto completo serializado (ej: `"business_model": {...}`)
- Los campos `_model` **SOLO aparecen en listados paginados**
- En operaciones individuales (GET detail, POST, PUT, PATCH), solo se devuelven los IDs

### 3.3 Respuesta de Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos",
    "details": {
      "email": ["Este campo es requerido"],
      "phone": ["Formato de teléfono inválido"]
    }
  },
  "message": "Error en la validación"
}
```

### 3.4 Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| `VALIDATION_ERROR` | Error en validación de datos |
| `NOT_FOUND` | Recurso no encontrado |
| `PERMISSION_DENIED` | Sin permisos para realizar la acción |
| `AUTHENTICATION_FAILED` | Token inválido o expirado |
| `BUSINESS_NOT_FOUND` | Negocio no encontrado |
| `CONFLICT` | Conflicto (ej: horario ocupado) |
| `INTERNAL_ERROR` | Error interno del servidor |

---

## 4. Endpoints Principales

### 4.1 Business (Negocios)

```
GET    /api/v1/business/
POST   /api/v1/business/
GET    /api/v1/business/{id}/
PUT    /api/v1/business/{id}/
PATCH  /api/v1/business/{id}/
DELETE /api/v1/business/{id}/
```

#### GET /api/v1/business/?page=1 - Listar Negocios (Paginado)

**Usa `BusinessDetailSerializer`** → incluye campos `_model`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Barbería El Corte",
      "category": 2,
      "category_model": {
        "id": 2,
        "name": "Barbería",
        "description": "Servicios de barbería"
      },
      "logo": "https://...",
      "phone": "+573001234567",
      "timezone": "America/Bogota",
      "owner": 5,
      "owner_model": {
        "id": 5,
        "email": "owner@example.com",
        "full_name": "Juan Pérez"
      }
    }
  ],
  "pagination": {
    "count": 10,
    "next": null,
    "previous": null,
    "page_size": 20,
    "current_page": 1,
    "total_pages": 1
  }
}
```

#### GET /api/v1/business/1/ - Obtener Negocio Individual

**Usa `BusinessSerializer`** → NO incluye campos `_model`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Barbería El Corte",
    "category": 2,
    "logo": "https://...",
    "phone": "+573001234567",
    "timezone": "America/Bogota",
    "owner": 5
  }
}
```

#### POST /api/v1/business/ - Crear Negocio

**Usa `BusinessSerializer`** → NO incluye campos `_model` en la respuesta

```json
Request:
{
  "name": "Mi Salón",
  "category": 1,
  "phone": "+573001234567",
  "timezone": "America/Bogota"
}

Response:
{
  "success": true,
  "data": {
    "id": 10,
    "name": "Mi Salón",
    "category": 1,
    "phone": "+573001234567",
    "timezone": "America/Bogota",
    "owner": 5,
    "created_at": "2025-11-29T10:30:00Z"
  },
  "message": "Business creado correctamente"
}
```

---

### 4.2 Branches (Sedes)

```
GET    /api/v1/branches/
POST   /api/v1/branches/
GET    /api/v1/branches/{id}/
PUT    /api/v1/branches/{id}/
DELETE /api/v1/branches/{id}/
```

#### GET /api/v1/branches/?page=1 - Listar Sedes (Paginado)

**Usa `BranchDetailSerializer`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "business": 5,
      "business_model": {
        "id": 5,
        "name": "Barbería El Corte"
      },
      "name": "Sede Norte",
      "address": "Calle 100 #15-20, Bogotá",
      "phone": "+573001234567"
    }
  ],
  "pagination": { /* ... */ }
}
```

#### GET /api/v1/branches/1/ - Obtener Sede Individual

**Usa `BranchSerializer`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "business": 5,
    "name": "Sede Norte",
    "address": "Calle 100 #15-20, Bogotá",
    "phone": "+573001234567"
  }
}
```

---

### 4.3 Services (Servicios)

```
GET    /api/v1/services/
POST   /api/v1/services/
GET    /api/v1/services/{id}/
PUT    /api/v1/services/{id}/
DELETE /api/v1/services/{id}/
```

#### GET /api/v1/services/?page=1 - Listar Servicios (Paginado)

**Usa `ServiceDetailSerializer`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "business": 5,
      "business_model": {
        "id": 5,
        "name": "Barbería El Corte"
      },
      "name": "Corte de cabello",
      "description": "Corte moderno con máquina y tijera",
      "price": "25000.00",
      "duration_minutes": 30
    }
  ],
  "pagination": { /* ... */ }
}
```

#### GET /api/v1/services/1/ - Obtener Servicio Individual

**Usa `ServiceSerializer`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "business": 5,
    "name": "Corte de cabello",
    "description": "Corte moderno con máquina y tijera",
    "price": "25000.00",
    "duration_minutes": 30
  }
}
```

---

### 4.4 Professionals (Profesionales)

```
GET    /api/v1/professionals/
POST   /api/v1/professionals/
GET    /api/v1/professionals/{id}/
PUT    /api/v1/professionals/{id}/
DELETE /api/v1/professionals/{id}/
POST   /api/v1/professionals/{id}/assign-services/
```

#### GET /api/v1/professionals/?page=1 - Listar Profesionales (Paginado)

**Usa `ProfessionalDetailSerializer`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "branch": 2,
      "branch_model": {
        "id": 2,
        "name": "Sede Norte",
        "business": 5
      },
      "name": "María",
      "last_name": "González",
      "email": "maria@example.com",
      "description": "10 años de experiencia",
      "profile_photo": "https://...",
      "services": [1, 2, 5],
      "services_model": [
        {
          "id": 1,
          "name": "Corte de cabello",
          "price": "25000.00",
          "duration_minutes": 30
        },
        {
          "id": 2,
          "name": "Barba",
          "price": "15000.00",
          "duration_minutes": 20
        }
      ]
    }
  ],
  "pagination": { /* ... */ }
}
```

**Nota**:
- `services`: Array de IDs de servicios
- `services_model`: Array de objetos completos (solo en listados paginados)

#### GET /api/v1/professionals/1/ - Obtener Profesional Individual

**Usa `ProfessionalSerializer`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "branch": 2,
    "name": "María",
    "last_name": "González",
    "email": "maria@example.com",
    "description": "10 años de experiencia",
    "profile_photo": "https://...",
    "services": [1, 2, 5]
  }
}
```

#### POST /api/v1/professionals/{id}/assign-services/ - Asignar Servicios
```json
Request:
{
  "service_ids": [1, 2, 5]
}

Response:
{
  "success": true,
  "message": "Servicios asignados correctamente"
}
```

---

### 4.5 Customers (Clientes)

```
GET    /api/v1/customers/
POST   /api/v1/customers/
GET    /api/v1/customers/{id}/
PUT    /api/v1/customers/{id}/
DELETE /api/v1/customers/{id}/
```

#### GET /api/v1/customers/?page=1 - Listar Clientes (Paginado)

**Usa `CustomerDetailSerializer`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "business": 5,
      "business_model": {
        "id": 5,
        "name": "Barbería El Corte"
      },
      "full_name": "Pedro Martínez",
      "phone": "+573001234567",
      "email": "pedro@example.com"
    }
  ],
  "pagination": { /* ... */ }
}
```

#### GET /api/v1/customers/1/ - Obtener Cliente Individual

**Usa `CustomerSerializer`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "business": 5,
    "full_name": "Pedro Martínez",
    "phone": "+573001234567",
    "email": "pedro@example.com"
  }
}
```

---

### 4.6 Bookings (Reservas)

```
GET    /api/v1/bookings/
POST   /api/v1/bookings/
GET    /api/v1/bookings/{id}/
PUT    /api/v1/bookings/{id}/
PATCH  /api/v1/bookings/{id}/status/
DELETE /api/v1/bookings/{id}/
GET    /api/v1/bookings/by-date/?date=2025-12-01
GET    /api/v1/bookings/available-slots/
```

#### GET /api/v1/bookings/?page=1 - Listar Reservas (Paginado)

**Usa `BookingDetailSerializer`**

```json
{
  "success": true,
  "data": [
    {
      "id": 100,
      "business": 5,
      "business_model": {
        "id": 5,
        "name": "Barbería El Corte"
      },
      "branch": 1,
      "branch_model": {
        "id": 1,
        "name": "Sede Norte"
      },
      "professional": 5,
      "professional_model": {
        "id": 5,
        "name": "Carlos",
        "last_name": "Ramírez"
      },
      "service": 2,
      "service_model": {
        "id": 2,
        "name": "Corte de cabello",
        "price": "25000.00",
        "duration_minutes": 30
      },
      "customer": 10,
      "customer_model": {
        "id": 10,
        "full_name": "Pedro Martínez",
        "phone": "+573001234567"
      },
      "date": "2025-12-05",
      "start_time": "14:00:00",
      "end_time": "14:30:00",
      "status": "pending",
      "notes": "Primera visita"
    }
  ],
  "pagination": { /* ... */ }
}
```

#### GET /api/v1/bookings/1/ - Obtener Reserva Individual

**Usa `BookingSerializer`**

```json
{
  "success": true,
  "data": {
    "id": 100,
    "business": 5,
    "branch": 1,
    "professional": 5,
    "service": 2,
    "customer": 10,
    "date": "2025-12-05",
    "start_time": "14:00:00",
    "end_time": "14:30:00",
    "status": "pending",
    "notes": "Primera visita"
  }
}
```

#### POST /api/v1/bookings/ - Crear Reserva

**Usa `BookingSerializer`**

```json
Request:
{
  "branch": 1,
  "professional": 5,
  "service": 2,
  "customer": 10,
  "date": "2025-12-05",
  "start_time": "14:00:00",
  "notes": "Primera visita"
}

Response:
{
  "success": true,
  "data": {
    "id": 100,
    "business": 5,
    "branch": 1,
    "professional": 5,
    "service": 2,
    "customer": 10,
    "date": "2025-12-05",
    "start_time": "14:00:00",
    "end_time": "14:30:00",
    "status": "pending",
    "notes": "Primera visita",
    "created_at": "2025-11-29T10:45:00Z"
  },
  "message": "Booking creado correctamente"
}
```

**Nota**: En POST solo se devuelven los IDs, NO los objetos `_model`.

#### PATCH /api/v1/bookings/{id}/status/ - Actualizar Estado
```json
Request:
{
  "status": "confirmed"  // pending | confirmed | cancelled | completed
}

Response:
{
  "success": true,
  "data": {
    "id": 100,
    "status": "confirmed",
    "updated_at": "2025-11-29T11:00:00Z"
  },
  "message": "Estado actualizado"
}
```

#### GET /api/v1/bookings/available-slots/ - Horarios Disponibles
```json
Request Query Params:
?professional=5&service=2&date=2025-12-05

Response:
{
  "success": true,
  "data": {
    "date": "2025-12-05",
    "professional": 5,
    "service": 2,
    "available_slots": [
      {
        "start_time": "09:00:00",
        "end_time": "09:30:00"
      },
      {
        "start_time": "09:30:00",
        "end_time": "10:00:00"
      },
      {
        "start_time": "14:00:00",
        "end_time": "14:30:00"
      }
    ]
  }
}
```

---

### 4.7 Availability (Disponibilidad)

```
GET    /api/v1/availability/weekly/
POST   /api/v1/availability/weekly/
PUT    /api/v1/availability/weekly/{id}/
DELETE /api/v1/availability/weekly/{id}/

GET    /api/v1/availability/exceptions/
POST   /api/v1/availability/exceptions/
PUT    /api/v1/availability/exceptions/{id}/
DELETE /api/v1/availability/exceptions/{id}/

GET    /api/v1/availability/calendar/?professional=5&start_date=2025-12-01&end_date=2025-12-07
```

#### POST /api/v1/availability/weekly/ - Crear Disponibilidad Semanal
```json
Request:
{
  "professional": 5,
  "day_of_week": 1,  // 0=Domingo, 1=Lunes, ..., 6=Sábado
  "start_time": "09:00:00",
  "end_time": "18:00:00",
  "break_start_time": "12:00:00",
  "break_end_time": "13:00:00"
}

Response:
{
  "success": true,
  "data": {
    "id": 50,
    "professional": 5,
    "day_of_week": 1,
    "start_time": "09:00:00",
    "end_time": "18:00:00",
    "break_start_time": "12:00:00",
    "break_end_time": "13:00:00"
  },
  "message": "ProfessionalWeeklyAvailability creado correctamente"
}
```

#### POST /api/v1/availability/exceptions/ - Crear Excepción (Override)
```json
Request:
{
  "professional": 5,
  "date": "2025-12-25",
  "status": "unavailable",  // available | unavailable
  "notes": "Vacaciones de Navidad"
}

Response:
{
  "success": true,
  "data": {
    "id": 20,
    "professional": 5,
    "date": "2025-12-25",
    "status": "unavailable",
    "start_time": null,
    "end_time": null,
    "notes": "Vacaciones de Navidad"
  },
  "message": "ProfessionalAvailabilityException creado correctamente"
}
```

#### GET /api/v1/availability/calendar/ - Calendario de Disponibilidad
```json
Request Query Params:
?professional=5&start_date=2025-12-01&end_date=2025-12-07

Response:
{
  "success": true,
  "data": {
    "professional": 5,
    "start_date": "2025-12-01",
    "end_date": "2025-12-07",
    "calendar": [
      {
        "date": "2025-12-01",
        "day_of_week": 1,
        "is_available": true,
        "start_time": "09:00:00",
        "end_time": "18:00:00",
        "break_start_time": "12:00:00",
        "break_end_time": "13:00:00",
        "source": "weekly"  // weekly | exception | range
      },
      {
        "date": "2025-12-02",
        "day_of_week": 2,
        "is_available": true,
        "start_time": "14:00:00",
        "end_time": "20:00:00",
        "break_start_time": null,
        "break_end_time": null,
        "source": "exception"
      }
    ]
  }
}
```

---

## 5. Lógica de Disponibilidad (Prioridad)

El backend calcula la disponibilidad de un profesional en una fecha siguiendo esta **prioridad**:

1. **Si existe ProfessionalAvailabilityException** → usar esa información
2. **Si existe ProfessionalAvailabilityRange** (futuro) → usar rango
3. **Si existe ProfessionalWeeklyAvailability** → usar plantilla semanal
4. **Si nada aplica** → profesional NO disponible

### Ejemplo Práctico

- **Lunes (plantilla semanal)**: 09:00–18:00
- **25 de diciembre (excepción)**: unavailable (vacaciones)
- **2 de enero (excepción)**: 14:00–20:00 (horario especial)

Frontend puede obtener esta información usando el endpoint `/api/v1/availability/calendar/`.

---

## 6. Validaciones del Backend

### 6.1 Validaciones en Reservas (Bookings)

El backend valida automáticamente:

- ✅ El servicio existe y pertenece al negocio
- ✅ El profesional está asignado a ese servicio
- ✅ El profesional está disponible en la fecha/hora solicitada
- ✅ No hay otra reserva en conflicto
- ✅ El cliente existe
- ✅ El horario de inicio + duración del servicio = horario de fin

Si alguna validación falla, el backend devuelve:

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "El profesional no está disponible en este horario",
    "details": {
      "professional": 5,
      "date": "2025-12-05",
      "start_time": "14:00:00"
    }
  }
}
```

---

## 7. Paginación

Todos los endpoints de listado están paginados automáticamente cuando se incluye `?page=` o `?per_page=`.

### Request
```
GET /api/v1/bookings/?page=2&per_page=20
```

### Response
```json
{
  "success": true,
  "data": [ /* array de resultados con campos _model */ ],
  "pagination": {
    "count": 150,
    "next": "http://api.example.com/api/v1/bookings/?page=3",
    "previous": "http://api.example.com/api/v1/bookings/?page=1",
    "page_size": 20,
    "current_page": 2,
    "total_pages": 8
  }
}
```

**IMPORTANTE**: Cuando hay paginación, el backend usa el `DetailSerializer` que incluye los campos `_model`.

---

## 8. Filtros y Query Parameters

### 8.1 Bookings
```
GET /api/v1/bookings/?status=confirmed
GET /api/v1/bookings/?date=2025-12-05
GET /api/v1/bookings/?professional=5
GET /api/v1/bookings/?customer=10
GET /api/v1/bookings/?branch=1
GET /api/v1/bookings/?service=2
GET /api/v1/bookings/?start_date=2025-12-01&end_date=2025-12-31
```

### 8.2 Professionals
```
GET /api/v1/professionals/?branch=2
GET /api/v1/professionals/?service=5
```

### 8.3 Services
```
GET /api/v1/services/?professional=10
```

---

## 9. Estados de Reserva (Booking Status)

| Estado | Descripción |
|--------|-------------|
| `pending` | Reserva creada, pendiente de confirmación |
| `confirmed` | Reserva confirmada |
| `cancelled` | Reserva cancelada |
| `completed` | Reserva completada (servicio prestado) |

---

## 10. Multi-Tenant (Importante)

### ¿Qué significa?

Cada negocio (Business) es un **tenant independiente**.

- Un usuario solo ve datos de **SU negocio**
- No puede acceder a datos de otros negocios
- El backend filtra automáticamente por `business_id`

### Implicaciones para Frontend

- El `business_id` se obtiene del token JWT al hacer login
- No es necesario enviarlo en cada request, el backend lo maneja automáticamente
- Si intentas acceder a un recurso de otro negocio → `403 Forbidden`

---

## 11. Manejo de Errores HTTP

| Código HTTP | Significado |
|-------------|-------------|
| `200 OK` | Operación exitosa |
| `201 Created` | Recurso creado exitosamente |
| `400 Bad Request` | Error en los datos enviados |
| `401 Unauthorized` | Token inválido o expirado |
| `403 Forbidden` | Sin permisos para esta acción |
| `404 Not Found` | Recurso no encontrado |
| `409 Conflict` | Conflicto (ej: horario ocupado) |
| `500 Internal Server Error` | Error del servidor |

---

## 12. Timezone Handling

### El backend maneja zonas horarias

- Cada negocio tiene un campo `timezone` (ej: `America/Bogota`)
- Todas las fechas/horas se devuelven en UTC (ISO 8601)
- Frontend debe convertir a la zona horaria local del usuario

### Ejemplo

```json
{
  "created_at": "2025-11-29T15:30:00Z",  // UTC
  "business": {
    "timezone": "America/Bogota"  // UTC-5
  }
}
```

Frontend debe mostrar: `10:30 AM` (15:30 - 5 horas)

---

## 13. CORS y Headers

### Headers requeridos en requests

```http
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
```

### CORS está habilitado

El backend permite requests desde:
- `http://localhost:3000` (desarrollo)
- `https://app.tusitio.com` (producción)

---

## 14. Versionado de API

Todas las rutas usan versionado:

```
/api/v1/...
```

Si en el futuro hay cambios incompatibles, se creará `/api/v2/`.

---

## 15. Recursos Adicionales

### Base URL

- **Desarrollo**: `http://localhost:8000`
- **Staging**: `https://api-staging.tusitio.com`
- **Producción**: `https://api.tusitio.com`

### Documentación Interactiva

- **Swagger UI**: `/api/docs/swagger/`
- **ReDoc**: `/api/docs/redoc/`

---

## 16. Ejemplo de Flujo Completo

### Flujo: Crear una Reserva

1. **Login**
   ```
   POST /api/v1/auth/login/
   → Obtener access_token
   ```

2. **Obtener servicios disponibles**
   ```
   GET /api/v1/services/
   ```

3. **Seleccionar profesional para el servicio**
   ```
   GET /api/v1/professionals/?service=2
   ```

4. **Consultar horarios disponibles**
   ```
   GET /api/v1/bookings/available-slots/?professional=5&service=2&date=2025-12-05
   ```

5. **Crear/buscar cliente**
   ```
   POST /api/v1/customers/
   o
   GET /api/v1/customers/?phone=+573001234567
   ```

6. **Crear reserva**
   ```
   POST /api/v1/bookings/
   {
     "professional": 5,
     "service": 2,
     "customer": 10,
     "branch": 1,
     "date": "2025-12-05",
     "start_time": "14:00:00"
   }
   ```

7. **Confirmar reserva**
   ```
   PATCH /api/v1/bookings/100/status/
   {
     "status": "confirmed"
   }
   ```

---

## 17. Consideraciones de Performance

- Todos los endpoints de listado usan paginación cuando se solicita
- Usa filtros para reducir la cantidad de datos
- El backend cachea ciertos queries (categorías, configuraciones)
- Las consultas de disponibilidad pueden ser costosas → evita llamadas innecesarias
- Los listados paginados incluyen más información (campos `_model`) pero están optimizados con `select_related` y `prefetch_related`

---

## 18. Notas Finales

- **Profesionales NO son usuarios**: No tienen login, solo se registran sus datos
- **Clientes NO son usuarios**: Solo se guardan datos básicos (nombre, teléfono, email)
- **Todo pasa por JWT**: Sin token válido, no hay acceso
- **Siempre usar `ApiResponse`**: Todas las respuestas siguen este formato
- **Multi-tenant automático**: No te preocupes por filtrar por `business_id`, el backend lo hace

---

## 19. Resumen del Patrón de Serialización `_model`

Este es el patrón más importante para frontend:

### Regla General

El backend usa **dos tipos de serializers**:

| Serializer | Cuándo se usa | Campos `_model` |
|------------|---------------|-----------------|
| **`Serializer`** (básico) | GET individual, POST, PUT, PATCH | ❌ NO |
| **`DetailSerializer`** | GET con paginación | ✅ SÍ |

### Tabla Comparativa

| Contexto | Serializer | Campos `_model` | Ejemplo |
|----------|-----------|-----------------|---------|
| **GET /api/v1/bookings/?page=1** | `BookingDetailSerializer` | ✅ Sí | `professional_model`, `service_model` |
| **GET /api/v1/bookings/123/** | `BookingSerializer` | ❌ No | Solo IDs |
| **POST /api/v1/bookings/** | `BookingSerializer` | ❌ No | Solo IDs |
| **PUT /api/v1/bookings/123/** | `BookingSerializer` | ❌ No | Solo IDs |

### Ejemplos Concretos

#### Listado Paginado de Bookings (GET /api/v1/bookings/?page=1)
```json
{
  "data": [{
    "id": 1,
    "business": 5,                    // ID
    "business_model": { /* ... */ },  // Objeto completo
    "professional": 10,               // ID
    "professional_model": { /* ... */ },  // Objeto completo
    "service": 2,                     // ID
    "service_model": { /* ... */ }    // Objeto completo
  }]
}
```

#### Detalle Individual de Booking (GET /api/v1/bookings/1/)
```json
{
  "data": {
    "id": 1,
    "business": 5,        // Solo ID
    "professional": 10,   // Solo ID
    "service": 2          // Solo ID
    // NO hay campos _model
  }
}
```

#### Crear Booking (POST /api/v1/bookings/)
```json
// Request
{
  "business": 5,
  "professional": 10,
  "service": 2
}

// Response
{
  "data": {
    "id": 100,
    "business": 5,        // Solo ID
    "professional": 10,   // Solo ID
    "service": 2          // Solo ID
    // NO hay campos _model
  }
}
```

### Cómo Manejar en Frontend

```typescript
// Type para listado paginado (DetailSerializer)
interface BookingListItem {
  id: number;
  business: number;
  business_model: Business;
  professional: number;
  professional_model: Professional;
  service: number;
  service_model: Service;
  customer: number;
  customer_model: Customer;
}

// Type para detalle/create/update (Serializer básico)
interface Booking {
  id: number;
  business: number;
  professional: number;
  service: number;
  customer: number;
}
```

### Por Qué Este Patrón

- **Optimización**: Los listados necesitan información completa para mostrar (nombre del profesional, nombre del servicio, etc.)
- **Performance**: En operaciones individuales (GET detail, POST, PUT), no se serializa información extra innecesaria
- **Consistencia**: El campo FK siempre existe con el ID, los `_model` son información adicional opcional solo para listados

### Identificar Cuándo Aparecen Campos `_model`

✅ **Aparecen cuando:**
- La URL incluye `?page=` o `?per_page=`
- Se usa paginación explícita
- El backend devuelve un objeto `pagination` en la respuesta

❌ **NO aparecen cuando:**
- Es un endpoint individual (`/api/v1/bookings/123/`)
- Es una operación POST, PUT, PATCH
- No hay paginación en la respuesta

---

**Última actualización**: 2025-11-29
**Versión de API**: v1
**Contacto**: [Tu correo o Slack]
