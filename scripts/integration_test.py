import requests
import time

BASE = 'http://127.0.0.1:8000'

def wait():
    for _ in range(10):
        try:
            r = requests.get(BASE + '/items')
            if r.status_code == 200:
                return True
        except Exception:
            pass
        time.sleep(0.5)
    return False

def pretty(resp):
    try:
        return resp.status_code, resp.json()
    except Exception:
        return resp.status_code, resp.text

def main():
    print('Waiting for server...')
    if not wait():
        print('Server did not start')
        return

    print('\n1) Create item')
    payload = {"brand":"Rolex","model":"Submariner","price":5000,"stock":2,"sku":"ROLEX-SUB-001","description":"Classic diver"}
    r = requests.post(BASE + '/items', json=payload)
    print(pretty(r))

    print('\n2) List items')
    r = requests.get(BASE + '/items')
    print(pretty(r))

    print('\n3) Get item 1')
    r = requests.get(BASE + '/items/1')
    print(pretty(r))

    print('\n4) Edit item 1')
    r = requests.patch(BASE + '/items/1', json={"price":4800, "stock":3})
    print(pretty(r))

    print('\n5) Sell 1 unit of item 1')
    r = requests.post(BASE + '/items/1/sell', json={"quantity":1})
    print(pretty(r))

    print('\n6) Export CSV')
    r = requests.get(BASE + '/items/export')
    print('status', r.status_code)
    print(r.text[:200])

    print('\n7) Import CSV (replace inventory)')
    csv_body = 'id,brand,model,price,stock,sku,description\n1,Omega,Speedmaster,3000,5,OMEGA-SP-001,Professional chronograph\n'
    r = requests.post(BASE + '/items/import', data=csv_body, headers={'Content-Type':'text/csv'})
    print(pretty(r))

    print('\n8) Search for "Speedmaster"')
    r = requests.get(BASE + '/items/search?q=Speedmaster')
    print(pretty(r))

if __name__ == '__main__':
    main()
