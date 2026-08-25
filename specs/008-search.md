---
title: Search by SKU or text
id: 008-search
summary: |
  Allow searching inventory by exact `sku` or free-text query matching `brand`, `model`, or `description`.
http:
  request:
    method: GET
    path: /items/search
    query:
      q: "submariner"
      sku: "ROLEX-SUB-001"
  response:
    status: 200
    body:
      - id: 1
        brand: "Rolex"
        model: "Submariner"
acceptance_criteria:
  - `GET /items/search?q=...` performs a case-insensitive substring search over `brand`, `model`, `description`.
  - `GET /items/search?sku=...` returns exact SKU match(s).
scenarios:
  - name: Search by text
    given: Inventory contains submariner watches
    when: GET `/items/search?q=submariner`
    then: Response 200 and matching items
