# Documentación de Modelos del Sistema de Reservas

Este documento detalla todos los modelos del sistema agrupados por aplicación, incluyendo sus campos, tipos de datos y restricciones de nulidad.

---

## Campos Base (BaseModel)

Todos los modelos heredan de `BaseModel` que incluye:

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `id` | CharField(26) | NO | ULID generado automáticamente (Primary Key) |
| `created` | DateTimeField | NO | Fecha y hora de creación (auto_now_add) |
| `modified` | DateTimeField | NO | Fecha y hora de última modificación (auto_now) |
| `is_active` | BooleanField | NO | Flag para soft delete (default=True) |
| `created_by` | ForeignKey(User) | SÍ | Usuario que creó el registro |
| `updated_by` | ForeignKey(User) | SÍ | Usuario que actualizó el registro |

---

## 1. App: `users`

### Model: `User`

Extiende `AbstractBaseUser`, `PermissionsMixin` y `BaseModel`.

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `role` | CharField(20) | NO | Rol del usuario (SUPERADMIN, OWNER, STAFF, CUSTOMER) |
| `username` | CharField(150) | NO | Nombre de usuario único |
| `dni` | CharField(16) | SÍ | DNI o CE único |
| `first_name` | CharField(150) | NO | Nombres |
| `last_name` | CharField(150) | NO | Apellido paterno |
| `mother_last_name` | CharField(150) | SÍ | Apellido materno (blank=True) |
| `email` | EmailField | NO | Correo electrónico único |
| `business` | ForeignKey(Business) | SÍ | Negocio al que pertenece |
| `profile_picture` | ImageField | SÍ | Foto de perfil |
| `last_password_change` | DateTimeField | SÍ | Último cambio de contraseña |
| `password_change_required` | BooleanField | NO | Requiere cambio de contraseña (default=False) |
| `is_active` | BooleanField | NO | Usuario activo (default=True) |
| `is_staff` | BooleanField | NO | Usuario staff (default=False) |
| `password` | CharField | NO | Contraseña hasheada |

#### UserSerializer - Campos Básicos
- `id`, `username`, `first_name`, `last_name`, `mother_last_name`, `password` (write_only)
- `email`, `role`, `role_display` (read_only), `is_active`, `business`, `profile_picture`
- `created`, `modified`, `created_by`, `updated_by`

#### UserDetailSerializer - Campos Adicionales
- Todos los campos de UserSerializer excepto `password`
- `business_model` (SerializerMethodField) - Objeto Business completo

---

## 2. App: `organizations`

### Model: `Category`

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `name` | CharField(100) | NO | Nombre de la categoría |
| `description` | TextField | SÍ | Descripción |
| `logo` | ImageField | SÍ | Logo de la categoría |

#### CategorySerializer
- Campos: `__all__` (todos los campos del modelo + campos base)

---

### Model: `Business`

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `name` | CharField(100) | NO | Nombre del negocio |
| `category` | ForeignKey(Category) | NO | Categoría del negocio |
| `logo` | ImageField | SÍ | Logo del negocio |
| `phone` | CharField(20) | SÍ | Teléfono |
| `timezone` | CharField(50) | NO | Zona horaria (default="America/Lima") |
| `owner` | ForeignKey(User) | NO | Propietario del negocio |

#### BusinessSerializer - Campos Básicos
- `__all__` (todos los campos del modelo + campos base)

#### BusinessDetailSerializer - Campos Adicionales
- Todos los campos de BusinessSerializer
- `category_model` (CategorySerializer) - Objeto Category completo
- `owner_model` (UserSerializer) - Objeto User completo

---

### Model: `Branch`

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `business` | ForeignKey(Business) | NO | Negocio al que pertenece |
| `name` | CharField(100) | NO | Nombre de la sucursal |
| `address` | CharField(255) | SÍ | Dirección |
| `phone` | CharField(20) | SÍ | Teléfono |

#### BranchSerializer - Campos Básicos
- `__all__` (todos los campos del modelo + campos base)

#### BranchDetailSerializer - Campos Adicionales
- Todos los campos de BranchSerializer
- `business_model` (BusinessSerializer) - Objeto Business completo

---

## 3. App: `services_catalog`

### Model: `Service`

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `business` | ForeignKey(Business) | NO | Negocio al que pertenece |
| `name` | CharField(100) | NO | Nombre del servicio |
| `description` | TextField | SÍ | Descripción |
| `price` | DecimalField(10,2) | NO | Precio del servicio |
| `duration_minutes` | PositiveIntegerField | NO | Duración en minutos |

#### ServiceSerializer - Campos Básicos
- `__all__` (todos los campos del modelo + campos base)

#### ServiceDetailSerializer - Campos Adicionales
- Todos los campos de ServiceSerializer
- `business_model` (BusinessSerializer) - Objeto Business completo

---

## 4. App: `professionals`

### Model: `Professional`

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `branch` | ForeignKey(Branch) | NO | Sucursal a la que pertenece |
| `name` | CharField(100) | NO | Nombre |
| `last_name` | CharField(100) | NO | Apellido |
| `email` | EmailField | SÍ | Email |
| `description` | TextField | SÍ | Descripción/biografía |
| `profile_photo` | ImageField | SÍ | Foto de perfil |
| `services` | ManyToManyField(Service) | - | Servicios que ofrece (relación M2M) |

#### ProfessionalSerializer - Campos Básicos
- `__all__` (todos los campos del modelo + campos base)

#### ProfessionalDetailSerializer - Campos Adicionales
- Todos los campos de ProfessionalSerializer
- `branch_model` (BranchSerializer) - Objeto Branch completo
- `services_model` (ServiceSerializer, many=True) - Lista de objetos Service

