# YourLoops Project

## Project Overview
YourLoops is a medical application for diabetes management developed by Diabeloop. The application focuses on insulin tracking, statistics, and patient data visualization.

## Technology Stack
- **Frontend**: React with TypeScript
- **Package Manager**: npm
- **Architecture**: Monorepo structure
- **Internationalization**: i18next
- **Medical Domain**: Custom medical-domain package

## Code Style & Conventions

### TypeScript/React
- Use functional components with TypeScript
- Follow React hooks patterns
- Use proper interface definitions for props
- Import types with `type` keyword: `import { type FunctionComponent } from 'react'`
- Use destructuring for props

### Medical Domain
- Use `medical-domain` package for units and medical calculations
- Always use `Unit.InsulinUnit` for insulin measurements
- Round insulin values using `roundToOneDecimal()` utility
- Handle weight parameters with proper fallbacks (`'--'` if no weight)

### Internationalization
- Use `i18next` for all user-facing text
- Import: `import { t } from 'i18next'`
- Use descriptive keys: `t('meal-bolus')`, `t('basal-and-correction-bolus')`

### Component Structure
- Separate "dumb" components for UI rendering
- Use clear, descriptive prop interfaces
- Include proper copyright headers (Diabeloop BSD license)
- Follow conditional rendering patterns for optional data

### File Organization
- Components in `packages/yourloops/components/`
- Utilities in separate `.util.ts` files
- Follow existing directory structure

## Medical Context
- Handle different insulin types: meal boluses, manual boluses, pen boluses, basal/correction
- Support estimated Total Daily Dose (TDD) calculations
- Ensure proper medical unit handling and precision
- Consider patient safety in all calculations

## Testing
- Integration test files must be named with a role suffix matching the user role they test: `.hcp.spec.tsx`, `.caregiver.spec.tsx`, or `.patient.spec.tsx`
- Use `.common.spec.tsx` for integration tests covering features that are not role-specific
- This naming is required for the `integration-test-hcp`, `integration-test-caregiver`, `integration-test-patient`, and `integration-test-common` npm scripts to correctly select tests by role
- Integration tests are split in 3 layers (in `packages/yourloops/test/integration/`):
  - **Spec files** (`pages/**/*.spec.tsx`): mock the APIs, render the page, then call `testXXX` use cases. Keep as few `it()` as possible: each `it()` renders the page again, so group as many checks as possible in one `it()` to keep the tests fast
  - **Use cases** (`use-cases/*.ts`, `testXXX` functions): only perform the user actions (clicks, typing...) and call `checkXXX` functions. A use case must never contain an assert (`expect`, `waitFor` on an expectation) or the expected values of an assert
  - **Asserts** (`assert/*.assert.ts`, `checkXXX` functions): contain all the asserts and their expected values

## Development Practices
- Use feature branches: `feature/YLP-XXXX-description`
- Include proper error handling for medical data
- Validate all medical calculations
- Follow existing patterns for data processing and rendering
- Use an enum for the status field to improve the discoverability of the different values (we avoid raw strings if we can predict their values)
