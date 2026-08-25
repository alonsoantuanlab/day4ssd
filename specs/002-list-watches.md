---
title: List watches with pagination and filter
id: 002-list-watches
summary: |
  Allow listing watches with optional pagination and filtering by `brand` and `model`.
http:
  request:
    method: GET
    path: /items
    query:
      page: 1
      per_page: 20
      brand: (optional)
      model: (optional)
  response:
    status: 200
    body:
      - id: 1
        brand: "Rolex"
        model: "Submariner"
        price: 5000
        stock: 2
        sku: "ROLEX-SUB-001"
acceptance_criteria:
  - GET `/items` returns a JSON array of watches.
  - Supports `page` and `per_page` parameters for pagination; default `per_page=20`.
  - Supports `brand` and `model` query filters (case-insensitive substring match).
scenarios:
  - name: List first page
    given: Inventory has 50 items
    when: GET `/items?page=1&per_page=20`
    then: Response has 20 items and status 200
