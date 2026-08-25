---
title: UI - View Watch Details
id: 103-ui-view-watch
summary: |
  Clicking on an item shows a detail panel or navigates to a detail view with full watch information.
ui:
  path: / or /items/{id}
  element: .watch-item (clickable)
actions:
  - click a list item
expected:
  - UI shows a details view with all fields and actions (edit, delete, sell)
acceptance_criteria:
  - Detail view displays brand, model, price, stock, sku, description
