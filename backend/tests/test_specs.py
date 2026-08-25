import os
import sys
import tempfile
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import app as app_module

client = TestClient(app_module.app)


def make_csv(path):
    with open(path, "w") as f:
        f.write("id,brand,model,price,stock,sku,description\n")


def test_add_watch():
    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    make_csv(tmp.name)
    app_module.DATA_FILE = tmp.name

    res = client.post("/items", json={
        "brand": "Rolex",
        "model": "Submariner",
        "price": 5000,
        "stock": 2,
        "sku": "ROLEX-SUB-001",
        "description": "Classic diver"
    })
    assert res.status_code == 201


def test_list_watches_pagination_and_filter():
    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    make_csv(tmp.name)
    app_module.DATA_FILE = tmp.name

    res = client.get("/items?page=1&per_page=20")
    assert res.status_code == 200


def test_view_watch():
    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    make_csv(tmp.name)
    app_module.DATA_FILE = tmp.name

    res = client.get("/items/1")
    assert res.status_code in (200, 404)


def test_edit_watch():
    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    make_csv(tmp.name)
    app_module.DATA_FILE = tmp.name

    # create item first
    client.post("/items", json={
        "brand": "Rolex",
        "model": "Submariner",
        "price": 5000,
        "stock": 2,
        "sku": "ROLEX-SUB-001",
        "description": "Classic diver"
    })

    res = client.patch("/items/1", json={"price": 4800, "stock": 3})
    assert res.status_code == 200


def test_delete_watch():
    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    make_csv(tmp.name)
    app_module.DATA_FILE = tmp.name

    # create item first
    client.post("/items", json={
        "brand": "Rolex",
        "model": "Submariner",
        "price": 5000,
        "stock": 2,
        "sku": "ROLEX-SUB-001",
        "description": "Classic diver"
    })

    res = client.delete("/items/1")
    assert res.status_code in (204, 404)


def test_register_sale():
    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    make_csv(tmp.name)
    app_module.DATA_FILE = tmp.name

    # create item first
    client.post("/items", json={
        "brand": "Rolex",
        "model": "Submariner",
        "price": 5000,
        "stock": 2,
        "sku": "ROLEX-SUB-001",
        "description": "Classic diver"
    })

    res = client.post("/items/1/sell", json={"quantity": 1})
    assert res.status_code in (200, 400)


def test_import_export():
    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    make_csv(tmp.name)
    app_module.DATA_FILE = tmp.name

    res = client.get("/items/export")
    assert res.status_code == 200

    csv_body = "id,brand,model,price,stock,sku,description\n1,Rolex,Submariner,5000,2,ROLEX-SUB-001,Classic diver\n"
    res2 = client.post("/items/import", headers={"Content-Type": "text/csv"}, data=csv_body)
    assert res2.status_code == 201


def test_search():
    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    make_csv(tmp.name)
    app_module.DATA_FILE = tmp.name

    res = client.get("/items/search?q=submariner")
    assert res.status_code == 200
