---
title: Edit watch
id: 004-edit-watch
summary: |
  Update fields of an existing watch. Partial updates allowed (PATCH) or full replacement (PUT).
http:
  request:
    method: PATCH
    path: /items/{id}
    body:
      price: 4800
      stock: 3
  response:
    status: 200
    body:
      id: 1
      price: 4800
      stock: 3
acceptance_criteria:
  - PATCH `/items/{id}` updates provided fields and returns the updated resource.
  - Validates invariants (e.g., price >= 0; stock >= 0).
  - Returns 404 if item not found.
scenarios:
  - name: Decrease price and increase stock
    given: Watch id=1 exists
    when: PATCH `/items/1` with `{"price":4800, "stock":3}`
    then: Response 200 and updated fields