---

## 5. App: `schedules`

### Model: `ProfessionalWeeklyAvailability`

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `professional` | ForeignKey(Professional) | NO | Profesional |
| `day_of_week` | PositiveSmallIntegerField | NO | Día de la semana (0=Lunes, 6=Domingo) |
| `start_time` | TimeField | NO | Hora de inicio |
| `end_time` | TimeField | NO | Hora de fin |
| `break_start_time` | TimeField | SÍ | Inicio de descanso |
| `break_end_time` | TimeField | SÍ | Fin de descanso |

#### ProfessionalWeeklyAvailabilitySerializer - Campos Básicos
- `__all__` (todos los campos del modelo + campos base)

#### ProfessionalWeeklyAvailabilityDetailSerializer - Campos Adicionales
- Todos los campos de ProfessionalWeeklyAvailabilitySerializer
- `professional_model` (ProfessionalSerializer) - Objeto Professional completo

---

### Model: `ProfessionalAvailabilityException`

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `professional` | ForeignKey(Professional) | NO | Profesional |
| `date` | DateField | NO | Fecha específica |
| `status` | CharField(20) | NO | Estado (available/unavailable) |
| `start_time` | TimeField | SÍ | Hora de inicio (null si unavailable) |
| `end_time` | TimeField | SÍ | Hora de fin (null si unavailable) |
| `break_start_time` | TimeField | SÍ | Inicio de descanso |
| `break_end_time` | TimeField | SÍ | Fin de descanso |
| `notes` | TextField | SÍ | Notas adicionales |

**Choices del campo `status`:**
- `available`: Disponible
- `unavailable`: No Disponible

#### ProfessionalAvailabilityExceptionSerializer - Campos Básicos
- `__all__` (todos los campos del modelo + campos base)

#### ProfessionalAvailabilityExceptionDetailSerializer - Campos Adicionales
- Todos los campos de ProfessionalAvailabilityExceptionSerializer
- `professional_model` (ProfessionalSerializer) - Objeto Professional completo

---

## 6. App: `customers`

### Model: `Customer`

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `business` | ForeignKey(Business) | NO | Negocio al que pertenece |
| `full_name` | CharField(200) | NO | Nombre completo |
| `phone` | CharField(20) | NO | Teléfono |
| `email` | EmailField | SÍ | Email |

#### CustomerSerializer - Campos Básicos
- `__all__` (todos los campos del modelo + campos base)

#### CustomerDetailSerializer - Campos Adicionales
- Todos los campos de CustomerSerializer
- `business_model` (BusinessSerializer) - Objeto Business completo

---

## 7. App: `appointments`

### Model: `Booking`

| Campo | Tipo | Null | Descripción |
|-------|------|------|-------------|
| `business` | ForeignKey(Business) | NO | Negocio |
| `branch` | ForeignKey(Branch) | NO | Sucursal |
| `professional` | ForeignKey(Professional) | NO | Profesional que atiende |
| `service` | ForeignKey(Service) | NO | Servicio reservado |
| `customer` | ForeignKey(Customer) | NO | Cliente |
| `date` | DateField | NO | Fecha de la reserva |
| `start_time` | TimeField | NO | Hora de inicio |
| `end_time` | TimeField | NO | Hora de fin |
| `status` | CharField(20) | NO | Estado de la reserva |
| `notes` | TextField | SÍ | Notas adicionales |

**Choices del campo `status`:**
- `pending`: Pendiente
- `confirmed`: Confirmada
- `cancelled`: Cancelada
- `completed`: Completada

#### BookingSerializer - Campos Básicos
- `__all__` (todos los campos del modelo + campos base)

#### BookingDetailSerializer - Campos Adicionales
- Todos los campos de BookingSerializer
- `business_model` (BusinessSerializer) - Objeto Business completo
- `branch_model` (BranchSerializer) - Objeto Branch completo
- `professional_model` (ProfessionalSerializer) - Objeto Professional completo
- `service_model` (ServiceSerializer) - Objeto Service completo
- `customer_model` (CustomerSerializer) - Objeto Customer completo

---

## Notas Importantes

1. **Todos los modelos heredan de BaseModel** excepto `User` que hereda de `AbstractBaseUser` y `PermissionsMixin` (pero también de `BaseModel`).

2. **IDs tipo ULID**: Todos los modelos usan IDs de 26 caracteres generados automáticamente (ULID).

3. **Soft Delete**: El campo `is_active` permite desactivar registros sin eliminarlos físicamente.

4. **Auditoría automática**: Los campos `created_by` y `updated_by` se asignan automáticamente cuando se usa `AuditFieldsViewMixin` en las vistas.

5. **DetailSerializers**: Cuando un serializer tiene el sufijo "Detail", incluye objetos relacionados completos usando `SerializerMethodField` o `source`.

6. **Campos `__all__`**: Cuando un serializer usa `fields = "__all__"`, incluye todos los campos del modelo más los campos heredados de BaseModel.

7. **Relaciones Many-to-Many**: El modelo `Professional` tiene una relación M2M con `Service` a través del campo `services`.

8. **Cascada de eliminación**:
   - Business → Branch, Service, Customer, Booking (CASCADE)
   - Branch → Professional, Booking (CASCADE)
   - Professional → WeeklyAvailability, AvailabilityException, Booking (CASCADE)
   - Service → Booking (PROTECT)
   - Customer → Booking (CASCADE)
   - Category → Business (PROTECT)
   - User(owner) → Business (PROTECT)
