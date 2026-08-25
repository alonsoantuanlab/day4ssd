---
title: UI - Register Sale
id: 106-ui-register-sale
summary: |
  UI allows recording a sale (quantity) for an item, which calls `POST /items/{id}/sell` and updates stock in the UI.
ui:
  element: form.sell-form (per item or detail view)
actions:
  - enter quantity and submit
expected:
  - sends `POST /items/{id}/sell` with `{quantity}`
  - on success, updates item stock displayed
  - shows error if insufficient stock
