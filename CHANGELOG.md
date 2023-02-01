# Blip
Blip is the web front end for YourLoops system.
It is based on Tidepool Blip 1.27.

## 3.2.0-beta - 2023-02-01
### Engineering use
- YLP-2065 Migrate CBGDateTraceLabel from viz to dumb
- YLP-2068 Update minor dependencies
- YLP-2069 Migrate CBGSlicesContainer from viz to dumb
- YLP-2084 Migrate trends Y axis labels and ticks to dumb
- YLP-2085 Update major dependencies with no API break
- YLP-2091 Remove withDefaultYPosition method wrapper from viz

## 3.1.0 - 2023-01-31
### Fixed
- YLP-1682 Labels in PDF reports are not clear
- YLP-1704 PDF Report Generation failed
- YLP-1963 Glucose unit not coherent between curves and DBL settings
### Added
- YLP-1524 Add change password option for HCP and caregivers
- YLP-1590 Changing role caregiver to hcp with auth0
- YLP-1679 Allow caregivers to remove patients from their direct share
- YLP-1850 Patient search should comply to INS standard
- YLP-1943 Training material is acknowledged after Yourloops TM is opened and read (including the new checkbox message) and before any use of YLP
- YLP-1944 Rename "Intended Use" in the footer as "Product labelling"
- YLP-1947 Add team selection dropdown on patient dashboard for HCP
- YLP-1973 User should be able to uncheck the training check box
- YLP-1989 New friendly login page
### Engineering use
- YLP-1444 Handle user name display for Japanese
- YLP-1624 Fix error messages when inviting a patient already in the team
- YLP-1625 Display an explicit error when trying to share data with another patient
- YLP-1680 getPatientData Api method has a wrong parameter
- YLP-1726 Rework signup with Auth0
- YLP-1805 Push error to the backend
- YLP-1868 Add route to invite team member
- YLP-1873 Fix patient profile update not visible in dashboard
- YLP-1874 Fix PDF report generation
- YLP-1894 Retrieve pump settings in pump settings object if no upload object available
- YLP-1892 Creation of an integration test for the team form
- YLP-1900 Fix CSS in events configuration modal
- YLP-1901 CSV generation is not using the correct time frame
- YLP-1903 Timezone detection should exclude some data types
- YLP-1904 CSV generation outputs a pdf
- YLP-1906-Fix-training-modal-CSS
- YLP-1910 Retrieve patients from bff v1 route
- YLP-1916 Migrate tooltips from viz to dumb
- YLP-1919 Use user preferred units on alarm configuration component
- YLP-1935 CBG thresholds should be used from medical data service
- YLP-1942 Rename files in yourloops and medical-domain
- YLP-1945 Migrate NoBar component to dumb
- YLP-1949 Migrate Lines component to dumb
- YLP-1953 Migrate WheelPercent to dumb
- YLP-1960 enhance pipeline
- YLP-1968 Removing eCPS connection feature (revert of YLP-1182)
- YLP-1976 Fix PDF generation
- YLP-1971 Product labelling page should use blip version for UDI and configuration for doc revision in bottom page
- YLP-1991 Update patient header design and add currently available patients fields
- YLP-2004 Refine dashboard look and feel (part one)
- YLP-2012 Migrate LabeledCheckbox to dumb
- YLP-2015 Replace loaders by MUI CircularProgress
- YLP-2016 Migrate BolusTooltip to dumb
- YLP-2021 Implement remote monitoring card new design
- YLP-2022 HBA1C is not displayed in profile when logged in as a patient
- YLP-2030 Remove TwoOptionToggle and BgSourceToggle
- YLP-2031 Migrate viz tests to dumb
- YLP-2037 Hide the column in the patient list related to remote monitoring option
- YLP-2045 Migrate CbgSliceSegment to dumb
- YLP-2046 Migrate table settings from viz to dumb
- YLP-2048 Migrate CBGMedianAnimated from viz to dumb
- YLP-2050 Migrate trends background to dumb
- YLP-2054 Migrate trends "no data" text to dumb
- YLP-2055 Migrate CBGSliceAnimated from viz to dumb
- YLP-2061 Migrate trends X axis labels and ticks to dumb
- Automate copyright generation on new and updated files
- Changing CI from Jenkins to GitHub Actions
- Migrate MUI 4 to MUI 5
- Refactoring profile page code and adding tests
- Remove react-test-renderer dependency
- Update copyright on all files in `dumb` and `yourloops` packages

