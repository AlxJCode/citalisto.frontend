```yaml
app/
    (public)/
        Login/

    (protected)/
        Users/
        
    page.tsx
    layout.tsx

modules or features/
    users/
        services/
            user.service.ts
        hooks/
            useUsers.ts
        types/
            user.type.ts
        components/
            filters/
            modals/
            tables/
                UserTable/ (example)
        data/
    organizations/
        services/
        hooks/
        types/
        components/
        data/

components/
    ui/
        Button/
        
    layout/
        Sidebar/
        Header/

contexts/
    useSession.tsx
hooks/
    useDebounce.ts
lib/
    auth/
    axios/
    utils/
styles/
    
public/
```

DRY
YAGNI
KISS