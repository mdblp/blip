# Architecture

This document describes the architecture of the YourLoops frontend application.

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Client["Browser"]
        subgraph YourLoops["YourLoops Application"]
            UI[React UI Layer]
            STATE[Application State]
            SERVICES[Service Layer]
        end
    end

    subgraph External["External Services"]
        AUTH0[Auth0<br/>Authentication]
    end

    subgraph Backend["Backloops Backend"]
        GW[Harbour BFF gateway]
        TW[Tide Whisperer<br/>Data Service]
        SHORE[Shoreline<br/>User Service]
        CREW[Crew<br/>Team Service]
        PELICAN[Pelican<br/>Chat Service]
    end

    UI --> STATE
    STATE --> SERVICES
    SERVICES --> AUTH0
    SERVICES --> GW
    GW --> TW
    GW --> SHORE
    GW --> CREW
    GW --> PELICAN

    style UI fill:#4CAF50,color:#fff
    style AUTH0 fill:#EB5424,color:#fff
    style GW fill:#2196F3,color:#fff
```

## Application Layers

### Layer Architecture

```mermaid
flowchart TD
    subgraph Presentation["Presentation Layer"]
        PAGES[Pages]
        COMPONENTS[Components]
        LAYOUT[Layouts]
    end

    subgraph Business["Business Logic Layer"]
        HOOKS[Custom Hooks]
        CONTEXT[React Context]
        SERVICES[Services]
    end

    subgraph Data["Data Layer"]
        HTTP[HTTP Client]
        MEDICAL[Medical Domain]
        CACHE[Cache]
    end

    subgraph Visualization["Visualization Layer"]
        DUMB[Dumb Components]
        VIZ[Viz Charts]
        TIDELINE[Tideline]
    end

    PAGES --> COMPONENTS
    COMPONENTS --> HOOKS
    HOOKS --> SERVICES
    SERVICES --> HTTP
    HTTP --> MEDICAL
    COMPONENTS --> DUMB
    DUMB --> VIZ
    VIZ --> TIDELINE
```

### Layer Responsibilities

| Layer              | Package                   | Responsibility                      |
|--------------------|---------------------------|-------------------------------------|
| **Presentation**   | `yourloops`               | UI rendering, user interactions     |
| **Business Logic** | `yourloops/lib`           | Application logic, state management |
| **Data**           | `medical-domain`          | Data normalization, validation      |
| **Visualization**  | `dumb`, `viz`, `tideline` | Charts, graphs, statistics          |

## Component Architecture

### Component Types

```mermaid
flowchart LR
    subgraph Smart["Smart Components"]
        PAGE[Page Components]
        CONTAINER[Container Components]
    end

    subgraph Dumb["Dumb Components"]
        UI[UI Components]
        CHART[Chart Components]
        STAT[Statistics Components]
    end

    PAGE --> CONTAINER
    CONTAINER --> UI
    CONTAINER --> CHART
    CONTAINER --> STAT
```

| Type                     | Location               | Characteristics              |
|--------------------------|------------------------|------------------------------|
| **Page Components**      | `pages/`               | Route-level, data fetching   |
| **Container Components** | `components/`          | State management, logic      |
| **UI Components**        | `components/`, `dumb/` | Presentational, props-driven |

### Component Example

```typescript
// Smart Component (Page)
// packages/yourloops/pages/patient/patient-dashboard.tsx
const PatientDashboard: FC = () => {
  const { data, loading } = useMedicalData(patientId)

  return (
    <MainLayout>
      <DashboardHeader patient={patient} />
      <StatisticsCard data={data} loading={loading} />
      <TimelineChart data={data} />
    </MainLayout>
  )
}

// Dumb Component
// packages/dumb/src/components/stats/statistics-card.tsx
const StatisticsCard: FC<StatisticsCardProps> = ({
  data,
  loading
}) => {
  if (loading) return <Skeleton />
  return <Card>{/* render statistics */}</Card>
}
```

## Data Fetching Strategy

### Fetch Pattern

```mermaid
sequenceDiagram
    participant C as Component
    participant H as Custom Hook
    participant S as Service
    participant A as API
    participant M as Medical Domain

    C->>H: usePatientData(id)
    H->>S: fetchData(id)
    S->>A: GET /data/{id}
    A->>S: Raw JSON
    S->>M: normalize(data)
    M->>S: MedicalData
    S->>H: Processed Data
    H->>C: { data, loading, error }
