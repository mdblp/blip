# YourLoops Project - Copilot Instructions

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

## Development Practices
- Use feature branches: `feature/YLP-XXXX-description`
- Include proper error handling for medical data
- Validate all medical calculations
- Follow existing patterns for data processing and rendering
