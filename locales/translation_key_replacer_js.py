#!/usr/bin/env python3
"""
Translation Key Replacer Script
Replaces old translation keys with new kebab-case keys in JS/JSX files.

# Dry run (preview changes without modifying files)
python replace_translation_keys.py --dry-run

# Process all files in current directory
python replace_translation_keys.py

# Process specific directory
python replace_translation_keys.py ./src

# Process single file
python replace_translation_keys.py --file ./src/components/Header.jsx

"""

import os
import re
import sys
from collections import defaultdict

REPLACEMENT_STATS = defaultdict(int)

# Mapping of old keys to new keys
KEY_MAPPING = {
  "%-I:%M %p": "time-format-12h",
  "%b %-d, %Y": "date-format-short",
  "**Avg. Daily Insulin:** All basal and bolus insulin delivery (in Units) added together, divided by the number of days in this view.": "avg-daily-insulin-tooltip",
  "**Daily Insulin:** All basal and bolus insulin delivery (in Units) added together.": "daily-insulin-tooltip",
  "**Readings In Range:** Daily average of the number of {{smbgLabel}} readings.": "readings-in-range-tooltip",
  "**Time In Loop Mode:** Daily average of the time spent in automated basal delivery.": "time-in-loop-mode-avg-tooltip",
  "**Time In Loop Mode:** Time spent in automated basal delivery.": "time-in-loop-mode-tooltip",
  "**Time In Range:** Daily average of the time spent in range, based on {{cbgLabel}} readings.": "time-in-range-avg-tooltip",
  "**Time In Range:** Time spent in range, based on {{cbgLabel}} readings.": "time-in-range-tooltip",
  "**Total Insulin:** All basal and bolus insulin delivery (in Units) added together": "total-insulin-tooltip",
  "**Total Insulin:** All basal and bolus insulin delivery (in Units) added together, divided by the number of days in this view": "avg-daily-insulin-alt-tooltip",
  "100% of Readings": "readings-100-percent",
  "50% of Readings": "readings-50-percent",
  "80% of Readings": "readings-80-percent",
  "A_Label": "label-on",
  "Advanced": "advanced",
  "An unknown error occurred": "error-unknown",
  "Anonymous user": "anonymous-user",
  "Approx {{numVisibleDays}} days in view": "days-in-view-approx",
  "Automated": "automated",
  "Average BG": "average-bg",
  "Avg BG readings / day": "avg-bg-readings-per-day",
  "Avg boluses / day": "avg-boluses-per-day",
  "Avg daily carbs": "avg-daily-carbs",
  "Avg per day": "avg-per-day",
  "Avg total daily dose": "avg-total-daily-dose",
  "Avg. Daily Carbs": "avg-daily-carbs-label",
  "Avg. Daily Insulin": "avg-daily-insulin-label",
  "Avg. Daily Readings In Range": "avg-daily-readings-in-range",
  "Avg. Daily Total Insulin": "avg-daily-total-insulin",
  "BG": "bg-label",
  "BG readings": "bg-readings",
  "BGM": "bgm",
  "Basal": "basal",
  "Basal Events": "basal-events",
  "Basal Rates": "basal-rates",
  "Basal:Bolus Ratio": "basal-bolus-ratio",
  "Basals": "basals",
  "Below {{threshold}}": "below-threshold",
  "Bolus": "bolus",
  "Bolus Legend": "bolus-legend",
  "Bolusing": "bolusing",
  "CGM": "cgm",
  "Calculator": "calculator",
  "Calibration": "calibration",
  "Calibrations": "calibrations",
  "Cancel": "cancel",
  "Carbohydrates": "carbohydrates",
  "Carbs": "carbs",
  "Cartridge change": "cartridge-change",
  "Cgm sensor expiration date": "cgm-sensor-expiration",
  "Cgm transmitter end of life": "cgm-transmitter-end-of-life",
  "Cgm transmitter id": "cgm-transmitter-id",
  "Cgm transmitter software version": "cgm-transmitter-software-version",
  "Change": "change",
  "Change Cartridge": "change-cartridge",
  "Close": "close",
  "Comment_submit": "comment-submit",
  "Confidential mode": "confidential-mode",
  "Confirmed": "confirmed",
  "Correction": "correction",
  "DOB: {{birthdate}}": "dob-label",
  "Daily Charts": "daily-charts",
  "Daily Dose ÷ Weight": "daily-dose-per-weight",
  "Date": "date",
  "Delivered": "delivered",
  "Derived from _**{{total}}**_ {{smbgLabel}} readings.": "derived-from-readings",
  "Device": "device",
  "Duration": "duration",
  "Edit": "edit",
  "Entered at": "entered-at",
  "Events": "events",
  "F_Friday": "friday-abbrev",
  "Fill Cannula": "fill-cannula",
  "Fill Tubing": "fill-tubing",
  "GMI ({{bgSourceLabel}})": "gmi-label",
  "Glucose": "glucose",
  "Hang on there, skippy! You unselected all of the data!": "all-data-unselected-warning",
  "High fat meal": "high-fat-meal",
  "IMEI": "imei",
  "IOB": "iob",
  "Identifier": "identifier",
  "Infusion site changes": "infusion-site-changes",
  "Insulin ratio": "insulin-ratio",
  "Intensity": "intensity",
  "Interrupted": "interrupted",
  "Legend": "legend",
  "Level": "level",
  "Loading...": "loading",
  "Loop mode": "loop-mode-on",
  "Loop mode off": "loop-mode-off",
  "Loop mode status": "loop-mode-status",
  "millisecond": "millisecond",
  "milliseconds": "milliseconds",
  "MMM D": "date-format-mmm-d",
  "MMM D, YYYY": "date-format-mmm-d-yyyy",
  "MMM D, YYYY h:mm a": "date-format-mmm-d-yyyy-time",
  "MMM D, h:mm a": "date-format-mmm-d-time",
  "MMMM D": "date-format-mmmm-d",
  "MMMM D [at] h:mm a": "date-format-mmmm-d-at-time",
  "M_Label": "label-off",
  "M_Monday": "monday-abbrev",
  "Manual": "manual",
  "Manual Bolus": "manual-bolus",
  "Manufacturer": "manufacturer",
  "Meal Bolus": "meal-bolus",
  "Median": "median",
  "Meter": "meter",
  "N/A": "not-available",
  "Name": "name",
  "New": "new",
  "No BG data available": "no-bg-data",
  "No diabeloop device informations available": "no-device-info",
  "No diabeloop device parameters available": "no-device-parameters",
  "Override": "override",
  "Override up & down": "override-up-down",
  "Page {{page}} of {{pageCount}}": "page-count",
  "Parameter": "parameter",
  "Parameters History": "parameters-history",
  "Physical Activity": "physical-activity",
  "select-view-to-see-data": "select-view-prompt",
  "Post_submit": "post-submit",
  "Prescribed by Loop Mode": "prescribed-by-loop-mode",
  "Printed on: ": "printed-on",
  "Product": "product",
  "Profile": "profile",
  "Pump": "pump",
  "Pump version": "pump-version",
  "Readings Above Range": "readings-above-range",
  "Readings Below Range": "readings-below-range",
  "Readings In Range": "readings-in-range",
  "Recommended": "recommended",
  "Refresh": "refresh",
  "Rescuecarbs": "rescue-carbs",
  "Reservoir change": "reservoir-change",
  "Reservoir changes": "reservoir-changes",
  "Sa_Saturday": "saturday-abbrev",
  "Save": "save",
  "Sending...": "sending",
  "Serial Number": "serial-number",
  "Settings on day": "settings-on-day",
  "Showing BGM data (no CGM)": "showing-bgm-no-cgm",
  "Showing BGM data (not enough CGM)": "showing-bgm-insufficient-cgm",
  "Showing CGM data": "showing-cgm-data",
  "Software version": "software-version",
  "Su_Sunday": "sunday-abbrev",
  "Suspends": "suspends",
  "Temp Basals": "temp-basals",
  "Th_Thursday": "thursday-abbrev",
  "The Basics": "basics-view-title",
  "There is no {{displayType}} data for this time period :(": "no-data-for-period",
  "nothing-to-display": "nothing-to-display",
  "Time Above Range": "time-above-range",
  "Time Below Range": "time-below-range",
  "Time Change": "time-change",
  "Time In Loop Mode": "time-in-loop-mode",
  "Time In Loop Mode OFF": "time-in-loop-mode-off-label",
  "Time In Loop Mode ON": "time-in-loop-mode-on-label",
  "Time In Range": "time-in-range",
  "Time in Target": "time-in-target",
  "Time in {{automatedLabel}}": "time-in-automated",
  "Time in {{automatedLabel}} ratio": "time-in-automated-ratio",
  "Timezone Change": "timezone-change",
  "Total Carbs": "total-carbs",
  "Total Insulin": "total-insulin",
  "Total basal events": "total-basal-events",
  "Tu_Tuesday": "tuesday-abbrev",
  "Type a comment here ...": "comment-placeholder",
  "Type a new note here ...": "note-placeholder",
  "U": "unit-u",
  "U/kg": "unit-u-per-kg",
  "Undelivered": "undelivered",
  "Underride": "underride",
  "Unit": "unit",
  "Uploaded on": "uploaded-on",
  "Value": "value",
  "W_Wednesday": "wednesday-abbrev",
  "Weight": "weight",
  "Why is this grey? There is not enough data to show this statistic.": "insufficient-data-tooltip",
  "YYYY-MM-DD": "date-format-yyyy-mm-dd",
  "abbrev_duration_day": "duration-day-abbrev",
  "abbrev_duration_hour": "duration-hour-abbrev",
  "abbrev_duration_minute": "duration-minute-abbrev",
  "abbrev_duration_minute_m": "duration-minute-abbrev-m",
  "abbrev_duration_second": "duration-second-abbrev",
  "above {{value}} {{- units}}": "above-value",
  "below {{value}} {{- units}}": "below-value",
  "between {{low}} - {{high}} {{- units}}": "between-range",
  "birthday-format": "birthday-format",
  "bolus_biphasic": "bolus-type-biphasic",
  "bolus_normal": "bolus-type-normal",
  "bolus_pen": "bolus-type-pen",
  "bolus_type": "bolus-type",
  "carbs": "carbs-label",
  "compute-ndays-time-in-auto": "time-in-auto-calculation-ndays",
  "compute-ndays-time-in-range": "time-in-range-calculation-ndays",
  "compute-oneday-time-in-auto": "time-in-auto-calculation-oneday",
  "compute-oneday-time-in-range": "time-in-range-calculation-oneday",
  "custom": "custom",
  "date-format": "date-format-locale",
  "day": "day",
  "days": "days",
  "ddd": "day-abbrev-3",
  "ddd, MMM D, Y": "date-format-ddd-mmm-d-y",
  "ddd, MMM D, YYYY": "date-format-ddd-mmm-d-yyyy",
  "dddd, MMMM D": "date-format-dddd-mmmm-d",
  "dddd, h:mm a": "date-format-dddd-time",
  "delivered": "delivered-label",
  "from": "from",
  "g": "unit-grams",
  "h a": "time-format-h-a",
  "h:mm a": "time-format-h-mm-a",
  "h:mma": "time-format-h-mma",
  "ha": "time-format-ha",
  "high": "high",
  "high-pa": "physical-activity-high",
  "hour": "hour",
  "hours": "hours",
  "img-alt-hover-for-more-info": "img-alt-hover-info",
  "insufficient-data": "insufficient-data-explanation",
  "kg": "unit-kg",
  "lb": "unit-lb",
  "level": "level-label",
  "low": "low",
  "low-pa": "physical-activity-low",
  "medium-pa": "physical-activity-moderate",
  "minute": "minute",
  "minutes": "minutes",
  "month": "month",
  "months": "months",
  "note": "note",
  "pdf-date-range": "pdf-date-range-label",
  "pdf-footer-center-text": "pdf-footer-center-text",
  "second": "second",
  "seconds": "seconds",
  "settings": "settings",
  "to": "to",
  "unknown": "unknown",
  "week": "week",
  "weeks": "weeks",
  "wheel-label-off": "wheel-off-label",
  "wheel-label-on": "wheel-on-label",
  "year": "year",
  "years": "years",
  "{{date}} - {{time}}": "date-time-format",
  "{{numVisibleDays}} days in view": "days-in-view-exact",
  "{{title}} (cont.)": "title-continued"
}


