---
title: UI - List Watches
id: 102-ui-list-watches
summary: |
  The home view lists watches returned by `GET /items`. Supports pagination controls and filters for brand/model.
ui:
  path: /
  element: ul#inventory-list
actions:
  - load page
  - apply brand filter
expected:
  - initial load fetches `GET /items` and renders list items
  - pagination controls call `GET /items?page=...&per_page=...`
  - applying a filter updates the displayed list
acceptance_criteria:
  - List shows item brand, model, price, stock, sku and description excerpt