## 3.0.2 - 2022-11-28
### Added
- YLP-1943 Training material is acknowledged after Yourloops TM is opened and read (including the new checkbox message) and before any use of YLP
- YLP-1944 Rename "Intended Use" in the footer as "Product labelling"

## 3.0.1 - 2022-10-11
### Added
- YLP-1681 HCP can remove a patient
- YLP-1753 Fix memory leak on useState
- YLP-1837 Display training material acknowledgment
- YLP-1841 Rework of accompanying documents in footer
- YLP-1865 Add an error message if email is not valid in create team form
- YLP-1867 Use a single route to fetch user profile, settings and preferences at once
### Engineering use
- YLP-1317 Renaming Shoreline model to a generic name
- YLP-1626 Refactor team hook to only keep functions impacting the state
- YLP-1631 Install react testing library
- YLP-1634 Fix missing UTs
- YLP-1635 Modify CSP to enable refresh once logged in
- YLP-1653 Support RTL jest dom for unit tests
- YLP-1658 Creating a note does not create it at the time selected
- YLP-1692 Improve user-friendliness of medical widget
- YLP-1697 Split patients and team members management
- YLP-1699 Rework TeamUser structure so that it becomes understandable
- YLP-1719 Remove inline CSS
- YLP-1740 Make HTTP calls to back instead of computing data in the front
- YLP-1754 Patient list not updated after accept invitation
- YLP-1767 Create package to migrate viz components
- YLP-1797 Make it possible to see what role the users are logged in with matomo
- YLP-1834 Migrate time in range stats
- YLP-1915 Migrate reservoir tooltip
- Add a route /version to display blip version

### Fixed
- YLP-1645 A patient can create, edit and delete a medical record
- YLP-1659 Language is not updated with user preferences
- YLP-1842 Disable sourcemap for production builds

## 3.0.0 - 2022-06-16
### Added
- YLP-1260 Verify password leak on signup or password change
- YLP-1291 A monitoring team can flag a patient under remote monitoring
- YLP-1340 Remote monitoring left menu for an HCP user
- YLP-1367 The medical data can be exported as csv file
- YLP-1369 HCP can send private messages for this team
- YLP-1370 HCP and patient can communicate through messaging system
- YLP-1379 New Header
- YLP-1410 New left navigation drawer
- YLP-1411 Implement the Patient list table with the new layout
- YLP-1415 Implement the team details page
- YLP-1445 Implement alerts in patients table
- YLP-1452 Implement Auth0 Login/Logout
- YLP-1453 Implement Auth0 Signup
- YLP-1462 Create Patient statistics card for dashboard
- YLP-1463 create Patient information card for dashboard
- YLP-1465 create Device usage card for dashboard
- YLP-1466 Create alarm card
- YLP-1469 Update footer with "Accompanying documents" dropdown
- YLP-1475 Implement the team details page for patients
- YLP-1476 Remove care teams page
- YLP-1494 Implement patient table for caregiver
- YLP-1495 Add success/error messages on team details page
- YLP-1496 Add possibility for a patient to add a caregiver
- YLP-1497 Change all buttons to a flat design
- YLP-1500 Patient can join a team from header
- YLP-1501 Update team details alarms management with new design
- YLP-1504 Plug team alarms configuration to backend
- YLP-1511 Display message date, status and the number of unread messages in chat widget
- YLP-1518 Implement drawer filters
- YLP-1537 Display settings page in a dialog
- YLP-1541 Plug team alarm configuration to backend
- YLP-1544 Create dialog to invite patient in remote monitoring team
- YLP-1547 Rework patient and caregiver list nav bar
- YLP-1583 Add message column in patient list
- YLP-1585 Add messages filter in left drawer
- YLP-1594 Implement the delete button for remote monitored patients
- YLP-1595 Plug prescription upload to backend
- YLP-1596 Referring doctor must be saved into backend when inviting a user to remote monitoring team
- YLP-1597 add renew dialog for a patient under remote monitoring
- YLP-1604 Update patient profile with new patient information
- YLP-1607 Ask patient to consent when he joins the monitoring program
- YLP-1609 Add button to reset patient monitoring parameters
- YLP-1612 Display an alert if account is not validated
- YLP-1613 Add icon button to remove team member
- YLP-1615 Download a prescription
- YLP-1616 Display details of a weekly report in modal
- YLP-1626 Patients not monitored should not have any alarms