def escape_for_regex(text):
  """Escape special regex characters in text."""
  # Escape all special regex characters
  return re.escape(text)

def replace_translation_keys(content, file_path):
  """Replace old translation keys with new ones in the content."""
  modified = False
  changes = []

  # Sort keys by length (longest first) to avoid partial matches
  sorted_keys = sorted(KEY_MAPPING.keys(), key=len, reverse=True)

  for old_key in sorted_keys:
    new_key = KEY_MAPPING[old_key]

    # Escape the old key for regex
    escaped_old_key = escape_for_regex(old_key)

    # Pattern to match t('old-key') or t("old-key")
    # Captures: quote type, key, everything after
    pattern = rf"(t\s*\(\s*)(['\"])({escaped_old_key})\2"

    # Count occurrences before replacement
    matches = re.findall(pattern, content)

    if matches:
      count = len(matches)
      content = re.sub(pattern, rf"\1\2{new_key}\2", content)
      modified = True
      changes.append(f"  '{old_key}' -> '{new_key}' ({count} occurrence(s))")

      # Increment global stats
      REPLACEMENT_STATS[old_key] += count

  return content, modified, changes


def process_file(file_path, dry_run=False):
  """Process a single JS/JSX file."""
  try:
    with open(file_path, 'r', encoding='utf-8') as f:
      content = f.read()

    new_content, modified, changes = replace_translation_keys(content, file_path)

    if modified:
      if not dry_run:
        with open(file_path, 'w', encoding='utf-8') as f:
          f.write(new_content)
        print(f"\n✓ Modified: {file_path}")
      else:
        print(f"\n→ Would modify: {file_path}")

      for change in changes:
        print(change)

      return True

    return False

  except Exception as e:
    print(f"\n✗ Error processing {file_path}: {e}")
    return False


