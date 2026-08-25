import React, { useEffect, useState } from 'react'

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f4efe8 0%, #efe7dd 35%, #e7edf5 100%)',
    color: '#1f2937',
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '32px 20px',
  },
  shell: {
    maxWidth: 1280,
    margin: '0 auto',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    padding: '18px 20px',
    borderRadius: 20,
    background: 'rgba(17, 24, 39, 0.92)',
    color: '#f8fafc',
    boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
  },
  heading: {
    margin: 0,
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    letterSpacing: '-0.05em',
  },
  chips: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  chip: {
    padding: '8px 12px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '420px minmax(0, 1fr)',
    gap: 22,
    alignItems: 'start',
  },
  panel: {
    background: 'rgba(255,255,255,0.68)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(148, 163, 184, 0.24)',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
    borderRadius: 24,
    padding: 20,
  },
  panelHeading: {
    margin: '0 0 16px',
    fontSize: 22,
    letterSpacing: '-0.04em',
  },
  input: {
    width: '100%',
    border: '1px solid #d7dce4',
    borderRadius: 12,
    padding: '12px 14px',
    fontSize: 14,
    background: 'rgba(255,255,255,0.9)',
    color: '#111827',
    boxSizing: 'border-box',
    outline: 'none',
  },
  formGrid: {
    display: 'grid',
    gap: 12,
  },
  row: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  button: {
    border: 'none',
    borderRadius: 12,
    padding: '11px 16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all .2s ease',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #111827, #374151)',
    color: '#fff',
    boxShadow: '0 12px 24px rgba(17, 24, 39, 0.15)',
  },
  secondaryButton: {
    background: '#f3f4f6',
    color: '#111827',
    border: '1px solid #e5e7eb',
  },
  ghostButton: {
    background: '#fff',
    color: '#374151',
    border: '1px solid #dfe4ea',
  },
  dangerButton: {
    background: '#ef4444',
    color: '#fff',
  },
  actionButton: {
    background: '#eef2ff',
    color: '#3730a3',
    border: '1px solid #c7d2fe',
    padding: '8px 10px',
    fontSize: 12,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 14,
  },
  itemCard: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(248,250,252,0.9))',
    border: '1px solid rgba(226, 232, 240, 0.9)',
    borderRadius: 18,
    padding: 16,
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  itemTitle: {
    margin: 0,
    fontSize: 18,
    letterSpacing: '-0.03em',
  },
  meta: {
    margin: '6px 0 0',
    color: '#475569',
    fontSize: 13,
    lineHeight: 1.5,
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  smallBadge: {
    background: '#f8fafc',
    color: '#334155',
    border: '1px solid #e2e8f0',
    borderRadius: 999,
    padding: '5px 10px',
    fontSize: 11,
    fontWeight: 700,
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.45)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 20,
    padding: 16,
  },
  modalCard: {
    width: 'min(560px, 100%)',
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 30px 70px rgba(15, 23, 42, 0.2)',
    border: '1px solid rgba(203, 213, 225, 0.8)',
    padding: 20,
  },
  modalTitle: {
    margin: '0 0 12px',
    fontSize: 28,
    letterSpacing: '-0.04em',
  },
  detailGrid: {
    display: 'grid',
    gap: 10,
    marginTop: 14,
    color: '#334155',
    fontSize: 15,
  },
  footerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    flexWrap: 'wrap',
  },
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0))
}

