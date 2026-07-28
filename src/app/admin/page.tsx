import Link from 'next/link'
import { getSupabaseServer } from '@/lib/supabase/server'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(n)

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Bogota',
  }).format(new Date(iso))

const METODOS: Record<string, string> = {
  efectivo: 'Efectivo',
  nequi: 'Nequi',
  transferencia: 'Transf.',
  daviplata: 'Daviplata',
  no_especificado: '—',
}

export default async function AdminDashboard() {
  const supabase = getSupabaseServer()

  const [statsRes, topRes, salesRes, stockRes] = await Promise.all([
    supabase.rpc('get_dashboard_stats'),
    supabase.rpc('get_top_productos_mes'),
    supabase
      .from('ventas')
      .select('id, creado_en, fecha, total, metodo_pago, estado, clientes(nombre)')
      .in('estado', ['pagado', 'pendiente'])
      .order('fecha', { ascending: false })
      .order('creado_en', { ascending: false })
      .limit(10),
    supabase
      .from('stock_actual')
      .select('nombre, presentacion, stock_actual, stock_minimo')
      .eq('activo', true),
  ])

  const stats = statsRes.data?.[0]
  const topProductos: { nombre: string; presentacion: string; unidades: number }[] =
    topRes.data ?? []
  const recentSales = salesRes.data ?? []
  const allStock = stockRes.data ?? []
  const lowStock = allStock.filter((p) => (p.stock_actual as number) <= p.stock_minimo)

  const ingresosMes = Number(stats?.total_mes ?? 0)
  const gastosMes = Number(stats?.gastos_mes ?? 0)
  const balanceNeto = ingresosMes - gastosMes

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Alerta stock bajo */}
      {lowStock.length > 0 && (
        <div className="rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-3">
          <p className="mb-1 text-sm font-semibold text-red-300">
            Stock bajo — {lowStock.length} producto{lowStock.length > 1 ? 's' : ''}
          </p>
          {lowStock.map((p) => (
            <p key={`${p.nombre}-${p.presentacion}`} className="text-sm text-red-200/70">
              {p.nombre} {p.presentacion} — {p.stock_actual} ud. (mín. {p.stock_minimo})
            </p>
          ))}
        </div>
      )}

      {/* Tarjetas hoy */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Vendido hoy" value={fmt(Number(stats?.total_hoy ?? 0))} />
        <StatCard label="Ventas hoy" value={String(stats?.ventas_hoy ?? 0)} />
      </div>

      {/* Tarjetas mes */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Ingresos mes" value={fmt(ingresosMes)} accent="teal" />
        <StatCard label="Gastos mes" value={fmt(gastosMes)} accent="amber" />
        <StatCard
          label="Balance neto"
          value={fmt(balanceNeto)}
          accent={balanceNeto >= 0 ? 'teal' : 'red'}
        />
      </div>

      {/* Top productos del mes */}
      {topProductos.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">
            Top productos este mes
          </h2>
          <div className="rounded-lg border border-white/8 bg-surface">
            {topProductos.map((p, i) => (
              <div
                key={`${p.nombre}-${p.presentacion}`}
                className="flex items-center gap-3 px-4 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-white/8"
              >
                <span className="w-5 text-sm text-cream/30">#{i + 1}</span>
                <span className="flex-1 text-sm text-cream">
                  {p.nombre} {p.presentacion}
                </span>
                <span className="text-sm font-semibold text-teal-light">
                  {p.unidades} ud.
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/admin/nueva-venta"
          className="flex items-center justify-center rounded-lg bg-teal py-4 font-semibold text-white transition-colors hover:bg-teal-light"
        >
          + Venta
        </Link>
        <Link
          href="/admin/gastos"
          className="flex items-center justify-center rounded-lg border border-amber/40 py-4 font-semibold text-amber transition-colors hover:bg-amber/10"
        >
          + Gasto
        </Link>
      </div>

      {/* Últimas ventas */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">
          Últimas ventas
        </h2>
        {recentSales.length === 0 ? (
          <p className="text-sm text-cream/40">Todavía no hay ventas registradas.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-cream/40">
                  <th className="px-3 py-3 font-medium">Fecha</th>
                  <th className="px-3 py-3 font-medium">Cliente</th>
                  <th className="px-3 py-3 font-medium">Total</th>
                  <th className="px-3 py-3 font-medium">Método</th>
                  <th className="px-3 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((v) => {
                  const cliente = Array.isArray(v.clientes) ? v.clientes[0] : v.clientes
                  return (
                    <tr
                      key={v.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/3"
                    >
                      <td className="whitespace-nowrap px-3 py-3 text-cream/60">
                        {v.fecha
                          ? new Intl.DateTimeFormat('es-CO', { dateStyle: 'short' }).format(
                              new Date(v.fecha + 'T12:00:00')
                            )
                          : fmtDate(v.creado_en)}
                      </td>
                      <td className="px-3 py-3 text-cream">
                        {(cliente as { nombre: string } | null)?.nombre ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-medium text-cream">
                        {fmt(Number(v.total))}
                      </td>
                      <td className="px-3 py-3 text-cream/60">
                        {METODOS[v.metodo_pago] ?? v.metodo_pago}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            v.estado === 'pagado'
                              ? 'bg-teal/15 text-teal-light'
                              : 'bg-amber/15 text-amber'
                          }`}
                        >
                          {v.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent = 'none',
}: {
  label: string
  value: string
  accent?: 'teal' | 'amber' | 'red' | 'none'
}) {
  const colors = {
    teal: 'text-teal-light',
    amber: 'text-amber',
    red: 'text-red-400',
    none: 'text-cream',
  }
  return (
    <div className="rounded-lg border border-white/8 bg-surface px-4 py-4">
      <p className="mb-1 text-xs text-cream/50">{label}</p>
      <p className={`truncate text-xl font-bold ${colors[accent]}`}>{value}</p>
    </div>
  )
}
