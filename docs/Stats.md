# Analytics Tracking Documentation

This document provides a comprehensive overview of all analytics tracking events captured in the Blip application using
`AnalyticsApi.trackClick`.

## Patient List

### Filters and Search

#### `patient-list-filters`
- **Type:** Button
- **Description:** Tracks when a user opens the patient list filters dialog
- **Location:** Patient list header
- **User Action:** Clicking the "Filters" button

#### `patient-list-header-filters-reset`
- **Type:** Button
- **Description:** Tracks when a user resets all active filters in the patient list
- **Location:** Patient list header filters label
- **User Action:** Clicking the "reset" link to clear all filters

#### `patient-list-column-settings`
- **Type:** Button
- **Description:** Tracks when a user opens the column settings dialog to customize visible columns
- **Location:** Patient list header
- **User Action:** Clicking the settings icon button

### Patient List Filters (Popover)

#### `patient-filters-flagged`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the manual flag filter to show/hide flagged patients
- **Location:** Patient filters popover
- **User Action:** Toggling the manual flag switch

#### `patient-filters-out-of-range`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the time out of target range filter
- **Location:** Patient filters popover - Monitoring Alerts section
- **User Action:** Toggling the time out of range filter switch

#### `patient-filters-hypoglycemia`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the hypoglycemia alert filter
- **Location:** Patient filters popover - Monitoring Alerts section
- **User Action:** Toggling the hypoglycemia filter switch

#### `patient-filters-data-not-transmitted`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the data not transmitted filter
- **Location:** Patient filters popover - Monitoring Alerts section
- **User Action:** Toggling the data not transmitted filter switch

#### `patient-filters-unread-messages`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the unread messages filter
- **Location:** Patient filters popover - Notification section
- **User Action:** Toggling the unread messages filter switch

### Patient List Sorting

#### `patient-list-sort-{field}_{direction}`
- **Type:** Button
- **Description:** Tracks when a user sorts the patient list by a specific column
- **Location:** Medical team patient list
- **User Action:** Clicking on a column header to sort
- **Dynamic Values:**
  - `{field}`: The column name being sorted (e.g., "patient", "lastDataUpload", etc.)
  - `{direction}`: Sort direction ("asc" or "desc")

## Patient Data Views

### Data Display Controls

#### `patient-data-show-pdf`
- **Type:** Button
- **Description:** Tracks when a user opens the print/PDF report dialog
- **Location:** Patient data header
- **User Action:** Clicking the print report button

#### `patient-data-refresh-data`
- **Type:** Button
- **Description:** Tracks when a user manually refreshes patient data when no data is available
- **Location:** Patient data view (displayed when no diabetes data is present)
- **User Action:** Clicking the "Refresh" button

#### `daily-pan-back`
- **Type:** Button
- **Description:** Tracks when a user navigates backward in time on the daily chart view
- **Location:** Daily chart component
- **User Action:** Clicking the back navigation button or using keyboard shortcuts

## Dashboard

### Medical Reports

#### `medical-report-add`
- **Type:** Button
- **Description:** Tracks when a user initiates the creation of a new medical report
- **Location:** Medical report list in dashboard cards
- **User Action:** Clicking the "New" button to add a medical report

### Cartridge Change

#### `cartridge-changes-stat`
- **Type:** Link
- **Description:** Tracks when a user goes to a cartridge change daily page from dashboard
- **Location:** Cartridge change list in dashboard cards
- **User Action:** Clicking the date link of the cartridge change to go to the daily page at a specific date

## Print/PDF Report Dialog
#### `print-report-dialog-preset-{preset}`
- **Type:** Button
- **Description:** Tracks when a user selects a predefined date range preset for report generation
- **Location:** Print report dialog
- **User Action:** Clicking on a preset button (e.g., "last 7 days", "last 30 days", etc.)
- **Dynamic Values:**
  - `{preset}`: The selected preset identifier

#### `print-report-dialog-output-format-{format}`
- **Type:** Button
- **Description:** Tracks when a user changes the output format for the report
- **Location:** Print report dialog
- **User Action:** Selecting a different output format (PDF, CSV, etc.)
- **Dynamic Values:**
  - `{format}`: The selected output format

## Patient Profile Settings

#### `range-section-profile-{type}`
- **Type:** Button
- **Description:** Tracks when a user changes the diabetic profile type in the range settings
- **Location:** Patient profile - Range section
- **User Action:** Selecting a different diabetic type profile
- **Dynamic Values:**
  - `{type}`: The diabetic type selected (e.g., "type1", "type2", etc.)

## Device View

#### `device-view-section-{section}`
- **Type:** Link
- **Description:** Tracks when a user navigates to a different section in the device view
- **Location:** Device view menu
- **User Action:** Clicking on a menu item to view a specific device section
- **Dynamic Values:**
  - `{section}`: The device section identifier (e.g., "settings", "history", etc.)

## Care Team Settings

#### `care-team-settings-menu-info-and-members`
- **Type:** Link
- **Description:** Tracks when a user navigates to the "Info and Members" section in care team settings
- **Location:** Care team settings menu
- **User Action:** Clicking the "Info and Members" menu item

#### `care-team-settings-menu-monitoring-alerts`
- **Type:** Link
- **Description:** Tracks when a user navigates to the "Monitoring Alerts" section in care team settings
- **Location:** Care team settings menu
- **User Action:** Clicking the "Monitoring Alerts" menu item

