# Data Flow

This document describes how data flows through the YourLoops application, from backend APIs to user interface rendering.

## Overview

```mermaid
flowchart LR
    subgraph Backend["Backloops Services"]
        TW[Tide Whisperer<br/>Data API]
        CREW[Crew<br/>Teams API]
        PELICAN[Pelican<br/>Chat API]
    end

    subgraph Frontend["YourLoops Frontend"]
        HTTP[HTTP Service]
        MD[Medical Domain<br/>Normalization]
        STATE[Application State]
        VIZ[Visualization<br/>Components]
        UI[React UI]
    end

    TW --> HTTP
    CREW --> HTTP
    PELICAN --> HTTP
    HTTP --> MD
    MD --> STATE
    STATE --> VIZ
    VIZ --> UI

    style MD fill:#2196F3,color:#fff
    style VIZ fill:#E91E63,color:#fff
```

## Data Fetching

### API Communication

```mermaid
sequenceDiagram
    participant UI as React Component
    participant Hook as Custom Hook
    participant HTTP as HTTP Service
    participant API as Backloops API
    participant MD as Medical Domain

    UI->>Hook: usePatientData(patientId)
    Hook->>HTTP: fetchPatientData(patientId)
    HTTP->>API: GET /data/{patientId}
    API->>HTTP: Raw JSON response
    HTTP->>MD: normalize(rawData)
    MD->>MD: deduplicate()
    MD->>MD: validate()
    MD->>Hook: MedicalData
    Hook->>UI: { data, loading, error }
```

### HTTP Service Layer

Located in `packages/yourloops/lib/http/`:

```typescript
// Simplified example
class HttpService {
  async get<T>(endpoint: string): Promise<T> {
    const token = await this.getAccessToken()
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }
}
```

## Medical Data Processing

### Normalization Pipeline

```mermaid
flowchart TD
    RAW[Raw API Data] --> PARSE[Parse JSON]
    PARSE --> VALIDATE[Validate Schema]
    VALIDATE --> NORMALIZE[Normalize Types]
    NORMALIZE --> DEDUP[Deduplicate]
    DEDUP --> FILTER[Apply Date Filters]
    FILTER --> MEDICAL[MedicalData Object]

    subgraph MedicalDataService
        VALIDATE
        NORMALIZE
        DEDUP
        FILTER
    end
```

### Data Types

```mermaid
classDiagram
    class MedicalData {
        +Bolus[] bolus
        +Basal[] basal
        +Cbg[] cbg
        +Smbg[] smbg
        +Meal[] meals
        +PhysicalActivity[] physicalActivities
        +Wizard[] wizards
        +AlarmEvent[] alarms
    }

    class Datum {
        <<interface>>
        +string id
        +DatumType type
        +string time
        +string timezone
        +string source
    }

    class Bolus {
        +number normal
        +BolusSubtype subType
        +Prescriptor prescriptor
    }

    class Cbg {
        +number value
        +BgUnit units
    }

    MedicalData --> Datum
    Bolus --|> Datum
    Cbg --|> Datum
```

### MedicalDataService

```typescript
// packages/medical-domain/src/domains/repositories/medical/medical-data.service.ts
class MedicalDataService {
  /**
   * Normalize raw data from API
   */
  normalize(rawData: unknown[]): MedicalData {
    // Type detection and normalization
  }

  /**
   * Remove duplicate entries
   */
  deduplicate(data: MedicalData): MedicalData {
    // Deduplication by ID and timestamp
  }

  /**
   * Filter by date range
   */
  filterByDateRange(
    data: MedicalData,
    filter: DateFilter
  ): MedicalData {
    // Date-based filtering
  }
}
```

## State Management

### Data Flow in Components

```mermaid
flowchart TD
    subgraph "Page Component"
        PAGE[PatientDataPage]
        FETCH[useMedicalData Hook]
    end

    subgraph "State"
        DATA[Medical Data]
        FILTER[Date Filter]
        SETTINGS[User Settings]
    end

    subgraph "Visualization"
        DAILY[Daily View]
        TRENDS[Trends View]
        BASICS[Basics View]
    end

    PAGE --> FETCH
    FETCH --> DATA
    DATA --> DAILY
    DATA --> TRENDS
    DATA --> BASICS
    FILTER --> DAILY
    FILTER --> TRENDS
    SETTINGS --> DAILY
    SETTINGS --> TRENDS
```

### Custom Hooks Pattern

```typescript
// packages/yourloops/lib/data/use-medical-data.hook.ts
export const useMedicalData = (patientId: string, dateFilter: DateFilter) => {
  const [data, setData] = useState<MedicalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const rawData = await httpService.getPatientData(patientId, dateFilter)
        const normalizedData = medicalDataService.normalize(rawData)
        setData(normalizedData)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [patientId, dateFilter])

  return { data, loading, error }
}
```

