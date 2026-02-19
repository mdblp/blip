#!/usr/bin/env python3
"""
Translation JSON Files Key Updater
Updates translation keys in all translation JSON files to use new kebab-case keys.
# Dry run to preview changes (recommended first!)
python update_translation_files.py ./locales --dry-run

# Update all translation files in the locales folder
python update_translation_files.py ./locales

# Process a single translation file
python update_translation_files.py --file ./locales/fr/translation.json

# Show keys that weren't found in the mapping
python update_translation_files.py ./locales --show-unmapped

# Custom filename pattern (e.g., if your files are named differently)
python update_translation_files.py ./locales --pattern "translations.json"
"""

import os
import json
import sys

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


def update_translation_file(file_path, dry_run=False):
  """
  Update translation keys in a JSON file.
  Returns (modified, keys_updated, keys_not_found)
  """
  try:
    # Read the JSON file
    with open(file_path, 'r', encoding='utf-8') as f:
      translations = json.load(f)

    # Create new dictionary with updated keys
    new_translations = {}
    keys_updated = 0
    keys_not_found = []

    for old_key, value in translations.items():
      if old_key in KEY_MAPPING:
        new_key = KEY_MAPPING[old_key]
        new_translations[new_key] = value
        keys_updated += 1
      else:
        # Keep the key as-is if no mapping found
        new_translations[old_key] = value
        keys_not_found.append(old_key)

    # Write back to file if not dry run
    if keys_updated > 0 and not dry_run:
      with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(new_translations, f, ensure_ascii=False, indent=2)

    return True, keys_updated, keys_not_found

  except json.JSONDecodeError as e:
    print(f"  ✗ Error: Invalid JSON in {file_path}: {e}")
    return False, 0, []
  except Exception as e:
    print(f"  ✗ Error processing {file_path}: {e}")
    return False, 0, []


def find_translation_files(directory, filename_pattern="translation.json"):
  """
  Find all translation JSON files in the directory recursively.
  Default pattern matches 'translation.json' but can be customized.
  """
  translation_files = []

  for root, dirs, files in os.walk(directory):
    # Skip node_modules and other common directories
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build', 'coverage']]

    for file in files:
      # Match the filename pattern (case-insensitive)
      if file.lower() == filename_pattern.lower() or file.lower().endswith('.json'):
        file_path = os.path.join(root, file)
        translation_files.append(file_path)

  return translation_files


def main():
  """Main function to run the script."""
  import argparse

  parser = argparse.ArgumentParser(
    description='Update translation keys in all translation JSON files to use new kebab-case keys.'
  )
  parser.add_argument(
    'directory',
    nargs='?',
    default='.',
    help='Directory to search for translation JSON files (default: current directory)'
  )
  parser.add_argument(
    '--dry-run',
    action='store_true',
    help='Show what would be changed without modifying files'
  )
  parser.add_argument(
    '--file',
    help='Process a single translation file instead of a directory'
  )
  parser.add_argument(
    '--pattern',
    default='translation.json',
    help='Filename pattern to match (default: translation.json)'
  )
  parser.add_argument(
    '--show-unmapped',
    action='store_true',
    help='Show keys that were not found in the mapping'
  )

  args = parser.parse_args()

  print("=" * 80)
  print("Translation Keys Updater - Converting to Kebab-Case")
  print("=" * 80)

  if args.dry_run:
    print("\n🔍 DRY RUN MODE - No files will be modified\n")

  if args.file:
    # Process single file
    if not os.path.exists(args.file):
      print(f"\n✗ Error: File '{args.file}' not found")
      sys.exit(1)

    print(f"\nProcessing file: {args.file}")
    print("-" * 80)

    success, keys_updated, keys_not_found = update_translation_file(args.file, args.dry_run)

    if success:
      if keys_updated > 0:
        status = "Would update" if args.dry_run else "Updated"
        print(f"  ✓ {status} {keys_updated} key(s)")

        if args.show_unmapped and keys_not_found:
          print(f"\n  ⚠ {len(keys_not_found)} key(s) not found in mapping:")
          for key in keys_not_found[:10]:  # Show first 10
            print(f"    - {key}")
          if len(keys_not_found) > 10:
            print(f"    ... and {len(keys_not_found) - 10} more")
      else:
        print("  → No keys needed updating")
  else:
    # Process directory
    if not os.path.exists(args.directory):
      print(f"\n✗ Error: Directory '{args.directory}' not found")
      sys.exit(1)

    print(f"\nSearching for translation files in: {os.path.abspath(args.directory)}")
    print(f"Filename pattern: {args.pattern}\n")

    translation_files = find_translation_files(args.directory, args.pattern)

    if not translation_files:
      print("✗ No translation JSON files found")
      sys.exit(0)

    print(f"Found {len(translation_files)} translation file(s)")
    print("-" * 80)

    total_keys_updated = 0
    files_modified = 0
    all_unmapped_keys = set()

    for file_path in translation_files:
      relative_path = os.path.relpath(file_path, args.directory)
      print(f"\n📄 {relative_path}")

      success, keys_updated, keys_not_found = update_translation_file(file_path, args.dry_run)

      if success:
        if keys_updated > 0:
          status = "Would update" if args.dry_run else "Updated"
          print(f"  ✓ {status} {keys_updated} key(s)")
          total_keys_updated += keys_updated
          files_modified += 1
          all_unmapped_keys.update(keys_not_found)
        else:
          print("  → No keys needed updating")

    print("\n" + "=" * 80)
    print("Summary:")
    print("=" * 80)
    print(f"  Total files found: {len(translation_files)}")
    print(f"  Files modified: {files_modified}")
    print(f"  Total keys updated: {total_keys_updated}")

    if args.show_unmapped and all_unmapped_keys:
      print(f"\n  ⚠ {len(all_unmapped_keys)} unique key(s) not found in mapping:")
      for key in sorted(list(all_unmapped_keys))[:20]:  # Show first 20
        print(f"    - {key}")
      if len(all_unmapped_keys) > 20:
        print(f"    ... and {len(all_unmapped_keys) - 20} more")

    if args.dry_run:
      print("\n💡 Run without --dry-run to apply changes")
    else:
      print("\n✅ Done!")


if __name__ == "__main__":
  main()
