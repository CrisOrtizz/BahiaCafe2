'use client'
import { useTransition, useState } from 'react'
import { registrarCompra } from './_actions'
import type { CompraItem } from './_actions'

type Producto = { id: string; nombre: string; presentacion: string; costo: number }

const CATEGORIAS = [
  { value: 'compra_cafe', label: 'Compra de café' },
  { value: 'empaque', label: 'Empaque / embalaje' },
  { value: 'logistica', label: 'Logística / envíos' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'otro', label: 'Otro' },
]

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(n)

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function CompraForm({ productos }: { productos: Producto[] }) {
  const [isPending, startTransition] = useTransition()

  // Líneas del pedido
  const [items, setItems] = useState<CompraItem[]>([])
  const [selectedId, setSelectedId] = useState(productos[0]?.id ?? '')
  const [qty, setQty] = useState(1)
  const [costoInput, setCostoInput] = useState(productos[0]?.costo ?? 0)

  // Campos generales
  const [fecha, setFecha] = useState(todayISO())
  const [envio, setEnvio] = useState(0)
  const [categoria, setCategoria] = useState('compra_cafe')
  const [notas, setNotas] = useState('')

  // UI
  const [error, setError] = useState('')
  const [successId, setSuccessId] = useState('')

  function onProductoChange(id: string) {
    setSelectedId(id)
    const prod = productos.find((p) => p.id === id)
    if (prod) setCostoInput(prod.costo)
  }

  function addLine() {
    if (qty <= 0) { setError('La cantidad debe ser mayor a 0'); return }
    if (costoInput <= 0) { setError('El costo debe ser mayor a 0'); return }
    setError('')
    setItems((prev) => {
      const existing = prev.find((i) => i.producto_id === selectedId)
      if (existing) {
        return prev.map((i) =>
          i.producto_id === selectedId
            ? { ...i, cantidad: i.cantidad + qty, costo_unitario: costoInput }
            : i
        )
      }
      return [...prev, { producto_id: selectedId, cantidad: qty, costo_unitario: costoInput }]
    })
    setQty(1)
  }

  function removeLine(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const subtotal = items.reduce((s, i) => s + i.cantidad * i.costo_unitario, 0)
  const total = subtotal + envio

  function handleSubmit() {
    if (items.length === 0) { setError('Agrega al menos un producto'); return }
    setError('')
    setSuccessId('')
    startTransition(async () => {
      const result = await registrarCompra(items, envio, categoria, fecha, notas || null)
      if (!result || 'error' in result) {
        setError(result?.error ?? 'Error desconocido')
      } else {
        setSuccessId(result.compraId)
        setItems([])
        setEnvio(0)
        setNotas('')
        setFecha(todayISO())
        setCategoria('compra_cafe')
      }
    })
  }

  if (successId) {
    return (
      <div className="rounded-xl border border-gold/30 bg-gold/10 px-6 py-10 text-center">
        <p className="mb-2 text-4xl">✓</p>
        <p className="mb-1 text-lg font-semibold text-gold">Compra registrada</p>
        <p className="mb-6 text-sm text-cream/50">
          Stock actualizado · ID: {successId.slice(0, 8)}…
        </p>
        <button
          onClick={() => setSuccessId('')}
          className="rounded-lg border border-gold/40 px-6 py-3 font-medium text-gold transition-colors hover:bg-gold/10"
        >
          Registrar otra compra
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Fecha y categoría */}
      <section className="rounded-xl border border-white/8 bg-surface p-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-cream/50">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-cream/50">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Agregar línea de producto */}
      <section className="rounded-xl border border-white/8 bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">
          Agregar producto
        </h2>
        <select
          value={selectedId}
          onChange={(e) => onProductoChange(e.target.value)}
          className="mb-2 w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
        >
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.presentacion}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-cream/50">Costo / unidad</label>
            <input
              type="number"
              min={0}
              step={1000}
              value={costoInput}
              onChange={(e) => setCostoInput(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-cream/50">Cant.</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-16 rounded-lg border border-white/10 bg-background px-3 py-2.5 text-center text-sm text-cream focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={addLine}
              className="rounded-lg border border-gold/30 bg-surface px-4 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
            >
              Agregar
            </button>
          </div>
        </div>
      </section>

      {/* Resumen del pedido */}
      {items.length > 0 && (
        <section className="rounded-xl border border-white/8 bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">
            Pedido
          </h2>
          <div className="space-y-2">
            {items.map((item, idx) => {
              const prod = productos.find((p) => p.id === item.producto_id)
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 rounded-lg bg-background/60 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-cream">
                      {prod?.nombre} {prod?.presentacion} × {item.cantidad}
                    </p>
                    <p className="text-xs text-cream/50">
                      {fmt(item.costo_unitario)}/ud · {fmt(item.cantidad * item.costo_unitario)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(idx)}
                    className="shrink-0 rounded px-2 py-1 text-xs text-cream/40 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
          <div className="mt-3 space-y-1 border-t border-white/8 pt-3 text-right text-sm">
            <p className="text-cream/50">
              Productos: <span className="text-cream">{fmt(subtotal)}</span>
            </p>
            {envio > 0 && (
              <p className="text-cream/50">
                Envío: <span className="text-cream">{fmt(envio)}</span>
              </p>
            )}
            <p className="text-base font-bold text-gold">Total: {fmt(total)}</p>
          </div>
        </section>
      )}

      {/* Envío y notas */}
      <section className="rounded-xl border border-white/8 bg-surface p-4 space-y-3">
        <div>
          <label className="mb-1.5 block text-xs text-cream/50">Envío / flete (opcional)</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={envio}
            onChange={(e) => setEnvio(Math.max(0, Number(e.target.value)))}
            placeholder="0"
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-cream/50">Notas (proveedor, referencia…)</label>
          <textarea
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Ej: Finca La Esperanza, lote 24B"
            className="w-full resize-none rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-gold focus:outline-none"
          />
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-red-900/30 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || items.length === 0}
        className="w-full rounded-xl border border-gold/40 bg-gold/5 py-4 text-base font-semibold text-gold transition-colors hover:bg-gold/15 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending
          ? 'Guardando…'
          : `Registrar compra${total > 0 ? ` · ${fmt(total)}` : ''}`}
      </button>
    </div>
  )
}