### Engineering Use
- YLP-1233 Remove session object
- YLP-1256 Split Profile component into smaller subcomponents
- YLP-1319 Switch-roles dialogs CSS not consistent with other dialogs
- YLP-1320 Dynamic branding
- YLP-1345 Correct blip pdf export to display japanese chars
- YLP-1350 Auth API refactoring
- YLP-1353 Share API refactoring
- YLP-1354 Team API refactoring
- YLP-1383 Rework app routing
- YLP-1447 Skip flaky test
- YLP-1506 Skip flaky test
### Fixed
- YLP-1199 Stats in trends view may be wrong
- YLP-1312 Data loading may be missing some ranges
- YLP-1313 Join wizard and bolus may fail
- YLP-1356 Can't remove a pending member from a team with a user that did not invite it

## 2.0.6 - 2022-03-03
### Added
- YLP-1105 Yourloops new blue theme
- YLP-1106 Switch account from caregiver to hcp should ask for the profession
- YLP-1122 Patient should enter the team unique ID to accept a team invitation
- YLP-1188 Pink theme for clinical environment
- YLP-1190 Advertise user about account deletion
- YLP-1191 Add feature flag to retrieve cbg data with or without bucket optimization
- YLP-1217 Patient should be better informed that he should not create an account through web UI
### Security Update
- YLP-1182 Add an eCPS connection link into user preferences (HCP certification)
- YLP-1183 Add certified professional icon
### Improvements
- YLP-22 Print PDF content cleaned and improved (removing useless data)
- YLP-288 Improve date selection on Trends view
- YLP-590 Date picker for PDF reports
- YLP-1088 Rework UX/UI of the YLP footer
- YLP-1120 Overview tab cleanup
### Fixed
- YLP-1101 Yourloops logo redirect not working for HCPs
- YLP-1109 YourLoops main menu sometimes do not disappear as it should
- YLP-1116 Missing password strength meter into reset password page
- YLP-1129 Pending patient not displayed into HCP view when already in a team or private practice
- YLP-1148 Average daily carbs is null in PDF report
- YLP-1164 Daily view device parameters tooltips display wrong hours
- YLP-1169 Fix German translation of Dietitian
- YLP-1170 Bolus sent multiple times by the handset are duplicated in Yourloops/Backloops
- YLP-1194 Time of reservoir change event in Overview page is not correct - GMT time is displayed
- YLP-1252 Settings History values are changing over the time
- YLP-1289 Wrong units displayed in the PDF for avg glucose
### Engineering Use
- YLP-1082 Improve daily view rendering
- YLP-1114 Review routes and data structure for message-api
- YLP-1172 Cannot debug unit test of blip (front)
- YLP-1174 Removing add patient functionality for a caregiver (not used)
- YLP-1304 Various minor eng changes

