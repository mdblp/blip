# Analytics Tracking Documentation

This document provides a comprehensive overview of all analytics tracking events captured in the Blip application using
`AnalyticsApi.trackClick` and `AnalyticsApi.trackHover`.

Events are organized by page for easy reference.

---

## Patient List Page
### Header Controls
#### `patient-list-filters`
- **Type:** Button
- **Description:** Tracks when a user opens the patient list filters dialog by clicking the "Filters" button
#### `patient-list-header-filters-reset`
- **Type:** Button
- **Description:** Tracks when a user resets all active filters in the patient list by clicking the "reset" link
#### `patient-list-column-settings`
- **Type:** Button
- **Description:** Tracks when a user opens the column settings dialog to customize visible columns by clicking the settings icon button

### Sorting
#### `patient-list-sort-{field}_{direction}`
- **Type:** Button
- **Description:** Tracks when a user sorts the patient list by clicking on a column header
- **Dynamic Values:**
  - `{field}`: The column name being sorted (e.g., "patient", "lastDataUpload", etc.)
  - `{direction}`: Sort direction ("asc" or "desc")

### Filters (Popover)
#### `patient-filters-flagged`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the manual flag filter to show/hide flagged patients in the filters popover
#### `patient-filters-out-of-range`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the time out of target range filter in the filters popover (Monitoring Alerts section)
#### `patient-filters-hypoglycemia`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the hypoglycemia alert filter in the filters popover (Monitoring Alerts section)
#### `patient-filters-hyperglycemia`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the hyperglycemia alert filter in the filters popover (Monitoring Alerts section)
#### `patient-filters-data-not-transmitted`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the data not transmitted filter in the filters popover (Monitoring Alerts section)
#### `patient-filters-unread-messages`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the unread messages filter in the filters popover (Notification section)

### Monitoring Alerts
#### `monitoring-alerts-ack-{alertType}`
- **Type:** Button
- **Description:** Tracks when a user clicks the acknowledge button on a monitoring alert in the patient list
- **Dynamic Values:**
  - `{alertType}`: The type of alert being acknowledged (e.g., "hypo", "time-out-of-target", "data-not-transmitted")
#### `acknowledge-monitoring-alert-dialog-analyse-{alertName}`
- **Type:** Button
- **Description:** Tracks when a user clicks "Analyse" in the monitoring alert acknowledgment dialog to view patient data related to the alert
- **Dynamic Values:**
  - `{alertName}`: The name of the alert being analyzed
#### `acknowledge-monitoring-alert-dialog-acknowledge-{alertName}`
- **Type:** Button
- **Description:** Tracks when a user clicks "Acknowledge" in the monitoring alert acknowledgment dialog to confirm alert acknowledgment
- **Dynamic Values:**
  - `{alertName}`: The name of the alert being acknowledged

---

## Dashboard Page
### Medical Reports
#### `medical-report-add`
- **Type:** Button
- **Description:** Tracks when a user clicks the "New" button in the medical report list to create a new medical report
### Cartridge Changes
#### `cartridge-changes-stat`
- **Type:** Link
- **Description:** Tracks when a user clicks the date link of a cartridge change to navigate to the daily page at that specific date
### Statistics Widgets (Hover Events)
#### `sensor-usage-stat`
- **Type:** Hover
- **Description:** Tracks when a user hovers over the info icon of the Sensor Usage statistic widget on the dashboard

---

## Daily Page
### Navigation Controls
#### `daily-pan-back`
- **Type:** Button
- **Description:** Tracks when a user navigates backward in time by clicking the back navigation button or using keyboard shortcuts
#### `daily-pan-forward`
- **Type:** Button
- **Description:** Tracks when a user navigates forward in time by clicking the forward navigation button or using keyboard shortcuts
#### `daily-most-recent`
- **Type:** Button
- **Description:** Tracks when a user jumps to the most recent date by clicking the "Most Recent" button
### Action Controls
#### `patient-data-show-pdf`
- **Type:** Button
- **Description:** Tracks when a user opens the print/PDF report dialog by clicking the print report button
#### `patient-data-refresh-data`
- **Type:** Button
- **Description:** Tracks when a user manually refreshes patient data by clicking the "Refresh" button when no diabetes data is available
#### `show-parameters-at`
- **Type:** Button
- **Description:** Tracks when a user opens the parameters popover to view effective parameters at a specific date
### Chart Interactions
#### `daily-event-superposition`
- **Type:** Button
- **Description:** Tracks when a user clicks on overlapping events to expand the event details popover
- **Location:** Daily chart - Events section
#### `daily-basal`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a basal rate element in the basal section
#### `daily-bolus`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a bolus element in the bolus/carbs section
#### `daily-smbg`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a self-monitoring blood glucose (SMBG) data point
#### `daily-cbg`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a continuous blood glucose (CBG) data point
#### `daily-carb`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a carbohydrate entry (including rescue carbs)
#### `daily-eating-shortly`
- **Type:** Hover
- **Description:** Tracks when a user hovers over an "eating shortly" event marker
#### `daily-iob`
- **Type:** Hover
- **Description:** Tracks when a user hovers over an insulin on board (IOB) data point on the IOB curve
#### `daily-reservoir-change`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a reservoir change event marker
#### `daily-physical-activity`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a physical activity event marker
#### `daily-parameter`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a parameter change event marker
#### `daily-warmup`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a CGM sensor warmup period
#### `daily-alarm-event`
- **Type:** Hover
- **Description:** Tracks when a user hovers over an alarm event marker
#### `daily-night-mode`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a night mode period indicator
#### `daily-time-change`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a time change event marker
#### `daily-zen-mode`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a zen mode period indicator
#### `daily-confidential`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a confidential mode indicator

