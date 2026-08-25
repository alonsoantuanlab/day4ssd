---
title: Add a watch to inventory
id: 001-add-watch
summary: |
  Allow an administrator to add a new watch to inventory. The request creates a persisted record in CSV storage and returns the created resource with its assigned `id`.
actors:
  - Administrator
http:
  request:
    method: POST
    path: /items
    headers:
      Content-Type: application/json
    body:
      brand: "Rolex"
      model: "Submariner"
      price: 5000
      stock: 2
      sku: "ROLEX-SUB-001"
      description: "Classic diver"
  response:
    status: 201
    headers:
      Content-Type: application/json
    body:
      id: 1
      brand: "Rolex"
      model: "Submariner"
      price: 5000
      stock: 2
      sku: "ROLEX-SUB-001"
      description: "Classic diver"
acceptance_criteria:
  - The POST `/items` endpoint accepts the JSON body with required fields and returns HTTP 201.
  - The response body contains the created item including a numeric `id`.
  - The item is persisted to the CSV file (inventory) so a subsequent `GET /items` returns the new item.
scenarios:
  - name: Add valid watch
    given: Inventory CSV exists and is empty
    when: Administrator POSTs a valid watch JSON to `/items`
    then:
      - Response is 201
      - Response body contains the same fields plus `id`
      - `GET /items` returns the new item
notes: |
  Teaching notes:
  - We'll implement this in the backend first (FastAPI) and write a pytest that exercises the endpoint and verifies CSV persistence.
  - For front-end integration later, we'll create a React form that POSTs the same JSON shape.
  - When using `spec-kit` you can place this file under `specs/` and the tool will render and run spec checks (see `specs/README.md` below).