function Confirm({ message = 'Are you sure?', onConfirm, onCancel }) {
  return (
    <div style={styles.modalCard}>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{message}</div>
      <div style={styles.row}>
        <button type="button" style={{ ...styles.button, ...styles.primaryButton }} onClick={onConfirm}>Yes</button>
        <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={onCancel}>No</button>
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

  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { fetchItems() }, [page, brandFilter, modelFilter])

  async function fetchItems(params = {}) {
    setLoading(true)
    setError('')
    try {
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
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.topbar}>
          <div style={styles.titleWrap}>
            <div style={styles.badge}>⌚</div>
            <div>
              <h1 style={styles.heading}>Watch Inventory</h1>
            </div>
          </div>
          <div style={styles.chips}>
            <span style={styles.chip}>Luxury stock</span>
            <span style={styles.chip}>{items.length} items</span>
          </div>
        </header>

        <div style={styles.contentGrid}>
          <aside style={styles.panel}>
            <div style={{ marginBottom: 18 }}>
              <h2 style={styles.panelHeading}>Add watch</h2>
            </div>

            <form onSubmit={submit} style={styles.formGrid}>
              <input style={styles.input} placeholder="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required />
              <input style={styles.input} placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required />
              <input style={styles.input} placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              <input style={styles.input} placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
              <input style={styles.input} placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required />
              <input style={styles.input} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div style={styles.row}>
                <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>Add watch</button>
                <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => fetchItems()}>Refresh</button>
              </div>
            </form>

            <div style={{ height: 1, background: '#e2e8f0', margin: '24px 0 18px' }} />

            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <input style={styles.input} placeholder="Search text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <div style={styles.row}>
                  <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => fetchItems({ q: searchQuery })}>Search</button>
                  <button type="button" style={{ ...styles.button, ...styles.ghostButton }} onClick={() => { setSearchQuery(''); setSkuSearch(''); fetchItems() }}>Clear</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <input style={styles.input} placeholder="Search SKU" value={skuSearch} onChange={e => setSkuSearch(e.target.value)} />
                <div style={styles.row}>
                  <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => fetchItems({ sku: skuSearch })}>Search SKU</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <input style={styles.input} placeholder="Filter brand" value={brandFilter} onChange={e => setBrandFilter(e.target.value)} />
                <input style={styles.input} placeholder="Filter model" value={modelFilter} onChange={e => setModelFilter(e.target.value)} />
                <button type="button" style={{ ...styles.button, ...styles.primaryButton }} onClick={() => { setPage(1); fetchItems({ page: 1, brand: brandFilter, model: modelFilter }) }}>Apply filters</button>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={styles.row}>
                <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={doExport}>Export CSV</button>
                <label style={{ ...styles.button, ...styles.ghostButton, display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  Import CSV
                  <input type="file" accept="text/csv" onChange={e => { if (e.target.files[0]) doImport(e.target.files[0]) }} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          </aside>

          <main style={styles.panel}>
            <div style={styles.footerBar}>
              <h2 style={styles.panelHeading}>Inventory</h2>
              {loading && <span style={{ color: '#64748b', fontWeight: 600 }}>Loading...</span>}
            </div>

            {error && <div style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 12px', marginBottom: 12 }}>{error}</div>}

            <ul style={styles.list}>
              {items.map(i => (
                <li key={i.id} style={styles.itemCard}>
                  <div style={styles.itemHeader}>
                    <div>
                      <h3 style={styles.itemTitle}>{i.brand} {i.model}</h3>
                      <p style={styles.meta}>{i.description || 'No description provided'}</p>
                      <div style={styles.badgeRow}>
                        <span style={styles.smallBadge}>{i.sku}</span>
                        <span style={styles.smallBadge}>Stock: {i.stock}</span>
                        <span style={styles.smallBadge}>{formatMoney(i.price)}</span>
                      </div>
                    </div>
                    <div style={styles.row}>
                      <button type="button" style={{ ...styles.button, ...styles.actionButton }} onClick={() => setSelected(i)}>View</button>
                      <button type="button" style={{ ...styles.button, ...styles.actionButton }} onClick={() => setEditing(i)}>Edit</button>
                      <button type="button" style={{ ...styles.button, ...styles.dangerButton, padding: '8px 10px', fontSize: 12 }} onClick={() => setConfirmDelete(i)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div style={styles.footerBar}>
              <div style={styles.row}>
                <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => { if (page > 1) { setPage(p => p - 1); fetchItems({ page: page - 1 }) } }}>Prev</button>
                <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => { setPage(p => p + 1); fetchItems({ page: page + 1 }) }}>Next</button>
              </div>
              <span style={{ color: '#475569', fontWeight: 700 }}>Page {page}</span>
            </div>
          </main>
        </div>
      </div>

      {selected && (
        <div style={styles.modalBackdrop} onClick={() => setSelected(null)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Details: {selected.brand} {selected.model}</h3>
            <div style={styles.detailGrid}>
              <div><strong>Price:</strong> {formatMoney(selected.price)}</div>
              <div><strong>Stock:</strong> {selected.stock}</div>
              <div><strong>SKU:</strong> {selected.sku}</div>
              <div><strong>Description:</strong> {selected.description || '—'}</div>
            </div>
            <div style={{ marginTop: 18 }}>
              <SellForm item={selected} onSell={(q) => doSell(selected.id, q)} />
              <div style={{ marginTop: 16 }}>
                <button type="button" style={{ ...styles.button, ...styles.primaryButton }} onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div style={styles.modalBackdrop} onClick={() => setEditing(null)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Edit: {editing.brand} {editing.model}</h3>
            <EditForm item={editing} onCancel={() => setEditing(null)} onSave={(changes) => doEdit(editing.id, changes)} />
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={styles.modalBackdrop} onClick={() => setConfirmDelete(null)}>
          <div onClick={e => e.stopPropagation()}>
            <Confirm message={`Delete ${confirmDelete.brand} ${confirmDelete.model}?`} onConfirm={() => doDelete(confirmDelete.id)} onCancel={() => setConfirmDelete(null)} />
          </div>
        </div>
      )}
    </div>
  )
}

function EditForm({ item, onCancel, onSave }) {
  const [state, setState] = useState({ brand: item.brand, model: item.model, price: item.price, stock: item.stock, sku: item.sku, description: item.description })
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(state) }} style={{ display: 'grid', gap: 12 }}>
      <input style={styles.input} value={state.brand} onChange={e => setState({ ...state, brand: e.target.value })} />
      <input style={styles.input} value={state.model} onChange={e => setState({ ...state, model: e.target.value })} />
      <input style={styles.input} type="number" value={state.price} onChange={e => setState({ ...state, price: Number(e.target.value) })} />
      <input style={styles.input} type="number" value={state.stock} onChange={e => setState({ ...state, stock: Number(e.target.value) })} />
      <input style={styles.input} value={state.sku} onChange={e => setState({ ...state, sku: e.target.value })} />
      <input style={styles.input} value={state.description} onChange={e => setState({ ...state, description: e.target.value })} />
      <div style={styles.row}>
        <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>Save</button>
        <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function SellForm({ item, onSell }) {
  const [qty, setQty] = useState(1)
  return (
    <form onSubmit={e => { e.preventDefault(); onSell(qty) }} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <input style={{ ...styles.input, width: 140 }} type="number" value={qty} min={1} max={item.stock} onChange={e => setQty(Number(e.target.value))} />
      <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>Sell</button>
    </form>
  )
}