## 2.0.5 - 2021-12-06
### Improvements
- YLP-67 Popup calendar on daily view
- YLP-941 Improve email validation with a better verification and error message
- YLP-996 Restructure account preferences page
- YLP-1002 Allow patients to receive the email "forgot password" from yourloops
- YLP-1011 Add profession details for HCPs
- YLP-1040 Give access to latest release notes from YourLoops
### Security Update
- YLP-62 Implement session timeout
- YLP-1058 Implement a password strength meter
### Fixed
- YLP-1012 Translation missing in Loop mode widget
- YLP-1041 Fix potential crash in YourLoops when rendering the PDF
- YLP-1083 Missing IOB on wizard (meal) bolus
- YLP-1087 Missing notification when switch team member role to admin
- YLP-1095 Patient name not displayed into remove dialog
### Engineering Use
- YLP-662 Rework events tagging for Matomo
- YLP-1029 Add a build step to verify translations
- YLP-1042 Bump some dependencies
- YLP-1049 Bump node to v14
- YLP-1051 Allow to verify with eslint js files outside main packages
- YLP-1053 Remove lolcat language and Crowdin build
- YLP-1054 Harmonize ESLint configuration (ts/js) and fix source files
- YLP-1067 Create a material-ui simple date picker
- YLP-1085 Bump cloudfront distribution script deps

## 2.0.4 - 2021-09-27
### Added
- YLP-950 Generate robot.txt and sitemap.xml
- YLP-952 Add meta "description" to the index.html
- YLP-972 Add United Kingdom
- YLP-987 HCP feedbacks consent
### Changed
- YLP-925 Update glycemia unit conversion in blip
- YLP-958 Review text justification in modal windows
- YLP-963 Updating urls of legal documents
### Fixed
- YLP-977 Re-send account activation link
- YLP-982 Harmonize units in YourLoops
- YLP-992 Modify email pronoun for a neutral form in German
- YLP-955 Sign-up consent next button should be greyed when boxes are not checked
### Engineering Use
- YLP-864 Add TU for lib notifications
- YLP-688 Cleanup translation keys

## 2.0.3 - 2021-08-20
### Changed
- YLP-611: Hide "go to original article" option in ZD widget
### Fixed
- YLP-878 Wrong settings for glucose units uploaded by the handset
- YLP-882 Wrong dates in the PDF report
- YLP-888 Threshold on the Trends graph display only SMBG data points
- YLP-910 lastName / firstName / Language translations keys should be in lower-case
- YLP-918 Caregivers bg unit change not taken without reload
- YLP-919 Yourloops do not encode correctly passwords with special characters
- YLP-926 Sanitize HTML in message note
- YLP-931 Cannot leave and delete a team that still contains a patient
- YLP-935 Email in user account should not contain special characters
### Added
- YLP-759 Add Austria
- YLP-869 Display page title
- YLP-930 Call shoreline's logout route in YourLoops
### Engineering Use
- YLP-814 Add TU for i18next integration / localization
- YLP-815 Add TU for metrics / Matomo
- YLP-816 Add JUnit reports to Jenkins
- YLP-832 Add TU for zendesk manager
- YLP-836 Add TU for lib/auth
- YLP-887 Add more HTML selectors to ease system tests

## 2.0.2 - 2021-07-05
### Fixed
- YLP-839 Missing error string for translation
- YLP-842 Patient user click logo leads to a blank page
- YLP-851 Translation error in Loop Mode widget (DE)
- YLP-852 App crash in the daily view on mobile - on resize display
- YLP-856 Viz metrics are not updated after loading new data
- YLP-860 Adjust the display of temporay basal to workaround handset issue #220
- YLP-861 First consent login page for patient is never displayed
- YLP-862 Translation error in Italian for My Care Teams
### Engineering Use
- YLP-570 Ensure confidentiality in the Matomo reports
- YLP-813 Add TU for cookies manager
- YLP-855 Add more HTML selectors to ease system tests

## 2.0.1 - 2021-06-16
### Fixed
- YLP-779 Caregiver switching to hcp is logged off at the end of the process
- YLP-Y82 Overview calendar day hover are hard to read
- YLP-783 Wrong wording in French for care team
- YLP-793 Sorting on TIR indicators and data upload in the patient dashboard
- YLP-791 Patient can share to the same team several times
- YLP-796 Set header x-tidepool-language for all requests to /confirm/send/xx
- YLP-799 CSS fixes for mobile display of patient data
- YLP-820 Data loading loses some days when browsing daily view chronologically
- YLP-828 Add button to display the cookies manager
- YLP-831 Missing team name on modals delete team / remove team member

