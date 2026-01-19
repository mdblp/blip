# Feature Overview

YourLoops is a web application for type 1 diabetes (T1D) management, enabling patients and their care teams to visualize diabetes device data and communicate effectively.

## User Roles

```mermaid
flowchart LR
    subgraph Users
        P[Patient]
        C[Caregiver]
        H[Healthcare Provider]
    end

    subgraph Features
        DATA[View Data]
        SHARE[Share Data]
        TEAM[Manage Team]
        MONITOR[Monitor Patients]
        CHAT[Messaging]
    end

    P --> DATA
    P --> SHARE
    P --> CHAT
    C --> DATA
    C --> CHAT
    H --> DATA
    H --> TEAM
    H --> MONITOR
    H --> CHAT
```

| Role          | Description                                         |
|---------------|-----------------------------------------------------|
| **Patient**   | Person with diabetes, manages own data and sharing  |
| **Caregiver** | Family member or friend with access to patient data |
| **HCP**       | Healthcare provider managing multiple patients      |

## Core Features

### 1. Account Management

- **Sign Up**: Create Tidepool/Diabeloop platform account
- **Email Verification**: Verify email address
- **Consent Management**: Accept Terms of Use and Privacy Policy
- **Profile Setup**: Configure personal and medical information
- **Account Settings**: Update email, password, preferences

### 2. Data Visualization

```mermaid
flowchart TD
    subgraph Views
        BASICS[Basics View]
        DAILY[Daily View]
        TRENDS[Trends View]
    end

    subgraph Data
        BG[Blood Glucose]
        INS[Insulin]
        CARBS[Carbohydrates]
        EVENTS[Device Events]
    end

    BASICS --> BG
    BASICS --> INS
    DAILY --> BG
    DAILY --> INS
    DAILY --> CARBS
    DAILY --> EVENTS
    TRENDS --> BG
```

#### Basics View
General summary of all uploaded device data:
- Blood Glucose readings and distribution
- Infusion site changes
- Basal events
- Bolus events
- Time in Range statistics

#### Daily View
Detailed charts for a specific day:
- Timeline of all device data
- Basal:Bolus ratios
- Time in Target statistics
- Average blood glucose
- Notes and messages

#### Trends View
Analyze BGM or CGM trends over time:
- 1, 2, or 4 week analysis periods
- Statistical summaries

### 3. Default View Logic

The default view is determined by the most recent data type:

```mermaid
flowchart TD
    LOGIN[User Login] --> CHECK{Latest Data Type?}
    CHECK -->|CGM Data| TRENDS[Trends View]
    CHECK -->|BGM Data| BASICS[Basics View]
    CHECK -->|Pump Data| BASICS
```

### 4. Team Management

this diagram shows the relationship between the different user roles: Patients, Healthcare Professional and Caregivers.

```mermaid
flowchart TD
    subgraph Patient
        P[Patient]
        SHARE[Share Data with]
    end

    subgraph HCP["Healthcare Provider"]
        H[HCP]
        TEAM[Medical Team]
        PATIENTS[Patient List]
    end

    subgraph Caregiver
        C[Caregiver]
        ACCESS[View Patient Data]
    end

    P --> SHARE
    SHARE --> TEAM
    SHARE --> C
    H -- belongs to --> TEAM
    TEAM -- see  --> PATIENTS
    C --> ACCESS
```

#### For Patients
- Share data with healthcare providers
- Invite caregivers
- Manage sharing permissions
- Revoke access

#### For Healthcare Providers
- Create and manage medical teams
- Invite patients to teams
- invite hcp members
- manage hcp permissions (member vs admin)
- Monitor multiple patients
- Access patient data with permission

#### For Caregivers
- Accept patient invitations
- View shared patient data
- Communicate with patients

### 5. Communication

simple messaging between patients and their care team (messages fetched after the login):
- Team-based chat
- Message notifications
- Unread message tracking

### 6. Medical Reports

- Generate PDF reports
- Export data for appointments
- Print-ready visualizations

## Device Support

### Supported Devices

| Device Type      | Data Collected                |
|------------------|-------------------------------|
| **DBLG1**        | Pump data, CGM, settings      |
| **DBLG2**        | Pump data, CGM, settings      |
| **CGM**          | Continuous glucose readings   |
| **Insulin Pump** | Basal, bolus, settings        |

### Data Types

```mermaid
classDiagram
    class MedicalData {
        +Cbg[] cbg
        +Smbg[] smbg
        +Basal[] basal
        +Bolus[] bolus
        +Wizard[] wizards
        +Meal[] meals
        +PhysicalActivity[] activities
        +AlarmEvent[] alarms
    }
```

## User Flows

### Patient Onboarding

the patient onboarding occurs only through the DBLx device during its initial setup.

```mermaid
sequenceDiagram
    participant U as Patient
    participant D as DBL Device
    participant APP as YourLoops
    participant EMAIL as Email

    U->>D: Initial setup
    D->>APP: Sign up
    APP->>EMAIL: Send verification
    U->>EMAIL: Click verify link
    EMAIL->>APP: Verify email
    APP->>U: Show consent page
    U->>APP: Accept consent
    APP->>U: Show training
    U->>APP: Complete training
    APP->>U: Dashboard access
```

### HCP and Caregivers Onboarding


```mermaid
sequenceDiagram
    participant U as Hcp/Caregiver
    participant APP as YourLoops
    participant EMAIL as Email

    U->>APP:Sign up
    APP->>EMAIL: Send verification
    U->>EMAIL: Click verify link
    EMAIL->>APP: Verify email
    APP->>U: Show profile setup
    U->>APP: Complete profile
    APP->>U: Show training
    U->>APP: Complete training
    APP->>U: Dashboard access
```

### Data Sharing Flow

```mermaid
sequenceDiagram
    participant P as Patient
    participant APP as YourLoops
    participant H as HCP

    P->>APP: Share with team
    APP->>H: Notification
    H->>APP: Access patient list
    APP->>H: Show patient data
```

## Internationalization

YourLoops supports multiple languages:

| Language | Code |
|----------|------|
| English  | `en` |
| French   | `fr` |
| German   | `de` |
| Spanish  | `es` |
| Italian  | `it` |
| Dutch    | `nl` |
| Japanese | `ja` |

---

## See Also

- [Architecture](./Architecture.md) - Technical architecture
- [Data Flow](DataFlow.md) - How data flows through the app
- [Authentication](./Authentication.md) - User authentication
