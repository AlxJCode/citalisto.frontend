# Feature: Service (Catálogo de Servicios)

Estructura estándar para features del sistema. Sigue este patrón para todos los modelos.

## 📁 Estructura

```
src/features/services-catalog/service/
├── types/
│   └── service.types.ts        # Tipos e interfaces
├── services/
│   └── services.api.ts         # Llamadas a la API
├── hooks/
│   └── useServices.ts          # Lógica y estado
└── components/
    ├── ServicesView/           # Vista principal
    ├── ServicesTable/          # Tabla de datos
    ├── ServiceForm/            # Formulario crear/editar
    └── ServiceFilters/         # Filtros de búsqueda
```

## 📝 Types

### service.types.ts
```typescript
// Backend response (snake_case)
export interface ServiceApi {
  id: number
  name: string
  price: string
  duration_minutes: number
}

// Frontend model (camelCase)
export interface Service {
  id: number
  name: string
  price: number
  durationMinutes: number
}

```

**Patrón:**
- `ModelApi` = Respuesta del backend (snake_case, también se usa para crear/editar)
- `Model` = Modelo del frontend (camelCase)

## 🔌 API Service

### services.api.ts
```typescript
import { apiClient } from "@/lib/api/client"
import { ApiResponse, ApiResponsePaginated } from "@/types/base"

// Mapper snake_case → camelCase
const mapService = (api: ServiceApi): Service => ({
  id: api.id,
  name: api.name,
  price: parseFloat(api.price),
  durationMinutes: api.duration_minutes,
})

// Filtros
export interface ServiceFilters {
  page?: number
  search?: string
}

// GET lista
export const getServicesApi = async (filters?: ServiceFilters): Promise<Service[]> => {
  const params = new URLSearchParams()
  if (filters?.page) params.append("page", filters.page.toString())
  if (filters?.search) params.append("search", filters.search)

  const { data } = await apiClient.get<ApiResponsePaginated<ServiceApi>>(
    `/api/v1/services-catalog/service/?${params.toString()}`
  )

  if (!data.success || !data.data) {
    throw new Error(data.message || "Error al obtener servicios")
  }

  return data.data.map(mapService)
}

// GET detalle
export const getServiceApi = async (id: number): Promise<Service> => { ... }

// POST crear
export const createServiceApi = async (formData: ServiceApi): Promise<Service> => { ... }

// PATCH actualizar
export const updateServiceApi = async (id: number, formData: Partial<ServiceApi>): Promise<Service> => { ... }

// DELETE eliminar
export const deleteServiceApi = async (id: number): Promise<void> => { ... }
```

**Patrón:**
- Funciones con sufijo `Api`
- Mapper para convertir snake_case → camelCase
- Interface `ModelFilters` para filtros de búsqueda
- Manejo de `ApiResponse` wrapper

## 🎣 Hook

### useServices.ts
```typescript
'use client'

import { useState } from 'react'
import { Service, ServiceApi } from '../types/service.types'
import { getServicesApi, createServiceApi, updateServiceApi, deleteServiceApi, ServiceFilters } from '../services/services.api'
import { message } from 'antd'

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<ServiceFilters>({})

  const fetchServices = async (newFilters?: ServiceFilters) => {
    setLoading(true)
    try {
      const filtersToUse = newFilters || filters
      const data = await getServicesApi(filtersToUse)
      setServices(data)
      if (newFilters) setFilters(newFilters)
    } catch (error) {
      message.error('Error al cargar servicios')
    } finally {
      setLoading(false)
    }
  }

  const createService = async (formData: ServiceApi) => {
    setLoading(true)
    try {
      await createServiceApi(formData)
      message.success('Servicio creado exitosamente')
      fetchServices()
      return true
    } catch (error) {
      message.error('Error al crear servicio')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateService = async (id: number, formData: Partial<ServiceApi>) => { ... }
  const deleteService = async (id: number) => { ... }

  return {
    services,
    loading,
    filters,
    fetchServices,
    createService,
    updateService,
    deleteService,
    applyFilters: fetchServices,
  }
}
```

**Patrón:**
- Hook `useModel` (singular)
- Estado: `models` (plural), `loading`, `filters`
- Métodos: `fetchModels`, `createModel`, `updateModel`, `deleteModel`
- No hace fetch automático (manual con `fetchModels`)
- Retorna booleano en operaciones de escritura
- Usa `message` de Ant Design para notificaciones

## 🧩 Componentes

### ServicesView/index.tsx
```typescript
'use client'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from 'antd'
import { ServicesTable } from '../ServicesTable'
import { useServices } from '../../hooks/useServices'
import { useEffect } from 'react'

export const ServicesView = () => {
  const { services, loading, fetchServices } = useServices()

  useEffect(() => {
    fetchServices()
  }, [])

  return (
    <PageContainer
      title="Gestionar Servicios"
      description="Administra los servicios de tu consultorio"
      actions={<Button type="primary">+ Nuevo Servicio</Button>}
    >
      <ServicesTable data={services} loading={loading} />
    </PageContainer>
  )
}
```

**Patrón:**
- Vista principal usa `PageContainer`
- Llama `fetchModels()` en `useEffect`
- Renderiza componentes hijos

### ServicesTable/index.tsx
```typescript
import { Table } from 'antd'
import { Service } from '../../types/service.types'

export const ServicesTable = ({ data, loading }: { data: Service[], loading: boolean }) => {
  const columns = [
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Precio', dataIndex: 'price', key: 'price' },
    { title: 'Duración', dataIndex: 'durationMinutes', key: 'durationMinutes' },
  ]

  return <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
}
```

**Patrón:**
- Componente presentacional
- Recibe `data` y `loading` por props
- Usa componentes de Ant Design

## 📄 Page

### app/(protected)/servicios/page.tsx
```typescript
import { ServicesView } from '@/features/services-catalog/service/components/ServicesView'

const ServiciosPage = () => {
  return <ServicesView />
}

export default ServiciosPage
```

**Patrón:**
- Page mínima, solo renderiza la vista
- Toda la lógica en el feature

## ✅ Checklist para nuevos features

- [ ] Crear estructura de carpetas
- [ ] `types/model.types.ts` con ModelApi y Model
- [ ] `services/model.api.ts` con mapper y CRUD completo
- [ ] `hooks/useModel.ts` con estado y métodos
- [ ] `components/ModelView/index.tsx` vista principal
- [ ] `components/ModelTable/index.tsx` tabla de datos
- [ ] `components/ModelForm/index.tsx` formulario
- [ ] `app/(protected)/ruta/page.tsx` página

## 🔑 Convenciones

- **Nombres:** PascalCase para componentes, camelCase para funciones
- **Imports:** Absolutos con `@/`
- **Estilos:** Ant Design components, evitar CSS custom
- **Estructura:** Carpeta/index.tsx para cada componente
- **Types:** Separar API types de frontend types
- **Mensajes:** Ant Design `message` para notificaciones
- **Errores:** Manejados en el hook, mostrados al usuario