def find_js_jsx_files(directory):
  """Find all .js and .jsx files in the directory recursively."""
  js_files = []

  for root, dirs, files in os.walk(directory):
    # Skip node_modules and other common directories
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build', 'coverage']]

    for file in files:
      if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
        js_files.append(os.path.join(root, file))

  return js_files


def main():
  """Main function to run the script."""
  import argparse

  parser = argparse.ArgumentParser(
    description='Replace old translation keys with new kebab-case keys in JS/JSX files.'
  )
  parser.add_argument(
    'directory',
    nargs='?',
    default='.',
    help='Directory to search for JS/JSX files (default: current directory)'
  )
  parser.add_argument(
    '--dry-run',
    action='store_true',
    help='Show what would be changed without modifying files'
  )
  parser.add_argument(
    '--file',
    help='Process a single file instead of a directory'
  )

  args = parser.parse_args()

  if args.dry_run:
    print("🔍 DRY RUN MODE - No files will be modified\n")

  if args.file:
    # Process single file
    if not os.path.exists(args.file):
      print(f"Error: File '{args.file}' not found")
      sys.exit(1)

    print(f"Processing file: {args.file}")
    modified = process_file(args.file, args.dry_run)

    if not modified:
      print(f"\nNo changes needed in {args.file}")
  else:
    # Process directory
    if not os.path.exists(args.directory):
      print(f"Error: Directory '{args.directory}' not found")
      sys.exit(1)

    print(f"Searching for JS/JSX files in: {os.path.abspath(args.directory)}\n")

    js_files = find_js_jsx_files(args.directory)

    if not js_files:
      print("No JS/JSX files found")
      sys.exit(0)

    print(f"Found {len(js_files)} JS/JSX file(s)\n")
    print("=" * 80)

    modified_count = 0

    for file_path in js_files:
      if process_file(file_path, args.dry_run):
        modified_count += 1

    print("\n" + "=" * 80)
    print(f"\nSummary:")
    print(f"  Total files processed: {len(js_files)}")
    print(f"  Files modified: {modified_count}")
    print(f"  Files unchanged: {len(js_files) - modified_count}")

    # Print replacement summary
    print("\nReplacement Summary:")
    print("-" * 80)

    unused_keys = []

    for old_key in sorted(KEY_MAPPING.keys()):
      count = REPLACEMENT_STATS.get(old_key, 0)
      if count > 0:
        print(f"✓ '{old_key}' replaced {count} time(s)")
      else:
        unused_keys.append(old_key)

    if unused_keys:
      print("\n⚠️ Keys not found (not replaced in any file):")
      print("-" * 80)
      for key in unused_keys:
        print(f"• '{key}'")

    print("\n💡 If you expected these keys to be found, double-check quote types, spacing, or usage.")

    if args.dry_run:
      print("\n💡 Run without --dry-run to apply changes")
    else:
      print("\n✅ Done!")


if __name__ == "__main__":
  main()
