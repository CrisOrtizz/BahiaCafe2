'use client'
import { useTransition, useState } from 'react'
import { registrarVenta } from './_actions'
import type { CartItem } from './_actions'

type Producto = { id: string; nombre: string; presentacion: string; precio_venta: number }
type Cliente = { id: string; nombre: string; telefono: string | null }
type MetodoPago = 'efectivo' | 'nequi' | 'transferencia' | 'daviplata'
type Estado = 'pagado' | 'pendiente'

const METODOS: { value: MetodoPago; label: string }[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'nequi', label: 'Nequi' },
  { value: 'transferencia', label: 'Transf.' },
  { value: 'daviplata', label: 'Daviplata' },
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

export function SaleForm({ productos, clientes }: { productos: Producto[]; clientes: Cliente[] }) {
  const [isPending, startTransition] = useTransition()

  // Cliente
  const [clienteMode, setClienteMode] = useState<'existing' | 'new'>('existing')
  const [selectedClienteId, setSelectedClienteId] = useState('')
  const [newNombre, setNewNombre] = useState('')
  const [newTelefono, setNewTelefono] = useState('')

  // Agregar producto
  const [selectedProductoId, setSelectedProductoId] = useState(productos[0]?.id ?? '')
  const [qty, setQty] = useState(1)
  const [descuentoInput, setDescuentoInput] = useState(0)

  // Carrito
  const [cart, setCart] = useState<CartItem[]>([])

  // Venta
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')
  const [estado, setEstado] = useState<Estado>('pagado')
  const [fecha, setFecha] = useState(todayISO())

  // Estado UI
  const [error, setError] = useState('')
  const [successId, setSuccessId] = useState('')

  function addToCart() {
    const prod = productos.find((p) => p.id === selectedProductoId)
    if (!prod) return
    if (descuentoInput < 0 || descuentoInput >= prod.precio_venta) {
      setError('El descuento no puede ser mayor o igual al precio')
      return
    }
    setError('')
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productoId === prod.id && i.descuento === descuentoInput
      )
      if (existing) {
        return prev.map((i) =>
          i.productoId === prod.id && i.descuento === descuentoInput
            ? { ...i, cantidad: i.cantidad + qty }
            : i
        )
      }
      return [
        ...prev,
        {
          productoId: prod.id,
          nombre: prod.nombre,
          presentacion: prod.presentacion,
          precio: prod.precio_venta,
          cantidad: qty,
          descuento: descuentoInput,
        },
      ]
    })
    setQty(1)
    setDescuentoInput(0)
  }

  function removeFromCart(idx: number) {
    setCart((prev) => prev.filter((_, i) => i !== idx))
  }

  const total = cart.reduce((s, i) => s + (i.precio - i.descuento) * i.cantidad, 0)

  function handleSubmit() {
    setError('')
    setSuccessId('')
    startTransition(async () => {
      const result = await registrarVenta({
        clienteId: clienteMode === 'existing' ? selectedClienteId || null : null,
        nuevoCliente:
          clienteMode === 'new' ? { nombre: newNombre, telefono: newTelefono } : null,
        items: cart,
        metodoPago,
        fecha,
        estado,
      })
      if ('error' in result) {
        setError(result.error)
      } else {
        setSuccessId(result.ventaId)
        setCart([])
        setNewNombre('')
        setNewTelefono('')
        setSelectedClienteId('')
        setClienteMode('existing')
        setFecha(todayISO())
        setEstado('pagado')
      }
    })
  }

  if (successId) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-teal/30 bg-teal/10 px-6 py-10 text-center">
        <p className="mb-2 text-4xl">✓</p>
        <p className="mb-1 text-lg font-semibold text-teal-light">Venta guardada</p>
        <p className="mb-6 text-sm text-cream/50">ID: {successId.slice(0, 8)}…</p>
        <button
          onClick={() => setSuccessId('')}
          className="rounded-lg bg-teal px-6 py-3 font-medium text-white transition-colors hover:bg-teal-light"
        >
          Registrar otra venta
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-4">

      {/* Fecha y estado */}
      <section className="rounded-xl border border-white/8 bg-surface p-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-cream/50">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream focus:border-teal focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-cream/50">Estado</label>
            <div className="flex gap-1.5">
              {(['pagado', 'pendiente'] as Estado[]).map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEstado(e)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
                    estado === e
                      ? e === 'pagado'
                        ? 'bg-teal text-white'
                        : 'bg-amber text-background'
                      : 'border border-white/15 text-cream/60 hover:border-white/30'
                  }`}
                >
                  {e === 'pagado' ? 'Pagado' : 'Pendiente'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cliente */}
      <section className="rounded-xl border border-white/8 bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">
          Cliente
        </h2>
        <div className="mb-3 flex gap-2">
          {(['existing', 'new'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setClienteMode(mode)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                clienteMode === mode
                  ? 'bg-teal text-white'
                  : 'border border-white/15 text-cream/60 hover:border-white/30'
              }`}
            >
              {mode === 'existing' ? 'Existente' : '+ Nuevo'}
            </button>
          ))}
        </div>

        {clienteMode === 'existing' ? (
          <select
            value={selectedClienteId}
            onChange={(e) => setSelectedClienteId(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream focus:border-teal focus:outline-none"
          >
            <option value="">Sin cliente / mostrador</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}{c.telefono ? ` — ${c.telefono}` : ''}
              </option>
            ))}
          </select>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nombre *"
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-teal focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Teléfono (opcional)"
              value={newTelefono}
              onChange={(e) => setNewTelefono(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-teal focus:outline-none"
            />
          </div>
        )}
      </section>

      {/* Agregar producto */}
      <section className="rounded-xl border border-white/8 bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">
          Agregar producto
        </h2>
        <select
          value={selectedProductoId}
          onChange={(e) => setSelectedProductoId(e.target.value)}
          className="mb-2 w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream focus:border-teal focus:outline-none"
        >
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.presentacion} — {fmt(p.precio_venta)}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-cream/50">Descuento / unidad</label>
            <input
              type="number"
              min={0}
              step={1000}
              value={descuentoInput}
              onChange={(e) => setDescuentoInput(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream focus:border-teal focus:outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-cream/50">Cant.</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-16 rounded-lg border border-white/10 bg-background px-3 py-2.5 text-center text-sm text-cream focus:border-teal focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={addToCart}
              className="rounded-lg border border-teal/30 bg-surface px-4 py-2.5 text-sm font-medium text-teal-light transition-colors hover:bg-teal/10"
            >
              Agregar
            </button>
          </div>
        </div>
      </section>

      {/* Carrito */}
      {cart.length > 0 && (
        <section className="rounded-xl border border-white/8 bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">
            Carrito
          </h2>
          <div className="space-y-2">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 rounded-lg bg-background/60 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-cream">
                    {item.nombre} {item.presentacion} × {item.cantidad}
                  </p>
                  <p className="text-xs text-cream/50">
                    {fmt((item.precio - item.descuento) * item.cantidad)}
                    {item.descuento > 0 && (
                      <span className="ml-1 text-amber">
                        (desc. {fmt(item.descuento)}/ud)
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(idx)}
                  className="shrink-0 rounded px-2 py-1 text-xs text-cream/40 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-white/8 pt-3 text-right">
            <span className="text-sm text-cream/50">Total: </span>
            <span className="text-lg font-bold text-cream">{fmt(total)}</span>
          </div>
        </section>
      )}

      {/* Método de pago */}
      <section className="rounded-xl border border-white/8 bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">
          Método de pago
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {METODOS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMetodoPago(m.value)}
              className={`rounded-lg py-3 text-sm font-medium transition-colors ${
                metodoPago === m.value
                  ? 'bg-teal text-white'
                  : 'border border-white/15 text-cream/60 hover:border-white/30 hover:text-cream'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-red-900/30 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || cart.length === 0}
        className="w-full rounded-xl bg-teal py-4 text-base font-semibold text-white transition-colors hover:bg-teal-light disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending
          ? 'Guardando…'
          : `Guardar ${estado === 'pendiente' ? '(pendiente)' : 'venta'}${total > 0 ? ` · ${fmt(total)}` : ''}`}
      </button>
    </div>
  )
}