### Engineering Use
- YLP-750 Support TideWhisper v1 routes
- YLP-808 Regenerate package-lock.json files
- YLP-833 Add matomo analytics for better perfs metrics

## 2.0.0 2021-05-21
### Added
* YLP-13 Signup workflow for caregivers and hcps
* YLP-351 Main Navigation header
* YLP-491 Switch from caregiver to professional account
* YLP-488 Patient profile page for HCP users
* YLP-352 Add tabs for patients and teams in the main nav
* YLP-377 Create a care team
* YLP-380 Care teams list
* YLP-394 In-app invitations / notifications
* YLP-358 Invite a patient to share data with a team
* YLP-757 Discard a patient invitation to a care team
* YLP-743 A HCP cannot invite a patient that does not have yet an account
* YLP-708 A HCP user must not be able to invite a patient to join a team
* YLP-357 Breadcrumb “My Patients” on HCP view
* YLP-372 Possibility to flag patients
* YLP-373 Force sorting on flagged patients
* YLP-397 Manage data sharing with care teams
* YLP-552 Display Caregiver's patients list
* YLP-554 Display caregiver/teams list for Patients
* YLP-711 Update password: hcp/caregivers must give current password
* YLP-499 Add cookie banner
* YLP-464 Implement success and error snackbars
* YLP-423 Add Dexcom branding to the glucose graph
* YLP-581 Rescue carbs indicator
* YLP-558 Display sensor warm up session on daily view
* YLP-547 Bolus name in tooltip
* YLP-610 Stonly widget
* YLP-270 Choose preferred units (HCP)
* YLP-326 Get HbA1c result from DBL and display on patient profile
* YLP-356 Filters on patient dashboard

### Changed
* YLP-507 Screen to renew consent when terms of use and/or policy have changed
* YLP-487 Rework patient Account preferences Page
* YLP-486 HCP account preferences page
* YLP-432 New login page
* YLP-715 Do not display Physical Activity when duration is set to 0
* YLP-693 Hide Glucose and events graph when in confidential mode
* YLP-586 Remove mailchimp integration
* YLP-482 Remove the possibility to customize thresholds for patient in YourLoops
* YLP-441 Change glucose level colors
* YLP-443 Update DBL settings table
* YLP-544 Create footer on logged-in pages
* YLP-366 List patients in table (HCP view)
* YLP-367 Add columns with indicators (TBR, TIR)
* YLP-355 Search box on the patient dashboard

### Fixed
* YLP-707 fix glucose level colors in generated PDF
* YLP-266 Hour format isn't updated on daily view when language is changed
* YLP-511 Wrong string used for "serial number"
* YLP-454 The Number of Login validation does not make the count for a single account

### Engineering Use
- YLP-699 Add CodeQL Analysis
- Add jenkins lock on CloudFront publication

## 1.7.3-rc1 2021-02-22
### Engineering Use
- Fix init Jenkins pipeline
- Add https dev server (docker) for OWASP ZAP

## 1.7.2 2021-01-12
### Fixed
- Fix SOUP list generation
- Fix translations
- YLP-442 DBLG1 sends units at the wrong place

## 1.7.1 2021-01-08
### Fixed
- Fix translations

