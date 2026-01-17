
# Sistema de Cambio de Contraseñas

Sistema seguro y completo para el cambio de contraseñas con control de permisos por roles, rate limiting y auditoría.

## 📋 Características

### Seguridad
- ✅ **Rate Limiting**: 5 intentos por hora para prevenir ataques de fuerza bruta
- ✅ **Validación de fortaleza**: Usa los validadores de Django (longitud, complejidad, contraseñas comunes)
- ✅ **Validación de contraseña diferente**: No permite reutilizar la contraseña actual
- ✅ **Verificación de contraseña actual**: Al cambiar la propia contraseña
- ✅ **Control de permisos por roles**: Matriz jerárquica de permisos
- ✅ **Protección contra escalada de privilegios**: Los admins no pueden cambiar contraseñas de superusers
- ✅ **Auditoría completa**: Logging de todos los cambios de contraseña

### Tracking
- **`last_password_change`**: Fecha y hora del último cambio
- **`password_change_required`**: Flag para forzar cambio en próximo login

## 🚀 Uso

### Endpoints

#### 1. Cambiar contraseña propia
```http
POST /api/v1/users/change-password/
Content-Type: application/json
Authorization: Bearer {token}

{
  "current_password": "MiPasswordActual123!",
  "new_password": "NuevoPasswordSeguro456!"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "status": "success",
  "message": "Contraseña actualizada correctamente.",
  "data": null,
  "meta": {
    "version": "v1.0.0",
    "timestamp": "2025-11-20T13:50:00Z",
    "processing_time_ms": 245
  }
}
```

#### 2. Administrador cambia contraseña de otro usuario
```http
POST /api/v1/users/change-password/{user_id}/
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "new_password": "NuevoPasswordSeguro456!"
}
```

**Nota:** Los administradores NO necesitan proporcionar la contraseña actual del usuario objetivo.

### Matriz de Permisos

```python
ADMIN puede cambiar contraseña de:
├── STAFF
├── WORKER
├── DRIVER
└── INSPECTOR

STAFF puede cambiar contraseña de:
├── WORKER
├── DRIVER
└── INSPECTOR

WORKER, DRIVER, INSPECTOR:
└── Solo pueden cambiar su propia contraseña

SUPERUSER:
└── Puede cambiar cualquier contraseña (incluso de otros superusers)
```

**Restricciones:**
- Los admins normales NO pueden cambiar contraseñas de superusers
- Los usuarios solo pueden cambiar contraseñas de roles inferiores
- Todos los usuarios pueden cambiar su propia contraseña

## 🔒 Seguridad y Validaciones

### 1. Rate Limiting
```python
# Configurado en: core/auth/throttling.py
class ChangePasswordThrottle(UserRateThrottle):
    rate = '5/hour'  # 5 intentos por hora
```

### 2. Validaciones Aplicadas

**Al cambiar contraseña propia:**
- ✅ Campo `current_password` es requerido
- ✅ La contraseña actual debe ser correcta
- ✅ La nueva contraseña debe cumplir requisitos de fortaleza
- ✅ La nueva contraseña debe ser diferente a la actual

**Al cambiar contraseña de otro usuario:**
- ✅ Solo roles autorizados pueden hacerlo
- ✅ No se puede cambiar contraseña de superusers (excepto por superusers)
- ✅ La nueva contraseña debe cumplir requisitos de fortaleza
- ✅ La nueva contraseña debe ser diferente a la actual del usuario objetivo

### 3. Respuestas de Error

**Error de validación (422):**
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
      "new_password": [
        "La contraseña es muy corta. Debe contener al menos 8 caracteres."
      ]
    },
    "timestamp": "2025-11-20T13:50:00Z"
  },
  "meta": {...}
}
```

**Permisos denegados (403):**
```json
{
  "success": false,
  "status": "error",
  "message": "No tienes permiso para cambiar la contraseña de usuarios con rol ADMIN.",
  "data": null,
  "error": {
    "code": 403,
    "type": "authorization_error",
    "message": "No tienes permiso para cambiar la contraseña de usuarios con rol ADMIN.",
    "details": null,
    "timestamp": "2025-11-20T13:50:00Z"
  },
  "meta": {...}
}
```

**Usuario no encontrado (404):**
```json
{
  "success": false,
  "status": "error",
  "message": "Usuario no encontrado",
  "data": null,
  "error": {
    "code": 404,
    "type": "not_found",
    "message": "Usuario no encontrado",
    "details": null,
    "timestamp": "2025-11-20T13:50:00Z"
  },
  "meta": {...}
}
```

**Rate limit excedido (429):**
```json
{
  "detail": "Request was throttled. Expected available in 3599 seconds."
}
```

## 📁 Arquitectura

### Archivos Creados/Modificados

```
core/
├── auth/
│   ├── throttling.py              # ✨ NUEVO - Rate limiting
│   └── __init__.py                # Exporta ChangePasswordThrottle

