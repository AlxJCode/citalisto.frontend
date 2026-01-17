# 📋 API: Addons Summary

## Endpoint

```
GET /api/v1/subscriptions/addons-summary/
```

**Autenticación:** Bearer Token (IsOwner)

**Descripción:** Retorna el catálogo completo de addons agrupados por tipo + los addons comprados por el negocio.

---

## Response Structure

```json
{
  "success": true,
  "message": "Resumen de addons obtenido exitosamente",
  "data": {
    "catalog": {
      "whatsapp": [...],
      "professionals": [...],
      "branches": [...]
    },
    "purchased": {
      "whatsapp": [...],
      "professionals": {...} | null,
      "branches": {...} | null
    }
  }
}
```

---

## Ejemplo de Response Completo

```json
{
  "success": true,
  "message": "Resumen de addons obtenido exitosamente",
  "data": {
    "catalog": {
      "whatsapp": [
        {
          "id": 1,
          "name": "Pack 500 WhatsApp",
          "quota_amount": 500,
          "price": "5.00"
        },
        {
          "id": 2,
          "name": "Pack 1000 WhatsApp",
          "quota_amount": 1000,
          "price": "10.00"
        },
        {
          "id": 3,
          "name": "Pack 5000 WhatsApp",
          "quota_amount": 5000,
          "price": "40.00"
        }
      ],
      "professionals": [
        {
          "id": 4,
          "name": "+3 Profesionales",
          "quota_amount": 3,
          "price": "10.00"
        },
        {
          "id": 5,
          "name": "+5 Profesionales",
          "quota_amount": 5,
          "price": "15.00"
        },
        {
          "id": 6,
          "name": "+10 Profesionales",
          "quota_amount": 10,
          "price": "25.00"
        }
      ],
      "branches": [
        {
          "id": 7,
          "name": "+1 Sucursal",
          "quota_amount": 1,
          "price": "8.00"
        },
        {
          "id": 8,
          "name": "+2 Sucursales",
          "quota_amount": 2,
          "price": "15.00"
        },
        {
          "id": 9,
          "name": "+5 Sucursales",
          "quota_amount": 5,
          "price": "30.00"
        }
      ]
    },
    "purchased": {
      "whatsapp": [
        {
          "id": 10,
          "name": "Pack 1000 WhatsApp",
          "used": 650,
          "total": 1000,
          "remaining": 350
        },
        {
          "id": 11,
          "name": "Pack 1000 WhatsApp",
          "used": 1000,
          "total": 1000,
          "remaining": 0
        },
        {
          "id": 12,
          "name": "Pack 500 WhatsApp",
          "used": 0,
          "total": 500,
          "remaining": 500
        }
      ],
      "professionals": {
        "id": 13,
        "name": "+5 Profesionales",
        "quota": 5,
        "expires_at": "2025-02-15T00:00:00Z"
      },
      "branches": null
    }
  }
}
```

---

## Estructura Detallada

### `catalog` (Catálogo de addons disponibles)

Objeto con 3 claves: `whatsapp`, `professionals`, `branches`

Cada una contiene un **array de addons** ordenados por `quota_amount` (menor a mayor):

```typescript
{
  id: number;
  name: string;
  quota_amount: number;  // Cantidad de cuota que otorga
  price: string;         // Precio decimal
}
```

**Ordenamiento:** Menor a mayor cuota (ej: 500 → 1000 → 5000)

---

### `purchased` (Addons comprados por el negocio)

#### `purchased.whatsapp` - Array

Lista **completa** de todos los packs de WhatsApp comprados (activos):

```typescript
[
  {
    id: number;           // ID del SubscriptionAddon
    name: string;         // Nombre del addon
    used: number;         // Cuota usada (AddonUsage.used_quota)
    total: number;        // Cuota total (AddonUsage.initial_quota)
    remaining: number;    // Cuota restante (total - used)
  }
]
```

**Ordenamiento:** Por antigüedad (FIFO - el más antiguo primero)

**Casos:**
- Array vacío `[]` → No tiene addons de WhatsApp
- Múltiples elementos → Tiene varios packs (algunos agotados, otros con cuota)

---

#### `purchased.professionals` - Objeto | null

**Solo UNO** (el activo). Si tiene múltiples, solo retorna el primero activo:

```typescript
{
  id: number;              // ID del SubscriptionAddon
  name: string;            // Nombre del addon
  quota: number;           // Cuota que otorga (ej: 5 profesionales)
  expires_at: string|null; // Fecha de expiración (ISO 8601)
} | null
```

**Casos:**
- `null` → No tiene addon de profesionales activo
- Objeto → Tiene addon activo

---

#### `purchased.branches` - Objeto | null

Idéntico a `professionals`:

```typescript
{
  id: number;
  name: string;
  quota: number;
  expires_at: string|null;
} | null
```

---

## Casos de Uso

### Frontend: Mostrar catálogo de compra

```javascript
const { catalog } = response.data;

// Renderizar opciones de WhatsApp
catalog.whatsapp.map(addon => (
  <AddonCard
    key={addon.id}
    name={addon.name}
    quota={addon.quota_amount}
    price={addon.price}
    onBuy={() => buyAddon(addon.id)}
  />
));
```

---

### Frontend: Mostrar addons de WhatsApp comprados

```javascript
const { purchased } = response.data;

// Mostrar lista de packs
purchased.whatsapp.map(pack => (
  <WhatsAppPackCard
    key={pack.id}
    name={pack.name}
    progress={pack.used / pack.total * 100}
    remaining={pack.remaining}
    status={pack.remaining === 0 ? 'agotado' : 'disponible'}
  />
));

// Calcular total restante
const totalRemaining = purchased.whatsapp.reduce(
  (sum, pack) => sum + pack.remaining,
  0
);
```

---

### Frontend: Mostrar addon de profesionales activo

```javascript
const profAddon = purchased.professionals;

if (profAddon) {
  <AddonActiveCard
    name={profAddon.name}
    quota={profAddon.quota}
    expiresAt={profAddon.expires_at}
    daysRemaining={calculateDaysRemaining(profAddon.expires_at)}
  />
} else {
  <EmptyState message="No tienes addons de profesionales" />
}
```

---

## Errores Posibles

### 404 - No tiene suscripción activa

```json
{
  "success": false,
  "message": "No tienes una suscripción activa",
  "code": 404
}
```

**Solución:** Usuario debe contratar un plan primero.

---

### 401 - No autenticado

```json
{
  "success": false,
  "message": "Authentication credentials were not provided.",
  "code": 401
}
```

**Solución:** Incluir token en header: `Authorization: Bearer {token}`

---

## Notas Importantes

1. **WhatsApp addons:** Se retornan TODOS (incluso agotados) para que el usuario vea su historial
2. **Mensuales (professionals/branches):** Solo el activo (si tiene múltiples, solo el primero)
3. **Ordenamiento catálogo:** Menor a mayor quota_amount (para mostrar opciones progresivas)
4. **Ordenamiento WhatsApp comprados:** FIFO (más antiguo primero, coincide con orden de consumo)

---

## Testing

```bash
# Con curl
curl -X GET \
  'http://localhost:8000/api/v1/subscriptions/addons-summary/' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Respuesta esperada
{
  "success": true,
  "data": {
    "catalog": { ... },
    "purchased": { ... }
  }
}
```

---

## Changelog

- **v1.0** (2025-01-13): Endpoint creado
