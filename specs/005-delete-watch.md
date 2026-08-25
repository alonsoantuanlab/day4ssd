---
title: Delete watch
id: 005-delete-watch
summary: |
  Remove a watch from inventory by `id`.
http:
  request:
    method: DELETE
    path: /items/{id}
  response:
    status: 204
acceptance_criteria:
  - DELETE `/items/{id}` removes the record from CSV and returns 204.
  - Subsequent GET `/items/{id}` returns 404.
scenarios:
  - name: Delete existing item
    given: Watch id=1 exists
    when: DELETE `/items/1`
    then: Response 204 and item no longer present
