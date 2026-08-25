---
title: Register sale and adjust stock
id: 006-register-sale
summary: |
  Register a sale for a watch (decrease stock) and record a simple sale log (optional CSV).
http:
  request:
    method: POST
    path: /items/{id}/sell
    body:
      quantity: 1
  response:
    status: 200
    body:
      id: 1
      sold: 1
      remaining_stock: 1
acceptance_criteria:
  - POST `/items/{id}/sell` decreases `stock` by `quantity` if sufficient stock.
  - Returns 400 if insufficient stock.
  - Returns updated item state in response.
scenarios:
  - name: Sell one unit
    given: Watch id=1 has stock=2
    when: POST `/items/1/sell` with `{"quantity":1}`
    then: Response 200 and `remaining_stock` = 1