## 1.7.0 2021-01-07
### Added
- YLP-215 Display Confidential mode on Daily view
- YLP-236 Display Zen mode activation on Daily view
- YLP-298 Enable Spanish and Italian languages
- YLP-317 Add Switzerland in country list
### Fixed
- YLP-216 Interrupted bolus is not correctly displayed
- YLP-289 RescueCarbs: recommendation is always set to 0 for automatic mode
- YLP-292 Error messages not translated when creating an account
- YLP-306 Change the language on login page may prevent the login
- YLP-318 Widget bolus / weight does not display result
- YLP-320 Matomo tracker is no longer active
- YLP-322 Units change after an update done in patient settings
- YLP-336 Block DBL settings display order
### Changed
- YLP-26 Make bolus graph more readable
- YLP-52 Review clinician direct signup flow
- YLP-267 Delete BG readings calendar from overview
- YLP-280 Make France as default country for existing users
- YLP-273 Translate units in DBL settings table and display depending on patient profile
- YLP-282 Simplify Basal/Bolus insulin ratio widget
- YLP-299 Change "parameters" for "settings" in English
- YLP-305 Change patient age to birthdate in their profile
- YLP-313 Create dedicated key for bolus graph title
- YLP-324 Pump and CGM information in DBL settings
- YLP-337 Update settings labels
- YLP-342 Add missing translation keys for CBG/SMBG tooltips
- YLP-415 Change "infusion site changes" calendar for "cartridge changes"
### Engineering Use
- YLP-147 Merge blip dependencies
- YLP-211 Rework Cloudfront deployment services to use an alternate domain name
- YLP-345 Add a "maintenance state" to our CloudFront config

## 1.6.0 - 2020-11-10
### Added
- YLP-247 Add Dutch language
### Changed
- YLP-59 Clean HCP profil setup form
- YLP-103 Pick country and language when signing up
- YLP-109 Block units
- YLP-111 Display localized CGU and data privacy
- YLP-173 Loop mode label
- YLP-203 Change menu item "System settings" to "DBL settings"
- YLP-205 Change menu item "print"
- YLP-206 Allow name edition for patient profile
- YLP-229 Make "Daily" view the homepage of YourLoops instead of "Overview"
- YLP-265 Prevent the edition of patient name on clinical environment
- YLP-272 Display data with correct units when user settings does not contain the bgTarget
- YLP-289 Block weight units
### Fixed
- YLP-262 Settings are not displayed in blip with updated pumpSettings uploads
- YLP-290 Trends calendar button and text is white
- Be sure to use the fallback language if the navigator one is not supported (YLP-111 related)
### Engineering Use
- YLP-221: move to Jenkins and automatically deploy our master branch (dblp) to cloudfront preview env.

## 1.5.0 - 2020-10-05
### Changed
- YLP-152 Design update consent screen.
- YLP-158 Delete Consent banner from all environments.
- YLP-159 Upgrade blip, viz and tideline from react15 to react16
- YLP-180 Create separate string for bolus type


### Engineering Use
- YLP-128 Refactor to move to Cloudfront
- Prevent from security scan to run

## 1.4.2 - 2020-09-09
### Fixed
- YLP-157 Add german locale to the list of available languages.

## 1.4.1 - 2020-08-31
### Fixed
- Updating german translations

## 1.4.0 - 2020-08-26
### Changed
- YLP-92 Block patient name edition in profile


### Fixed
- PT-1480 Tideline 1.12.1


### Engineering Use
- YLP-107 Create lambda edge generatation script for CloudFront

## 1.3.1 - 2020-08-19
### Engineering Use
- PT-1470 Update blip docker image to run as Coreye user

## 1.3.0 - 2020-08-17
### Changed
- PT-1444 Deduplicate Physical Activity events containing the new EventId field
- PT-1304 Display the new physical activity fields
- YLP-115 Add intermediate screen after login to renew consent

### Fixed
- YLP-15 Calculate coefficient of Variation with correct formula: 2 weeks CV displays the result of average daily CV of the 14 days

## 1.2.0 - 2020-07-31
### Changed
- YLP-72 Have two distincts fields for first name and last name in profile page


### Engineering Use
- YLP-48 Change crowdin pseudo language from 'it' to 'lol'
- Externalize languages definition (out of code)

## 1.1.0 - 2020-07-21
### Changed
- PT-1297 Display Bolus objects additional fields


### Fixed
- Translation update: English / French / German
- YLP-78 Don't let tests failed when we update a translation in Crowdin
- YLP-89 Infusion site icon missing in basics calendar

## 1.0.3 - 2020-07-15
### Fixed
- PT-1395 Daily view: time of objects is displayed as UTC while timeline is displayed with locale time

## 1.0.2 - 2020-07-10
### Fixed
- PT-1168 Fix display bug when updating user profile
- PT-1125 Add missing calendar translation


