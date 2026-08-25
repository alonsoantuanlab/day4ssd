---
title: UI - Import/Export CSV
id: 107-ui-import-export
summary: |
  The UI provides controls to export inventory as CSV (download) and import a CSV file to replace inventory.
ui:
  element: button#export-csv, input[type=file]#import-csv
actions:
  - click export, expect file download
  - choose CSV file and click import
expected:
  - export triggers download of CSV from `GET /items/export`
  - import uploads CSV to `POST /items/import` and refreshes list on success
acceptance_criteria:
  - invalid CSV shows descriptive error
