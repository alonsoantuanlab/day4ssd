import React, { useEffect, useState } from 'react'

function Confirm({ message = 'Are you sure?', onConfirm, onCancel }) {
  return (
    <div style={{ padding: 12, background: '#fff', border: '1px solid #ccc' }}>
      <div>{message}</div>
      <div style={{ marginTop: 8 }}>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel} style={{ marginLeft: 8 }}>No</button>
      </div>
    </div>
  )
}

export default function App() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [brandFilter, setBrandFilter] = useState('')
  const [modelFilter, setModelFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [skuSearch, setSkuSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ brand: '', model: '', price: '', stock: 0, sku: '', description: '' })

  const [selected, setSelected] = useState(null) // for detail view
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { fetchItems() }, [page, brandFilter, modelFilter])

  async function fetchItems(params = {}) {
    setLoading(true)
    setError('')
    try {
      // if skuSearch or searchQuery present use search endpoint
      if (params.sku || params.q || skuSearch || searchQuery) {
        const q = params.q || searchQuery
        const sku = params.sku || skuSearch
        const url = new URL('http://localhost:8000/items/search')
        if (sku) url.searchParams.set('sku', sku)
        if (q) url.searchParams.set('q', q)
        const res = await fetch(url)
        const data = await res.json()
        setItems(data)
      } else {
        const url = new URL('http://localhost:8000/items')
        url.searchParams.set('page', params.page || page)
        url.searchParams.set('per_page', perPage)
        if (params.brand !== undefined) url.searchParams.set('brand', params.brand)
        if (params.model !== undefined) url.searchParams.set('model', params.model)
        if (brandFilter) url.searchParams.set('brand', brandFilter)
        if (modelFilter) url.searchParams.set('model', modelFilter)
        const res = await fetch(url)
        const data = await res.json()
        setItems(data)
      }
    } catch (e) {
      setError(String(e))
    }
    setLoading(false)
  }

  async function submit(e) {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:8000/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) })
      })
      if (res.ok) {
        const item = await res.json()
        setItems(prev => [item, ...prev])
        setForm({ brand: '', model: '', price: '', stock: 0, sku: '', description: '' })
      } else {
        const err = await res.json()
        alert(err.detail || 'Error')
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function doEdit(id, changes) {
    try {
      const res = await fetch(`http://localhost:8000/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
      })
      if (res.ok) {
        const updated = await res.json()
        setItems(prev => prev.map(it => it.id === id ? updated : it))
        setEditing(null)
        setSelected(updated)
      } else {
        const err = await res.json()
        alert(err.detail || 'Error updating')
      }
    } catch (e) { console.error(e) }
  }

  async function doDelete(id) {
    try {
      const res = await fetch(`http://localhost:8000/items/${id}`, { method: 'DELETE' })
      if (res.status === 204) {
        setItems(prev => prev.filter(i => i.id !== id))
        setConfirmDelete(null)
        if (selected && selected.id === id) setSelected(null)
      } else {
        alert('Delete failed')
      }
    } catch (e) { console.error(e) }
  }

  async function doSell(id, qty) {
    try {
      const res = await fetch(`http://localhost:8000/items/${id}/sell`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: Number(qty) })
      })
      if (res.ok) {
        const r = await res.json()
        // refresh item
        fetchItems()
        setSelected(prev => prev && prev.id === id ? { ...prev, stock: r.remaining_stock } : prev)
      } else {
        const err = await res.json()
        alert(err.detail || 'Sell failed')
      }
    } catch (e) { console.error(e) }
  }

  async function doExport() {
    try {
      const res = await fetch('http://localhost:8000/items/export')
      const text = await res.text()
      const blob = new Blob([text], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'inventory.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) { console.error(e) }
  }

  async function doImport(file) {
    try {
      const text = await file.text()
      const res = await fetch('http://localhost:8000/items/import', { method: 'POST', headers: { 'Content-Type': 'text/csv' }, body: text })
      if (res.ok) {
        await fetchItems()
        alert('Imported')
      } else {
        const err = await res.json()
        alert(err.detail || 'Import failed')
      }
    } catch (e) { console.error(e) }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Watch Inventory</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Search text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <button onClick={() => fetchItems({ q: searchQuery })}>Search</button>
        <input placeholder="Search SKU" value={skuSearch} onChange={e => setSkuSearch(e.target.value)} />
        <button onClick={() => fetchItems({ sku: skuSearch })}>Search SKU</button>
        <button onClick={() => { setSearchQuery(''); setSkuSearch(''); fetchItems() }}>Clear</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Filter brand" value={brandFilter} onChange={e => setBrandFilter(e.target.value)} />
        <input placeholder="Filter model" value={modelFilter} onChange={e => setModelFilter(e.target.value)} />
        <button onClick={() => { setPage(1); fetchItems({ page: 1, brand: brandFilter, model: modelFilter }) }}>Apply</button>
      </div>

      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 480, marginBottom: 12 }}>
        <h2>Add watch</h2>
        <input placeholder="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required />
        <input placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required />
        <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
        <input placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div>
          <button type="submit">Add watch</button>
          <button type="button" onClick={() => fetchItems()} style={{ marginLeft: 8 }}>Refresh</button>
        </div>
      </form>

      <div style={{ marginBottom: 12 }}>
        <button onClick={doExport}>Export CSV</button>
        <input type="file" accept="text/csv" onChange={e => { if (e.target.files[0]) doImport(e.target.files[0]) }} style={{ marginLeft: 8 }} />
      </div>

      <h2>Inventory</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul style={{ padding: 0 }}>
        {items.map(i => (
          <li key={i.id} style={{ marginBottom: 8, listStyle: 'none', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{i.brand} {i.model}</strong> — ${i.price} — stock: {i.stock} — {i.sku}
                <div style={{ fontSize: 12, color: '#666' }}>{i.description}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setSelected(i)}>View</button>
                <button onClick={() => setEditing(i)}>Edit</button>
                <button onClick={() => setConfirmDelete(i)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => { if (page > 1) { setPage(p => p - 1); fetchItems({ page: page - 1 }) } }}>Prev</button>
        <span style={{ margin: '0 8px' }}>Page {page}</span>
        <button onClick={() => { setPage(p => p + 1); fetchItems({ page: page + 1 }) }}>Next</button>
      </div>

      {/* Selected detail modal */}
      {selected && (
        <div style={{ position: 'fixed', left: 20, right: 20, top: 60, bottom: 60, background: '#fff', border: '1px solid #ccc', padding: 12, overflow: 'auto' }}>
          <h3>Details: {selected.brand} {selected.model}</h3>
          <div>Price: ${selected.price}</div>
          <div>Stock: {selected.stock}</div>
          <div>SKU: {selected.sku}</div>
          <div>Description: {selected.description}</div>
          <div style={{ marginTop: 12 }}>
            <SellForm item={selected} onSell={(q) => doSell(selected.id, q)} />
            <button onClick={() => setSelected(null)} style={{ marginTop: 8 }}>Close</button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div style={{ position: 'fixed', left: 20, right: 20, top: 60, bottom: 60, background: '#fff', border: '1px solid #ccc', padding: 12, overflow: 'auto' }}>
          <h3>Edit: {editing.brand} {editing.model}</h3>
          <EditForm item={editing} onCancel={() => setEditing(null)} onSave={(changes) => doEdit(editing.id, changes)} />
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div style={{ position: 'fixed', left: '40%', top: '40%', background: '#fff', padding: 12 }}>
          <Confirm message={`Delete ${confirmDelete.brand} ${confirmDelete.model}?`} onConfirm={() => doDelete(confirmDelete.id)} onCancel={() => setConfirmDelete(null)} />
        </div>
      )}
    </div>
  )
}

function EditForm({ item, onCancel, onSave }) {
  const [state, setState] = useState({ brand: item.brand, model: item.model, price: item.price, stock: item.stock, sku: item.sku, description: item.description })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(state) }} style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
      <input value={state.brand} onChange={e => setState({ ...state, brand: e.target.value })} />
      <input value={state.model} onChange={e => setState({ ...state, model: e.target.value })} />
      <input type="number" value={state.price} onChange={e => setState({ ...state, price: Number(e.target.value) })} />
      <input type="number" value={state.stock} onChange={e => setState({ ...state, stock: Number(e.target.value) })} />
      <input value={state.sku} onChange={e => setState({ ...state, sku: e.target.value })} />
      <input value={state.description} onChange={e => setState({ ...state, description: e.target.value })} />
      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
      </div>
    </form>
  )
}

function SellForm({ item, onSell }) {
  const [qty, setQty] = useState(1)
  return (
    <form onSubmit={e => { e.preventDefault(); onSell(qty) }} style={{ marginTop: 8 }}>
      <input type="number" value={qty} min={1} max={item.stock} onChange={e => setQty(Number(e.target.value))} />
      <button type="submit" style={{ marginLeft: 8 }}>Sell</button>
    </form>
  )
}
