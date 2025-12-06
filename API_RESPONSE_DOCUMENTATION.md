# Documentación ApiResponse - Sistema de Respuestas Estandarizado

Esta documentación describe el formato estandarizado de todas las respuestas de la API del Sistema de Reservas.

---

## 📋 Índice

1. [Estructura General](#estructura-general)
2. [Respuestas Exitosas](#respuestas-exitosas)
3. [Respuestas de Error](#respuestas-de-error)
4. [Respuestas Paginadas](#respuestas-paginadas)
5. [Códigos HTTP](#códigos-http)
6. [Tipos de Error](#tipos-de-error)
7. [Ejemplos TypeScript](#ejemplos-typescript)

---

## Estructura General

Todas las respuestas de la API siguen esta estructura base:

```typescript
interface ApiResponse<T = any> {
  success: boolean;           // true si la operación fue exitosa, false si hubo error
  status: "success" | "error"; // Estado legible de la respuesta
  message: string;             // Mensaje descriptivo de la operación
  data: T | null;              // Datos de respuesta (null en caso de error)
  meta: MetaInfo;              // Metadatos adicionales
  error?: ErrorMeta;           // Información del error (solo presente si success = false)
}
```

### MetaInfo

```typescript
interface MetaInfo {
  version: string;              // Versión de la API (ej: "v1.0.0")
  timestamp: string;            // ISO 8601 timestamp de la respuesta
  processing_time_ms: number;   // Tiempo de procesamiento en milisegundos
  pagination?: PaginationMeta;  // Metadatos de paginación (solo en listados)
  deprecated?: boolean;         // Si el endpoint está deprecado
  replacement?: string;         // URL del endpoint de reemplazo (si aplica)
}
```

---

## Respuestas Exitosas

### 1. Respuesta Exitosa Simple (200 OK)

**Backend:**
```python
return ApiResponse.success(
    data={"id": 1, "name": "Juan Pérez"},
    message="Usuario obtenido exitosamente"
)
```

**Frontend recibe:**
```json
{
  "success": true,
  "status": "success",
  "message": "Usuario obtenido exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez"
  },
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 45
  }
}
```

**Código HTTP:** `200 OK`

---

### 2. Recurso Creado (201 Created)

**Backend:**
```python
return ApiResponse.created(
    data={"id": 5, "name": "Nueva Sucursal"},
    message="Sucursal creada exitosamente"
)
```

**Frontend recibe:**
```json
{
  "success": true,
  "status": "success",
  "message": "Sucursal creada exitosamente",
  "data": {
    "id": 5,
    "name": "Nueva Sucursal"
  },
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 120
  }
}
```

**Código HTTP:** `201 Created`

---

### 3. Sin Contenido (204 No Content)

**Backend:**
```python
return ApiResponse.no_content(
    message="Recurso eliminado exitosamente"
)
```

**Frontend recibe:**
```json
{
  "success": true,
  "status": "success",
  "message": "Recurso eliminado exitosamente",
  "data": null,
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 35
  }
}
```

**Código HTTP:** `204 No Content`

---

## Respuestas de Error

### Estructura de ErrorMeta

```typescript
interface ErrorMeta {
  code: number;                 // Código HTTP del error
  type: ErrorType;              // Tipo de error estandarizado
  message: string;              // Mensaje de error
  details?: ErrorDetails;       // Detalles adicionales (opcional)
  timestamp: string;            // ISO 8601 timestamp del error
}

type ErrorDetails =
  | string                           // Mensaje simple
  | Record<string, string[]>         // Errores de validación por campo
  | string[]                         // Lista de errores
  | Record<string, any>;             // Detalles personalizados
```

---

### 1. Error de Validación (422 Unprocessable Entity)

**Backend:**
```python
return ApiResponse.validation_error(
    errors={
        "email": ["Este campo es requerido"],
        "phone": ["Formato inválido", "Debe tener 10 dígitos"]
    },
    message="Error de validación"
)
```

**Frontend recibe:**
```json
{
  "success": false,
  "status": "error",
  "message": "Error de validación",
  "data": null,
  "error": {
    "code": 422,
    "type": "validation_error",
    "message": "Error de validación",
    "details": {
      "email": ["Este campo es requerido"],
      "phone": ["Formato inválido", "Debe tener 10 dígitos"]
    },
    "timestamp": "2025-11-29T10:30:00.123456Z"
  },
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 15
  }
}
```

**Código HTTP:** `422 Unprocessable Entity`

---

### 2. Recurso No Encontrado (404 Not Found)

**Backend:**
```python
return ApiResponse.not_found(
    message="Cliente no encontrado",
    resource="Customer"
)
```

**Frontend recibe:**
```json
{
  "success": false,
  "status": "error",
  "message": "Cliente no encontrado",
  "data": null,
  "error": {
    "code": 404,
    "type": "not_found",
    "message": "Cliente no encontrado",
    "details": {
      "resource": "Customer"
    },
    "timestamp": "2025-11-29T10:30:00.123456Z"
  },
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 10
  }
}
```

**Código HTTP:** `404 Not Found`

---

### 3. No Autenticado (401 Unauthorized)

**Backend:**
```python
return ApiResponse.unauthorized(
    message="Token de autenticación inválido o expirado"
)
```

**Frontend recibe:**
```json
{
  "success": false,
  "status": "error",
  "message": "Token de autenticación inválido o expirado",
  "data": null,
  "error": {
    "code": 401,
    "type": "authentication_error",
    "message": "Token de autenticación inválido o expirado",
    "details": null,
    "timestamp": "2025-11-29T10:30:00.123456Z"
  },
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 5
  }
}
```

**Código HTTP:** `401 Unauthorized`

---

### 4. Sin Permisos (403 Forbidden)

**Backend:**
```python
return ApiResponse.forbidden(
    message="No tiene permisos para acceder a este negocio"
)
```

**Frontend recibe:**
```json
{
  "success": false,
  "status": "error",
  "message": "No tiene permisos para acceder a este negocio",
  "data": null,
  "error": {
    "code": 403,
    "type": "authorization_error",
    "message": "No tiene permisos para acceder a este negocio",
    "details": null,
    "timestamp": "2025-11-29T10:30:00.123456Z"
  },
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 8
  }
}
```

**Código HTTP:** `403 Forbidden`

---

### 5. Error de Lógica de Negocio (400 Bad Request)

**Backend:**
```python
return ApiResponse.error(
    message="No se puede reservar en horario ya ocupado",
    code=400,
    error_type=ErrorType.BUSINESS_LOGIC_ERROR,
    details="El profesional ya tiene una reserva a las 10:00"
)
```

**Frontend recibe:**
```json
{
  "success": false,
  "status": "error",
  "message": "No se puede reservar en horario ya ocupado",
  "data": null,
  "error": {
    "code": 400,
    "type": "business_logic_error",
    "message": "No se puede reservar en horario ya ocupado",
    "details": "El profesional ya tiene una reserva a las 10:00",
    "timestamp": "2025-11-29T10:30:00.123456Z"
  },
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 25
  }
}
```

**Código HTTP:** `400 Bad Request`

---

### 6. Error Interno del Servidor (500 Internal Server Error)

**Backend:**
```python
return ApiResponse.internal_error(
    message="Error al procesar la solicitud",
    details="Database connection timeout"
)
```

**Frontend recibe:**
```json
{
  "success": false,
  "status": "error",
  "message": "Error al procesar la solicitud",
  "data": null,
  "error": {
    "code": 500,
    "type": "internal_error",
    "message": "Error al procesar la solicitud",
    "details": "Database connection timeout",
    "timestamp": "2025-11-29T10:30:00.123456Z"
  },
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 3000
  }
}
```

**Código HTTP:** `500 Internal Server Error`

---

## Respuestas Paginadas

### Estructura de PaginationMeta

```typescript
interface PaginationMeta {
  page: number;           // Página actual (base 1)
  per_page: number;       // Elementos por página
  total: number;          // Total de elementos
  total_pages: number;    // Total de páginas
  next: string | null;    // URL de la siguiente página (null si es la última)
  previous: string | null; // URL de la página anterior (null si es la primera)
}
```

### Ejemplo de Respuesta Paginada

**Backend:**
```python
return ApiResponse.paginated(
    data=[
        {"id": 1, "name": "Cliente 1"},
        {"id": 2, "name": "Cliente 2"},
        {"id": 3, "name": "Cliente 3"}
    ],
    page=2,
    per_page=3,
    total=25,
    message="Clientes obtenidos exitosamente",
    next_url="/api/v1/customers/?page=3",
    previous_url="/api/v1/customers/?page=1"
)
```

**Frontend recibe:**
```json
{
  "success": true,
  "status": "success",
  "message": "Clientes obtenidos exitosamente",
  "data": [
    {"id": 1, "name": "Cliente 1"},
    {"id": 2, "name": "Cliente 2"},
    {"id": 3, "name": "Cliente 3"}
  ],
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-29T10:30:00.123456Z",
    "processing_time_ms": 85,
    "pagination": {
      "page": 2,
      "per_page": 3,
      "total": 25,
      "total_pages": 9,
      "next": "/api/v1/customers/?page=3",
      "previous": "/api/v1/customers/?page=1"
    }
  }
}
```

**Código HTTP:** `200 OK`

---

## Códigos HTTP

### Códigos de Éxito (2xx)

| Código | Constante | Método Backend | Uso |
|--------|-----------|----------------|-----|
| 200 | `HTTP_200_OK` | `.success()` | Operación exitosa |
| 201 | `HTTP_201_CREATED` | `.created()` | Recurso creado |
| 204 | `HTTP_204_NO_CONTENT` | `.no_content()` | Operación exitosa sin contenido |

### Códigos de Error del Cliente (4xx)

| Código | Constante | Método Backend | Uso |
|--------|-----------|----------------|-----|
| 400 | `HTTP_400_BAD_REQUEST` | `.error()` | Error de lógica de negocio |
| 401 | `HTTP_401_UNAUTHORIZED` | `.unauthorized()` | No autenticado |
| 403 | `HTTP_403_FORBIDDEN` | `.forbidden()` | Sin permisos |
| 404 | `HTTP_404_NOT_FOUND` | `.not_found()` | Recurso no encontrado |
| 422 | `HTTP_422_UNPROCESSABLE_ENTITY` | `.validation_error()` | Error de validación |

### Códigos de Error del Servidor (5xx)

| Código | Constante | Método Backend | Uso |
|--------|-----------|----------------|-----|
| 500 | `HTTP_500_INTERNAL_SERVER_ERROR` | `.internal_error()` | Error interno del servidor |

---

## Tipos de Error

```typescript
enum ErrorType {
  VALIDATION_ERROR = "validation_error",           // Errores de validación de datos
  AUTHENTICATION_ERROR = "authentication_error",   // Errores de autenticación
  AUTHORIZATION_ERROR = "authorization_error",     // Errores de permisos
  NOT_FOUND = "not_found",                        // Recurso no encontrado
  BUSINESS_LOGIC_ERROR = "business_logic_error",  // Errores de lógica de negocio
  INTERNAL_ERROR = "internal_error"               // Errores internos del servidor
}
```

---

## Ejemplos TypeScript

### Tipos Base

```typescript
// types/api.ts

export enum ErrorType {
  VALIDATION_ERROR = "validation_error",
  AUTHENTICATION_ERROR = "authentication_error",
  AUTHORIZATION_ERROR = "authorization_error",
  NOT_FOUND = "not_found",
  BUSINESS_LOGIC_ERROR = "business_logic_error",
  INTERNAL_ERROR = "internal_error"
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
}

export interface ErrorMeta {
  code: number;
  type: ErrorType;
  message: string;
  details?: string | Record<string, string[]> | string[] | Record<string, any>;
  timestamp: string;
}

export interface MetaInfo {
  version: string;
  timestamp: string;
  processing_time_ms: number;
  pagination?: PaginationMeta;
  deprecated?: boolean;
  replacement?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  status: "success" | "error";
  message: string;
  data: T | null;
  meta: MetaInfo;
  error?: ErrorMeta;
}

export interface ApiResponsePaginated<T> extends ApiResponse<T[]> {
  meta: MetaInfo & {
    pagination: PaginationMeta;
  };
}
```

---

### Función de Manejo de Respuestas

```typescript
// utils/api-handler.ts

import { ApiResponse } from '@/types/api';

export async function handleApiResponse<T>(
  response: Response
): Promise<T> {
  const json: ApiResponse<T> = await response.json();

  if (!json.success) {
    // Lanzar error con información detallada
    throw new ApiError(
      json.message,
      json.error?.code || response.status,
      json.error?.type,
      json.error?.details
    );
  }

  return json.data as T;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public type?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

---

### Ejemplo de Uso en Frontend

```typescript
// services/customer.service.ts

import { ApiResponse, ApiResponsePaginated } from '@/types/api';
import { Customer, CustomerDetail } from '@/types/models';
import { handleApiResponse } from '@/utils/api-handler';

export class CustomerService {
  private baseUrl = '/api/v1/customers';

  // GET list - respuesta paginada
  async getCustomers(page: number = 1): Promise<CustomerDetail[]> {
    const response = await fetch(`${this.baseUrl}/?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    const json: ApiResponsePaginated<CustomerDetail> = await response.json();

    if (!json.success) {
      throw new Error(json.message);
    }

    // Puedes acceder a la paginación
    console.log('Página actual:', json.meta.pagination.page);
    console.log('Total:', json.meta.pagination.total);

    return json.data as CustomerDetail[];
  }

  // GET detail - respuesta simple
  async getCustomer(id: number): Promise<Customer> {
    const response = await fetch(`${this.baseUrl}/${id}/`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    return handleApiResponse<Customer>(response);
  }

  // POST - crear
  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });

    return handleApiResponse<Customer>(response);
  }

  // PATCH - actualizar
  async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
    const response = await fetch(`${this.baseUrl}/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });

    return handleApiResponse<Customer>(response);
  }

  // DELETE
  async deleteCustomer(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    await handleApiResponse<void>(response);
  }
}
```

---

### Manejo de Errores en Componentes

```typescript
// components/CustomerForm.tsx

import { useState } from 'react';
import { CustomerService } from '@/services/customer.service';
import { ApiError } from '@/utils/api-handler';

export function CustomerForm() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const customerService = new CustomerService();

  async function handleSubmit(data: any) {
    try {
      setErrors({});
      setGeneralError('');

      const customer = await customerService.createCustomer(data);

      // Éxito
      alert('Cliente creado exitosamente');

    } catch (error) {
      if (error instanceof ApiError) {
        // Error de validación (422)
        if (error.type === 'validation_error' && typeof error.details === 'object') {
          setErrors(error.details as Record<string, string[]>);
        }
        // Error de autenticación (401)
        else if (error.type === 'authentication_error') {
          // Redirigir a login
          window.location.href = '/login';
        }
        // Error de permisos (403)
        else if (error.type === 'authorization_error') {
          setGeneralError('No tiene permisos para realizar esta acción');
        }
        // Otros errores
        else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError('Error inesperado');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {generalError && (
        <div className="alert alert-error">{generalError}</div>
      )}

      <div>
        <label>Nombre:</label>
        <input name="full_name" />
        {errors.full_name && (
          <span className="error">{errors.full_name[0]}</span>
        )}
      </div>

      <div>
        <label>Teléfono:</label>
        <input name="phone" />
        {errors.phone && (
          <span className="error">{errors.phone[0]}</span>
        )}
      </div>

      <button type="submit">Guardar</button>
    </form>
  );
}
```

---

## Buenas Prácticas para el Frontend

### 1. Siempre verificar `success`

```typescript
const json: ApiResponse<Customer> = await response.json();

if (json.success) {
  // Procesar datos exitosos
  const customer = json.data;
} else {
  // Manejar error
  const errorMessage = json.message;
  const errorDetails = json.error?.details;
}
```

---

### 2. Usar el campo `status` para lógica condicional

```typescript
const json: ApiResponse<Customer> = await response.json();

switch (json.status) {
  case 'success':
    // Mostrar notificación de éxito
    toast.success(json.message);
    break;
  case 'error':
    // Mostrar notificación de error
    toast.error(json.message);
    break;
}
```

---

### 3. Aprovechar los metadatos

```typescript
const json: ApiResponse<Customer> = await response.json();

// Tiempo de procesamiento para debugging
console.log(`Request took ${json.meta.processing_time_ms}ms`);

// Verificar si el endpoint está deprecado
if (json.meta.deprecated) {
  console.warn(`Endpoint deprecado. Usar: ${json.meta.replacement}`);
}

// Mostrar timestamp del servidor
console.log(`Server time: ${json.meta.timestamp}`);
```

---

### 4. Manejo de Errores de Validación

```typescript
const json: ApiResponse<Customer> = await response.json();

if (!json.success && json.error?.type === 'validation_error') {
  const validationErrors = json.error.details as Record<string, string[]>;

  // Mostrar errores por campo
  Object.entries(validationErrors).forEach(([field, messages]) => {
    messages.forEach(message => {
      showFieldError(field, message);
    });
  });
}
```

---

### 5. Respuestas Paginadas

```typescript
const json: ApiResponsePaginated<CustomerDetail> = await response.json();

if (json.success && json.meta.pagination) {
  const { page, per_page, total, total_pages, next, previous } = json.meta.pagination;

  // Actualizar UI de paginación
  setPagination({
    currentPage: page,
    totalPages: total_pages,
    totalItems: total,
    hasNext: next !== null,
    hasPrevious: previous !== null
  });

  // Datos
  setCustomers(json.data);
}
```

---

## Resumen Rápido

### ✅ Respuestas Exitosas

- **200 OK**: `.success()` - Operación exitosa
- **201 Created**: `.created()` - Recurso creado
- **204 No Content**: `.no_content()` - Operación exitosa sin contenido

### ❌ Respuestas de Error

- **400 Bad Request**: `.error()` - Error de lógica de negocio
- **401 Unauthorized**: `.unauthorized()` - No autenticado
- **403 Forbidden**: `.forbidden()` - Sin permisos
- **404 Not Found**: `.not_found()` - Recurso no encontrado
- **422 Unprocessable Entity**: `.validation_error()` - Error de validación
- **500 Internal Server Error**: `.internal_error()` - Error interno

### 🔍 Verificaciones Importantes

1. Siempre verificar `success: boolean`
2. Usar `message: string` para mensajes al usuario
3. Los datos están en `data: T | null`
4. Los errores tienen información detallada en `error?: ErrorMeta`
5. La paginación está en `meta.pagination?: PaginationMeta`

---

**Versión:** 1.0
**Última actualización:** 2025-11-29
**Dominio API:** https://www.citalistoapi.iveltech.com/
