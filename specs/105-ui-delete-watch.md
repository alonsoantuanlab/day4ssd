---
title: UI - Delete Watch
id: 105-ui-delete-watch
summary: |
  The UI provides a delete control per item that calls `DELETE /items/{id}` and removes the item from the list on success.
ui:
  element: button.delete-button (per item)
actions:
  - click delete and confirm
expected:
  - sends `DELETE /items/{id}`
  - removes item from UI on 204
acceptance_criteria:
  - confirmation prompt before delete
