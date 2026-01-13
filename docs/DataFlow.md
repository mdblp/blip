# Data Flow

This document describes how data flows through the YourLoops application, from backend APIs to user interface rendering.

## Overview

In order to not overwhelm the diagram, not all services are shown.
```mermaid
flowchart LR
    subgraph Backend["Backloops Services"]
        TW[Tide Whisperer V2<br/>Data API]
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

In order to not overwhelm the diagram, not all types are shown.
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
        BFF[Harbour<br/>BFF Gateway]
        AUTH[auth<br/>Authentication]
        CREW[crew<br/>Team Management]
        HYDRO[hydrophone<br/>Notifications]
        PELICAN[pelican<br/>Messaging]
    end

    APP --> TW
    APP --> AUTH
    APP --> CREW
    APP --> HYDRO
    APP --> PELICAN
```

### Main API Endpoints

| Service             | Purpose                                   | Key Endpoints                     |
|---------------------|-------------------------------------------|-----------------------------------|
| `tide-whisperer-v2` | Medical data access                       | `GET /data/v2/all/{userId}`       |
| `harbour`           | Backend for front end (aggration gateway) | `GET /bff/v1/*`                   |
| `crew`              | Team management                           | `GET /teams`, `POST /teams`       |
| `hydrophone`        | Email notifications                       | `POST /send`                      |
| `pelican`           | Chat/messaging                            | `GET /messages`, `POST /messages` |

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
    APP2->>API: GET /messages (on page load only)
    API->>APP2: New messages
    APP2->>U2: Display message
```

## Error Handling

### Data Fetch Errors

the http service will throw an error if the response status code is not 2xx.

```typescript
private static handleError(error: AxiosError, excludedErrorCodes: number[] = []): Error {
  if (!error.response || excludedErrorCodes.includes(error.response.status)) {
    return error
  }

  if (error.response.status >= 400 && error.response.status <= 550) {
    switch (error.response.status) {
      case HttpStatus.StatusNotFound:
        throw Error(ErrorMessageStatus.NotFound)
      case HttpStatus.StatusInternalServerError:
        throw Error(t('error-http-500'))
      default:
        throw Error(t('error-http-40x'))
    }
  }
}
```

then the error will be handled in the component or the custom hook, most of the time using this pattern below:

```typescript
const funcName = useCallback(async (userid: string): Promise<void> => {
  setRefreshInProgress(true)
  try {
    const dataNeeded = await nameOfApiToCall(userid) // to change of course
      ...
  } catch (err) {
    const errorMessage = errorTextFromException(err)
    logError(errorMessage, 'fetch-patient-infos')
    alert.error(t('error-http-40x'))
    // Reset to minimal patient state on error
      ...
  } finally {
    setRefreshInProgress(false)
  }
}, [alert, t])
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

1. **Lazy Loading**: patient list metrics loaded on demand
2. **Data Windowing**: Only visible date range loaded
3. **Memoization**: Expensive calculations cached
4. **Web Workers**: Heavy processing off main thread, (not yet implemented, can be a future improvement)

---

## See Also

- [Packages](Packages.md) - Package responsibilities
- [Architecture](Architecture.md) - Overall architecture
- [Authentication](Authentication.md) - Auth flow details

