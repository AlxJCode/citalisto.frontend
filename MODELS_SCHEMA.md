# Schema de Modelos del Sistema de Reservas

Este documento contiene todos los modelos del sistema, sus campos, relaciones y los campos adicionales generados por los serializers para representación detallada.

---

## 1. User
**App:** `users`
**Tabla:** `users_user`
**Hereda de:** `AbstractBaseUser`, `PermissionsMixin`, `BaseModel`

### Campos del Modelo

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | AutoField | ID único (heredado de BaseModel) | PK, Auto-increment |
| `username` | CharField | Nombre de usuario | max_length=150, unique=True |
| `dni` | CharField | DNI o CE | max_length=16, unique=True, null=True, blank=True |
| `first_name` | CharField | Nombres | max_length=150 |
| `last_name` | CharField | Apellido paterno | max_length=150 |
| `mother_last_name` | CharField | Apellido materno | max_length=150, blank=True |
| `email` | EmailField | Correo electrónico | unique=True |
| `business` | ForeignKey | Negocio asociado | FK → Business, null=True, blank=True, on_delete=SET_NULL |
| `role` | CharField | Rol del usuario | Choices: SUPERADMIN, OWNER, STAFF, CUSTOMER, default=CUSTOMER |
| `profile_picture` | ImageField | Foto de perfil | upload_to=user_profile_picture_path, null=True, blank=True |
| `last_password_change` | DateTimeField | Último cambio de contraseña | null=True, blank=True |
| `password_change_required` | BooleanField | Requiere cambio de contraseña | default=False |
| `is_active` | BooleanField | Usuario activo | default=True |
| `is_staff` | BooleanField | Es staff de Django | default=False |
| `created` | DateTimeField | Fecha de creación (heredado) | auto_now_add=True |
| `modified` | DateTimeField | Fecha de modificación (heredado) | auto_now=True |
| `created_by` | ForeignKey | Creado por (heredado) | FK → User, null=True, blank=True |
| `updated_by` | ForeignKey | Actualizado por (heredado) | FK → User, null=True, blank=True |

### Campos Adicionales del Serializer (DetailSerializer)

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `role_display` | `get_role_display()` | Nombre legible del rol |
| `business_model` | SerializerMethodField | Objeto completo Business serializado |

---

## 2. Category
**App:** `organizations`
**Tabla:** `organizations_category`
**Hereda de:** `BaseModel`

### Campos del Modelo

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | AutoField | ID único | PK |
| `name` | CharField | Nombre de la categoría | max_length=100 |
| `description` | TextField | Descripción | blank=True, null=True |
| `logo` | ImageField | Logo de la categoría | upload_to="categories/logos/", blank=True, null=True |
| `created` | DateTimeField | Fecha de creación | auto_now_add=True |
| `modified` | DateTimeField | Fecha de modificación | auto_now=True |
| `created_by` | ForeignKey | Creado por | FK → User, null=True, blank=True |
| `updated_by` | ForeignKey | Actualizado por | FK → User, null=True, blank=True |

### Campos Adicionales del Serializer

No tiene campos adicionales (usa `__all__`)

---

## 3. Business
**App:** `organizations`
**Tabla:** `organizations_business`
**Hereda de:** `BaseModel`

### Campos del Modelo

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | AutoField | ID único | PK |
| `name` | CharField | Nombre del negocio | max_length=100 |
| `category` | ForeignKey | Categoría del negocio | FK → Category, on_delete=PROTECT, related_name="businesses" |
| `logo` | ImageField | Logo del negocio | upload_to="businesses/logos/", blank=True, null=True |
| `phone` | CharField | Teléfono | max_length=20, blank=True, null=True |
| `timezone` | CharField | Zona horaria | max_length=50, default="America/Mexico_City" |
| `owner` | ForeignKey | Propietario del negocio | FK → User, on_delete=PROTECT, related_name="owned_businesses" |
| `created` | DateTimeField | Fecha de creación | auto_now_add=True |
| `modified` | DateTimeField | Fecha de modificación | auto_now=True |
| `created_by` | ForeignKey | Creado por | FK → User, null=True, blank=True |
| `updated_by` | ForeignKey | Actualizado por | FK → User, null=True, blank=True |

### Campos Adicionales del Serializer (BusinessDetailSerializer)

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `category_model` | `category` | Objeto completo Category serializado |
| `owner_model` | SerializerMethodField | Objeto completo User (owner) serializado |

---

## 4. Branch
**App:** `organizations`
**Tabla:** `organizations_branch`
**Hereda de:** `BaseModel`

### Campos del Modelo

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | AutoField | ID único | PK |
| `business` | ForeignKey | Negocio al que pertenece | FK → Business, on_delete=CASCADE, related_name="branches" |
| `name` | CharField | Nombre de la sucursal | max_length=100 |
| `address` | CharField | Dirección | max_length=255, blank=True, null=True |
| `phone` | CharField | Teléfono | max_length=20, blank=True, null=True |
| `created` | DateTimeField | Fecha de creación | auto_now_add=True |
| `modified` | DateTimeField | Fecha de modificación | auto_now=True |
| `created_by` | ForeignKey | Creado por | FK → User, null=True, blank=True |
| `updated_by` | ForeignKey | Actualizado por | FK → User, null=True, blank=True |

