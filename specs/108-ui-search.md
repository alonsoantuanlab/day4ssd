---
title: UI - Search
id: 108-ui-search
summary: |
  The UI provides a search box to find items by SKU or free-text; executes `GET /items/search` and updates the list.
ui:
  element: input#search-box, button#search-btn
actions:
  - search by q or sku
expected:
  - sends `GET /items/search?q=...` or `GET /items/search?sku=...`
  - displays matching results