---

## Trends Page
### Navigation Controls
#### `trends-pan-back`
- **Type:** Button
- **Description:** Tracks when a user navigates backward in time by clicking the back navigation button
#### `trends-pan-forward`
- **Type:** Button
- **Description:** Tracks when a user navigates forward in time by clicking the forward navigation button
#### `trends-pan-most-recent`
- **Type:** Button
- **Description:** Tracks when a user jumps to the most recent date by clicking the "Most Recent" button
#### `trends-refresh`
- **Type:** Button
- **Description:** Tracks when a user manually refreshes trends data by clicking the "Refresh" button
### Period Selection
#### `trends-preset-period-{preset}`
- **Type:** Button
- **Description:** Tracks when a user selects a predefined time period by clicking on a preset period button (e.g., "1 week", "2 weeks", "4 weeks")
- **Dynamic Values:**
  - `{preset}`: The selected period preset (e.g., "1week", "2weeks", "4weeks")
### Day Filters
#### `trends-day-{day}`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the visibility of a specific day of the week by clicking on a day toggle (e.g., Monday, Tuesday, etc.)
- **Dynamic Values:**
  - `{day}`: The day of the week (e.g., "monday", "tuesday", etc.)
#### `trends-weekday-group`
- **Type:** Toggle
- **Description:** Tracks when a user toggles all weekdays (Monday-Friday) at once by clicking the weekday group toggle
#### `trends-weekend-group`
- **Type:** Toggle
- **Description:** Tracks when a user toggles weekend days (Saturday-Sunday) at once by clicking the weekend group toggle
### Range Selection
#### `range-label-toggle-{displayFlag}`
- **Type:** Toggle
- **Description:** Tracks when a user toggles the display of different percentile ranges (100%, 80%, 50%, Median) on the trends chart
- **Dynamic Values:**
  - `{displayFlag}`: The display flag identifier (e.g., "cbg100Enabled", "cbg80Enabled", "cbg50Enabled", "cbgMedianEnabled")
### Statistics Widgets (Hover Events)
#### `time-in-range-chart-title`
- **Type:** Hover
- **Description:** Tracks when a user hovers over the info icon of the Time In Range chart title
#### `time-in-range-dt1-chart-title`
- **Type:** Hover
- **Description:** Tracks when a user hovers over the info icon of the Time In Range DT1 chart title (for DT1 Pregnancy profile)
#### `time-in-tight-range-chart-title`
- **Type:** Hover
- **Description:** Tracks when a user hovers over the info icon of the Time In Tight Range chart title
#### `sensor-usage-stat`
- **Type:** Hover
- **Description:** Tracks when a user hovers over the info icon of the Sensor Usage statistic widget
### Carbs and Bolus Card (Hover Events)
#### `carbs-and-bolus-cell-rescue-carbs`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a rescue carbs cell in the Carbs and Bolus card to view details
#### `carbs-and-bolus-cell-manual-pen-bolus`
- **Type:** Hover
- **Description:** Tracks when a user hovers over a manual/pen bolus cell in the Carbs and Bolus card to view details

---

## Profile Page
### Range Settings
#### `range-section-profile-{type}`
- **Type:** Button
- **Description:** Tracks when a user changes the diabetic profile type in the range settings by selecting a different diabetic type profile
- **Dynamic Values:**
  - `{type}`: The diabetic type selected (e.g., "type1", "type2", etc.)

---

## Devices Page
### Device View Navigation
#### `device-view-section-{section}`
- **Type:** Link
- **Description:** Tracks when a user navigates to a different section in the device view by clicking on a menu item
- **Dynamic Values:**
  - `{section}`: The device section identifier (e.g., "settings", "history", etc.)

---

## Care Team Settings Page
### Navigation Menu
#### `care-team-settings-menu-info-and-members`
- **Type:** Link
- **Description:** Tracks when a user navigates to the "Info and Members" section by clicking the menu item

#### `care-team-settings-menu-monitoring-alerts`
- **Type:** Link
- **Description:** Tracks when a user navigates to the "Monitoring Alerts" section by clicking the menu item

---

## Print/PDF Report Dialog
### Report Configuration
#### `print-report-dialog-preset-{preset}`
- **Type:** Button
- **Description:** Tracks when a user selects a predefined date range preset for report generation by clicking on a preset button (e.g., "last 7 days", "last 30 days", etc.)
- **Dynamic Values:**
  - `{preset}`: The selected preset identifier
#### `print-report-dialog-output-format-{format}`
- **Type:** Button
- **Description:** Tracks when a user changes the output format for the report by selecting a different output format (PDF, CSV, etc.)
- **Dynamic Values:**
  - `{format}`: The selected output format

---

*Last updated: March 26, 2026*