### Campos Adicionales del Serializer (BranchDetailSerializer)

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `business_model` | `business` | Objeto completo Business serializado |

---

## 5. Service
**App:** `services_catalog`
**Tabla:** `services_catalog_service`
**Hereda de:** `BaseModel`

### Campos del Modelo

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | AutoField | ID único | PK |
| `business` | ForeignKey | Negocio al que pertenece | FK → Business, on_delete=CASCADE, related_name="services" |
| `name` | CharField | Nombre del servicio | max_length=100 |
| `description` | TextField | Descripción del servicio | blank=True, null=True |
| `price` | DecimalField | Precio | max_digits=10, decimal_places=2 |
| `duration_minutes` | PositiveIntegerField | Duración en minutos | - |
| `created` | DateTimeField | Fecha de creación | auto_now_add=True |
| `modified` | DateTimeField | Fecha de modificación | auto_now=True |
| `created_by` | ForeignKey | Creado por | FK → User, null=True, blank=True |
| `updated_by` | ForeignKey | Actualizado por | FK → User, null=True, blank=True |

### Campos Adicionales del Serializer (ServiceDetailSerializer)

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `business_model` | `business` | Objeto completo Business serializado |

---

## 6. Professional
**App:** `professionals`
**Tabla:** `professionals_professional`
**Hereda de:** `BaseModel`

### Campos del Modelo

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | AutoField | ID único | PK |
| `branch` | ForeignKey | Sucursal a la que pertenece | FK → Branch, on_delete=CASCADE, related_name="professionals" |
| `name` | CharField | Nombre | max_length=100 |
| `last_name` | CharField | Apellido | max_length=100 |
| `email` | EmailField | Email | blank=True, null=True |
| `description` | TextField | Descripción/Bio | blank=True, null=True |
| `profile_photo` | ImageField | Foto de perfil | upload_to="professionals/photos/", blank=True, null=True |
| `services` | ManyToManyField | Servicios que ofrece | M2M → Service, related_name="professionals", blank=True |
| `created` | DateTimeField | Fecha de creación | auto_now_add=True |
| `modified` | DateTimeField | Fecha de modificación | auto_now=True |
| `created_by` | ForeignKey | Creado por | FK → User, null=True, blank=True |
| `updated_by` | ForeignKey | Actualizado por | FK → User, null=True, blank=True |

### Campos Adicionales del Serializer (ProfessionalDetailSerializer)

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `branch_model` | `branch` | Objeto completo Branch serializado |
| `services_model` | `services` | Array de objetos Service serializados (many=True) |

---

## 7. Customer
**App:** `customers`
**Tabla:** `customers_customer`
**Hereda de:** `BaseModel`

### Campos del Modelo

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | AutoField | ID único | PK |
| `business` | ForeignKey | Negocio al que pertenece | FK → Business, on_delete=CASCADE, related_name="customers" |
| `full_name` | CharField | Nombre completo | max_length=200 |
| `phone` | CharField | Teléfono | max_length=20 |
| `email` | EmailField | Email | blank=True, null=True |
| `created` | DateTimeField | Fecha de creación | auto_now_add=True |
| `modified` | DateTimeField | Fecha de modificación | auto_now=True |
| `created_by` | ForeignKey | Creado por | FK → User, null=True, blank=True |
| `updated_by` | ForeignKey | Actualizado por | FK → User, null=True, blank=True |

### Campos Adicionales del Serializer (CustomerDetailSerializer)

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `business_model` | `business` | Objeto completo Business serializado |

---

## 8. Booking
**App:** `appointments`
**Tabla:** `appointments_booking`
**Hereda de:** `BaseModel`

### Campos del Modelo

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | AutoField | ID único | PK |
| `business` | ForeignKey | Negocio | FK → Business, on_delete=CASCADE, related_name="bookings" |
| `branch` | ForeignKey | Sucursal | FK → Branch, on_delete=CASCADE, related_name="bookings" |
| `professional` | ForeignKey | Profesional asignado | FK → Professional, on_delete=CASCADE, related_name="bookings" |
| `service` | ForeignKey | Servicio solicitado | FK → Service, on_delete=PROTECT, related_name="bookings" |
| `customer` | ForeignKey | Cliente | FK → Customer, on_delete=CASCADE, related_name="bookings" |
| `date` | DateField | Fecha de la reserva | - |
| `start_time` | TimeField | Hora de inicio | - |
| `end_time` | TimeField | Hora de fin | - |
| `status` | CharField | Estado de la reserva | Choices: pending, confirmed, cancelled, completed, default=pending |
| `notes` | TextField | Notas adicionales | blank=True, null=True |
| `created` | DateTimeField | Fecha de creación | auto_now_add=True |
| `modified` | DateTimeField | Fecha de modificación | auto_now=True |
| `created_by` | ForeignKey | Creado por | FK → User, null=True, blank=True |
| `updated_by` | ForeignKey | Actualizado por | FK → User, null=True, blank=True |

