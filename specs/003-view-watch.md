---
title: View watch details
id: 003-view-watch
summary: |
  Retrieve details for a single watch by `id`.
http:
  request:
    method: GET
    path: /items/{id}
  response:
    status: 200
    body:
      id: 1
      brand: "Rolex"
      model: "Submariner"
      price: 5000
      stock: 2
      sku: "ROLEX-SUB-001"
acceptance_criteria:
  - GET `/items/{id}` returns the watch when it exists.
  - Returns 404 when the `id` does not exist.
scenarios:
  - name: View existing watch
    given: Watch with id=1 exists
    when: GET `/items/1`
    then: Response 200 and JSON with watch fields
