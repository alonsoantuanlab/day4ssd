---
title: UI - Edit Watch
id: 104-ui-edit-watch
summary: |
  The UI allows editing an existing watch via an edit form or inline editor. Submitting updates the item via `PATCH /items/{id}` and updates the list/view.
ui:
  element: button.edit-button (per item)
actions:
  - open edit, change fields, submit
expected:
  - frontend sends `PATCH /items/{id}` with changed fields
  - on success, UI shows updated values
acceptance_criteria:
  - invalid values are blocked client-side (e.g., negative price)