### Engineering Use
- PT-1345 Fix vulnerabilities and update build system
  - Remove hakken and other deprecated stuffs
  - Update documentation
  - Upgrade most of the SOUP packages
  - Update eslint
  - Support CloudFront deployment
  - Fix route when using index.html as an entry
  - Allow to deploy in production a smaller server package (without webpack)
  - Fix problems when running the dblp target server for dev (config not set)
  - Allow to run test in docker
  - Speed up build

## 1.0.1 - 2020-06-12
### Fixed
- PT-1172 Display of parameter history in Device Settings page does not manage correctly the timezone information

## 1.0.0 - 2020-05-25
### Added
- Blip Medical Device published as major version.



### Fixed
- Fix regression introduced in PT-1309
- Disable German language

## 0.17.0 - 2020-05-20
### Changed
- PT-1309 Ensure Blip SOUP list includes viz and tideline SOUPs
- PT-1335 Display legal stuff in YourLoops (such as CE mark)

## 0.16.0 - 2020-05-14
### Added
 - PT-1251 Display TIR result of last 24 hours in patients search page.



### Changed
- PT-1205 Add timezone info on tooltips when necessary
- PT-1254 Disable Highwater from Blip
- PT-1256 Improve PDF generation



### Engineering Use
- PT-1249 Reduce blip & viz build time.

## 0.15.1 - 2020-04-17
### Changed
- Upgrade to Tideline 1.9.2
  - PT-1231 Basics: Total basal events count does not give the correct total
- Upgrade to Viz 0.11.3
  - PT-1230 CGM / BGM labels don't change with language



### Fixed
- PT-1218 Zendesk Contact form is not offloaded
- PT-419 Manage Language in Zendesk widget

## 0.15.0 - 2020-04-14
### Changed
- PT-1093 Search Page: remove date of birth as filter
- PT-1094 Search Page: remove the persona icon next to the patient name
- PT-1194 Search Page: add a way to open the patient page in a new tab



### Fixed
- PT-1157 Revert temporary fix PT-1115



### Other Notes
- PT-1215 Integration with Crowdin live preview (localization management saas)

## 0.14.1 - 2020-03-31
### Fixed
- Integrate parameters translations

## 0.14.0 - 2020-03-30
### Changed
- PT-1224 Remove useless link in Device Settings screen
- Upgrade tideline to 1.9.1
  - PT-1206 PT-1127 Have notes in first position on the daily screen, reverting PT-1100
- Upgrade tideline to 1.9.0
  - PT-1198 remove unused items from Basics screen
- Upgrade tideline to 1.8.0
  - PT-1203 Remove moreInfo message in noData section from Basics screen

## 0.13.0 - 2020-03-20
### Added
- PT-880 Display Parameter object change in Daily view
- PT-1027 Inform the user when he has reach a max login attempt



### Changed
- PT-1189 Review support email to be yourloops@diabeloop.com
- PT-1113 Upgrade Viz to 0.11.2 and Tideline to 1.7.2: Change basal insulin colors in widget and graph
- PT-1112 Upgrade Viz to 0.10.4: change the color of RescueCarb tool tip to be consistent with the other tool tips
- PT-1135 Remove BGLog page
- PT-1140 Split the link to the terms of Use in the footer
- PT-1009 Manage the update of the data privacy
- PT-1197 Basics screen wording update



### Fixed
- PT-1128 Refresh button is automatically switching to BGM
- PT-1103 Delete caps in legends (daily view)

## 0.12.0 - 2020-02-17
### Added
- PT-875 Flexible period in Trending page
- PT-1008 Add a 3 months button in Trending page



### Changed
- PT-1052 Rework sign up (direct link to clinician signup from home page + clinician option selected as default in signup page)
- PT-1100 Move message notes to the bottom of the daily page
- PT-1041 Rework invitation page for clinicals users
- PT-1111 Allow capacity to reset the search



### Fixed
- PT-338 Fix some translations.
- PT-1115 Fix wrong display due to inconsitent timezone in upload object
- PT-1108 PT-1105 PT-1114 Make Diabeloop devices automated devices.

