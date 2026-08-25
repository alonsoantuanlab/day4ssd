---
title: UI - Add Watch (form)
id: 101-ui-add-watch
summary: |
  The frontend provides a form to add a new watch. Submitting the form sends a POST to `/items` with the expected JSON body and shows the new item in the list on success.
ui:
  path: / (Home)
  element: form#add-watch-form
  fields:
    - brand: input[name=brand]
    - model: input[name=model]
    - price: input[name=price]
    - stock: input[name=stock]
    - sku: input[name=sku]
    - description: input[name=description]
actions:
  - fill fields with valid values
  - submit form
expected:
  - frontend performs `POST /items` with JSON matching domain model
  - new item appears in the inventory list without full page reload
acceptance_criteria:
  - All required inputs validate (non-empty, numeric where appropriate)
  - On server error, UI displays an error message
