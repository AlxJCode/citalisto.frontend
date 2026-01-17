# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dental consultation management platform: Next.js 16 + React 19 + TypeScript + Ant Design 6.0

## Commands

```bash
npm run dev              # Development server (localhost:3000)
npm run build            # Production build
npm run lint             # ESLint
npm run format           # Prettier format
npm run format:check     # Check formatting
npm run test:auth        # Run auth tests
```

## Code Principles (mandatory)

- **KISS, DRY, YAGNI**: Simple, no duplication, no unnecessary abstractions
- **Self-documenting**: Clear names > comments
- **Comments only for**: architecture decisions, business logic, non-obvious behavior

## Architecture

### Feature Module Pattern

Standard structure (see `feature_pattern.md`):

```
features/{domain}/{entity}/
├── types/{entity}.types.ts    # ModelApi (snake_case) + Model (camelCase)
├── services/{entity}.api.ts   # API calls + mapper
├── hooks/use{Entity}.ts       # State management
└── components/                # View, Table, Form, Filters
```

**Key Convention**: Backend = snake_case, Frontend = camelCase. API services map between them.

### Authentication

1. Login: `POST /api/v1/auth/token/` → `{ access, refresh }`
2. User data: `GET /api/v1/auth/me/` → full user info
3. Storage: httpOnly cookies (server-side via Next.js API routes)
4. JWT contains ONLY: `user_id`, `exp`, `iat`, `jti` (no roles/permissions)

**Key files**:
- `src/lib/auth/session.ts` - Server-side session
- `src/lib/api/client.ts` - API client with auto token attachment

### API Integration

- Base URL: `https://www.citalistoapi.iveltech.com`
- Pattern: `/api/v1/{domain}/{entity}/`
- Response: `{ success, status, message, data, meta? }`
- Client: `apiClient` from `@/lib/api/client` (auto token, 401 → login redirect)

### Path Aliases

```typescript
@/components/*
@/features/*
@/hooks/*
@/lib/*
@/types/*
```

## Common Patterns

### API Service

```typescript
// Types: ModelApi (snake_case) + Model (camelCase)
const mapModel = (api: ModelApi): Model => ({
  id: api.id,
  fieldName: api.field_name,  // snake → camel
})

export const getModelsApi = async (): Promise<Model[]> => {
  const { data } = await apiClient.get<ApiResponse<ModelApi[]>>('/api/v1/...')
  if (!data.success || !data.data) throw new Error(data.message)
  return data.data.map(mapModel)
}
```

### Hook

```typescript
export const useModels = () => {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)

  const fetchModels = async () => {
    setLoading(true)
    try {
      const data = await getModelsApi()
      setModels(data)
    } catch (error) {
      message.error('Error')
    } finally {
      setLoading(false)
    }
  }

  return { models, loading, fetchModels }
}
```

### Component

```typescript
'use client'
export const ModelsView = () => {
  const { models, loading, fetchModels } = useModels()

  useEffect(() => { fetchModels() }, [])

  return (
    <PageContainer title="Models">
      <ModelsTable data={models} loading={loading} />
    </PageContainer>
  )
}
```

## Conventions

- PascalCase: components | camelCase: functions/variables
- Absolute imports: `@/`
- Ant Design for UI (avoid custom CSS)
- Component structure: `Folder/index.tsx`
- Error handling: in hooks, display via `message.error()`

## Key Documentation

- `feature_pattern.md` - Feature structure details
- `AUTH_FLOW_DOCUMENTATION.md` - Auth implementation
- `API_ENDPOINTS.md` - Backend endpoints
- `.claude/rules.md` - Code principles