## Parameters

#### `show-parameters-at`
- **Type:** Button
- **Description:** Tracks when a user opens the parameters popover to view effective parameters at a specific date
- **Location:** Show parameters component
- **User Action:** Clicking the button to display parameters at a specific date

## Daily View Tooltips (Hover Events)

#### `daily-basal`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a basal rate element to view its tooltip
- **Location:** Daily chart - Basal section
- **User Action:** Hovering over a basal rate element

#### `daily-bolus`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a bolus element to view its tooltip
- **Location:** Daily chart - Bolus/Carbs section
- **User Action:** Hovering over a bolus element

#### `daily-smbg`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a self-monitoring blood glucose (SMBG) data point
- **Location:** Daily chart - Blood glucose section
- **User Action:** Hovering over an SMBG data point

#### `daily-cbg`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a continuous blood glucose (CBG) data point
- **Location:** Daily chart - Blood glucose section
- **User Action:** Hovering over a CBG data point

#### `daily-carb`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a carbohydrate entry (including rescue carbs)
- **Location:** Daily chart - Bolus/Carbs section
- **User Action:** Hovering over a carb element

#### `daily-eating-shortly`
- **Type:** Hover
- **Description:** Tracks when a user hovers over an "eating shortly" event marker
- **Location:** Daily chart - Events section
- **User Action:** Hovering over an eating shortly event

#### `daily-iob`
- **Type:** Hover
- **Description:** Tracks when a user hovers over an insulin on board (IOB) data point
- **Location:** Daily chart - IOB curve
- **User Action:** Hovering over the IOB curve

#### `daily-reservoir-change`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a reservoir change event marker
- **Location:** Daily chart - Events section
- **User Action:** Hovering over a reservoir change marker

#### `daily-physical-activity`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a physical activity event marker
- **Location:** Daily chart - Events section
- **User Action:** Hovering over a physical activity marker

#### `daily-parameter`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a parameter change event marker
- **Location:** Daily chart - Events section
- **User Action:** Hovering over a parameter change marker

#### `daily-warmup`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a CGM sensor warmup period
- **Location:** Daily chart - Events section
- **User Action:** Hovering over a warmup indicator

#### `daily-alarm-event`
- **Type:** Hover
- **Description:** Tracks when a user hovers over an alarm event marker
- **Location:** Daily chart - Events section
- **User Action:** Hovering over an alarm event marker

#### `daily-night-mode`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a night mode period indicator
- **Location:** Daily chart - Events section
- **User Action:** Hovering over a night mode marker

#### `daily-time-change`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a time change event marker
- **Location:** Daily chart - Events section
- **User Action:** Hovering over a time change indicator

#### `daily-zen-mode`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a zen mode period indicator
- **Location:** Daily chart - Events section
- **User Action:** Hovering over a zen mode marker

#### `daily-confidential`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a confidential mode indicator
- **Location:** Daily chart - Various sections
- **User Action:** Hovering over confidential data

#### `daily-event-superposition`
- **Type:** Button
- **Description:** Tracks when a user clicks on overlapping events to expand the event details popover
- **Location:** Daily chart - Events section
- **User Action:** Clicking on superposed events indicator

## Statistics Widget Tooltips (Hover Events)

#### `time-in-range-chart-title`
- **Type:** Hover
- **Description:** Tracks when a user hovers over the info icon of the Time In Range chart title
- **Location:** Time In Range statistics widget
- **User Action:** Hovering over the info tooltip icon

#### `time-in-range-dt1-chart-title`
- **Type:** Hover
- **Description:** Tracks when a user hovers over the info icon of the Time In Range DT1 chart title
- **Location:** Time In Range DT1 statistics widget (for DT1 Pregnancy profile)
- **User Action:** Hovering over the info tooltip icon

#### `time-in-tight-range-chart-title`
- **Type:** Hover
- **Description:** Tracks when a user hovers over the info icon of the Time In Tight Range chart title
- **Location:** Time In Tight Range statistics widget
- **User Action:** Hovering over the info tooltip icon

#### `sensor-usage-stat`
- **Type:** Hover
- **Description:** Tracks when a user hovers over the info icon of the Sensor Usage statistic
- **Location:** Sensor Usage statistics widget (Dashboard and Trends view)
- **User Action:** Hovering over the info tooltip icon

---

## Tracking Categories Summary

### By Element Type:
- **Button:** 10 unique events
- **Toggle:** 5 unique events
- **Link:** 3 unique events

### By Feature Area:
- **Patient List Management:** 11 events
- **Report Generation:** 3 events
- **Patient Data Views:** 3 events
- **Settings & Configuration:** 4 events
- **Medical Reports:** 1 event
- **Parameters:** 1 event

### Dynamic Tracking Events:
Some tracking events include dynamic values that provide additional context:
1. `patient-list-sort-{field}_{direction}` - Captures which column and direction
2. `print-report-dialog-preset-{preset}` - Captures which date preset
3. `print-report-dialog-output-format-{format}` - Captures output format choice
4. `range-section-profile-{type}` - Captures diabetic profile type
5. `device-view-section-{section}` - Captures which device section

---

*Last updated: March 23, 2026*

