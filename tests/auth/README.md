# 🧪 Auth Tests - CitaListo

Suite de pruebas modularizada para el sistema de autenticación.

## 📁 Estructura

```
tests/auth/
├── config.ts           # Configuración y credenciales de prueba
├── helpers.ts          # Funciones helper para logging
├── test-api.ts         # Pruebas de auth.api.ts (servicios API)
├── test-actions.ts     # Pruebas de auth.actions.ts (Server Actions)
├── test-session.ts     # Pruebas de session.ts (manejo de sesión)
└── run-all-tests.ts    # Runner principal
```

## 🚀 Ejecutar Pruebas

```bash
npm run test:auth
```

## ✅ Resultados de la Última Ejecución

### API Services (`auth.api.ts`) - 5/6 ✅

| Test | Estado | Notas |
|------|--------|-------|
| ✅ loginApi() - válido | PASSED | Tokens recibidos correctamente |
| ✅ loginApi() - inválido | PASSED | Error: "Tu sesión ha expirado..." |
| ❌ getMeApi() | **FAILED** | Endpoint `/api/v1/auth/me/` retorna 404 |
| ✅ verifyTokenApi() - válido | PASSED | Token validado |
| ✅ verifyTokenApi() - inválido | PASSED | Token inválido detectado |
| ✅ refreshTokenApi() | PASSED | Tokens refrescados |

### Server Actions (`auth.actions.ts`) - Esperado ⚠️

**Nota:** Los Server Actions solo funcionan dentro de un request HTTP de Next.js, no en scripts standalone.

| Test | Estado | Motivo |
|------|--------|--------|
| ❌ loginAction() | EXPECTED FAIL | Requiere request context |
| ❌ logoutAction() | EXPECTED FAIL | Requiere request context |
| ❌ refreshTokenAction() | EXPECTED FAIL | Requiere request context |

### Session Management (`session.ts`) - 3/3 ✅

| Test | Estado | Notas |
|------|--------|-------|
| ✅ getSession() | PASSED | Retorna null sin sesión |
| ✅ isAuthenticated() | PASSED | Retorna false |
| ✅ requireAuth() | PASSED | Lanza error correctamente |

## 🐛 Problemas Encontrados

### 1. ❌ Endpoint `/api/v1/auth/me/` no existe (404)

El backend retorna **404 Not Found** para este endpoint.

**Posibles soluciones:**
- Verificar que el endpoint exista en el backend
- Revisar si la URL correcta es diferente (ej: `/api/v1/users/me/`)
- Confirmar en la documentación del backend

## 🎯 Credenciales de Prueba

```typescript
{
    valid: {
        username: "ccc",
        password: "xxx",
    },
    invalid: {
        username: "usuario_invalido_123",
        password: "password_incorrecta_456",
    },
}
```

## 📝 Conclusiones

### ✅ Funcionando Correctamente

1. **Axios Integration** - Funcionando perfectamente
2. **Error Handling** - Mensajes del backend extraídos correctamente
3. **Token Management** - Login, verify y refresh funcionan
4. **Type Safety** - TypeScript sin errores

### ❌ Requiere Atención

1. **Endpoint `/me/`** - Retorna 404, necesita corrección
2. **Server Actions** - Solo testeable en runtime de Next.js (esperado)

## 🔧 Próximos Pasos

1. Corregir endpoint `/api/v1/auth/me/` o actualizar la URL
2. Probar el login desde la UI (http://localhost:3000/login)
3. Verificar que las cookies se guardan correctamente
4. Probar flujo completo: login → dashboard → logout
