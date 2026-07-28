'use client'
import { useActionState } from 'react'
import { registrarGasto } from './_actions'
import type { GastoState } from './_actions'

const CATEGORIAS = [
  { value: 'compra_cafe', label: 'Compra de café' },
  { value: 'empaque', label: 'Empaque / embalaje' },
  { value: 'logistica', label: 'Logística / envíos' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'otro', label: 'Otro' },
]

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function GastoForm() {
  const [state, action, isPending] = useActionState<GastoState, FormData>(
    registrarGasto,
    null
  )

  if (state && 'success' in state) {
    return (
      <div className="rounded-xl border border-teal/30 bg-teal/10 px-6 py-8 text-center">
        <p className="mb-1 text-lg font-semibold text-teal-light">Gasto registrado</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-teal px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-light"
        >
          Registrar otro
        </button>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <div className="rounded-xl border border-white/8 bg-surface p-4 space-y-3">

        {/* Fecha */}
        <div>
          <label className="mb-1.5 block text-xs text-cream/50">Fecha</label>
          <input
            type="date"
            name="fecha"
            defaultValue={todayISO()}
            required
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream focus:border-teal focus:outline-none"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="mb-1.5 block text-xs text-cream/50">Descripción *</label>
          <input
            type="text"
            name="descripcion"
            required
            placeholder="Ej: Compra 10 kg café en finca"
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-teal focus:outline-none"
          />
        </div>

        {/* Monto */}
        <div>
          <label className="mb-1.5 block text-xs text-cream/50">Monto (COP) *</label>
          <input
            type="number"
            name="monto"
            min={1}
            step={1000}
            required
            placeholder="0"
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-teal focus:outline-none"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="mb-1.5 block text-xs text-cream/50">Categoría</label>
          <select
            name="categoria"
            defaultValue="compra_cafe"
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream focus:border-teal focus:outline-none"
          >
            {CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Notas */}
        <div>
          <label className="mb-1.5 block text-xs text-cream/50">Notas (opcional)</label>
          <textarea
            name="notas"
            rows={2}
            placeholder="Proveedor, referencia, etc."
            className="w-full resize-none rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-teal focus:outline-none"
          />
        </div>
      </div>

      {state && 'error' in state && (
        <p className="rounded-lg bg-red-900/30 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-teal py-4 text-base font-semibold text-white transition-colors hover:bg-teal-light disabled:opacity-40"
      >
        {isPending ? 'Guardando…' : 'Guardar gasto'}
      </button>
    </form>
  )
}
