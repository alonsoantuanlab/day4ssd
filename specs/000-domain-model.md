---
title: Domain model - Watch
id: 000-domain-model
summary: |
  Modelo de dominio para la aplicación de venta de relojes. Define los campos, tipos y reglas básicas.
fields:
  - id: integer (assigned by system, read-only)
  - brand: string (required)
  - model: string (required)
  - price: number (required, >= 0)
  - stock: integer (required, >= 0)
  - sku: string (required, unique per inventory)
  - description: string (optional)
invariants:
  - `price >= 0`
  - `stock >= 0`
  - `sku` must be unique in CSV persistence (best-effort uniqueness check on write)
notes: |
  Teaching notes:
  - We persist watches as CSV rows with header: `id,brand,model,price,stock,sku,description`.
  - The API will validate types and invariants before persisting.