### Campos Adicionales del Serializer (BookingDetailSerializer)

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `business_model` | `business` | Objeto completo Business serializado |
| `branch_model` | `branch` | Objeto completo Branch serializado |
| `professional_model` | `professional` | Objeto completo Professional serializado |
| `service_model` | `service` | Objeto completo Service serializado |
| `customer_model` | `customer` | Objeto completo Customer serializado |

---

## 9. ProfessionalWeeklyAvailability
**App:** `schedules`
**Tabla:** `schedules_professionalweeklyavailability`
**Hereda de:** `BaseModel`

### Campos del Modelo

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | AutoField | ID único | PK |
| `professional` | ForeignKey | Profesional | FK → Professional, on_delete=CASCADE, related_name="weekly_availabilities" |
| `day_of_week` | PositiveSmallIntegerField | Día de la semana | 0=Lunes, 1=Martes, ..., 6=Domingo |
| `start_time` | TimeField | Hora de inicio | - |
| `end_time` | TimeField | Hora de fin | - |
| `break_start_time` | TimeField | Inicio de descanso | blank=True, null=True |
| `break_end_time` | TimeField | Fin de descanso | blank=True, null=True |
| `created` | DateTimeField | Fecha de creación | auto_now_add=True |
| `modified` | DateTimeField | Fecha de modificación | auto_now=True |
| `created_by` | ForeignKey | Creado por | FK → User, null=True, blank=True |
| `updated_by` | ForeignKey | Actualizado por | FK → User, null=True, blank=True |

### Campos Adicionales del Serializer (ProfessionalWeeklyAvailabilityDetailSerializer)

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `professional_model` | `professional` | Objeto completo Professional serializado |

---

## 10. ProfessionalAvailabilityException
**App:** `schedules`
**Tabla:** `schedules_professionalavailabilityexception`
**Hereda de:** `BaseModel`

### Campos del Modelo

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | AutoField | ID único | PK |
| `professional` | ForeignKey | Profesional | FK → Professional, on_delete=CASCADE, related_name="availability_exceptions" |
| `date` | DateField | Fecha específica | - |
| `status` | CharField | Estado | Choices: available, unavailable, default=available |
| `start_time` | TimeField | Hora de inicio | blank=True, null=True |
| `end_time` | TimeField | Hora de fin | blank=True, null=True |
| `break_start_time` | TimeField | Inicio de descanso | blank=True, null=True |
| `break_end_time` | TimeField | Fin de descanso | blank=True, null=True |
| `notes` | TextField | Notas | blank=True, null=True |
| `created` | DateTimeField | Fecha de creación | auto_now_add=True |
| `modified` | DateTimeField | Fecha de modificación | auto_now=True |
| `created_by` | ForeignKey | Creado por | FK → User, null=True, blank=True |
| `updated_by` | ForeignKey | Actualizado por | FK → User, null=True, blank=True |

### Campos Adicionales del Serializer (ProfessionalAvailabilityExceptionDetailSerializer)

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `professional_model` | `professional` | Objeto completo Professional serializado |

---

## Resumen de Relaciones

### ForeignKey (FK)
- **User** → Business (business)
- **Business** → Category (category)
- **Business** → User (owner)
- **Branch** → Business (business)
- **Service** → Business (business)
- **Professional** → Branch (branch)
- **Customer** → Business (business)
- **Booking** → Business, Branch, Professional, Service, Customer
- **ProfessionalWeeklyAvailability** → Professional (professional)
- **ProfessionalAvailabilityException** → Professional (professional)

### ManyToMany (M2M)
- **Professional** ↔ **Service** (services / professionals)

### Campos Heredados de BaseModel
Todos los modelos heredan de `BaseModel`, que proporciona:
- `id` (AutoField, PK)
- `created` (DateTimeField, auto_now_add=True)
- `modified` (DateTimeField, auto_now=True)
- `created_by` (ForeignKey → User, null=True, blank=True)
- `updated_by` (ForeignKey → User, null=True, blank=True)

---

## Convención de Naming para Serializers

En los **DetailSerializer**, los campos adicionales que expanden las relaciones ForeignKey siguen este patrón:

```
{campo_fk}_model
```

**Ejemplos:**
- `business` (FK) → `business_model` (objeto serializado completo)
- `category` (FK) → `category_model` (objeto serializado completo)
- `professional` (FK) → `professional_model` (objeto serializado completo)
- `services` (M2M) → `services_model` (array de objetos serializados)

Esta convención permite diferenciar claramente entre:
- El ID de la relación: `business` (int)
- El objeto completo: `business_model` (dict)