## Visualization Pipeline

### From Data to Charts

```mermaid
flowchart LR
    subgraph "Data Layer"
        MD[MedicalData]
    end

    subgraph "Processing"
        STATS[Statistics<br/>Services]
        GROUP[Data<br/>Grouping]
    end

    subgraph "Rendering"
        TL[Tideline<br/>D3.js]
        DUMB[Dumb<br/>Components]
    end

    subgraph "Output"
        CHART[Interactive<br/>Charts]
        PDF[PDF<br/>Reports]
    end

    MD --> STATS
    MD --> GROUP
    STATS --> DUMB
    GROUP --> TL
    TL --> CHART
    DUMB --> CHART
    TL --> PDF
    DUMB --> PDF
```

### Statistics Calculation

```typescript
// Calculate glycemia statistics
const glycemiaStats = GlycemiaStatisticsService.calculate(
  medicalData.cbg,
  bgBounds,
  dateFilter
)

// Result includes:
// - Time in Range (TIR)
// - Average glucose
// - Standard deviation
// - Glucose Management Indicator (GMI)
```

### Chart Rendering Flow

```mermaid
sequenceDiagram
    participant Data as MedicalData
    participant Stats as StatisticsService
    participant Pool as Tideline Pool
    participant D3 as D3.js
    participant DOM as DOM/SVG

    Data->>Stats: Calculate statistics
    Stats->>Pool: Formatted data
    Pool->>Pool: Create data pools
    Pool->>D3: bindData()
    D3->>DOM: render()
    DOM->>DOM: Interactive chart
```

## Backend Services Integration

### Service Map

```mermaid
graph TB
    subgraph "YourLoops Frontend"
        APP[Application]
    end

    subgraph "Backloops Services"
        TW[tide-whisperer-v2<br/>Medical Data]
        SHORE[shoreline<br/>Authentication]
        CREW[crew<br/>Team Management]
        HYDRO[hydrophone<br/>Notifications]
        PELICAN[pelican<br/>Messaging]
    end

    APP --> TW
    APP --> SHORE
    APP --> CREW
    APP --> HYDRO
    APP --> PELICAN
```

### API Endpoints

| Service | Purpose | Key Endpoints |
|---------|---------|---------------|
| `tide-whisperer-v2` | Medical data access | `GET /data/{userId}` |
| `shoreline` | User management | `GET /user`, `POST /user` |
| `crew` | Team management | `GET /teams`, `POST /teams` |
| `hydrophone` | Email notifications | `POST /send` |
| `pelican` | Chat/messaging | `GET /messages`, `POST /messages` |

## Caching Strategy

### Client-Side Caching

```mermaid
flowchart TD
    REQ[Data Request] --> CACHE{In Cache?}
    CACHE -->|Yes| VALID{Still Valid?}
    CACHE -->|No| FETCH[Fetch from API]
    VALID -->|Yes| RETURN[Return Cached]
    VALID -->|No| FETCH
    FETCH --> STORE[Store in Cache]
    STORE --> RETURN
```

### Cache Invalidation

- **Time-based**: Data expires after configurable TTL
- **Event-based**: Cache cleared on user actions (e.g., data upload)
- **Navigation-based**: Fresh data fetched on page navigation

## Real-Time Updates

### Chat/Messaging Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant APP1 as YourLoops
    participant API as Pelican API
    participant APP2 as YourLoops
    participant U2 as User 2

    U1->>APP1: Send message
    APP1->>API: POST /messages
    API->>APP1: Message ID
    loop Polling
        APP2->>API: GET /messages (since lastId)
        API->>APP2: New messages
    end
    APP2->>U2: Display message
```

## Error Handling

### Data Fetch Errors

```typescript
try {
  const data = await fetchMedicalData(patientId)
} catch (error) {
  if (error instanceof NetworkError) {
    // Show offline message
  } else if (error instanceof AuthError) {
    // Redirect to login
  } else if (error instanceof ValidationError) {
    // Show data error message
  }
}
```

### Error States in UI

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Success: Data received
    Loading --> Error: Fetch failed
    Error --> Loading: Retry
    Success --> Loading: Refresh
    Success --> [*]
```

## Performance Considerations

1. **Lazy Loading**: Charts loaded on demand
2. **Data Windowing**: Only visible date range loaded
3. **Memoization**: Expensive calculations cached
4. **Web Workers**: Heavy processing off main thread

---

## See Also

- [Packages](Packages.md) - Package responsibilities
- [Architecture](Architecture.md) - Overall architecture
- [Authentication](Authentication.md) - Auth flow details

