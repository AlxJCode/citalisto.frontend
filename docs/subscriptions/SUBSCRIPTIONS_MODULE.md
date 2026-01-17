# 📦 Módulo de Suscripciones - Documentación Completa

> **Última actualización:** 2025-01-13
> **Versión:** 2.0
> **Cambios importantes:**
> - ❌ Eliminado prorateo de primer mes
> - ✅ Bookings siempre ilimitados
> - ✅ Sistema de addons completamente funcional
> - ✅ Addons permanentes (WhatsApp) y mensuales (Profesionales/Branches)
> - ✅ Nuevo endpoint `/addons-summary/`

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Modelos](#modelos)
4. [Flujo de Validación de Cuotas](#flujo-de-validación-de-cuotas)
5. [Endpoints de API](#endpoints-de-api)
6. [Servicios](#servicios)
7. [Prorateo de Cuotas](#prorateo-de-cuotas)
8. [Reset Mensual Automático](#reset-mensual-automático)
9. [Race Conditions y Seguridad](#race-conditions-y-seguridad)
10. [Ejemplos de Uso](#ejemplos-de-uso)
11. [Recomendaciones](#recomendaciones)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Visión General

El módulo de suscripciones gestiona **límites de uso** y **validaciones de cuotas** para cada negocio en el SaaS. Controla cuántos recursos puede crear un negocio según su plan contratado.

### Principios de Diseño

✅ **Simple**: Una validación por responsabilidad
✅ **Seguro**: Atomic operations + database locks
✅ **Consistente**: Misma lógica en ambas APIs (owner y pública)
✅ **Centralizado**: Lógica en services, no en views
✅ **Fail-safe**: Logs sin bloquear operaciones críticas
✅ **Sin prorateo**: Límites completos desde el día 1
✅ **Addons flexibles**: Permanentes (WhatsApp) y Mensuales (Profesionales/Branches)

### Recursos Controlados

| Recurso | Tipo | Límite | Observaciones |
|---------|------|--------|---------------|
| **Branches** | Permanente | `plan.max_branches` + addons mensuales | Se pueden comprar addons mensuales |
| **Professionals** | Permanente | `plan.max_professionals` + addons mensuales | Se pueden comprar addons mensuales |
| **Bookings** | Ilimitado | `None` | Siempre ilimitado en todos los planes |
| **WhatsApp** | Mensual | `plan.max_whatsapp_per_month` + addons permanentes | Plan se resetea, addons permanentes no |
| **Email** | Ilimitado | `None` | Sin límite |

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Business (Negocio)                          │
└────────────┬────────────────────────────────────────────────────────┘
             │
             ├─── (1) ──► Subscription (activa)
             │                  │
             │                  └──► Plan
             │                         ├── max_branches
             │                         ├── max_professionals
             │                         ├── max_bookings_per_month
             │                         ├── max_whatsapp_per_month
             │                         └── features (whatsapp, branding, etc)
             │
             ├─── (1) ──► Usage (período actual - mutable)
             │                  ├── period_start / period_end
             │                  ├── branches_count (contador permanente)
             │                  ├── professionals_count (contador permanente)
             │                  ├── bookings_count (reset mensual)
             │                  ├── whatsapp_messages_sent (reset mensual)
             │                  └── email_messages_sent (reset mensual)
             │
             └─── (N) ──► UsageHistory (snapshots inmutables)
                                ├── Un registro por mes
                                ├── Incluye overages
                                └── Para auditoría y analytics
```

### Relación OneToOne vs ForeignKey

- **`Business ←1:1→ Usage`**: Cada negocio tiene **UN SOLO** registro de uso (período actual)
- **`Business ←1:N→ Subscription`**: Múltiples suscripciones (histórico), pero solo una activa
- **`Business ←1:N→ UsageHistory`**: Un snapshot por cada mes cerrado

---

## 📊 Modelos

### 1. Plan

**Archivo**: `applications/subscriptions/models/plan.py`

Define los planes disponibles en el SaaS.

```python
class Plan(BaseModel):
    name = CharField(max_length=100)
    slug = SlugField(unique=True)
    price = DecimalField(max_digits=10, decimal_places=2)
    billing_period = CharField(choices=["monthly", "yearly"])

    # Límites de recursos
    max_branches = PositiveIntegerField(null=True)  # None = ilimitado
    max_professionals = PositiveIntegerField(null=True)
    max_bookings_per_month = PositiveIntegerField(null=True)  # Siempre None (ilimitado)
    max_whatsapp_per_month = PositiveIntegerField(null=True)

    # Features
    whatsapp_enabled = BooleanField(default=False)
    custom_branding_enabled = BooleanField(default=False)
    api_access_enabled = BooleanField(default=False)
    analytics_enabled = BooleanField(default=False)
```

**Características**:
- `null=True` en límites significa **ilimitado**
- `is_active=False` oculta planes descontinuados
- Slug para URLs amigables

---

### 2. Subscription

**Archivo**: `applications/subscriptions/models/subscription.py`

Suscripción activa o histórica de un negocio.

```python
class Subscription(BaseModel):
    class Status(TextChoices):
        ACTIVE = "active"
        CANCELLED = "cancelled"
        EXPIRED = "expired"
        SUSPENDED = "suspended"

    business = ForeignKey("organizations.Business")
    plan = ForeignKey("subscriptions.Plan", on_delete=PROTECT)
    status = CharField(choices=Status.choices)
    started_at = DateTimeField(auto_now_add=True)
    expires_at = DateTimeField(null=True)  # Para trials/anuales
    auto_renew = BooleanField(default=True)
    trial_ends_at = DateTimeField(null=True)
    cancelled_at = DateTimeField(null=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=["business"],
                condition=Q(status="active", is_active=True),
                name="unique_active_subscription_per_business"
            )
        ]
```

**Métodos importantes**:

#### `get_active_for_business(business)` (classmethod)
```python
subscription = Subscription.get_active_for_business(business)
# Retorna la suscripción activa o None
```

Condiciones para ser activa:
- `status = 'active'`
- `is_active = True`
- `expires_at` es NULL o futuro

#### `get_effective_limits()` → dict
```python
limits = subscription.get_effective_limits()
# {
#     'bookings': None,     # Siempre ilimitado
#     'whatsapp': 500,      # Solo del plan (addons permanentes aparte)
#     'branches': 8,        # Plan (3) + Addons mensuales activos (5)
#     'professionals': 15   # Plan (10) + Addons mensuales activos (5)
# }
```

**Lógica de suma de addons**:
- **Branches y Professionals**: Se suman addons MENSUALES activos al límite del plan
- **WhatsApp**: Addons PERMANENTES NO se suman aquí (se consumen aparte cuando plan se agota)
- **Bookings**: Siempre `None` (ilimitado)

```python
# Ejemplo: Plan 10 profesionales + Addon mensual +5
base_limits['professionals'] = 10 + 5 = 15
```

**Addons permanentes (WhatsApp)**:
- NO se suman a `effective_limits`
- Se consumen DESPUÉS de agotar el plan
- Se trackean en `AddonUsage`

---

### 3. Usage

**Archivo**: `applications/subscriptions/models/usage.py`

Registro **ÚNICO y MUTABLE** del uso actual del negocio.

```python
class Usage(BaseModel):
    business = OneToOneField("organizations.Business")
    period_start = DateField()  # Primer día del mes
    period_end = DateField()    # Último día del mes

    # Contadores permanentes (NO se resetean)
    branches_count = PositiveIntegerField(default=0)
    professionals_count = PositiveIntegerField(default=0)

    # Contadores mensuales (SE RESETEAN cada mes)
    bookings_count = PositiveIntegerField(default=0)
    whatsapp_messages_sent = PositiveIntegerField(default=0)
    email_messages_sent = PositiveIntegerField(default=0)

    last_updated = DateTimeField(auto_now=True)
```

**Características clave**:
- **OneToOne**: Solo existe UN registro por negocio
- **Mutable**: Los contadores se incrementan durante el mes
- **Auto-reset**: Al cambiar de mes, se archiva y resetea automáticamente
- **Permanentes vs Mensuales**: Distingue entre recursos persistentes y temporales

**Ciclo de vida**:
```
Día 1 del mes:
├── Se crea UsageHistory con datos del mes anterior
├── Se resetean bookings_count, whatsapp_messages_sent, email_messages_sent → 0
├── Se mantienen branches_count, professionals_count (son permanentes)
└── Se actualiza period_start y period_end al nuevo mes
```

---

### 4. UsageHistory

**Archivo**: `applications/subscriptions/models/usage_history.py`

Snapshot **INMUTABLE** del uso de un mes cerrado.

```python
class UsageHistory(BaseModel):
    business = ForeignKey("organizations.Business")
    subscription = ForeignKey("subscriptions.Subscription", null=True)

    # Identificación del período
    period_start = DateField()
    period_end = DateField()
    period_month = PositiveSmallIntegerField()  # 1-12
    period_year = PositiveIntegerField()

    # Snapshot de contadores
    branches_count = PositiveIntegerField()
    professionals_count = PositiveIntegerField()
    bookings_count = PositiveIntegerField()
    bookings_completed = PositiveIntegerField()
    bookings_cancelled = PositiveIntegerField()
    whatsapp_messages_sent = PositiveIntegerField()
    email_messages_sent = PositiveIntegerField()

    # Límites del plan en ese momento (auditoría)
    plan_max_branches = PositiveIntegerField(null=True)
    plan_max_professionals = PositiveIntegerField(null=True)
    plan_max_bookings = PositiveIntegerField(null=True)
    plan_max_whatsapp = PositiveIntegerField(null=True)

    # Overages (excesos)
    overage_bookings = PositiveIntegerField(default=0)
    overage_whatsapp = PositiveIntegerField(default=0)

    notes = TextField(blank=True)

    class Meta:
        unique_together = [["business", "period_year", "period_month"]]
```

**Propiedades calculadas**:

```python
history.period_name  # "Enero 2025"
history.usage_percentage  # {"bookings": 85.5, "whatsapp": 92.3, ...}
history.had_overages  # True si overage_bookings > 0 OR overage_whatsapp > 0
```

**Importante**:
- **Inmutable**: No se puede editar/eliminar desde Django Admin
- **Un registro por mes**: constraint unique en (business, year, month)
- **Snapshot de límites**: Guarda los límites del plan en ese momento (por si cambian)

---

## ⚙️ Flujo de Validación de Cuotas

### Diagrama de Flujo General

```
Usuario intenta crear recurso (Branch/Professional/Booking)
                    ↓
            ┌───────────────┐
            │  Serializer   │
            │  valida datos │
            └───────┬───────┘
                    ↓
            ┌───────────────┐
            │    Service    │
            │  valida cuota │
            └───────┬───────┘
                    ↓
    ┌───────────────────────────────────┐
    │   UsageTrackingService            │
    │                                   │
    │  1. select_for_update() - LOCK   │ ← Previene race conditions
    │  2. get_or_create_current_usage()│
    │  3. Obtener suscripción activa   │
    │  4. get_effective_limits()       │ ← Con prorateo si aplica
    │  5. Validar: current >= limit?   │
    │     ├── SÍ → QuotaExceededError  │
    │     └── NO → F() increment       │ ← Atomic
    │                                   │
    └───────────────┬───────────────────┘
                    ↓
            ┌───────────────┐
            │    Signal     │
            │ update_resource│
            │    _counts()   │  ← Para recursos permanentes
            └───────┬───────┘
                    ↓
            Recurso creado ✅
```

---

### Flujo Específico por Recurso

#### 🏢 Branch (Sucursal)

**Archivo**: `applications/organizations/serializers/branch.py`

```python
# En BranchSerializer.validate():
try:
    BranchService.validate_branch_quota(business)
except BranchValidationError as e:
    raise serializers.ValidationError({'business': str(e)})
except ValueError as e:  # Sin suscripción activa
    raise serializers.ValidationError({'business': str(e)})
```

**Archivo**: `applications/organizations/services/branch_service.py`

```python
@staticmethod
def validate_branch_quota(business):
    subscription = Subscription.get_active_for_business(business)

    if not subscription:
        raise ValueError("El negocio no tiene una suscripción activa")

    effective_limits = subscription.get_effective_limits()
    max_branches = effective_limits.get('branches')

    if max_branches is None:
        return  # Ilimitado

    current_count = Branch.objects.filter(
        business=business,
        is_active=True
    ).count()

    if current_count >= max_branches:
        raise BranchValidationError(
            f"Has alcanzado el límite de {max_branches} sucursales. "
            f"Upgradea tu plan para crear más."
        )
```

**Después de crear**:
```python
# Signal: applications/organizations/signals.py
@receiver(post_save, sender=Branch)
def update_branch_count(sender, instance, created, **kwargs):
    UsageTrackingService.update_resource_counts(instance.business)
```

**Características**:
- ✅ Validación **ANTES** de crear
- ✅ Solo cuenta branches con `is_active=True`
- ❌ **NO se prorratea** (recurso permanente)
- ✅ Signal actualiza `Usage.branches_count` automáticamente

---

#### 👨‍⚕️ Professional

**Archivo**: `applications/professionals/services/professional_service.py`

```python
# Similar a Branch, valida antes de crear
max_professionals = subscription.plan.max_professionals
if max_professionals is not None:
    current_count = Professional.objects.filter(
        branch__business=business,
        is_active=True
    ).count()

    if current_count >= max_professionals:
        raise ValidationError(...)
```

**Después de crear**:
```python
# Signal: applications/professionals/signals.py
@receiver(post_save, sender=Professional)
def update_professional_count(sender, instance, created, **kwargs):
    UsageTrackingService.update_resource_counts(instance.branch.business)
```

**Características**:
- ✅ Validación antes de crear
- ❌ **NO se prorratea**
- ✅ Signal actualiza contador

---

#### 📅 Booking (Reserva)

**Archivo**: `applications/appointments/services/booking_service.py`

```python
@staticmethod
@transaction.atomic
def create_booking(validated_data, user):
    # Validación 0: Incrementar contador (sin límite)
    UsageTrackingService.increment_bookings(business)

    # Validación 1-4: Otras validaciones de negocio
    # ...

    booking = Booking.objects.create(**validated_data)
    return booking
```

**UsageTrackingService.increment_bookings()**:
```python
@staticmethod
@transaction.atomic
def increment_bookings(business):
    """
    Incrementa contador de bookings (siempre ilimitado).

    Los bookings son ilimitados en todos los planes, por lo que
    este método solo incrementa el contador sin validar límites.
    """
    # 1. Lock FOR UPDATE (previene race conditions)
    usage = Usage.objects.select_for_update().get(business=business)

    # 2. Incremento atómico (sin validación, bookings ilimitados)
    Usage.objects.filter(pk=usage.pk).update(
        bookings_count=F('bookings_count') + 1
    )

    usage.refresh_from_db()
    return usage
```

**Características**:
- ✅ Solo tracking, sin validación
- ✅ Siempre ilimitado en todos los planes
- ✅ Database lock con `select_for_update()`
- ✅ F() expression para prevenir race conditions

---

#### 📱 WhatsApp

**Lógica con fallback a addons permanentes**:

```python
UsageTrackingService.increment_whatsapp(business)
# Flujo: lock → validar plan → si agotado buscar addons permanentes → incrementar
```

**UsageTrackingService.increment_whatsapp()**:
```python
@staticmethod
@transaction.atomic
def increment_whatsapp(business):
    # 1. Lock
    usage = Usage.objects.select_for_update().get(business=business)

    # 2. Límite del plan (sin addons permanentes)
    effective_limits = subscription.get_effective_limits()
    max_whatsapp = effective_limits.get('whatsapp')

    # 3. ¿Hay cuota del plan?
    if usage.whatsapp_messages_sent < max_whatsapp:
        # Consumir del plan
        Usage.objects.filter(pk=usage.pk).update(
            whatsapp_messages_sent=F('whatsapp_messages_sent') + 1
        )
    else:
        # Plan agotado → buscar addons permanentes
        addon_consumed = _try_consume_addon_quota(business, 'whatsapp', 1)

        if addon_consumed:
            # Incrementar usage (solo tracking)
            Usage.objects.filter(pk=usage.pk).update(
                whatsapp_messages_sent=F('whatsapp_messages_sent') + 1
            )
        else:
            raise QuotaExceededError("Sin cuota en plan ni addons")
```

**Características**:
- ✅ Primero consume del plan
- ✅ Cuando plan se agota → busca addons permanentes (FIFO)
- ✅ Addons permanentes NO se resetean mensualmente
- ✅ Atomic + lock
- ✅ Se valida ANTES de enviar mensaje

---

## 🌐 Endpoints de API

### 1. Listar Planes (Público)

```http
GET /api/v1/subscriptions/plans/
Authorization: No requerida
```

**Response**:
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Plan Básico",
      "slug": "basico",
      "description": "Para negocios pequeños",
      "price": "29.99",
      "billing_period": "monthly",
      "billing_period_display": "Mensual",
      "max_branches": 1,
      "max_professionals": 3,
      "max_bookings_per_month": 100,
      "max_whatsapp_per_month": 100,
      "whatsapp_enabled": true,
      "custom_branding_enabled": false,
      "api_access_enabled": false,
      "analytics_enabled": false
    }
  ]
}
```

**Uso**: Mostrar planes en UI de upgrade/pricing.

---

### 2. Obtener Suscripción Actual

```http
GET /api/v1/subscriptions/current/
Authorization: Bearer {token}
Permissions: IsOwner
```

**Response**:
```json
{
  "success": true,
  "message": "Suscripción activa obtenida exitosamente",
  "data": {
    "id": 1,
    "business": 1,
    "plan": 1,
    "plan_detail": {
      "id": 1,
      "name": "Plan Profesional",
      "price": "79.99",
      "max_branches": 5,
      "max_professionals": 10,
      "max_bookings_per_month": 500,
      "max_whatsapp_per_month": 500
    },
    "status": "active",
    "status_display": "Activa",
    "started_at": "2025-01-15T10:00:00Z",
    "expires_at": null,
    "auto_renew": true,
    "trial_ends_at": null,
    "cancelled_at": null,
    "effective_limits": {
      "bookings": null,    // Ilimitado
      "whatsapp": 500,     // Solo del plan
      "branches": 8,       // Plan (3) + Addons (5)
      "professionals": 15  // Plan (10) + Addons (5)
    }
  }
}
```

**Uso**:
- Mostrar plan actual en configuración
- Validar features disponibles
- Mostrar límites efectivos del mes

---

### 3. Obtener Uso Actual

```http
GET /api/v1/subscriptions/usage/
Authorization: Bearer {token}
Permissions: IsOwner
```

**Response**:
```json
{
  "success": true,
  "message": "Uso actual obtenido exitosamente",
  "data": {
    "id": 1,
    "business": 1,
    "period_start": "2025-01-01",
    "period_end": "2025-01-31",
    "branches_count": 2,
    "professionals_count": 5,
    "bookings_count": 150,
    "whatsapp_messages_sent": 120,
    "email_messages_sent": 200,
    "last_updated": "2025-01-22T14:30:00Z",
    "subscription": {
      "id": 1,
      "plan_name": "Plan Profesional",
      "status": "active"
    },
    "usage_percentages": {
      "branches": 25.0,      // 2/8 = 25%
      "professionals": 33.3,  // 5/15 = 33.3%
      "bookings": null,      // Ilimitado
      "whatsapp": 24.0       // 120/500 = 24%
    }
  }
}
```

**Uso**:
- Progress bars en UI
- Alertas cuando se acerque al límite
- Dashboard de uso

---

### 4. Historial de Uso

```http
GET /api/v1/subscriptions/history/?page=1
Authorization: Bearer {token}
Permissions: IsOwner
```

**Response** (paginado):
```json
{
  "success": true,
  "data": {
    "count": 6,
    "next": "http://api.../history/?page=2",
    "previous": null,
    "results": [
      {
        "id": 5,
        "period_name_display": "Diciembre 2024",
        "period_start": "2024-12-01",
        "period_end": "2024-12-31",
        "branches_count": 2,
        "professionals_count": 4,
        "bookings_count": 480,
        "bookings_completed": 450,
        "bookings_cancelled": 30,
        "whatsapp_messages_sent": 490,
        "plan_max_bookings": 500,
        "plan_max_whatsapp": 500,
        "overage_bookings": 0,
        "overage_whatsapp": 0,
        "had_overages": false,
        "usage_percentage_display": {
          "bookings": 96.0,
          "whatsapp": 98.0
        }
      }
    ]
  }
}
```

**Uso**:
- Reportes mensuales
- Analytics de uso histórico
- Identificar patrones de consumo

---

### 5. Resumen de Addons (Catálogo + Comprados)

```http
GET /api/v1/subscriptions/addons-summary/
Authorization: Bearer {token}
Permissions: IsOwner
```

**Response**:
```json
{
  "success": true,
  "message": "Resumen de addons obtenido exitosamente",
  "data": {
    "catalog": {
      "whatsapp": [
        {"id": 1, "name": "Pack 500 WSP", "quota_amount": 500, "price": "5.00"},
        {"id": 2, "name": "Pack 1000 WSP", "quota_amount": 1000, "price": "10.00"}
      ],
      "professionals": [
        {"id": 4, "name": "+5 Profesionales", "quota_amount": 5, "price": "15.00"}
      ],
      "branches": [
        {"id": 7, "name": "+2 Sucursales", "quota_amount": 2, "price": "15.00"}
      ]
    },
    "purchased": {
      "whatsapp": [
        {"id": 10, "name": "Pack 1000 WSP", "used": 650, "total": 1000, "remaining": 350}
      ],
      "professionals": {
        "id": 12,
        "name": "+5 Profesionales",
        "quota": 5,
        "expires_at": "2025-02-15T00:00:00Z"
      },
      "branches": null
    }
  }
}
```

**Uso**:
- Mostrar catálogo de addons disponibles (agrupados por tipo)
- Mostrar addons comprados con su uso actual
- WhatsApp: lista completa con uso/máximo
- Profesionales/Branches: solo el activo

**Documentación completa**: `docs/API_ADDONS_SUMMARY.md`

---

### 6. Estadísticas Consolidadas (Dashboard)

```http
GET /api/v1/subscriptions/stats/
Authorization: Bearer {token}
Permissions: IsOwner
```

**Response**:
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "subscription": {
      "plan_name": "Plan Profesional",
      "status": "active",
      "is_first_month": true,
      "effective_limits": {
        "bookings": 258,
        "whatsapp": 258,
        "branches": 5,
        "professionals": 10
      }
    },
    "usage": {
      "branches": 4,
      "professionals": 9,
      "bookings": 240,
      "whatsapp": 250,
      "email": 300,
      "period_start": "2025-01-01",
      "period_end": "2025-01-31"
    },
    "alerts": [
      {
        "resource": "whatsapp",
        "level": "warning",
        "message": "Estás cerca del límite de mensajes WhatsApp mensuales (250/258 - 97%)"
      },
      {
        "resource": "bookings",
        "level": "info",
        "message": "Has usado 93% de tu cuota de reservas mensuales"
      }
    ],
    "has_critical_alerts": false
  }
}
```

**Niveles de alerta**:
- `critical`: ≥100% (límite alcanzado)
- `warning`: ≥90% (muy cerca)
- `info`: ≥80% (acercándose)

**Uso**:
- Widget de dashboard principal
- Notificaciones proactivas
- Call-to-action para upgrade

---

## 🛠️ Servicios

### UsageTrackingService

**Archivo**: `applications/subscriptions/services/usage_tracking.py`

Servicio centralizado para gestión de uso.

#### Métodos Principales

##### `get_or_create_current_usage(business)`

```python
usage = UsageTrackingService.get_or_create_current_usage(business)
```

**Responsabilidades**:
1. Usa timezone del negocio para cálculos precisos
2. Crea Usage si no existe para el período actual
3. **Detecta cambio de mes** y archiva automáticamente
4. Retorna Usage actualizado

**Detección de cambio de mes**:
```python
if usage.period_start != period_start:
    # Cambió el mes → archivar y resetear
    UsageTrackingService._archive_and_reset(usage, period_start, period_end)
```

##### `increment_bookings(business)`

```python
try:
    usage = UsageTrackingService.increment_bookings(business)
except QuotaExceededError as e:
    # Límite alcanzado
```

**Flujo**:
1. `select_for_update()` - Lock de base de datos
2. Validar suscripción activa
3. Obtener límites efectivos (con prorateo)
4. Validar: `current_count >= limit` → error
5. Incremento atómico con F() expression

##### `increment_whatsapp(business)`

Idéntico a `increment_bookings` pero para WhatsApp.

##### `increment_email(business)`

Sin validación de límite (ilimitado).

##### `update_resource_counts(business)`

```python
UsageTrackingService.update_resource_counts(business)
```

Recalcula contadores permanentes:
- `branches_count`: cuenta branches activas
- `professionals_count`: cuenta professionals activos

Llamado automáticamente por signals cuando se crea/elimina Branch o Professional.

##### `_archive_and_reset(usage, new_period_start, new_period_end)` (privado)

**Flujo de archivado**:
```python
1. Lock explícito: usage = Usage.objects.select_for_update().get(pk=usage.pk)
2. Calcular overages:
   - overage_bookings = max(0, usage.bookings_count - plan_max)
   - overage_whatsapp = max(0, usage.whatsapp - plan_max)
3. Contar bookings completadas/canceladas del período
4. Crear UsageHistory con snapshot completo
5. Resetear contadores mensuales:
   - usage.bookings_count = 0
   - usage.whatsapp_messages_sent = 0
   - usage.email_messages_sent = 0
6. Mantener contadores permanentes (branches, professionals)
7. Actualizar period_start y period_end
8. Guardar Usage
```

**Lock explícito**: Previene que múltiples requests simultáneos en el primer día del mes creen duplicados de UsageHistory.

---

### BranchService

**Archivo**: `applications/organizations/services/branch_service.py`

##### `validate_branch_quota(business)`

Valida cuota sin incrementar contador.

##### `create_branch(data, user)`

Crea sucursal con validación previa.

---

### BookingService

**Archivo**: `applications/appointments/services/booking_service.py`

##### `create_booking(validated_data, user)`

Crea reserva con todas las validaciones.

##### `_validate_booking_quota(business)` (privado)

Wrapper que convierte excepciones de UsageTrackingService a BookingValidationError.

##### `validate_slot_available(professional, service, date, start_time, business_id)`

Validación de disponibilidad (extraída de PublicBookingCreateView).

##### `validate_no_duplicate_booking(business, customer, professional, service, date)`

Prevención de duplicados (extraída de PublicBookingCreateView).

---

## 📐 ~~Prorateo de Cuotas~~ (ELIMINADO)

### ⚠️ Importante: Ya no hay prorateo

**Decisión de diseño**: El sistema **NO aplica prorateo**.

**Antes (con prorateo)**:
- Si un negocio contrataba el día 15, tenía límites reducidos el primer mes
- Bookings y WhatsApp se prorrateaban según días disponibles
- Ejemplo: Plan 500 → Primer mes 274 (días 15-31)

**Ahora (sin prorateo)**:
- ✅ Límites completos desde el día 1
- ✅ Si contratas el día 15, tienes el límite completo hasta fin de mes
- ✅ Más simple para el usuario

**Beneficios de no tener prorateo**:
1. **Más simple**: Usuario no necesita entender cálculos proporcionales
2. **Mejor UX**: Límites completos desde el inicio
3. **Menos código**: Sin lógica de `is_first_month()` ni cálculos de proporción

**Sistema de addons como alternativa**:
- Si el negocio necesita más cuota, puede comprar addons
- Addons permanentes (WhatsApp) no expiran
- Addons mensuales se suman al plan base

---

## 🔄 Reset Mensual Automático

### Tarea Celery

**Archivo**: `applications/subscriptions/tasks.py`

```python
@shared_task(
    bind=True,
    max_retries=5,
    default_retry_delay=60 * 5  # 5 minutos
)
def monthly_usage_reset(self):
    """
    Tarea programada para ejecutarse el día 1 de cada mes a las 00:00.

    Archiva el mes anterior y resetea contadores mensuales.
    """
    from applications.organizations.models import Business

    businesses = Business.objects.filter(is_active=True)

    stats = {
        'total': businesses.count(),
        'success': 0,
        'errors': 0,
        'skipped': 0
    }

    for business in businesses:
        try:
            # Esto detecta automáticamente cambio de mes y archiva
            UsageTrackingService.get_or_create_current_usage(business)
            stats['success'] += 1
        except Exception as e:
            logger.error(f"Error resetting usage for {business.name}: {e}")
            stats['errors'] += 1

    return stats
```

### Configuración de Celery Beat

**Archivo**: `config/settings.py`

```python
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'monthly-usage-reset': {
        'task': 'applications.subscriptions.tasks.monthly_usage_reset',
        'schedule': crontab(
            day_of_month='1',  # Día 1 del mes
            hour='0',          # Medianoche
            minute='0'
        ),
    },
}
```

### Alternativa: Reset Distribuido

Para evitar pico de carga en sistemas grandes (1000+ negocios):

```python
@shared_task
def monthly_usage_reset_distributed():
    """
    Distribuye el reset a lo largo de la primera hora del mes.
    """
    from applications.organizations.models import Business
    import random

    businesses = Business.objects.filter(is_active=True)

    for business in businesses:
        # Delay aleatorio entre 0-60 minutos
        delay_seconds = random.randint(0, 3600)

        reset_single_business.apply_async(
            args=[business.id],
            countdown=delay_seconds
        )
```

### Reset Manual (Management Command)

```bash
python manage.py reset_usage_for_business --business-id=1
```

Útil para:
- Testing
- Corrección manual
- Debugging

---

## 🔒 Race Conditions y Seguridad

### Problema: Condiciones de Carrera

**Escenario**: Dos usuarios intentan crear una reserva simultáneamente cuando solo queda 1 slot disponible.

```
Thread 1: Lee bookings_count = 499 (límite 500)
Thread 2: Lee bookings_count = 499 (límite 500)
Thread 1: Valida 499 < 500 ✅ → Incrementa a 500
Thread 2: Valida 499 < 500 ✅ → Incrementa a 501 ❌ SOBREPASÓ
```

### Solución 1: Database Lock

```python
usage = Usage.objects.select_for_update().get(business=business)
```

**Efecto**: Thread 2 espera hasta que Thread 1 termine la transacción.

```
Thread 1: Lock usage → lee 499 → valida → incrementa a 500 → unlock
Thread 2: Espera... → Lock usage → lee 500 → valida → ERROR ✅
```

### Solución 2: F() Expressions

```python
Usage.objects.filter(pk=usage.pk).update(
    bookings_count=F('bookings_count') + 1
)
```

**Ventaja**: Operación atómica a nivel de base de datos.

```sql
-- En vez de:
SELECT bookings_count FROM usage WHERE id = 1;  -- 499
-- Python calcula 499 + 1 = 500
UPDATE usage SET bookings_count = 500 WHERE id = 1;

-- Se hace:
UPDATE usage SET bookings_count = bookings_count + 1 WHERE id = 1;
-- Todo en una query atómica
```

### Implementación Completa

```python
@staticmethod
@transaction.atomic  # Transacción
def increment_bookings(business):
    # 1. Lock explícito
    usage = Usage.objects.select_for_update().get(business=business)

    # 2. Validar límite
    if usage.bookings_count >= max_limit:
        raise QuotaExceededError(...)

    # 3. Incremento atómico
    Usage.objects.filter(pk=usage.pk).update(
        bookings_count=F('bookings_count') + 1
    )

    # 4. Refresh para tener valor actualizado
    usage.refresh_from_db()
    return usage
```

### Race Condition en Transición de Mes

**Problema**: Múltiples requests a las 00:00:01 del día 1 del mes.

```
Request 1: Detecta cambio de mes → crea UsageHistory
Request 2: Detecta cambio de mes → crea UsageHistory DUPLICADO ❌
```

**Solución**:

```python
@transaction.atomic
def _archive_and_reset(usage, new_period_start, new_period_end):
    # Lock ANTES de crear UsageHistory
    usage = Usage.objects.select_for_update().get(pk=usage.pk)

    # Solo el primer request pasará, los demás esperarán
    # y verán que period_start ya cambió

    UsageHistory.objects.create(...)
```

**Constraint adicional**:
```python
class Meta:
    unique_together = [["business", "period_year", "period_month"]]
```

Si falla el lock, el constraint evita duplicados a nivel de DB.

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear Sucursal con Validación

```python
# Vista o Serializer
from applications.organizations.services.branch_service import (
    BranchService,
    BranchValidationError
)

try:
    branch = BranchService.create_branch(
        data={
            'business': business,
            'name': 'Sucursal Centro',
            'address': 'Calle Principal 123'
        },
        user=request.user
    )
except BranchValidationError as e:
    return ApiResponse.error(message=str(e), code=400)
except ValueError as e:  # Sin suscripción
    return ApiResponse.error(message=str(e), code=403)
```

### Ejemplo 2: Validar Feature Habilitada

```python
subscription = Subscription.get_active_for_business(business)

if not subscription:
    return ApiResponse.error(message="No hay suscripción activa", code=403)

if not subscription.plan.whatsapp_enabled:
    return ApiResponse.error(
        message="Tu plan no incluye WhatsApp. Upgradea para activarlo.",
        code=403
    )

# Proceder a enviar WhatsApp
send_whatsapp_message(...)
```

### Ejemplo 3: Mostrar Progress Bar en Frontend

```javascript
// Llamar al endpoint
const response = await fetch('/api/v1/subscriptions/usage/');
const { data } = await response.json();

// Renderizar progress bar
const bookingsPercentage = data.usage_percentages.bookings;
const bookingsUsed = data.bookings_count;
const subscription = data.subscription;
const limits = await getSubscriptionLimits(); // Otro endpoint

<ProgressBar
  percentage={bookingsPercentage}
  current={bookingsUsed}
  max={limits.effective_limits.bookings}
  label="Reservas del mes"
  color={bookingsPercentage >= 90 ? 'red' : 'blue'}
/>

{bookingsPercentage >= 90 && (
  <Alert type="warning">
    Estás cerca del límite de reservas.
    <Link to="/upgrade">Upgradea tu plan</Link>
  </Alert>
)}
```

### Ejemplo 4: Notificación Proactiva

```python
# En un middleware o decorator
def check_quota_alerts(business):
    """
    Envía email si se alcanza 90% de cualquier cuota.
    """
    usage = Usage.objects.get(business=business)
    subscription = Subscription.get_active_for_business(business)

    limits = subscription.get_effective_limits()

    alerts = []

    # Bookings
    if limits['bookings']:
        percentage = (usage.bookings_count / limits['bookings']) * 100
        if percentage >= 90:
            alerts.append(f"Reservas: {percentage:.0f}%")

    # WhatsApp
    if limits['whatsapp']:
        percentage = (usage.whatsapp_messages_sent / limits['whatsapp']) * 100
        if percentage >= 90:
            alerts.append(f"WhatsApp: {percentage:.0f}%")

    if alerts:
        send_quota_alert_email(business.owner.email, alerts)
```

---

## 🎯 Recomendaciones

### ✅ Implementadas

1. **✅ Validación de cuotas para Branches**
   - Ahora branches tienen la misma validación que professionals

2. **✅ Endpoints de API completos**
   - Frontend puede mostrar uso, límites y estadísticas

3. **✅ Lógica común centralizada**
   - `validate_slot_available()` y `validate_no_duplicate_booking()` reutilizables

4. **✅ Manejo estricto de excepciones**
   - Diferencia entre `QuotaExceededError` y `ValueError` (sin suscripción)

5. **✅ Locks explícitos**
   - `select_for_update()` en transiciones críticas

6. **✅ Timezone del negocio**
   - Cálculos precisos para negocios en diferentes zonas horarias

---

### ✅ Funcionalidades Implementadas

#### 1. Sistema de Addons ✅

**Estado actual**: ✅ Completamente funcional

**Características implementadas**:
- ✅ Addons permanentes (WhatsApp) - Se consumen hasta agotar, no se resetean
- ✅ Addons mensuales (Profesionales, Branches) - Se suman al límite del plan
- ✅ Múltiples addons del mismo tipo permitidos
- ✅ AddonUsage para tracking de consumo de permanentes
- ✅ Consumo FIFO de addons permanentes
- ✅ Soft block cuando addon mensual expira
- ✅ API endpoint `addons-summary` para catálogo + comprados

**Documentación**:
- `docs/ADDON_SYSTEM.md` - Documentación completa
- `docs/flows/ADDON_FLOWS.md` - Diagramas de flujo
- `docs/API_ADDONS_SUMMARY.md` - API endpoint

**Ventajas**:
- ✅ Upsell flexible sin cambiar de plan
- ✅ Packs de WhatsApp permanentes
- ✅ Addons mensuales para escalar recursos

---

### 🔮 Futuras Mejoras (No Urgentes)

---

#### 2. Notificaciones Proactivas

**Recomendación**: Alertas automáticas cuando cuota alcance umbrales.

```python
# Celery task diaria
@shared_task
def check_quota_warnings():
    """
    Revisa todos los negocios y envía alertas si:
    - 80%: Notificación informativa
    - 90%: Advertencia
    - 100%: Límite alcanzado
    """
    from applications.subscriptions.models import Usage, Subscription

    usages = Usage.objects.select_related('business')

    for usage in usages:
        subscription = Subscription.get_active_for_business(usage.business)
        if not subscription:
            continue

        limits = subscription.get_effective_limits()

        # Revisar bookings
        if limits['bookings']:
            percentage = (usage.bookings_count / limits['bookings']) * 100

            if percentage >= 100 and not usage.business.alerted_bookings_100:
                send_critical_alert(usage.business, 'bookings')
                usage.business.alerted_bookings_100 = True
            elif percentage >= 90 and not usage.business.alerted_bookings_90:
                send_warning_alert(usage.business, 'bookings', percentage)
                usage.business.alerted_bookings_90 = True
```

**Campos a agregar en Business**:
```python
alerted_bookings_80 = BooleanField(default=False)
alerted_bookings_90 = BooleanField(default=False)
alerted_bookings_100 = BooleanField(default=False)
# Resetear en cada cambio de mes
```

---

#### 3. Rollover de Cuotas No Usadas

**Concepto**: Si un negocio solo usó 200/500 bookings, acumular 300 para el siguiente mes.

```python
# En _archive_and_reset()
unused_bookings = max(0, plan_max_bookings - usage.bookings_count)

if subscription.plan.allows_rollover:  # Feature premium
    max_rollover = plan_max_bookings * 0.5  # Máximo 50%
    rollover = min(unused_bookings, max_rollover)

    # Guardar en UsageHistory para referencia
    history.rollover_bookings = rollover

    # Aplicar en nuevo mes
    usage.bookings_count = rollover  # Empieza con rollover
```

**Ventajas**:
- Incentiva planes anuales
- Feature premium diferenciador
- Mayor flexibilidad para clientes

---

#### 4. Límite de Emails

**Estado actual**: Ilimitado.

**Recomendación**: Agregar límite para planes básicos.

```python
# En Plan
max_email_per_month = PositiveIntegerField(null=True, blank=True)

# En UsageTrackingService.increment_email()
if max_email is not None and usage.email_messages_sent >= max_email:
    raise QuotaExceededError("Límite de emails alcanzado")
```

---

#### 5. Analytics y Reportes

**Recomendación**: Dashboard de analytics.

```
GET /api/v1/subscriptions/analytics/
```

**Response**:
```json
{
  "trends": {
    "bookings": {
      "current_month": 450,
      "last_month": 380,
      "change_percentage": 18.4,
      "trend": "up"
    }
  },
  "predictions": {
    "bookings_projected_end_of_month": 580,
    "will_exceed_limit": true,
    "recommended_action": "upgrade_plan"
  },
  "top_usage_days": [
    {"date": "2025-01-22", "bookings": 35},
    {"date": "2025-01-15", "bookings": 30}
  ]
}
```

---

#### 6. Validación en Availability Endpoints

**Problema actual**: Usuario puede ver slots disponibles aunque ya alcanzó límite de bookings.

**Recomendación**: Incluir validación de cuota en respuesta.

```python
# En AvailabilityService.get_available_slots()
def get_available_slots(professional, date, business):
    slots = calculate_slots(professional, date)

    # Agregar info de cuota
    subscription = Subscription.get_active_for_business(business)
    usage = Usage.objects.get(business=business)
    limits = subscription.get_effective_limits()

    quota_warning = None
    if limits['bookings']:
        remaining = limits['bookings'] - usage.bookings_count
        if remaining <= 0:
            quota_warning = "Has alcanzado tu límite de reservas"
        elif remaining <= 5:
            quota_warning = f"Solo te quedan {remaining} reservas disponibles"

    return {
        'slots': slots,
        'quota_warning': quota_warning
    }
```

---

#### 7. Webhook de Overages

**Recomendación**: Notificar cuando se detectan overages en UsageHistory.

```python
# En _archive_and_reset()
if overage_bookings > 0 or overage_whatsapp > 0:
    # Webhook a sistema de billing
    notify_overage_webhook(
        business_id=business.id,
        period=f"{period_year}-{period_month}",
        overages={
            'bookings': overage_bookings,
            'whatsapp': overage_whatsapp
        }
    )

    # Email al owner
    send_overage_notification_email(
        business.owner.email,
        overages
    )
```

---

#### 8. Soft Limits vs Hard Limits

**Concepto**: Permitir exceder límite con cobro adicional.

```python
class Plan:
    # Existente
    max_bookings_per_month = PositiveIntegerField()

    # Nuevo
    allow_overages = BooleanField(default=False)
    overage_price_per_booking = DecimalField(default=0)  # $0.50 por booking extra
```

**Lógica**:
```python
if usage.bookings_count >= max_bookings:
    if subscription.plan.allow_overages:
        # Permitir pero registrar overage
        usage.overage_bookings += 1
        # Facturar al final del mes
    else:
        # Hard limit
        raise QuotaExceededError(...)
```

---

## 🐛 Troubleshooting

### Problema 1: "No tienes una suscripción activa"

**Síntomas**: No se pueden crear profesionales, sucursales o reservas.

**Causas posibles**:
1. Subscription con `status != 'active'`
2. Subscription con `is_active = False`
3. `expires_at` en el pasado
4. No existe registro de Subscription

**Solución**:
```python
# Verificar en Django Admin o shell
from applications.subscriptions.models import Subscription

subscription = Subscription.get_active_for_business(business)

if not subscription:
    # Crear suscripción
    plan = Plan.objects.get(slug='basico')
    subscription = Subscription.objects.create(
        business=business,
        plan=plan,
        status=Subscription.Status.ACTIVE
    )
```

---

### Problema 2: Contadores de Usage incorrectos

**Síntomas**: `branches_count` no coincide con sucursales reales.

**Causas**:
- Branches borradas sin actualizar Usage
- Signal no se ejecutó

**Solución**:
```python
# Recalcular manualmente
from applications.subscriptions.services import UsageTrackingService

UsageTrackingService.update_resource_counts(business)
```

---

### Problema 3: UsageHistory duplicado

**Síntomas**: Constraint violation `unique_together` en (business, year, month).

**Causas**:
- Race condition en transición de mes
- Reset manual ejecutado dos veces

**Solución**:
```python
# Eliminar duplicado (conservar el más reciente)
from applications.subscriptions.models import UsageHistory

duplicates = UsageHistory.objects.filter(
    business=business,
    period_year=2025,
    period_month=1
).order_by('-created')

# Conservar primero, eliminar resto
for h in duplicates[1:]:
    h.delete()
```

**Prevención**: El lock `select_for_update()` ya está implementado.

---

### Problema 4: Addons no se están sumando

**Síntomas**: Límites efectivos no incluyen addons mensuales.

**Causas**:
- Addon `is_active = False`
- Addon expiró (`expires_at` en el pasado)
- Addon es permanente (WhatsApp) en vez de mensual

**Verificación**:
```python
subscription = Subscription.objects.get(id=1)

# Ver addons activos
addons = SubscriptionAddon.objects.filter(
    subscription=subscription,
    is_active=True
)

for sa in addons:
    print(f"{sa.addon.name}: {sa.addon.resource_type}, expires: {sa.expires_at}")

limits = subscription.get_effective_limits()
print(limits)
```

**Solución**:
```python
# Activar addon si está inactivo
addon.is_active = True
addon.save()

# O extender expiración
addon.expires_at = timezone.now() + timedelta(days=30)
addon.save()
```

---

### Problema 5: Celery task no resetea

**Síntomas**: Llegó el día 1 del mes y Usage no se reseteó.

**Causas**:
- Celery Beat no está corriendo
- Tarea no está registrada en `CELERY_BEAT_SCHEDULE`

**Verificación**:
```bash
# Ver tareas programadas
celery -A config inspect scheduled

# Ver logs de Celery
tail -f celery.log | grep monthly_usage_reset
```

**Solución**:
```bash
# Reiniciar Celery Beat
pkill -f 'celery beat'
celery -A config beat --loglevel=info

# Ejecutar manualmente
python manage.py shell
>>> from applications.subscriptions.tasks import monthly_usage_reset
>>> monthly_usage_reset.delay()
```

---

### Problema 6: Timezone incorrecto

**Síntomas**: Usage se resetea a hora incorrecta (ej: 5 AM en vez de 00:00).

**Causas**:
- `business.timezone` incorrecto
- Celery usando UTC en vez de timezone del negocio

**Solución**:
```python
# Verificar timezone del negocio
business.timezone  # Debe ser 'America/Mexico_City', etc.

# Actualizar si es incorrecto
business.timezone = 'America/Bogota'
business.save()

# El servicio ya usa business.timezone desde la implementación actual
```

---

## 📚 Referencias

### Archivos Clave

- **Modelos**: `applications/subscriptions/models/`
- **Servicios**: `applications/subscriptions/services/usage_tracking.py`
- **API Views**: `applications/subscriptions/api_views.py`
- **Serializers**: `applications/subscriptions/serializers.py`
- **URLs**: `applications/subscriptions/urls.py`
- **Tasks**: `applications/subscriptions/tasks.py`
- **Signals**: `applications/subscriptions/signals.py`

### Documentos Relacionados

- `CLAUDE.md`: Dominio funcional completo del SaaS
- `BOOKING_CREATE_API.md`: Validaciones de bookings
- `PUBLIC_BOOKING_MANAGEMENT.md`: API pública de reservas
- `CELERY_INSTALL.md`: Configuración de Celery

---

## 🎓 Conclusión

El módulo de suscripciones es el **control central** del SaaS. Garantiza que:

✅ Cada negocio respete los límites de su plan
✅ Las validaciones sean atómicas y seguras
✅ El prorateo sea justo en el primer mes
✅ Los datos históricos se preserven para auditoría
✅ El frontend tenga visibilidad completa del uso

**Todo está centralizado, simple y seguro. Listo para producción.** 🚀