## 0.11.0 - 2020-01-06
### Added
 - PT-883 Display reservoir change in daily BG section
 - PN-10 Add Show/hide password in Signup page
 - PN-9 Add Show/hide password in Login page
 - PT-412 Add option to display password when changing password
 - PT-865 Display physical activity in Bolus/Food section



### Changed
 - PT-836 Display list of patients to clinician as a default behaviour



### Fixed
- PT-869 Fix labelling issue in validation errors

## 0.10.0 - 2019-12-09
### Added
 - PT-844 Integrate Tideline 1.4.0 with new logo/picto for insulin sites
 - PT-847 Integrate Viz 0.7.0 with new logo in pdf for infusion site. Fix date formats in pdf.

## 0.9.1 - 2019-12-02
### Fixed
 - PT-808 fix minor bugs identified after the release of blip 0.9.0
 - PT-814 distinguish matomo data origin (preview vs clinical vs commercial)

## 0.9.0 - 2019-11-08
### Added
- PT-728 Analytics/metrics for Blip/Front usage



### Changed
- PT-755 Update naming for stopped loop mode



### Fixed
- PT-597 Blip does not display medical data for patients having no medical data in the last 2 months
- PT-774 Fix problems with translations in blip

## 0.8.0 - 2019-10-30
### Other Notes
- PT-719 Update translations in Blip for parameters

## 0.7.1 - 2019-10-17
### Fixed
- PT-738 Blip build in invalid due to missing config
- PT-746 Fix Zendesk script missing when running buildconfig

## 0.7.0 - 2019-10-15
### Added
- PT-401 Display rescueCarbs with specific layout in Daily view
- PT-574 Integrate latest change from [Tidepool 1.27.0](https://github.com/tidepool-org/blip/releases/tag/v1.27.0)
- PT-415 Add german language

## 0.6.2 - 2019-09-16
### Other Notes
- PT-640 Upgrade viz to dblp.0.4.3

## 0.6.1 - 2019-08-26
### Fixed
- PT-426 Update Translations
- Using Tideline dblp.1.1.2
- Using Viz dblp.0.4.2
- PT-370 The same "B" was displayed in French in basal section for closed loop and open loop.

## 0.6.0 - 2019-08-09
### Added
- PT-545 Display infusion site changes for Diabeloop Devices



### Fixed
- PT-532 One can create a patient even if the application is not allowing it

## 0.5.0 - 2019-07-29
### Added
- PT-376 Integrate latest change from [Tidepool 1.20.2](https://github.com/tidepool-org/blip/releases/tag/v1.20.2)
- PT-513 Display history of parameters change in patient settings page.



### Fixed
- PT-304 Validation of the patient diagnostic date and date of birth uses the wrong format

## 0.4.0 - 2019-05-15
### Added
- PT-365 Add Firefox, Chrome on iOS and edge as authorized browsers. A warning message is displayed for any other browser than Chrome.

## 0.3.1 - 2019-04-17
### Changed
- PT-169: Review look & feel for PDF generated - review translations

## 0.3.0 - 2019-04-08
### Added
 - Add favicon
 - Add HELP_LINK variable to configure external web widget for online help in the application.
    - widget gives access to helpCenter
    - once authenticated, the widget form is pre-filled with user name and email
 - Add ASSETS_URL variable to reference terms of use and data privacy documents.
 - Remove Support link from footer
 - Add Diabeloop link in footer



### Other Notes
 Other Notes

## 0.2.2 - 2019-03-19
### Added
- Add/Update translations
- Change e-mail & password can be disabled for patients. They cannot be disabled for clinical accounts.
- Disable the create patient account page

## 0.1.8 - 2019-03-13
### Added
- Based on [Tidepool 1.12.5](https://github.com/tidepool-org/blip/releases/tag/v1.12.5)
- MVP for Branding
- Add integration with external tool
- Fix couple of bugs
   - user automatically disconnected [PT-69]
   - Fix race condition [PT-17]
   - Fix Unknown DOM property class [PT-163]