applications/users/
├── models/
│   └── user.py                    # ✅ MODIFICADO - Campos de tracking
├── services/
│   ├── __init__.py                # ✨ NUEVO
│   └── change_password.py         # ✨ NUEVO - Lógica de negocio
├── api_views/
│   └── change_password.py         # ✨ NUEVO - Vista API
├── migrations/
│   └── 0002_user_last_password_change_and_more.py  # ✨ NUEVO
├── tests/
│   ├── conftest.py                # ✅ MODIFICADO - Fixtures
│   └── test_change_password.py   # ✨ NUEVO - 18 tests
└── urls.py                        # ✅ MODIFICADO - Nuevos endpoints

config/settings/
└── test.py                        # ✅ MODIFICADO - Deshabilita throttling
```

### Patrón de Diseño

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/v1/users/change-password/
       ▼
┌─────────────────────────────┐
│  ChangePasswordView (APIView)│
│  - Maneja excepciones        │
│  - Aplica throttling         │
│  - Requiere autenticación    │
└──────┬──────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ ChangePasswordService        │
│ - Validación de permisos     │
│ - Validación de contraseña   │
│ - Cambio de contraseña       │
│ - Auditoría (logs)           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────┐
│   User Model     │
│ - set_password() │
│ - check_password()│
└──────────────────┘
```

## 🧪 Tests

Se han creado **18 tests** completos que cubren:

### TestChangeOwnPassword (7 tests)
- ✅ Cambio exitoso de contraseña propia
- ✅ Falta contraseña actual
- ✅ Contraseña actual incorrecta
- ✅ Nueva contraseña igual a la actual
- ✅ Contraseña débil
- ✅ Falta nueva contraseña
- ✅ Actualización de campos de tracking

### TestChangeOtherUserPassword (7 tests)
- ✅ ADMIN cambia contraseña de STAFF
- ✅ ADMIN cambia contraseña de WORKER
- ✅ STAFF cambia contraseña de WORKER
- ✅ WORKER no puede cambiar contraseña de otro WORKER
- ✅ STAFF no puede cambiar contraseña de ADMIN
- ✅ ADMIN no puede cambiar contraseña de SUPERUSER
- ✅ Admin no necesita contraseña actual

### TestSuperuserPermissions (2 tests)
- ✅ Superuser puede cambiar cualquier contraseña
- ✅ Superuser puede cambiar contraseña de otro superuser

### TestChangePasswordSecurity (2 tests)
- ✅ Usuario no autenticado no puede cambiar contraseñas
- ✅ Usuario inexistente devuelve 404

**Ejecutar tests:**
```bash
pytest applications/users/tests/test_change_password.py -v
```

## 🔧 Configuración

### 1. Ejecutar migración
```bash
python manage.py migrate
```

### 2. Configurar validadores de contraseña (settings)
```python
# En config/settings/base.py
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
```

### 3. Configurar rate limiting (opcional)
```python
# Para cambiar el límite de intentos
# En core/auth/throttling.py
class ChangePasswordThrottle(UserRateThrottle):
    rate = '10/hour'  # Cambiar de 5 a 10 intentos por hora
```

## 📝 Logs de Auditoría

Todos los cambios de contraseña se registran en los logs:

```python
[2025-11-20 13:50:00] INFO: Password changed for user 123 (john.doe) by user 1 (admin)
```

**Configuración de logging:**
```python
# En config/settings/base.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/password_changes.log',
        },
    },
    'loggers': {
        'applications.users.services.change_password': {
            'handlers': ['file'],
            'level': 'INFO',
        },
    },
}
```

## 🎯 Próximos Pasos Opcionales

1. **Historial de contraseñas**: Evitar reutilización de últimas N contraseñas
2. **Expiración de contraseñas**: Forzar cambio cada X días
3. **Notificación por email**: Alertar al usuario cuando se cambia su contraseña
4. **Two-Factor Authentication**: Requerir 2FA para cambios de contraseña
5. **Password strength meter**: En el frontend

## ⚠️ Notas Importantes

1. **No modificar `core/auth/throttling.py`** sin consultar - afecta la seguridad global
2. **Los campos de tracking son opcionales** - el servicio funciona si no existen
3. **El rate limiting se deshabilita automáticamente en tests**
4. **Los superusers tienen permisos ilimitados** - usar con precaución

## 🔗 Referencias

- **Servicio**: `applications/users/services/change_password.py:16`
- **Vista**: `applications/users/api_views/change_password.py:14`
- **Tests**: `applications/users/tests/test_change_password.py`
- **Modelo User**: `applications/users/models/user.py:8`