```

### Loading States

We follow the pattern of "render as soon as possible":

| State      | `data`   | `loading` | UI Behavior            |
|------------|----------|-----------|------------------------|
| Initial    | `null`   | `true`    | Show skeleton          |
| Empty      | `null`   | `false`   | Show "no data" message |
| Loaded     | `object` | `false`   | Display data           |
| Refreshing | `object` | `true`    | Show data + indicator  |

## State Management

### State Architecture

```mermaid
flowchart TD
    subgraph Global["Global State (Context)"]
        AUTH[Auth Context]
        CONFIG[Config Context]
        THEME[Theme Context]
    end

    subgraph Local["Local State (Hooks)"]
        PATIENT[Patient Data]
        UI[UI State]
        FORM[Form State]
    end

    AUTH --> PATIENT
    CONFIG --> PATIENT
    PATIENT --> UI
```

### State Providers

```typescript
// packages/yourloops/app/app.tsx
<Auth0Provider>
  <AuthContextProvider>
    <ThemeProvider>
      <SnackbarContextProvider>
        <MainLobby />
      </SnackbarContextProvider>
    </ThemeProvider>
  </AuthContextProvider>
</Auth0Provider>
```

## Routing Architecture

### Route Structure

```mermaid
flowchart TD
    ROOT["/"] --> PUBLIC
    ROOT --> PROTECTED

    subgraph PUBLIC["Public Routes"]
        LOGIN["/login"]
        VERIFY["/verify-email"]
        LABEL["/product-labelling"]
    end

    subgraph PROTECTED["Protected Routes"]
        DASH["/dashboard"]
        PATIENT["/patient/:id"]
        SETTINGS["/settings"]
        HCP["/hcp/*"]
    end

    subgraph ONBOARDING["Onboarding Routes"]
        SIGNUP["/complete-signup"]
        CONSENT["/consent"]
        TRAINING["/training"]
    end
```

### Route Protection

Routes are protected by the `MainLobby` component which:
1. Checks authentication status
2. Validates user consent
3. Enforces training completion
4. Redirects as needed

## Error Handling

### Error Boundary Pattern

```mermaid
flowchart TD
    APP[App] --> EB[Error Boundary]
    EB --> ROUTES[Routes]
    ROUTES --> PAGE[Page]
    PAGE --> COMP[Components]

    COMP -->|Error| EB
    EB -->|Catch| ERROR[Error UI]
```

### Error Types

| Type           | Handling           | User Experience     |
|----------------|--------------------|---------------------|
| **Network**    | Retry with backoff | Toast notification  |
| **Auth**       | Redirect to login  | Login page          |
| **Validation** | Display inline     | Form error messages |
| **Critical**   | Error boundary     | Error page          |

## Performance Patterns

### Optimization Strategies

```mermaid
flowchart LR
    subgraph Loading
        LAZY[Lazy Loading]
        SUSPENSE[Suspense]
    end

    subgraph Rendering
        MEMO[React.memo]
        CALLBACK[useCallback]
        USEMEMO[useMemo]
    end

    subgraph Data
        CACHE[Data Caching]
        WINDOW[Data Windowing]
    end
```

| Strategy           | Implementation       | Benefit                |
|--------------------|----------------------|------------------------|
| **Code Splitting** | `React.lazy()`       | Smaller initial bundle |
| **Memoization**    | `useMemo`, `memo`    | Prevent re-renders     |
| **Data Windowing** | Date range filtering | Reduce data volume     |
| **Virtualization** | Virtual lists        | Handle large datasets  |

## Security Architecture

### Security Layers

```mermaid
flowchart TD
    subgraph Client["Client Security"]
        HTTPS[HTTPS Only]
        TOKEN[Token Storage]
        IDLE[Idle Timeout]
    end

    subgraph Auth["Authentication"]
        AUTH0[Auth0]
        JWT[JWT Validation]
    end

    subgraph API["API Security"]
        CORS[CORS Policy]
        RATE[Rate Limiting]
        AUTHZ[Authorization]
    end

    Client --> Auth
    Auth --> API
```

### Security Measures

- **Authentication**: Auth0 with JWT tokens
- **Authorization**: Role-based access control
- **Data Protection**: HTTPS, secure cookies
- **Session**: Automatic timeout, secure refresh

---

## See Also

- [Packages](./Packages.md) - Package details
- [Authentication](./Authentication.md) - Auth flow
- [Data Flow](DataFlow.md) - Data processing
- [Directory Structure](./DirectoryStructure.md) - Code organization
