from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi.responses import PlainTextResponse
import csv
import os
from threading import Lock
from typing import List, Optional

app = FastAPI()

# Allow frontend dev server to access the API during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3002", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to CSV storage (can be overridden in tests)
DATA_FILE = os.path.join(os.path.dirname(__file__), "data.csv")
lock = Lock()


class ItemIn(BaseModel):
    brand: str
    model: str
    price: float = Field(..., ge=0)
    stock: int = Field(..., ge=0)
    sku: str
    description: Optional[str] = ""


def ensure_file():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["id", "brand", "model", "price", "stock", "sku", "description"])


def read_items() -> List[dict]:
    ensure_file()
    items = []
    with open(DATA_FILE, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get("id"):
                continue
            items.append({
                "id": int(row["id"]),
                "brand": row.get("brand", ""),
                "model": row.get("model", ""),
                "price": float(row.get("price", 0)) if row.get("price", "") != "" else 0.0,
                "stock": int(row.get("stock", 0)) if row.get("stock", "") != "" else 0,
                "sku": row.get("sku", ""),
                "description": row.get("description", ""),
            })
    return items


def write_all(items: List[dict]):
    ensure_file()
    with open(DATA_FILE, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["id", "brand", "model", "price", "stock", "sku", "description"])
        for it in items:
            writer.writerow([it["id"], it["brand"], it["model"], it["price"], it["stock"], it["sku"], it.get("description", "")])


def append_item(item: dict) -> dict:
    ensure_file()
    with lock:
        items = read_items()
        next_id = max([i["id"] for i in items], default=0) + 1
        record = {"id": next_id, **item}
        with open(DATA_FILE, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([record["id"], record["brand"], record["model"], record["price"], record["stock"], record["sku"], record.get("description", "")])
    return record


@app.post("/items", status_code=201)
def add_item(payload: ItemIn):
    # basic SKU uniqueness check
    items = read_items()
    for it in items:
        if it["sku"] == payload.sku:
            raise HTTPException(status_code=400, detail="SKU already exists")
    record = append_item(payload.dict())
    return record
@app.get("/items")
def list_items(page: int = 1, per_page: int = 20, brand: Optional[str] = None, model: Optional[str] = None):
    items = read_items()
    # filters
    if brand:
        items = [i for i in items if brand.lower() in i["brand"].lower()]
    if model:
        items = [i for i in items if model.lower() in i["model"].lower()]
    # pagination
    start = (page - 1) * per_page
    end = start + per_page
    return items[start:end]


@app.get("/items/export")
def export_items():
    ensure_file()
    with open(DATA_FILE, "r") as f:
        content = f.read()
    return PlainTextResponse(content, media_type="text/csv")


@app.post("/items/import", status_code=201)
async def import_items(request: Request):
    body = await request.body()
    text = body.decode("utf-8")
    # basic validation: must have header
    lines = text.splitlines()
    if not lines or not lines[0].startswith("id,"):
        raise HTTPException(status_code=400, detail="invalid csv")
    # write directly to file
    with lock:
        with open(DATA_FILE, "w", newline="") as f:
            f.write(text)
    return {"imported": True}


@app.get("/items/search")
def search_items(q: Optional[str] = None, sku: Optional[str] = None):
    items = read_items()
    if sku:
        return [it for it in items if it["sku"] == sku]
    if q:
        ql = q.lower()
        return [it for it in items if ql in it["brand"].lower() or ql in it["model"].lower() or ql in it.get("description", "").lower()]
    return []


@app.get("/items/{item_id}")
def get_item(item_id: int):
    items = read_items()
    for it in items:
        if it["id"] == item_id:
            return it
    raise HTTPException(status_code=404, detail="Not found")


@app.patch("/items/{item_id}")
def patch_item(item_id: int, payload: dict):
    items = read_items()
    for idx, it in enumerate(items):
        if it["id"] == item_id:
            # update allowed fields
            for k in ("brand", "model", "price", "stock", "sku", "description"):
                if k in payload:
                    if k == "price" and float(payload[k]) < 0:
                        raise HTTPException(status_code=400, detail="price must be >= 0")
                    if k == "stock" and int(payload[k]) < 0:
                        raise HTTPException(status_code=400, detail="stock must be >= 0")
                    items[idx][k] = payload[k]
            write_all(items)
            return items[idx]
    raise HTTPException(status_code=404, detail="Not found")


@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int):
    items = read_items()
    new = [it for it in items if it["id"] != item_id]
    if len(new) == len(items):
        raise HTTPException(status_code=404, detail="Not found")
    write_all(new)
    return Response(status_code=204)


@app.post("/items/{item_id}/sell")
def sell_item(item_id: int, payload: dict):
    qty = int(payload.get("quantity", 1))
    if qty <= 0:
        raise HTTPException(status_code=400, detail="quantity must be positive")
    items = read_items()
    for idx, it in enumerate(items):
        if it["id"] == item_id:
            if it["stock"] < qty:
                raise HTTPException(status_code=400, detail="insufficient stock")
            items[idx]["stock"] = it["stock"] - qty
            write_all(items)
            return {"id": item_id, "sold": qty, "remaining_stock": items[idx]["stock"]}
    raise HTTPException(status_code=404, detail="Not found")


@app.get("/items/export")
def export_items():
    ensure_file()
    with open(DATA_FILE, "r") as f:
        content = f.read()
    return PlainTextResponse(content, media_type="text/csv")


@app.post("/items/import", status_code=201)
async def import_items(request: Request):
    body = await request.body()
    text = body.decode("utf-8")
    # basic validation: must have header
    lines = text.splitlines()
    if not lines or not lines[0].startswith("id,"):
        raise HTTPException(status_code=400, detail="invalid csv")
    # write directly to file
    with lock:
        with open(DATA_FILE, "w", newline="") as f:
            f.write(text)
    return {"imported": True}


@app.get("/items/search")
def search_items(q: Optional[str] = None, sku: Optional[str] = None):
    items = read_items()
    if sku:
        return [it for it in items if it["sku"] == sku]
    if q:
        ql = q.lower()
        return [it for it in items if ql in it["brand"].lower() or ql in it["model"].lower() or ql in it.get("description", "").lower()]
    return []
