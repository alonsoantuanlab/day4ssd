---
title: Import and export inventory CSV
id: 007-import-export
summary: |
  Allow full export of inventory as CSV and importing a CSV to replace inventory (admin operation).
http:
  requests:
    - method: GET
      path: /items/export
    - method: POST
      path: /items/import
      headers:
        Content-Type: text/csv
      body: |
        id,brand,model,price,stock,sku,description
        1,Rolex,Submariner,5000,2,ROLEX-SUB-001,Classic diver
  responses:
    - status: 200 (for export)
    - status: 201 (for import success)
acceptance_criteria:
  - GET `/items/export` returns CSV content with header.
  - POST `/items/import` accepts CSV and replaces current inventory, returning 201.
  - Import validates basic CSV shape; invalid rows cause 400 with error details.
scenarios:
  - name: Export inventory
    given: Inventory has items
    when: GET `/items/export`
    then: Response 200 and CSV body with header
