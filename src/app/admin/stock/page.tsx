import Link from 'next/link'
import { getSupabaseServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Stock — Bahía Café' }

export default async function StockPage() {
  const supabase = getSupabaseServer()

  const { data: productos } = await supabase
    .from('stock_actual')
    .select('id, nombre, presentacion, stock_actual, stock_minimo, activo')
    .eq('activo', true)
    .order('stock_actual', { ascending: true })

  const stock = productos ?? []
  const lowStock = stock.filter((p) => (p.stock_actual as number) <= p.stock_minimo)

  function nivel(actual: number, minimo: number) {
    if (actual <= minimo) return 'crítico'
    if (actual <= minimo * 2) return 'bajo'
    return 'ok'
  }

  const badge = {
    crítico: 'bg-red-900/30 text-red-300',
    bajo: 'bg-amber/15 text-amber',
    ok: 'bg-teal/15 text-teal-light',
  }

  const dot = {
    crítico: 'bg-red-400',
    bajo: 'bg-amber',
    ok: 'bg-teal-light',
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm text-cream/50 hover:text-cream">
          ← Dashboard
        </Link>
        <h1 className="text-xl font-bold text-cream">Stock</h1>
      </div>

      {/* Alerta stock bajo */}
      {lowStock.length > 0 && (
        <div className="rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-3">
          <p className="mb-1 text-sm font-semibold text-red-300">
            Stock crítico — {lowStock.length} producto{lowStock.length > 1 ? 's' : ''}
          </p>
          {lowStock.map((p) => (
            <p key={p.id} className="text-sm text-red-200/70">
              {p.nombre} {p.presentacion} — {p.stock_actual} ud. (mín. {p.stock_minimo})
            </p>
          ))}
        </div>
      )}

      {/* Tabla de stock */}
      {stock.length === 0 ? (
        <p className="rounded-lg border border-white/8 bg-surface px-4 py-8 text-center text-sm text-cream/50">
          No hay productos activos.
        </p>
      ) : (
        <div className="rounded-lg border border-white/8">
          {stock.map((p, i) => {
            const n = nivel(p.stock_actual as number, p.stock_minimo)
            return (
              <div
                key={p.id}
                className={`flex items-center gap-4 px-4 py-3.5 ${
                  i !== stock.length - 1 ? 'border-b border-white/8' : ''
                }`}
              >
                {/* Indicador */}
                <span className={`h-2 w-2 shrink-0 rounded-full ${dot[n]}`} />

                {/* Nombre */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-cream">
                    {p.nombre}
                    <span className="ml-1.5 text-cream/40">{p.presentacion}</span>
                  </p>
                  <p className="text-xs text-cream/40">mín. {p.stock_minimo} ud.</p>
                </div>

                {/* Stock actual */}
                <div className="text-right">
                  <p className="text-lg font-bold text-cream">{p.stock_actual}</p>
                  <p className="text-xs text-cream/40">unidades</p>
                </div>

                {/* Badge estado */}
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge[n]}`}>
                  {n}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-center text-xs text-cream/25">
        Actualizado en cada carga de página
      </p>
    </div>
  )
}
